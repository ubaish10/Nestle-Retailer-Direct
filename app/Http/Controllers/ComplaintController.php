<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Display complaint form page for retailers.
     */
    public function create()
    {
        $orders = Order::with(['items.product', 'distributor'])
            ->where('user_id', Auth::id())
            ->whereIn('status', ['approved', 'completed'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'created_at' => $order->created_at->format('M d, Y'),
                    'distributor_name' => $order->distributor->name ?? 'N/A',
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'product_image' => $item->product_image,
                            'quantity' => (int) $item->quantity,
                            'price' => (float) $item->price,
                        ];
                    })->toArray(),
                ];
            })->toArray();

        return inertia('complaints/create', [
            'orders' => $orders,
        ]);
    }

    /**
     * Store a new complaint.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'product_id' => 'nullable|integer|exists:products,id',
            'product_name' => 'required|string',
            'product_image' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'description' => 'required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'order_id.required' => 'Please select an order.',
            'product_name.required' => 'Please select a product.',
            'quantity.required' => 'Please enter the quantity affected.',
            'quantity.min' => 'Quantity must be at least 1.',
            'description.required' => 'Please provide a description of the damage.',
            'description.max' => 'Description must not exceed 1000 characters.',
            'image.image' => 'Please upload a valid image file.',
            'image.max' => 'Image size must not exceed 2MB.',
        ]);

        // Verify the order belongs to the authenticated user
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
        }

        $complaint = Complaint::create([
            'user_id' => Auth::id(),
            'order_id' => $validated['order_id'],
            'product_id' => $validated['product_id'] ?? null,
            'product_name' => $validated['product_name'],
            'product_image' => $validated['product_image'] ?? null,
            'quantity' => $validated['quantity'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'status' => 'pending',
            'distributor_id' => $order->distributor_id,
        ]);

        return redirect()->route('complaints.index')
            ->with('success', 'Complaint submitted successfully! Your complaint ID is: ' . $complaint->complaint_id);
    }

    /**
     * Display complaint history for the authenticated retailer.
     */
    public function index()
    {
        $complaints = Complaint::with(['order.distributor', 'product'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'complaint_id' => $complaint->complaint_id,
                    'status' => $complaint->status,
                    'product_name' => $complaint->product_name,
                    'product_image' => $complaint->product_image,
                    'quantity' => (int) $complaint->quantity,
                    'description' => $complaint->description,
                    'image_path' => $complaint->image_path ? Storage::url($complaint->image_path) : null,
                    'distributor_response' => $complaint->distributor_response,
                    'created_at' => $complaint->created_at->format('M d, Y'),
                    'resolved_at' => $complaint->resolved_at ? $complaint->resolved_at->format('M d, Y') : null,
                    'distributor_name' => $complaint->order->distributor->name ?? 'N/A',
                    'order_id' => $complaint->order_id,
                ];
            })->toArray();

        $stats = [
            'total_complaints' => (int) Complaint::where('user_id', Auth::id())->count(),
            'pending_complaints' => (int) Complaint::where('user_id', Auth::id())->where('status', 'pending')->count(),
            'approved_complaints' => (int) Complaint::where('user_id', Auth::id())->where('status', 'approved')->count(),
            'rejected_complaints' => (int) Complaint::where('user_id', Auth::id())->where('status', 'rejected')->count(),
        ];

        return inertia('complaints/index', [
            'complaints' => $complaints,
            'stats' => $stats,
        ]);
    }

    /**
     * Display all complaints for distributor (incoming complaints).
     */
    public function distributorIndex()
    {
        $complaints = Complaint::with(['user', 'order', 'product'])
            ->where('distributor_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'complaint_id' => $complaint->complaint_id,
                    'status' => $complaint->status,
                    'product_name' => $complaint->product_name,
                    'product_image' => $complaint->product_image,
                    'quantity' => (int) $complaint->quantity,
                    'description' => $complaint->description,
                    'image_path' => $complaint->image_path ? Storage::url($complaint->image_path) : null,
                    'distributor_response' => $complaint->distributor_response,
                    'created_at' => $complaint->created_at->format('M d, Y'),
                    'resolved_at' => $complaint->resolved_at ? $complaint->resolved_at->format('M d, Y') : null,
                    'retailer_name' => $complaint->user->name ?? 'N/A',
                    'retailer_email' => $complaint->user->email ?? 'N/A',
                    'order_id' => $complaint->order_id,
                ];
            })->toArray();

        $stats = [
            'total_complaints' => (int) Complaint::where('distributor_id', Auth::id())->count(),
            'pending_complaints' => (int) Complaint::where('distributor_id', Auth::id())->where('status', 'pending')->count(),
            'approved_complaints' => (int) Complaint::where('distributor_id', Auth::id())->where('status', 'approved')->count(),
            'rejected_complaints' => (int) Complaint::where('distributor_id', Auth::id())->where('status', 'rejected')->count(),
        ];

        return inertia('distributor/complaints', [
            'complaints' => $complaints,
            'stats' => $stats,
        ]);
    }

    /**
     * Display a specific complaint for distributor review.
     */
    public function distributorShow(Complaint $complaint)
    {
        // Verify the complaint belongs to the authenticated distributor
        if ($complaint->distributor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $complaint->load(['user', 'order', 'order.items', 'product']);

        $complaintData = [
            'id' => $complaint->id,
            'complaint_id' => $complaint->complaint_id,
            'status' => $complaint->status,
            'product_name' => $complaint->product_name,
            'product_image' => $complaint->product_image,
            'quantity' => (int) $complaint->quantity,
            'description' => $complaint->description,
            'image_path' => $complaint->image_path ? Storage::url($complaint->image_path) : null,
            'distributor_response' => $complaint->distributor_response,
            'created_at' => $complaint->created_at->format('M d, Y H:i'),
            'resolved_at' => $complaint->resolved_at ? $complaint->resolved_at->format('M d, Y H:i') : null,
            'retailer_name' => $complaint->user->name ?? 'N/A',
            'retailer_email' => $complaint->user->email ?? 'N/A',
            'order_id' => $complaint->order_id,
            'order' => $complaint->order ? [
                'id' => $complaint->order->id,
                'status' => $complaint->order->status,
                'total_amount' => (float) $complaint->order->total_amount,
                'created_at' => $complaint->order->created_at->format('M d, Y'),
                'items' => $complaint->order->items->map(function ($item) {
                    return [
                        'product_name' => $item->product_name,
                        'product_image' => $item->product_image,
                        'quantity' => (int) $item->quantity,
                        'price' => (float) $item->price,
                    ];
                })->toArray(),
            ] : null,
        ];

        return inertia('distributor/complaint-review', [
            'complaint' => $complaintData,
        ]);
    }

    /**
     * Approve a complaint.
     */
    public function distributorApprove(Request $request, Complaint $complaint)
    {
        // Verify the complaint belongs to the authenticated distributor
        if ($complaint->distributor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'response' => 'nullable|string|max:1000',
        ]);

        $complaint->approve($validated['response'] ?? 'Replacement process initiated.');

        return redirect()->route('distributor.complaints.index')
            ->with('success', 'Complaint approved successfully!');
    }

    /**
     * Reject a complaint.
     */
    public function distributorReject(Request $request, Complaint $complaint)
    {
        // Verify the complaint belongs to the authenticated distributor
        if ($complaint->distributor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $complaint->reject($validated['reason']);

        return redirect()->route('distributor.complaints.index')
            ->with('success', 'Complaint rejected.');
    }

    /**
     * Mark a complaint as pending.
     */
    public function distributorMarkPending(Complaint $complaint)
    {
        // Verify the complaint belongs to the authenticated distributor
        if ($complaint->distributor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $complaint->markPending();

        return redirect()->route('distributor.complaints.index')
            ->with('success', 'Complaint marked as pending.');
    }
}
