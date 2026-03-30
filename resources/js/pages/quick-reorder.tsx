import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Plus, Minus, ShoppingCart, Users, ChevronDown, CreditCard, DollarSign, Warehouse, Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Credit card input formatting utilities
function formatCardNumber(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    // Add space every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiryDate(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 4 digits (MMYY)
    const limited = digits.slice(0, 4);
    
    if (limited.length >= 2) {
        const month = limited.slice(0, 2);
        const year = limited.slice(2);
        
        // Restrict month to 01-12
        let validMonth = month;
        const monthNum = parseInt(month, 10);
        if (monthNum > 12) {
            validMonth = '12';
        } else if (monthNum === 0) {
            validMonth = '01';
        }
        
        return validMonth + (year ? '/' + year : '');
    }
    return limited;
}

function validateCardNumber(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    return digits.length === 16;
}

function validateExpiryDate(value: string): boolean {
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    
    // Validate month (01-12)
    if (month < 1 || month > 12) return false;
    
    // Validate year (not in the past)
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    
    return true;
}

function validateCVV(value: string): boolean {
    return /^\d{3}$/.test(value);
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock_quantity: number;
    warehouse_quantity: number;
}

interface OrderItem extends Product {
    status: string;
    statusColor: string;
    quantity: number;
    warehouse_status?: string;
    warehouse_statusColor?: string;
}

interface Distributor {
    id: number;
    name: string;
    company_name: string | null;
}

interface DistributorInventory {
    product_id: number;
    stock_quantity: number;
}

function getStockStatus(stockQuantity: number | undefined): { status: string; statusColor: string } {
    const quantity = stockQuantity || 0;
    if (quantity === 0) {
        return { status: 'Out of Stock', statusColor: 'text-red-600' };
    }
    if (quantity <= 20) {
        return { status: 'Low Stock', statusColor: 'text-amber-600' };
    }
    return { status: 'In Stock', statusColor: 'text-emerald-600' };
}

function getWarehouseStockStatus(stockQuantity: number | undefined): { status: string; statusColor: string } {
    const quantity = stockQuantity || 0;
    if (quantity === 0) {
        return { status: 'Out of Stock', statusColor: 'text-red-600' };
    }
    if (quantity <= 20) {
        return { status: 'Low Stock', statusColor: 'text-amber-600' };
    }
    return { status: 'In Stock', statusColor: 'text-emerald-600' };
}

interface Props {
    products?: Product[] | null;
    distributors?: Distributor[] | null;
}

