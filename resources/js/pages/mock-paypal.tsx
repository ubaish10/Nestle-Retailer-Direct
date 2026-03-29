import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lock, CreditCard, ArrowLeft } from 'lucide-react';

interface MockPayPalProps {
    orderId: number;
    amount: number;
    returnUrl: string;
    cancelUrl: string;
}

export default function MockPayPal({ orderId, amount, returnUrl, cancelUrl }: MockPayPalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('buyer@sandbox.paypal.com');
    const [password, setPassword] = useState('');
    const [paymentStep, setPaymentStep] = useState<'login' | 'confirm' | 'processing' | 'success'>('login');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setPaymentStep('confirm');
            }, 1500);
        }
    };

    const handlePayment = () => {
        setIsProcessing(true);
        setPaymentStep('processing');
        
        setTimeout(() => {
            setPaymentStep('success');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 2000);
        }, 2500);
    };

    const handleCancel = () => {
        window.location.href = cancelUrl;
    };

    const renderLoginStep = () => (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 rounded-full p-3">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                    PayPal Checkout
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Secure payment for Order #{orderId}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium mb-1">Payment Amount</p>
                    <p className="text-2xl font-bold text-blue-900">LKR {amount.toFixed(2)}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="buyer@sandbox.paypal.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Log In'
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancel and return to merchant
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Lock className="h-3 w-3" />
                        <span>Secure SSL Encryption</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderConfirmStep = () => (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-600 rounded-full p-3">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                    Confirm Your Payment
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Review and confirm your payment details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                        <div className="bg-blue-100 rounded-full p-2">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">PayPal Balance</p>
                            <p className="text-xs text-gray-500">{email}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment to:</span>
                            <span className="font-medium text-gray-900">Nestle Retailer Direct</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Order #:</span>
                            <span className="font-medium text-gray-900">{orderId}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-green-600">LKR {amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handlePayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Payment...
                            </span>
                        ) : (
                            `Pay LKR ${amount.toFixed(2)}`
                        )}
                    </Button>
                    
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={isProcessing}
                    >
                        Cancel Payment
                    </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Lock className="h-3 w-3" />
                        <span>Your payment is protected by PayPal Buyer Protection</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderProcessingStep = () => (
        <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="text-center py-12">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600">Please wait while we process your payment of LKR {amount.toFixed(2)}</p>
            </CardContent>
        </Card>
    );

    const renderSuccessStep = () => (
        <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="text-center py-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-600 rounded-full p-4">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your payment of LKR {amount.toFixed(2)} has been processed</p>
                <p className="text-sm text-gray-500">Redirecting you back to the merchant...</p>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="PayPal Checkout" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
                {paymentStep === 'login' && renderLoginStep()}
                {paymentStep === 'confirm' && renderConfirmStep()}
                {paymentStep === 'processing' && renderProcessingStep()}
                {paymentStep === 'success' && renderSuccessStep()}
            </div>
        </>
    );
}
