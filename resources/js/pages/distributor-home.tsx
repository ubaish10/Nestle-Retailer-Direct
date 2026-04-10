import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import {
    ClipboardList,
    Warehouse,
    Truck,
    BarChart3,
    MapPin,
    PackageSearch,
    Users,
    Bell,
    AlertCircle,
} from 'lucide-react';

const distributorSections = [
    {
        area: 'Retailer Orders',
        icon: ClipboardList,
        href: '/distributor/incoming-orders',
        description: 'View incoming orders',
        isComingSoon: false,
    },
    {
        area: 'Complaints',
        icon: AlertCircle,
        href: '/distributor/complaints',
        description: 'Manage complaints',
        isComingSoon: false,
    },
    {
        area: 'Warehouse Inventory',
        icon: Warehouse,
        href: '/distributor/warehouse-inventory',
        description: 'Manage stock levels',
        isComingSoon: true,
    },
    {
        area: 'Delivery Tracking',
        icon: Truck,
        href: '/distributor/delivery',
        description: 'Track shipments',
        isComingSoon: true,
    },
    {
        area: 'Order Statistics',
        icon: BarChart3,
        href: '/distributor/statistics',
        description: 'View performance',
        isComingSoon: true,
    },
    {
        area: 'Delivery Schedule',
        icon: MapPin,
        href: '/distributor/schedule',
        description: 'Manage schedules',
        isComingSoon: true,
    },
    {
        area: 'Retailer Management',
        icon: Users,
        href: '/distributor/retailers',
        description: 'Manage retailers',
        isComingSoon: true,
    },
    {
        area: 'Tracking Dashboard',
        icon: PackageSearch,
        href: '/distributor/dashboard',
        description: 'Full tracking view',
        isComingSoon: true,
    },
    {
        area: 'Notifications',
        icon: Bell,
        href: '/distributor/notifications',
        description: 'View alerts',
        isComingSoon: true,
    },
];

interface Props {
    name: string;
    companyName: string;
    stats: {
        pending_orders: number;
        total_retailers: number;
        in_transit: number;
        pending_complaints: number;
    };
    recentComplaints: Array<{
        id: number;
        complaint_id: string;
        product_name: string;
        product_image: string | null;
        quantity: number;
        retailer_name: string;
        created_at: string;
    }>;
}

