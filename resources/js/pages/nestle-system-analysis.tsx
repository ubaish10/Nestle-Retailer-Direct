import { Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import {
    ShoppingCart,
    Package,
    Clock,
} from 'lucide-react';

const layoutSections = [
    {
        area: 'One-Tap Reorder',
        icon: ShoppingCart,
        href: '/quick-reorder',
        isComingSoon: false,
    },
    {
        area: 'Inventory',
        icon: Package,
        href: '/stock',
        isComingSoon: true,
    },
    {
        area: 'My Orders',
        icon: Clock,
        href: '/my-orders',
        isComingSoon: true,
    },
];

export default function NestleSystemAnalysis({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <GuestLayout canRegister={canRegister}>
            <Head title="Nestlé System Analysis" />
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-slate-900 dark:to-blue-900 overflow-x-hidden">
                {/* Cards Container */}
                <div className="flex flex-col justify-center gap-4 md:gap-10 w-full max-w-4xl mx-auto pb-28 md:pb-32 px-4">
                    {/* Mobile Layout - 3 rows x 2 cols */}
                    <div className="flex flex-col gap-4 md:hidden">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-3">
                            {layoutSections.slice(0, 2).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50"
                                        >
                                            <p className="font-medium text-[10px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <a
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1.5 h-5 w-5 text-primary" />
                                        </div>
                                        <p className="font-medium text-[10px] group-hover:text-primary/80 transition-colors duration-300">{section.area}</p>
                                        <div className="mt-1.5 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                                Click to view
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-3">
                            {layoutSections.slice(2, 3).map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50"
                                        >
                                            <p className="font-medium text-[10px] text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <a
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                            <Icon className="mb-1.5 h-5 w-5 text-primary" />
                                        </div>
                                        <p className="font-medium text-[10px] group-hover:text-primary/80 transition-colors duration-300">{section.area}</p>
                                        <div className="mt-1.5 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                                Click to view
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                            <div className="flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-[10px] text-muted-foreground">Coming Soon</p>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-[10px] text-muted-foreground">Coming Soon</p>
                            </div>
                            <div className="flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white/90 p-2 text-center shadow-lg backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-[10px] text-muted-foreground">Coming Soon</p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout - 2 rows x 3 cols (original) */}
                    <div className="hidden md:flex flex-col gap-10">
                        {/* Row 1 */}
                        <div className="grid gap-10 md:grid-cols-3">
                            {layoutSections.map((section) => {
                                const Icon = section.icon;
                                if (section.isComingSoon) {
                                    return (
                                        <div
                                            key={section.area}
                                            className="flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50"
                                        >
                                            <p className="font-medium text-xl text-muted-foreground">Coming Soon</p>
                                        </div>
                                    );
                                }
                                return (
                                    <a
                                        key={section.area}
                                        href={section.href}
                                        className="group flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm border border-white/50 dark:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-white cursor-pointer"
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                            <Icon className="mb-4 h-14 w-14 text-primary" />
                                        </div>
                                        <p className="font-medium text-xl group-hover:text-primary/80 transition-colors duration-300">{section.area}</p>
                                        <div className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                Click to view
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Row 2 - In Progress */}
                        <div className="grid gap-10 md:grid-cols-3">
                            <div className="flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-xl text-muted-foreground">Coming Soon</p>
                            </div>
                            <div className="flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-xl text-muted-foreground">Coming Soon</p>
                            </div>
                            <div className="flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm border border-white/50 dark:bg-white/10 opacity-50">
                                <p className="font-medium text-xl text-muted-foreground">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
