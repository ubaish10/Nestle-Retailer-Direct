import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, XCircle, Clock, Package, Calendar, ChevronRight, Plus, Eye, ImageOff, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ComplaintItem {
    id: number;
    product_id: number | null;
    product_name: string;
    product_image: string | null;
    quantity: number;
    proof_image_path: string | null;
}

interface Complaint {
    id: number;
    complaint_id: string;
    status: string;
    items: ComplaintItem[];
    product_name: string;
    quantity: number;
    description: string;
    distributor_response: string | null;
    created_at: string;
    resolved_at: string | null;
    distributor_name: string;
    order_id: number;
}

interface Props {
    complaints: Complaint[];
    stats: {
        total_complaints: number;
        pending_complaints: number;
        approved_complaints: number;
        rejected_complaints: number;
    };
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

function getStatusIcon(status: string) {
    switch (status) {
        case 'pending':
            return <Clock className="h-4 w-4" />;
        case 'approved':
            return <CheckCircle className="h-4 w-4" />;
        case 'rejected':
            return <XCircle className="h-4 w-4" />;
        default:
            return <AlertCircle className="h-4 w-4" />;
    }
}

export default function ComplaintIndex({ complaints, stats }: Props) {
    const { toast } = useToast();
    const { flash } = usePage().props;
    const [filter, setFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
    }, [flash?.success]);