export default function DistributorHome({ name, companyName, stats, recentComplaints }: Props) {
    return (
        <GuestLayout>
            <Head title="Distributor Portal" />
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-slate-900 dark:to-blue-900 overflow-x-hidden">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-1 tracking-wider">DISTRIBUTOR PORTAL</h1>
                    <p className="text-muted-foreground text-xs md:text-sm">{companyName} • {name}</p>
                </div>

                {/* Pending Complaints Cards */}
                {recentComplaints.length > 0 && (
                    <div className="w-full max-w-5xl mx-auto mb-6 md:mb-8 px-3 md:px-4">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Pending Complaints ({stats.pending_complaints})
                            </h2>
                            <Link
                                href="/distributor/complaints"
                                className="text-xs md:text-sm text-primary hover:underline font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        
                        {/* Mobile: Scroll horizontally */}
                        <div className="md:hidden overflow-x-auto pb-2 -mx-3 px-3">
                            <div className="flex gap-3">
                                {recentComplaints.map((complaint) => (
                                    <Link
                                        key={complaint.id}
                                        href={`/distributor/complaints/${complaint.id}`}
                                        className="flex-shrink-0 w-64 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {complaint.product_image ? (
                                                    <img
                                                        src={complaint.product_image}
                                                        alt={complaint.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 truncate">{complaint.product_name}</p>
                                                <p className="text-[10px] text-slate-500 mt-1">By: {complaint.retailer_name}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{complaint.created_at}</p>
                                                <div className="mt-2 flex items-center gap-1">
                                                    <span className="text-[10px] font-medium text-red-600">Qty: {complaint.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-red-200">
                                            <p className="text-[10px] font-medium text-red-700 text-center">Click to review →</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Grid */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentComplaints.map((complaint) => (
                                <Link
                                    key={complaint.id}
                                    href={`/distributor/complaints/${complaint.id}`}
                                    className="group bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-300"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {complaint.product_image ? (
                                                <img
                                                    src={complaint.product_image}
                                                    alt={complaint.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <AlertCircle className="h-10 w-10 text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{complaint.product_name}</p>
                                            <p className="text-xs text-slate-500 mt-1">By: {complaint.retailer_name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{complaint.created_at}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs font-medium text-red-600">Qty: {complaint.quantity} units</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <p className="text-xs font-medium text-red-700 text-center group-hover:text-red-800 transition-colors">
                                            Click to review complaint →
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cards Container */}
                <div className="flex flex-col justify-center gap-3 md:gap-6 w-full max-w-5xl mx-auto pb-24 md:pb-28 px-3 md:px-4">
                    {/* Mobile Layout - Multiple rows x 2 cols */}
                    <div className="flex flex-col gap-3 md:hidden">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-2">
                            {distributorSections.slice(0, 2).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-[9px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1 h-4 w-4 text-primary" />
                                        </div>
                                        <p className="font-medium text-[9px] group-hover:text-primary/80 transition-colors duration-300 text-center leading-tight">{section.area}</p>
                                        <div className="mt-1 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                                                Click
                                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-2">
                            {distributorSections.slice(2, 4).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-[9px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1 h-4 w-4 text-primary" />
                                        </div>
                                        <p className="font-medium text-[9px] group-hover:text-primary/80 transition-colors duration-300 text-center leading-tight">{section.area}</p>
                                        <div className="mt-1 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                                                Click
                                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-2">
                            {distributorSections.slice(4, 6).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-[9px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1 h-4 w-4 text-primary" />
                                        </div>
                                        <p className="font-medium text-[9px] group-hover:text-primary/80 transition-colors duration-300 text-center leading-tight">{section.area}</p>
                                        <div className="mt-1 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                                                Click
                                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-2 gap-2">
                            {distributorSections.slice(6, 8).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-[9px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-20 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1 h-4 w-4 text-primary" />
                                        </div>
                                        <p className="font-medium text-[9px] group-hover:text-primary/80 transition-colors duration-300 text-center leading-tight">{section.area}</p>
                                        <div className="mt-1 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                                                Click
                                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop Layout - 2 rows x 4 cols */}
                    <div className="hidden md:flex flex-col gap-6">
                        {/* Row 1 */}
                        <div className="grid gap-6 md:grid-cols-4">
                            {distributorSections.slice(0, 4).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-48 w-full flex-col items-center justify-center rounded-3xl bg-white/90 p-6 text-center shadow-2xl backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-lg text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-48 w-full flex-col items-center justify-center rounded-3xl bg-white/90 p-6 text-center shadow-2xl backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                            <Icon className="mb-3 h-10 w-10 text-primary" />
                                        </div>
                                        <p className="font-medium text-lg group-hover:text-primary/80 transition-colors duration-300 text-center">{section.area}</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-center">{section.description}</p>
                                        <div className="mt-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                Click to view
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Row 2 */}
                        <div className="grid gap-6 md:grid-cols-4">
                            {distributorSections.slice(4, 8).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-48 w-full flex-col items-center justify-center rounded-3xl bg-white/90 p-6 text-center shadow-2xl backdrop-blur-sm border border-white/50 opacity-50"
                                        >
                                            <p className="font-medium text-lg text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-48 w-full flex-col items-center justify-center rounded-3xl bg-white/90 p-6 text-center shadow-2xl backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                            <Icon className="mb-3 h-10 w-10 text-primary" />
                                        </div>
                                        <p className="font-medium text-lg group-hover:text-primary/80 transition-colors duration-300 text-center">{section.area}</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-center">{section.description}</p>
                                        <div className="mt-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                Click to view
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