export default function QuickReorder({ products, distributors }: Props) {
    const { toast } = useToast();

    // Safe array conversion
    const safeProducts = Array.isArray(products) ? products : [];
    const safeDistributors = Array.isArray(distributors) ? distributors : [];

    const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
    const [distributorInventory, setDistributorInventory] = useState<DistributorInventory[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>(
        safeProducts
            .filter(p => p && p.id)
            .map(product => ({
                ...product,
                ...getStockStatus(product.stock_quantity),
                quantity: 0,
                warehouse_quantity: 0, // Reset to 0 until distributor is selected
                warehouse_status: 'Out of Stock',
                warehouse_statusColor: 'text-gray-500',
            }))
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDistributorOpen, setIsDistributorOpen] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'paypal' | 'credit_card'>('cod');
    
    // Credit card form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const cardNumberRef = useRef<HTMLInputElement>(null);

    // Fetch distributor inventory when distributor is selected
    useEffect(() => {
        if (selectedDistributor) {
            fetch(`/api/distributor/${selectedDistributor.id}/inventory`)
                .then(res => res.json())
                .then(data => {
                    setDistributorInventory(data);
                    // Update order items with distributor-specific warehouse quantities
                    setOrderItems(prev => prev.map(item => {
                        const inv = data.find((d: DistributorInventory) => d.product_id === item.id);
                        const warehouseQty = inv ? inv.stock_quantity : 0;
                        const warehouseStatus = getWarehouseStockStatus(warehouseQty);
                        return {
                            ...item,
                            warehouse_quantity: warehouseQty,
                            warehouse_status: warehouseStatus.status,
                            warehouse_statusColor: warehouseStatus.statusColor,
                        };
                    }));
                })
                .catch(err => {
                    console.error('Failed to fetch distributor inventory:', err);
                    setDistributorInventory([]);
                });
        } else {
            setDistributorInventory([]);
            // Reset warehouse quantities when no distributor is selected
            setOrderItems(prev => prev.map(item => ({
                ...item,
                warehouse_quantity: 0,
                warehouse_status: 'Out of Stock',
                warehouse_statusColor: 'text-gray-500',
            })));
        }
    }, [selectedDistributor]);

    const handleQuantityChange = (id: number, delta: number) => {
        setOrderItems((prev) =>
            prev.map((order) => {
                if (order && order.id === id) {
                    const maxQuantity = order.warehouse_quantity || 0;
                    const newQuantity = Math.max(0, Math.min(maxQuantity, order.quantity + delta));
                    return { ...order, quantity: newQuantity };
                }
                return order;
            })
        );
    };

    const handleDirectQuantityChange = (id: number, value: string) => {
        const parsedValue = parseInt(value) || 0;
        setOrderItems((prev) =>
            prev.map((order) => {
                if (order && order.id === id) {
                    const maxQuantity = order.warehouse_quantity || 0;
                    const newQuantity = Math.max(0, Math.min(maxQuantity, parsedValue));
                    return { ...order, quantity: newQuantity };
                }
                return order;
            })
        );
    };

    const handleReorder = () => {
        const itemsToOrder = orderItems.filter((item) => item && item.quantity > 0);

        if (itemsToOrder.length === 0) {
            toast({
                title: 'No items selected',
                description: 'Please add at least one item to your order.',
                variant: 'destructive',
            });
            return;
        }

        if (!selectedDistributor) {
            toast({
                title: 'No distributor selected',
                description: 'Please select a distributor to place your order.',
                variant: 'destructive',
            });
            setIsDistributorOpen(true);
            return;
        }

        // Validate quantities against warehouse stock
        const overStockItems = itemsToOrder.filter(item => item.quantity > item.warehouse_quantity);
        if (overStockItems.length > 0) {
            toast({
                title: 'Insufficient warehouse stock',
                description: 'Some items exceed available warehouse quantity.',
                variant: 'destructive',
            });
            return;
        }

        setShowPaymentModal(true);
    };

    const handlePaymentConfirm = () => {
        const itemsToOrder = orderItems.filter((item) => item && item.quantity > 0);

        if (!selectedDistributor) {
            toast({
                title: 'Error',
                description: 'Please select a distributor',
                variant: 'destructive',
            });
            return;
        }

        // If credit card is selected, show credit card form
        if (selectedPaymentMethod === 'credit_card') {
            setShowPaymentModal(false);
            setShowCreditCardModal(true);
            return;
        }

        const orderData = {
            distributor_id: selectedDistributor.id,
            payment_method: selectedPaymentMethod,
            items: itemsToOrder.map((item) => ({
                product_id: item.id,
                product_name: item.name,
                product_image: item.image,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        setIsSubmitting(true);

        if (selectedPaymentMethod === 'paypal') {
            // First, submit order to /orders to get order data validated
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Inertia': 'false',
                },
                body: JSON.stringify(orderData),
                credentials: 'same-origin',
            })
            .then(res => res.json())
            .then(data => {
                setIsSubmitting(false);
                if (data.success && data.redirectUrl) {
                    // Don't show success toast yet - wait for PayPal payment to complete
                    // Redirect to PayPal process endpoint with order data
                    const paypalUrl = data.redirectUrl;
                    
                    // Create a form and submit order data to PayPal endpoint via POST
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = paypalUrl;
                    
                    // Add CSRF token
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_token';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                    
                    // Add order data
                    const dataInput = document.createElement('input');
                    dataInput.type = 'hidden';
                    dataInput.name = 'order_data';
                    dataInput.value = JSON.stringify(data.orderData);
                    form.appendChild(dataInput);
                    
                    document.body.appendChild(form);
                    form.submit();
                } else {
                    throw new Error('Invalid response from server');
                }
            })
            .catch(err => {
                setIsSubmitting(false);
                toast({
                    title: 'Order failed',
                    description: err.message || 'There was an error placing your order.',
                    variant: 'destructive',
                });
            });
        } else {
            // For COD, submit directly
            router.post('/orders', orderData, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Order placed successfully!',
                        description: 'Your order has been submitted.',
                    });
                    window.location.href = '/my-orders';
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    const errorMessages = Object.values(errors).join(' ');
                    toast({
                        title: 'Order failed',
                        description: errorMessages || 'There was an error placing your order.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const handleCreditCardSubmit = () => {
        const itemsToOrder = orderItems.filter((item) => item && item.quantity > 0);

        if (!selectedDistributor) {
            toast({
                title: 'Error',
                description: 'Please select a distributor',
                variant: 'destructive',
            });
            return;
        }

        // Validate card details
        if (!validateCardNumber(cardNumber)) {
            toast({
                title: 'Invalid Card Number',
                description: 'Please enter a valid 16-digit card number',
                variant: 'destructive',
            });
            cardNumberRef.current?.focus();
            return;
        }

        if (!validateExpiryDate(cardExpiry)) {
            toast({
                title: 'Invalid Expiry Date',
                description: 'Please enter a valid expiry date (MM/YY)',
                variant: 'destructive',
            });
            return;
        }

        if (!validateCVV(cardCvv)) {
            toast({
                title: 'Invalid CVV',
                description: 'Please enter a valid 3-digit CVV',
                variant: 'destructive',
            });
            return;
        }

        if (!cardName.trim()) {
            toast({
                title: 'Cardholder Name Required',
                description: 'Please enter the cardholder name',
                variant: 'destructive',
            });
            return;
        }

        const orderData = {
            distributor_id: selectedDistributor.id,
            payment_method: 'credit_card',
            items: itemsToOrder.map((item) => ({
                product_id: item.id,
                product_name: item.name,
                product_image: item.image,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        setIsSubmitting(true);

        // Submit credit card order directly (mock payment - instant success)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'X-Inertia': 'false',
            },
            body: JSON.stringify(orderData),
            credentials: 'same-origin',
        })
        .then(res => res.json())
        .then(data => {
            setIsSubmitting(false);
            if (data.success) {
                toast({
                    title: 'Order Successful!',
                    description: 'Your credit card payment was processed successfully.',
                });
                window.location.href = '/my-orders';
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .catch(err => {
            setIsSubmitting(false);
            toast({
                title: 'Payment Failed',
                description: err.message || 'There was an error processing your payment.',
                variant: 'destructive',
            });
        });
    };

    // Safe reduce with null checks
    const totalItems = orderItems
        .filter(item => item != null)
        .reduce((acc, item) => acc + (item?.quantity || 0), 0);
    
    const totalAmount = orderItems
        .filter(item => item != null)
        .reduce((acc, item) => acc + ((item?.quantity || 0) * (item?.price || 0)), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
            <Head title="Quick Reorder" />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-[#00447C] via-[#003d6f] to-[#00284a] shadow-lg">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <ChevronLeft className="h-6 w-6 text-white" />
                    </Link>
                    <h1 className="text-base font-bold text-white tracking-widest uppercase">Quick Reorder</h1>
                    <div className="w-6"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container md:py-6 pb-32">
                {/* Distributors Dropdown */}
                {safeDistributors.length > 0 && (
                    <Card className="max-w-2xl mx-auto border-0 shadow-lg mb-6 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                                    <Users className="h-4 w-4 md:h-5 md:w-5 text-[#00447C] flex-shrink-0" />
                                    <h2 className="font-semibold text-gray-900 text-xs md:text-sm whitespace-nowrap">Distributors</h2>
                                </div>
                                <DropdownMenu open={isDistributorOpen} onOpenChange={setIsDistributorOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-8 md:h-10 w-[140px] md:w-[200px] justify-between text-xs md:text-sm">
                                            {selectedDistributor ? (
                                                <span className="truncate">{selectedDistributor.company_name || selectedDistributor.name}</span>
                                            ) : (
                                                <span className="truncate">Select Distributor</span>
                                            )}
                                            <ChevronDown className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[140px] md:w-[200px]">
                                        {safeDistributors.filter(d => d && d.id).map((distributor) => (
                                            <DropdownMenuItem
                                                key={distributor.id}
                                                onClick={() => setSelectedDistributor(distributor)}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-xs md:text-sm">{distributor.company_name || distributor.name}</span>
                                                    {distributor.company_city && (
                                                        <span className="text-[10px] md:text-xs text-gray-500">{distributor.company_city}</span>
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Products List */}
                <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-32">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-[#00447C]" />
                                <h2 className="font-semibold text-gray-900">Frequent Orders</h2>
                            </div>
                            <span className="text-xs text-gray-500">{orderItems.length} items</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {orderItems.filter(item => item && item.id).map((order) => (
                                <div key={order.id} className="flex items-center gap-3 p-3 hover:bg-gray-50/80 transition-colors">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                        <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">{order.name}</h3>
                                        <p className={`text-xs font-medium mt-0.5 ${order.statusColor}`}>
                                            Your Stock: {order.stock_quantity} units
                                        </p>
                                        {selectedDistributor && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Warehouse className="h-3 w-3 text-[#00447C]" />
                                                <p className={`text-xs font-medium ${order.warehouse_statusColor || 'text-gray-500'}`}>
                                                    Warehouse: {order.warehouse_quantity || 0} units
                                                </p>
                                            </div>
                                        )}
                                        {!selectedDistributor && (
                                            <p className="text-xs text-amber-600 mt-0.5 font-medium">
                                                Select a distributor to see warehouse stock
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            LKR {order.price?.toFixed(2) || '0.00'} each
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(order.id, -1)}
                                                disabled={order.quantity === 0}
                                                className="p-1.5 rounded-md border border-gray-200 hover:border-[#00447C] disabled:opacity-50"
                                            >
                                                <Minus className="h-3.5 w-3.5 text-gray-600" />
                                            </button>
                                            <input
                                                type="number"
                                                min="0"
                                                max={selectedDistributor ? (order.warehouse_quantity || 0) : 0}
                                                value={order.quantity}
                                                onChange={(e) => handleDirectQuantityChange(order.id, e.target.value)}
                                                disabled={!selectedDistributor}
                                                className="w-16 text-center text-sm font-semibold border border-gray-200 rounded-md py-1.5 focus:outline-none focus:border-[#00447C] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(order.id, 1)}
                                                disabled={!selectedDistributor || order.quantity >= (order.warehouse_quantity || 0)}
                                                className="p-1.5 rounded-md bg-[#00447C] border border-[#00447C] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-white" />
                                            </button>
                                        </div>
                                        {selectedDistributor && (
                                            <span className="text-[10px] text-gray-400">
                                                Max: {order.warehouse_quantity || 0}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto mb-0 md:mb-0">
                        <div className="bg-gradient-to-r from-[#00447C] to-[#00284a] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-10">
                            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                                Select Payment Method
                            </h3>
                        </div>

                        <div className="p-4 md:p-5 space-y-3">
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs md:text-sm text-gray-600">Total Items</span>
                                    <span className="font-semibold text-sm md:text-base">{totalItems}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-gray-600">Total Amount</span>
                                    <span className="font-bold text-[#00447C] text-lg md:text-xl">LKR {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedPaymentMethod('paypal')}
                                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                                        selectedPaymentMethod === 'paypal'
                                            ? 'border-[#00447C] bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-semibold text-sm">PayPal</div>
                                        <div className="text-xs text-gray-500">Pay securely online</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelectedPaymentMethod('credit_card')}
                                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                                        selectedPaymentMethod === 'credit_card'
                                            ? 'border-[#00447C] bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Banknote className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-semibold text-sm">Credit Card</div>
                                        <div className="text-xs text-gray-500">Visa, Mastercard, etc.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelectedPaymentMethod('cod')}
                                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                                        selectedPaymentMethod === 'cod'
                                            ? 'border-[#00447C] bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-semibold text-sm">Cash on Delivery</div>
                                        <div className="text-xs text-gray-500">Pay when you receive</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 p-4 pt-0 sticky bottom-0 bg-white border-t border-gray-100">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                disabled={isSubmitting}
                                className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#00447C] to-[#003d6f] text-white font-semibold text-sm"
                            >
                                {isSubmitting ? 'Processing...' : (selectedPaymentMethod === 'paypal' ? 'Pay with PayPal' : 'Place Order')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credit Card Modal */}
            {showCreditCardModal && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto mb-0 md:mb-0">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-10">
                            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                <Banknote className="h-4 w-4 md:h-5 md:w-5" />
                                Credit Card Payment
                            </h3>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs md:text-sm text-gray-600">Total Items</span>
                                    <span className="font-semibold text-sm md:text-base">{totalItems}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-gray-600">Total Amount</span>
                                    <span className="font-bold text-purple-600 text-lg md:text-xl">LKR {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <input
                                        ref={cardNumberRef}
                                        type="text"
                                        id="card_number"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                                        maxLength={19}
                                        autoComplete="cc-number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        id="card_name"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        autoComplete="cc-name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            id="card_expiry"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-center text-sm"
                                            maxLength={5}
                                            autoComplete="cc-exp"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                        <input
                                            type="text"
                                            id="card_cvv"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                            placeholder="123"
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-center text-sm"
                                            maxLength={3}
                                            autoComplete="cc-csc"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 p-4 pt-0 sticky bottom-0 bg-white border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setShowCreditCardModal(false);
                                    setShowPaymentModal(true);
                                    // Reset form
                                    setCardNumber('');
                                    setCardExpiry('');
                                    setCardCvv('');
                                    setCardName('');
                                }}
                                disabled={isSubmitting}
                                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCreditCardSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm"
                            >
                                {isSubmitting ? 'Processing...' : `Pay LKR ${totalAmount.toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#00447C] via-[#003d6f] to-[#00284a]">
                <div className="container px-4 py-4">
                    <button
                        onClick={handleReorder}
                        disabled={isSubmitting || totalItems === 0}
                        className="w-full max-w-xs mx-auto block px-6 py-3 rounded-xl bg-white text-[#00447C] font-bold hover:bg-gray-100 disabled:opacity-50"
                    >
                        REORDER NOW ({totalItems} items) - LKR {totalAmount.toFixed(2)}
                    </button>
                </div>
            </footer>
        </div>
    );
}
