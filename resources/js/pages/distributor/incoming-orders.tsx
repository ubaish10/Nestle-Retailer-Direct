import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Sparkles, Trash2, Checkbox, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface OrderUser {
    id: number;
    name: string;
    email: string;
    shop_name: string | null;
    phone: string | null;
    address: string | null;
}

function formatAddress(address: string | null): string {
    if (!address) return '';
    // Truncate long addresses for display
    return address.length > 60 ? address.substring(0, 60) + '...' : address;
}

function formatPhone(phone: string | null): string {
    if (!phone) return '';
    return phone;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    user: OrderUser;
    items: OrderItem[];
}

interface Props {
    orders: Order[];
    stats: {
        total_orders: number;
        pending_orders: number;
        approved_orders: number;
        rejected_orders: number;
    };
}

function getStatusBadgeClass(status: string): string {
    switch (status) {
        case 'pending':
            return 'bg-amber-500 text-white';
        case 'approved':
            return 'bg-emerald-500 text-white';
        case 'rejected':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
}

export default function IncomingOrders({ orders, stats }: Props) {
    const { toast } = useToast();
    const [filter, setFilter] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

    const handleApprove = (orderId: number) => {
        router.post(`/distributor/incoming-orders/${orderId}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Order approved!',
                    description: 'The retailer order has been approved.',
                });
            },
            onError: () => {
                toast({
                    title: 'Failed to approve',
                    description: 'There was an error approving the order.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleReject = (orderId: number) => {
        router.post(`/distributor/incoming-orders/${orderId}/reject`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Order rejected',
                    description: 'The retailer order has been rejected.',
                });
            },
            onError: () => {
                toast({
                    title: 'Failed to reject',
                    description: 'There was an error rejecting the order.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleDeleteApprovedOrders = () => {
        if (selectedOrders.length === 0) return;

        router.post('/distributor/incoming-orders/delete-approved', {
            order_ids: selectedOrders,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Orders deleted!',
                    description: `${selectedOrders.length} approved order(s) have been deleted.`,
                });
                setSelectedOrders([]);
            },
            onError: () => {
                toast({
                    title: 'Failed to delete',
                    description: 'There was an error deleting the orders.',
                    variant: 'destructive',
                });
            },
        });
    };

    const toggleOrderSelection = (orderId: number) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleSelectAllApproved = () => {
        const approvedOrderIds = otherOrders
            .filter(o => o.status === 'approved')
            .map(o => o.id);

        if (selectedOrders.length === approvedOrderIds.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(approvedOrderIds);
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
    const otherOrders = filteredOrders.filter(o => o.status !== 'pending');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-4 px-3 md:py-8">
            <Head title="Incoming Orders" />

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#00447C]/3 via-transparent to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-5xl mx-auto">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 rounded-t-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00447C]/5 via-transparent to-[#00447C]/5"></div>
                    <div className="relative px-4 md:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/distributor/home"
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </Link>
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-[#00447C]/20 rounded-xl blur-md"></div>
                                    <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#00447C] to-[#003d6f] flex items-center justify-center shadow-lg">
                                        <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight truncate">Incoming Orders</h1>
                                    <p className="text-xs text-slate-500 font-medium hidden sm:block">Review and manage retailer orders</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 md:px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                                    <span className="text-xs sm:text-sm font-semibold text-amber-700 whitespace-nowrap">{stats.pending_orders} Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="relative bg-white/60 backdrop-blur-sm border-x border-slate-200/50 px-4 md:px-6 py-6 md:py-8 pb-40">
                    <div className="flex flex-col gap-6 md:gap-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Package className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">{stats.total_orders}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                        <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-amber-600 to-amber-500 bg-clip-text text-transparent">{stats.pending_orders}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Approved</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{stats.approved_orders}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Rejected</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                        <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-red-600 to-red-500 bg-clip-text text-transparent">{stats.rejected_orders}</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs - Scrollable on mobile */}
                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-slate-200/50 shadow-sm w-fit min-w-max">
                            {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                        filter === status
                                            ? 'bg-gradient-to-r from-[#00447C] to-[#003d6f] text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pending Orders Section */}
                    {pendingOrders.length > 0 ? (
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full hidden md:block"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pl-0 sm:pl-4">
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md"></div>
                                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Pending Approval</h2>
                                    <p className="text-xs text-slate-500 font-medium">Requires your attention</p>
                                </div>
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md self-start sm:self-center">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    {pendingOrders.length}
                                </Badge>
                            </div>
                            <div className="grid gap-3 md:gap-4">
                                {pendingOrders.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className="group relative"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative bg-white rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                            {/* Top accent bar */}
                                            <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
                                            
                                            <div className="p-4 md:p-5">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 md:mb-4">
                                                    <div className="flex items-center gap-3 md:gap-4 flex-1">
                                                        <div className="relative flex-shrink-0">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-md opacity-50"></div>
                                                            <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                                                                {order.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-bold text-base md:text-lg text-slate-900 truncate">{order.user.name}</div>
                                                            <div className="text-xs sm:text-sm text-slate-600 font-medium truncate">
                                                                {order.user.shop_name || order.user.email}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
                                                                {order.user.phone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                        <span>{order.user.phone}</span>
                                                                    </div>
                                                                )}
                                                                {order.user.address && (
                                                                    <div className="flex items-start gap-1">
                                                                        <svg className="h-3 w-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        <span className="break-words">{order.user.address}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1 pt-0.5">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{order.created_at}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className={getStatusBadgeClass(order.status)} variant="outline">
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </div>

                                                {/* Order Items */}
                                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-slate-200/50">
                                                    <div className="text-xs font-semibold text-slate-700 mb-2 md:mb-3 flex items-center gap-2">
                                                        <Package className="h-3.5 w-3.5" />
                                                        Order Items
                                                    </div>
                                                    <div className="space-y-1.5 md:space-y-2">
                                                        {order.items.map((item, itemIndex) => (
                                                            <div
                                                                key={itemIndex}
                                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs p-2 rounded-lg bg-white/50 border border-slate-200/50"
                                                            >
                                                                <span className="font-medium text-slate-700 break-words">{item.product_name}</span>
                                                                <div className="text-right flex-shrink-0">
                                                                    <span className="text-slate-600">
                                                                        {item.quantity} × LKR {item.price.toFixed(2)}
                                                                    </span>
                                                                    <span className="font-bold text-slate-900 ml-2">
                                                                        = LKR {item.subtotal.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Total and Actions */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 border-t border-slate-200/50">
                                                    <div>
                                                        <div className="text-xs text-slate-500 font-medium mb-0.5">Total Amount</div>
                                                        <div className="text-xl md:text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                                            LKR {order.total_amount.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button
                                                            onClick={() => handleReject(order.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300 flex-1 sm:flex-none"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                            <span className="ml-1 md:ml-1.5">Reject</span>
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleApprove(order.id)}
                                                            size="sm"
                                                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex-1 sm:flex-none"
                                                        >
                                                            <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                            <span className="ml-1 md:ml-1.5 hidden sm:inline">Approve</span>
                                                            <span className="ml-1 md:ml-1.5 sm:hidden">OK</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : filter === 'pending' ? (
                        <div className="relative bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent"></div>
                            <div className="relative flex flex-col items-center justify-center py-16 text-center px-6">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                        <AlertCircle className="h-10 w-10 text-amber-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No pending orders</h3>
                                <p className="text-slate-500 max-w-sm">
                                    There are no orders awaiting your approval at the moment.
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {/* Other Orders Section */}
                    {otherOrders.length > 0 ? (
                        <div className="mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Processed Orders</h2>
                                    <p className="text-xs text-slate-500 font-medium">Completed decisions</p>
                                </div>
                                <Badge variant="outline" className="self-start sm:self-center flex-shrink-0">
                                    {otherOrders.length}
                                </Badge>
                            </div>

                            {/* Bulk Delete Action Bar */}
                            {selectedOrders.length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-700">
                                            {selectedOrders.length} approved order(s) selected
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedOrders([])}
                                            className="text-red-600 hover:bg-red-100"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleDeleteApprovedOrders}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Select All Header */}
                            {otherOrders.some(o => o.status === 'approved') && (
                                <div className="flex items-center gap-3 mb-2 px-1">
                                    <button
                                        onClick={toggleSelectAllApproved}
                                        className="flex-shrink-0"
                                    >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                            selectedOrders.length === otherOrders.filter(o => o.status === 'approved').length && selectedOrders.length > 0
                                                ? 'bg-red-600 border-red-600'
                                                : 'bg-white border-slate-300 hover:border-red-400'
                                        }`}>
                                            {(selectedOrders.length === otherOrders.filter(o => o.status === 'approved').length && selectedOrders.length > 0) && (
                                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                                            )}
                                        </div>
                                    </button>
                                    <span className="text-sm text-slate-600">
                                        Select all approved orders
                                    </span>
                                </div>
                            )}

                            <div className="grid gap-3">
                                {otherOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className={`group relative rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                                            order.status === 'approved'
                                                ? 'bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-200/50'
                                                : 'bg-gradient-to-br from-red-50/50 to-red-100/30 border-red-200/50'
                                        }`}
                                    >
                                        <div className={`h-0.5 bg-gradient-to-r ${
                                            order.status === 'approved'
                                                ? 'from-emerald-400 via-emerald-500 to-emerald-600'
                                                : 'from-red-400 via-red-500 to-red-600'
                                        }`}></div>
                                        <div className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    {order.status === 'approved' && (
                                                        <button
                                                            onClick={() => toggleOrderSelection(order.id)}
                                                            className="flex-shrink-0 mt-1 sm:mt-0"
                                                        >
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                                selectedOrders.includes(order.id)
                                                                    ? 'bg-red-600 border-red-600'
                                                                    : 'bg-white border-slate-300 hover:border-red-400'
                                                            }`}>
                                                                {selectedOrders.includes(order.id) && (
                                                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    )}
                                                    <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                                                        order.status === 'approved'
                                                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                                            : 'bg-gradient-to-br from-red-400 to-red-600'
                                                    }`}>
                                                        {order.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-slate-900 truncate">{order.user.name}</div>
                                                        <div className="text-xs text-slate-600 truncate">
                                                            {order.user.shop_name || order.user.email}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                                            {order.user.phone && (
                                                                <div className="flex items-center gap-1">
                                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                    <span className="truncate">{formatPhone(order.user.phone)}</span>
                                                                </div>
                                                            )}
                                                            {order.user.address && (
                                                                <div className="flex items-start gap-1">
                                                                    <svg className="h-3 w-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="break-words">{formatAddress(order.user.address)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <Badge className={getStatusBadgeClass(order.status)}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-slate-900">LKR {order.total_amount.toFixed(2)}</div>
                                                        <div className="text-xs text-slate-500">{order.items.length} items</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (filter === 'approved' || filter === 'rejected') ? (
                        <div className="relative bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden mt-4">
                            <div className={`absolute inset-0 bg-gradient-to-br to-transparent ${
                                filter === 'approved' ? 'from-emerald-50/30' : 'from-red-50/30'
                            }`}></div>
                            <div className="relative flex flex-col items-center justify-center py-12 md:py-16 text-center px-6">
                                <div className="relative mb-4 md:mb-6">
                                    <div className={`absolute inset-0 rounded-full blur-xl ${
                                        filter === 'approved' ? 'bg-emerald-400/20' : 'bg-red-400/20'
                                    }`}></div>
                                    <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                                        filter === 'approved'
                                            ? 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                            : 'bg-gradient-to-br from-red-100 to-red-200'
                                    }`}>
                                        {filter === 'approved' ? (
                                            <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />
                                        ) : (
                                            <XCircle className="h-8 w-8 md:h-10 md:w-10 text-red-400" />
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                                    No {filter} orders
                                </h3>
                                <p className="text-sm md:text-base text-slate-500 max-w-sm px-4">
                                    {filter === 'approved'
                                        ? 'There are no approved orders yet.'
                                        : 'There are no rejected orders yet.'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {/* Empty State for All Filter */}
                    {filter === 'all' && filteredOrders.length === 0 && (
                        <div className="relative bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent"></div>
                            <div className="relative flex flex-col items-center justify-center py-12 md:py-16 text-center px-6">
                                <div className="relative mb-4 md:mb-6">
                                    <div className="absolute inset-0 bg-slate-400/20 rounded-full blur-xl"></div>
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                        <Package className="h-8 w-8 md:h-10 md:w-10 text-slate-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                                <p className="text-sm md:text-base text-slate-500 max-w-sm px-4">
                                    There are no orders in the system yet. Orders from retailers will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                </main>

                {/* Footer border */}
                <div className="relative bg-white/80 backdrop-blur-xl border-t border-slate-200/50 rounded-b-2xl h-2"></div>
            </div>
        </div>
    );
}
