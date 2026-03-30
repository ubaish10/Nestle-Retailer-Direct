<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PayPalController extends Controller
{
    /**
     * Process PayPal payment for an order.
     */
    public function processPayment(Request $request, $order_id)
    {
        $order = Order::find($order_id);

        if (!$order) {
            return redirect()->route('my-orders')->withErrors(['paypal' => 'Order not found.']);
        }

        // Verify the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['order' => 'Unauthorized access to this order.']);
        }

        // Check if order is already paid
        if ($order->payment_status === 'paid') {
            return redirect()->route('my-orders')->with('success', 'This order is already paid.');
        }

        // Check if PayPal credentials are configured
        $paypalConfig = config('paypal');
        $useMockPayment = empty($paypalConfig['sandbox']['username']) || empty($paypalConfig['sandbox']['password']);

        // If credentials are configured, use real PayPal
        if (!$useMockPayment) {
            try {
                $provider = new PayPalClient;
                $provider->setApiCredentials($paypalConfig);
                $provider->getAccessToken();

                $response = $provider->createOrder([
                    "intent" => "CAPTURE",
                    "purchase_units" => [
                        [
                            "amount" => [
                                "currency_code" => "USD",
                                "value" => number_format($order->total_amount, 2, '.', ''),
                                "breakdown" => [
                                    "item_total" => [
                                        "currency_code" => "USD",
                                        "value" => number_format($order->total_amount, 2, '.', ''),
                                    ]
                                ]
                            ],
                            "description" => "Order #{$order->id} - Quick Reorder",
                            "items" => $order->items->map(function ($item) {
                                return [
                                    "name" => $item->product_name,
                                    "quantity" => (string) $item->quantity,
                                    "unit_amount" => [
                                        "currency_code" => "USD",
                                        "value" => number_format($item->price, 2, '.', ''),
                                    ]
                                ];
                            })->toArray(),
                        ]
                    ],
                    "application_context" => [
                        "return_url" => route('paypal.success', ['order_id' => $order->id]),
                        "cancel_url" => route('paypal.cancel', ['order_id' => $order->id]),
                    ]
                ]);

                if (isset($response['id']) && $response['id']) {
                    // Redirect to PayPal
                    foreach ($response['links'] as $link) {
                        if ($link['rel'] === 'approve') {
                            return redirect()->away($link['href']);
                        }
                    }
                }

                return redirect()->back()->withErrors(['paypal' => 'Failed to create PayPal payment.']);
            } catch (\Exception $e) {
                \Log::error('PayPal API Error: ' . $e->getMessage());
                return redirect()->back()->withErrors(['paypal' => 'PayPal API error: ' . $e->getMessage()]);
            }
        }

        // MOCK PAYPAL MODE: Render mock PayPal checkout page using Blade view
        return view('paypal.mock', [
            'orderId' => $order->id,
            'amount' => (float) $order->total_amount,
            'returnUrl' => route('paypal.success', ['order_id' => $order->id]),
            'cancelUrl' => route('paypal.cancel', ['order_id' => $order->id]),
        ]);
    }

    /**
     * Handle PayPal success/capture payment.
     */
    public function success(Request $request, $order_id)
    {
        $order = Order::find($order_id);

        if (!$order || $order->user_id !== Auth::id()) {
            return redirect()->route('home')->withErrors(['paypal' => 'Invalid order.']);
        }

        // Check if using mock PayPal (no credentials configured)
        $paypalConfig = config('paypal');
        $useMockPayment = empty($paypalConfig['sandbox']['username']) || empty($paypalConfig['sandbox']['password']);

        if ($useMockPayment) {
            // Mock PayPal - simulate successful payment
            $paymentMethod = $order->payment_method ?? 'paypal';
            
            $order->update([
                'payment_status' => 'paid',
                'payment_method' => $paymentMethod,
                'paypal_transaction_id' => 'MOCK-' . strtoupper(uniqid()),
            ]);

            return redirect()->route('my-orders')->with('success', ucfirst($paymentMethod) . ' payment completed successfully!');
        }

        // Real PayPal - capture the payment
        $token = $request->get('token');

        try {
            $provider = new PayPalClient;
            $provider->setApiCredentials($paypalConfig);
            $provider->getAccessToken();

            $response = $provider->capturePaymentOrder($token);

            if (isset($response['status']) && $response['status'] === 'COMPLETED') {
                $paymentMethod = $order->payment_method ?? 'paypal';
                
                $order->update([
                    'payment_status' => 'paid',
                    'payment_method' => $paymentMethod,
                    'paypal_transaction_id' => $response['id'] ?? null,
                ]);

                return redirect()->route('my-orders')->with('success', ucfirst($paymentMethod) . ' payment completed successfully!');
            }

            return redirect()->back()->withErrors(['paypal' => 'Payment capture failed.']);
        } catch (\Exception $e) {
            \Log::error('PayPal capture error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['paypal' => 'Payment capture failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Handle PayPal cancel.
     */
    public function cancel(Request $request, $order_id)
    {
        $order = Order::find($order_id);

        if (!$order || $order->user_id !== Auth::id()) {
            return redirect()->route('home')->withErrors(['paypal' => 'Invalid order.']);
        }

        // Delete the order since payment was cancelled - order should not exist
        $order->delete();

        // Redirect back to quick-reorder page so user can select payment method again
        return redirect()->route('quick-reorder')->withErrors(['paypal' => 'Payment was cancelled. No order was created.']);
    }

    /**
     * Handle PayPal IPN notifications.
     */
    public function notify(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();

        $response = $provider->verifyIPN($request->all());

        if ($response) {
            // Handle IPN notification
            $transactionId = $request->input('resource.supplementary_data.related_ids.order_id') 
                ?? $request->input('resource.id');
            
            $order = Order::where('paypal_transaction_id', $transactionId)->first();
            
            if ($order) {
                $eventType = $request->input('event_type');
                
                if ($eventType === 'PAYMENT.CAPTURE.COMPLETED') {
                    $order->update([
                        'payment_status' => 'paid',
                    ]);
                } elseif ($eventType === 'PAYMENT.CAPTURE.DENIED' || $eventType === 'PAYMENT.CAPTURE.REFUNDED') {
                    $order->update([
                        'payment_status' => 'refunded',
                    ]);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
