import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Calendar, User, Mail, AlertCircle, CheckCircle, XCircle, Clock, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    items: OrderItem[];
}

interface Complaint {
    id: number;
    complaint_id: string;
    status: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    description: string;
    image_path: string | null;
    distributor_response: string | null;
    created_at: string;
    resolved_at: string | null;
    retailer_name: string;
    retailer_email: string;
    order_id: number;
    order: Order | null;
}

interface Props {
    complaint: Complaint;
}

function getStatusBadge(status: string): string {
    switch (status) {
        case 'pending':
            return 'bg-amber-100 text-amber-800 border-amber-300';
        case 'approved':
            return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

export default function DistributorComplaintReview({ complaint }: Props) {
    const { toast } = useToast();
    const { flash } = usePage().props;
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approveResponse, setApproveResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
    }, [flash?.success]);

    const handleApprove = () => {
        setIsSubmitting(true);
        router.post(`/distributor/complaints/${complaint.id}/approve`, {
            response: approveResponse,
        }, {
            onFinish: () => {
                setIsSubmitting(false);
                setShowApproveModal(false);
            },
        });
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please provide a reason for rejection.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        router.post(`/distributor/complaints/${complaint.id}/reject`, {
            reason: rejectReason,
        }, {
            onFinish: () => {
                setIsSubmitting(false);
                setShowRejectModal(false);
            },
        });
    };

    const handleMarkPending = () => {
        if (confirm('Are you sure you want to mark this complaint as pending?')) {
            router.post(`/distributor/complaints/${complaint.id}/mark-pending`, {
                onFinish: () => {
                    toast({
                        title: 'Success',
                        description: 'Complaint marked as pending.',
                    });
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-4 px-3 md:py-8">
            <Head title={`Review Complaint - ${complaint.complaint_id}`} />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-4xl mx-auto">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-t-2xl">
                    <div className="px-4 md:px-6 py-4">
                        <div className="flex items-center justify-between">
                            <a href="/distributor/complaints" className="flex items-center gap-2 text-slate-600 hover:text-[#00447C] transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="text-sm font-medium">Back to Complaints</span>
                            </a>
                            <Badge className={`flex items-center gap-2 px-4 py-2 text-sm ${getStatusBadge(complaint.status)}`}>
                                {complaint.status === 'pending' && <Clock className="h-4 w-4" />}
                                {complaint.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                                {complaint.status === 'rejected' && <XCircle className="h-4 w-4" />}
                                <span className="capitalize font-semibold">{complaint.status}</span>
                            </Badge>
                        </div>
                        <div className="mt-3">
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Complaint Review</h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Complaint ID: <span className="font-mono font-semibold">{complaint.complaint_id}</span>
                            </p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-b-2xl p-4 md:p-8 space-y-6">
                    {/* Retailer Information */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Retailer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Name</p>
                                    <p className="font-semibold text-slate-900">{complaint.retailer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="font-semibold text-slate-900">{complaint.retailer_email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Product Details</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-48 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {complaint.product_image ? (
                                    <img
                                        src={complaint.product_image}
                                        alt={complaint.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="h-20 w-20 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Product Name</p>
                                    <p className="text-lg font-bold text-slate-900">{complaint.product_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Quantity Affected</p>
                                        <p className="text-lg font-bold text-slate-900">{complaint.quantity} units</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Submitted On</p>
                                        <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {complaint.created_at}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Damage Description */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Damage Description</h2>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{complaint.description}</p>
                        </div>
                    </div>

                    {/* Proof Image */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Proof Image</h2>
                        {complaint.image_path ? (
                            <div className="space-y-3">
                                <div className="rounded-lg overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200">
                                    <img
                                        src={complaint.image_path}
                                        alt="Proof of damage"
                                        className="w-full h-auto max-h-96 object-contain"
                                        onError={(e) => {
                                            console.error('Failed to load proof image:', complaint.image_path);
                                            const target = e.currentTarget;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '';
                                                const placeholder = document.createElement('div');
                                                placeholder.className = 'flex flex-col items-center justify-center p-12 text-slate-400';
                                                placeholder.innerHTML = `
                                                    <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <p class="text-sm font-medium">Unable to load image</p>
                                                    <p class="text-xs mt-1">The image file may have been deleted</p>
                                                `;
                                                parent.appendChild(placeholder);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded">
                                    <Package className="h-3 w-3" />
                                    <span>Image path: {complaint.image_path}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                <ImageOff className="h-16 w-16 text-slate-300 mb-3" />
                                <p className="text-sm font-medium text-slate-500">No proof image uploaded</p>
                                <p className="text-xs text-slate-400 mt-1">The retailer did not upload an image with this complaint</p>
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    {complaint.order && (
                        <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Original Order Details</h2>
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order #</span>
                                    <span className="font-semibold text-slate-900">{complaint.order.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order Date</span>
                                    <span className="font-semibold text-slate-900">{complaint.order.created_at}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total Amount</span>
                                    <span className="font-semibold text-slate-900">${complaint.order.total_amount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3">
                                    <p className="text-xs font-semibold text-slate-700 mb-2">Order Items:</p>
                                    <div className="space-y-2">
                                        {complaint.order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-slate-600">{item.product_name} x{item.quantity}</span>
                                                <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Distributor Response (if already resolved) */}
                    {complaint.distributor_response && (
                        <div className={`rounded-xl p-6 border-2 ${
                            complaint.status === 'approved' 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <h2 className={`text-lg font-bold mb-4 ${
                                complaint.status === 'approved' ? 'text-emerald-900' : 'text-red-900'
                            }`}>
                                {complaint.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </h2>
                            <div className={`rounded-lg p-4 ${
                                complaint.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                            }`}>
                                <p className={`text-sm font-medium mb-2 ${
                                    complaint.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
                                }`}>
                                    Response:
                                </p>
                                <p className={`text-sm ${
                                    complaint.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {complaint.distributor_response}
                                </p>
                            </div>
                            {complaint.resolved_at && (
                                <p className="text-xs text-slate-500 mt-4">
                                    Resolved on: {complaint.resolved_at}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    {complaint.status === 'pending' && (
                        <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Take Action</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => setShowApproveModal(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Approve Complaint
                                </Button>
                                <Button
                                    onClick={() => setShowRejectModal(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-6"
                                >
                                    <XCircle className="h-5 w-5 mr-2" />
                                    Reject Complaint
                                </Button>
                                <Button
                                    onClick={handleMarkPending}
                                    variant="outline"
                                    className="font-semibold py-6"
                                >
                                    <Clock className="h-5 w-5 mr-2" />
                                    Keep Pending
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                <AlertCircle className="h-4 w-4 inline mr-1" />
                                Approving will initiate replacement process. Requiring requires a reason.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Approve Complaint</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            This will initiate the replacement process for {complaint.quantity} units of {complaint.product_name}.
                        </p>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Response (optional)
                            </label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Add any notes about the replacement..."
                                value={approveResponse}
                                onChange={(e) => setApproveResponse(e.target.value)}
                                maxLength={1000}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Approval'}
                            </Button>
                            <Button
                                onClick={() => setShowApproveModal(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Complaint</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Please provide a reason for rejecting this complaint.
                        </p>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Rejection Reason *
                            </label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Explain why this complaint is being rejected..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                maxLength={1000}
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
                            </Button>
                            <Button
                                onClick={() => setShowRejectModal(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