    const handleViewComplaint = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedComplaint(null);
    };

    const filteredComplaints = filter === 'all' 
        ? complaints 
        : complaints.filter(c => c.status === filter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-4 px-3 md:py-8">
            <Head title="My Complaints" />

            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-6xl mx-auto">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-t-2xl">
                    <div className="px-4 md:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#00447C] transition-colors">
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                <span className="text-sm font-medium">Back to Home</span>
                            </a>
                            <a
                                href="/complaints/create"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00447C] text-white hover:bg-[#003366] transition-colors font-medium text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Complaint</span>
                            </a>
                        </div>
                        <div className="mt-3">
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">My Complaints</h1>
                            <p className="text-xs text-slate-500 font-medium">Track damaged product complaints</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-6">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2 md:mb-3">
                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">{stats.total_complaints}</div>
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
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-amber-600 to-amber-500 bg-clip-text text-transparent">{stats.pending_complaints}</div>
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
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{stats.approved_complaints}</div>
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
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-red-600 to-red-500 bg-clip-text text-transparent">{stats.rejected_complaints}</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-2 mb-6">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-[#00447C] text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Complaints List */}
                <div className="space-y-4">
                    {filteredComplaints.length === 0 ? (
                        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-12 text-center">
                            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Complaints Found</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {filter === 'all' 
                                    ? "You haven't submitted any complaints yet."
                                    : `No ${filter} complaints found.`}
                            </p>
                            {filter === 'all' && (
                                <a
                                    href="/complaints/create"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00447C] text-white hover:bg-[#003366] transition-colors font-medium text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Submit Your First Complaint</span>
                                </a>
                            )}
                        </div>
                    ) : (
                        filteredComplaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Products List */}
                                    <div className="flex flex-wrap gap-2 md:flex-col flex-shrink-0">
                                        {complaint.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                                {item.product_image ? (
                                                    <img
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-8 w-8 text-slate-400" />
                                                )}
                                            </div>
                                        ))}
                                        {complaint.items.length > 3 && (
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
                                                <span className="text-xs font-bold text-slate-600">+{complaint.items.length - 3}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Complaint Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-900 mb-1">
                                                    {complaint.product_name}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    Complaint ID: <span className="font-mono font-semibold">{complaint.complaint_id}</span>
                                                </p>
                                            </div>
                                            <Badge className={`flex items-center gap-1 px-3 py-1 ${getStatusBadge(complaint.status)}`}>
                                                {getStatusIcon(complaint.status)}
                                                <span className="capitalize text-xs font-medium">{complaint.status}</span>
                                            </Badge>
                                        </div>

                                        <Button
                                            onClick={() => handleViewComplaint(complaint)}
                                            variant="outline"
                                            size="sm"
                                            className="mb-3 text-sm font-medium"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Complaint
                                        </Button>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                                            <div>
                                                <p className="text-slate-500 mb-1">Quantity</p>
                                                <p className="font-semibold text-slate-900">{complaint.quantity} units</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Distributor</p>
                                                <p className="font-semibold text-slate-900">{complaint.distributor_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Submitted</p>
                                                <p className="font-semibold text-slate-900">{complaint.created_at}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Resolved</p>
                                                <p className="font-semibold text-slate-900">{complaint.resolved_at || 'Pending'}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                            <p className="text-xs font-medium text-slate-700 mb-1">Description:</p>
                                            <p className="text-sm text-slate-600">{complaint.description}</p>
                                        </div>

                                        {complaint.distributor_response && (
                                            <div className={`rounded-lg p-3 ${
                                                complaint.status === 'approved' 
                                                    ? 'bg-emerald-50 border border-emerald-200' 
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <p className={`text-xs font-medium mb-1 ${
                                                    complaint.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
                                                }`}>
                                                    {complaint.status === 'approved' ? '✓ Approved - ' : '✗ Rejected - '}
                                                    Distributor Response:
                                                </p>
                                                <p className={`text-sm ${
                                                    complaint.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                    {complaint.distributor_response}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Floating Modal for Complaint Details */}
            {showModal && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200/50">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200/50 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Complaint Details</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Complaint ID: <span className="font-mono font-semibold">{selectedComplaint.complaint_id}</span>
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center justify-center">
                                <Badge className={`flex items-center gap-2 px-4 py-2 text-sm ${getStatusBadge(selectedComplaint.status)}`}>
                                    {getStatusIcon(selectedComplaint.status)}
                                    <span className="capitalize font-semibold">{selectedComplaint.status}</span>
                                </Badge>
                            </div>

                            {/* Product Details */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Products ({selectedComplaint.items.length})</h3>
                                <div className="space-y-3">
                                    {selectedComplaint.items.map((item, idx) => (
                                        <div key={item.id} className="bg-white rounded-lg p-3 border border-slate-200">
                                            <div className="flex items-start gap-3 mb-2">
                                                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                                                    {item.product_image ? (
                                                        <img
                                                            src={item.product_image}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">{item.product_name}</p>
                                                    <p className="text-xs text-slate-500">Quantity: {item.quantity} units</p>
                                                </div>
                                            </div>
                                            {item.proof_image_path ? (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-slate-700 mb-1">Proof Image:</p>
                                                    <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
                                                        <img
                                                            src={item.proof_image_path}
                                                            alt={`Proof for ${item.product_name}`}
                                                            className="w-full h-auto max-h-40 object-contain"
                                                            onError={(e) => {
                                                                const target = e.currentTarget;
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = `
                                                                        <div class="flex flex-col items-center justify-center p-6 text-slate-400">
                                                                            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                            </svg>
                                                                            <p class="text-xs">Unable to load image</p>
                                                                        </div>
                                                                    `;
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-slate-700 mb-1">Proof Image:</p>
                                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                                        <svg class="w-6 h-6 text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        <p className="text-[10px] text-slate-500">No image uploaded</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                                <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
                            </div>

                            {/* Dates */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Timeline</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Submitted On</p>
                                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {selectedComplaint.created_at}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Resolved On</p>
                                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {selectedComplaint.resolved_at || 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Distributor Response */}
                            {selectedComplaint.distributor_response && (
                                <div className={`rounded-xl p-4 border-2 ${
                                    selectedComplaint.status === 'approved'
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-red-50 border-red-200'
                                }`}>
                                    <h3 className={`text-sm font-bold mb-2 ${
                                        selectedComplaint.status === 'approved' ? 'text-emerald-900' : 'text-red-900'
                                    }`}>
                                        {selectedComplaint.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                    </h3>
                                    <div className={`rounded-lg p-3 ${
                                        selectedComplaint.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                                    }`}>
                                        <p className={`text-xs font-medium mb-1 ${
                                            selectedComplaint.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
                                        }`}>
                                            Distributor Response:
                                        </p>
                                        <p className={`text-sm ${
                                            selectedComplaint.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {selectedComplaint.distributor_response}
                                        </p>
                                    </div>
                                    {selectedComplaint.resolved_at && (
                                        <p className="text-xs text-slate-500 mt-2">
                                            Resolved on: {selectedComplaint.resolved_at}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200/50 px-6 py-4 rounded-b-2xl">
                            <Button
                                onClick={closeModal}
                                className="w-full bg-[#00447C] hover:bg-[#003366] text-white font-semibold py-3"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
