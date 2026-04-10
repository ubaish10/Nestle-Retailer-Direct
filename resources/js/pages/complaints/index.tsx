import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, XCircle, Clock, Package, Calendar, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
    }, [flash?.success]);

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
                                    {/* Product Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {complaint.product_image ? (
                                            <img
                                                src={complaint.product_image}
                                                alt={complaint.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Package className="h-10 w-10 text-slate-400" />
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
        </div>
    );
}
