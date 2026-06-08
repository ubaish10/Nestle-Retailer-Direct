import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import {
    AlertCircle,
    ClipboardList,
    BarChart3,
    MessageSquare,
    Receipt,
} from 'lucide-react';

interface Props {
    name: string;
    companyName: string;
    stats: {
        pending_orders: number;
        total_retailers: number;
        in_transit: number;
    };
}

const distributorSections = [
    {
        area: 'Incoming Orders',
        icon: ClipboardList,
        href: '/distributor/incoming-orders',
        description: 'View incoming orders',
    },
    {
        area: 'Complaints',
        icon: AlertCircle,
        href: '/distributor/complaints',
        description: 'Manage complaints',
    },
    {
        area: 'Feedback',
        icon: MessageSquare,
        href: '/distributor/feedback',
        description: 'Submit feedback',
    },
    {
        area: 'Invoice',
        icon: Receipt,
        href: '/invoices',
        description: 'View invoices',
    },
    {
        area: 'Sales Analytics',
        icon: BarChart3,
        href: '/distributor/sales-analytics',
        description: 'View sales trends & insights',
    },
];

export default function DistributorHome({ name, companyName, stats }: Props) {
    return (
        <GuestLayout>
            <Head title="Distributor Portal" />
            <div className="flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-12 md:pt-20 dark:from-blue-950 dark:via-slate-900 dark:to-blue-900">
                {/* Header */}
                <div className="mb-6 text-center md:mb-8">
                    <h1 className="mb-1 text-xl font-bold tracking-wider text-primary md:text-2xl">
                        DISTRIBUTOR PORTAL
                    </h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                        {companyName} • {name}
                    </p>
                </div>

                {/* Cards Container */}
                <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-center gap-3 px-3 pb-24 md:gap-6 md:px-6 md:pb-28">
                    {/* Mobile Layout */}
                    <div className="grid grid-cols-2 gap-3 md:hidden">
                        {distributorSections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <Link
                                    key={section.area}
                                    href={section.href}
                                    className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-white/50 bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:bg-white/10"
                                >
                                    <div className="transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                                        <Icon className="mb-1.5 h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-center text-[10px] leading-tight font-medium transition-colors duration-300 group-hover:text-primary/80">
                                        {section.area}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex md:flex-row md:justify-center md:gap-6">
                        {distributorSections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <Link
                                    key={section.area}
                                    href={section.href}
                                    className="group flex h-56 w-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:bg-white/10"
                                >
                                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110">
                                        <Icon className="mb-4 h-14 w-14 text-primary" />
                                    </div>
                                    <p className="text-center text-xl font-medium transition-colors duration-300 group-hover:text-primary/80">
                                        {section.area}
                                    </p>
                                    <div className="mt-4 translate-y-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                            Click to view
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
