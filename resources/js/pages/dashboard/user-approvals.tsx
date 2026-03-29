import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { User, CheckCircle, XCircle, AlertCircle, Sparkles, Store, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Approvals',
        href: '/dashboard/user-approvals',
    },
];

interface Profile {
    id: number;
    shop_name?: string;
    company_name?: string;
    shop_address?: string;
    company_address?: string;
    shop_city?: string;
    company_city?: string;
    shop_phone?: string;
    company_phone?: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    approval_status: string;
    created_at: string;
    profile: Profile | null;
}

interface Props {
    allUsers: UserData[];
    pendingUsers: UserData[];
    approvedUsers: UserData[];
    rejectedUsers: UserData[];
    stats: {
        total_users: number;
        pending_users: number;
        approved_users: number;
        rejected_users: number;
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

export default function UserApprovals({ allUsers = [], stats = { total_users: 0, pending_users: 0, approved_users: 0, rejected_users: 0 } }: Props) {
    const { toast } = useToast();
    const [filter, setFilter] = useState('all');

    const handleApprove = (userId: number) => {
        router.post(`/dashboard/user-approvals/${userId}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'User approved!',
                    description: 'The user account has been approved.',
                });
            },
            onError: () => {
                toast({
                    title: 'Failed to approve',
                    description: 'There was an error approving the user.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleReject = (userId: number) => {
        router.post(`/dashboard/user-approvals/${userId}/reject`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'User rejected',
                    description: 'The user account has been rejected.',
                });
            },
            onError: () => {
                toast({
                    title: 'Failed to reject',
                    description: 'There was an error rejecting the user.',
                    variant: 'destructive',
                });
            },
        });
    };

    const filteredUsers = filter === 'all' ? allUsers : allUsers.filter(u => u.approval_status === filter);
    const pendingUsers = filteredUsers.filter(u => u.approval_status === 'pending');
    const otherUsers = filteredUsers.filter(u => u.approval_status !== 'pending');

    const UserCard = ({ user, showActions = false }: { user: UserData; showActions?: boolean }) => (
        <div className={`group relative rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
            user.approval_status === 'pending'
                ? 'bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-amber-200/50'
                : user.approval_status === 'approved'
                ? 'bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-200/50'
                : 'bg-gradient-to-br from-red-50/50 to-red-100/30 border-red-200/50'
        }`}>
            <div className={`h-0.5 bg-gradient-to-r ${
                user.approval_status === 'pending'
                    ? 'from-amber-400 via-amber-500 to-amber-600'
                    : user.approval_status === 'approved'
                    ? 'from-emerald-400 via-emerald-500 to-emerald-600'
                    : 'from-red-400 via-red-500 to-red-600'
            }`}></div>
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                            user.role === 'retailer'
                                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                : 'bg-gradient-to-br from-purple-400 to-purple-600'
                        }`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                                <Badge variant={user.role === 'retailer' ? 'default' : 'secondary'} className="text-xs">
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="text-xs text-slate-600 truncate">{user.email}</div>
                            <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                {user.profile && (
                                    <>
                                        {user.role === 'retailer' && user.profile.shop_name && (
                                            <div className="flex items-center gap-1">
                                                <Store className="h-3 w-3" />
                                                <span className="truncate">{user.profile.shop_name}</span>
                                            </div>
                                        )}
                                        {user.role === 'distributor' && user.profile.company_name && (
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                <span className="truncate">{user.profile.company_name}</span>
                                            </div>
                                        )}
                                        {user.profile.shop_city || user.profile.company_city ? (
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{user.profile.shop_city || user.profile.company_city}</span>
                                            </div>
                                        ) : null}
                                        {user.profile.shop_phone || user.profile.company_phone ? (
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span>{user.profile.shop_phone || user.profile.company_phone}</span>
                                            </div>
                                        ) : null}
                                    </>
                                )}
                                <div className="flex items-center gap-1 pt-0.5">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{user.created_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge className={getStatusBadgeClass(user.approval_status)}>
                            {user.approval_status.charAt(0).toUpperCase() + user.approval_status.slice(1)}
                        </Badge>
                        {showActions && (
                            <div className="flex gap-1.5 flex-shrink-0">
                                <Button
                                    onClick={() => handleReject(user.id)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300 h-8"
                                >
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span className="ml-1 hidden sm:inline">Reject</span>
                                </Button>
                                <Button
                                    onClick={() => handleApprove(user.id)}
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 h-8"
                                >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span className="ml-1 hidden sm:inline">Approve</span>
                                    <span className="ml-1 sm:hidden">OK</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Approvals" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-4 px-3 md:py-8">
                {/* Decorative Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#00447C]/3 via-transparent to-transparent rounded-full blur-3xl"></div>
                </div>

                {/* Main Container */}
                <div className="relative w-full max-w-5xl mx-auto">
                    {/* Header */}
                    <header className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 sticky top-0 z-50 rounded-t-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00447C]/5 via-transparent to-[#00447C]/5"></div>
                        <div className="relative px-4 md:px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 bg-[#00447C]/20 rounded-xl blur-md"></div>
                                        <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#00447C] to-[#003d6f] flex items-center justify-center shadow-lg">
                                            <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight truncate">User Approvals</h1>
                                        <p className="text-xs text-slate-500 font-medium hidden sm:block">Review and manage user registrations</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 md:px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                        <span className="text-xs sm:text-sm font-semibold text-amber-700 whitespace-nowrap">{stats.pending_users} Pending</span>
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
                                                <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">{stats.total_users}</div>
                                    </div>
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2 md:mb-3">
                                            <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</span>
                                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                                <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-amber-600 to-amber-500 bg-clip-text text-transparent">{stats.pending_users}</div>
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
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{stats.approved_users}</div>
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
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-red-600 to-red-500 bg-clip-text text-transparent">{stats.rejected_users}</div>
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

                            {/* Pending Users Section */}
                            {pendingUsers.length > 0 ? (
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
                                            {pendingUsers.length}
                                        </Badge>
                                    </div>
                                    <div className="grid gap-3 md:gap-4">
                                        {pendingUsers.map((user, index) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                showActions
                                            />
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
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No pending users</h3>
                                        <p className="text-slate-500 max-w-sm">
                                            There are no users awaiting your approval at the moment.
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Other Users Section */}
                            {otherUsers.length > 0 ? (
                                <div className="mt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Processed Users</h2>
                                            <p className="text-xs text-slate-500 font-medium">Completed decisions</p>
                                        </div>
                                        <Badge variant="outline" className="self-start sm:self-center flex-shrink-0">
                                            {otherUsers.length}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-3">
                                        {otherUsers.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                            />
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
                                            No {filter} users
                                        </h3>
                                        <p className="text-sm md:text-base text-slate-500 max-w-sm px-4">
                                            {filter === 'approved'
                                                ? 'There are no approved users yet.'
                                                : 'There are no rejected users yet.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Empty State for All Filter */}
                            {filter === 'all' && filteredUsers.length === 0 && (
                                <div className="relative bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent"></div>
                                    <div className="relative flex flex-col items-center justify-center py-12 md:py-16 text-center px-6">
                                        <div className="relative mb-4 md:mb-6">
                                            <div className="absolute inset-0 bg-slate-400/20 rounded-full blur-xl"></div>
                                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                <User className="h-8 w-8 md:h-10 md:w-10 text-slate-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No users yet</h3>
                                        <p className="text-sm md:text-base text-slate-500 max-w-sm px-4">
                                            There are no user registrations in the system yet.
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
        </AppLayout>
    );
}
