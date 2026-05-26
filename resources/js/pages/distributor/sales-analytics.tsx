import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import SalesAnalyticsCard from '@/components/sales-analytics-card';

interface ProductSalesData {
    product_name: string;
    total_quantity: number;
    total_revenue: number;
}

interface MonthlySalesData {
    month: string;
    order_count: number;
    revenue: number;
}

interface SalesAnalyticsData {
    topProducts: ProductSalesData[];
    monthlySales: MonthlySalesData[];
    totalRevenue: number;
    totalProductsSold: number;
}

interface Props {
    salesAnalytics: SalesAnalyticsData;
}

export default function SalesAnalytics({ salesAnalytics }: Props) {
    return (
        <>
            <Head title="Sales Analytics" />
            <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-slate-900 dark:to-blue-900">

                {/* Background decorations */}
                <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl md:h-96 md:w-96"></div>
                <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl md:h-80 md:w-80"></div>

                <div className="relative mx-auto w-full max-w-5xl px-4 py-6">
                    {/* Header */}
                    <header className="relative mb-6 rounded-t-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl">
                        <div className="px-4 py-4 md:px-6">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/distributor/home"
                                    className="flex items-center gap-2 text-slate-600 transition-colors hover:text-[#00447C]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Back to Dashboard
                                    </span>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-[#00447C]" />
                                    <span className="text-sm font-semibold text-slate-700">
                                        Sales Analytics
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <SalesAnalyticsCard
                        topProducts={salesAnalytics.topProducts}
                        monthlySales={salesAnalytics.monthlySales}
                        totalRevenue={salesAnalytics.totalRevenue}
                        totalProductsSold={salesAnalytics.totalProductsSold}
                    />
                </div>
            </div>
        </>
    );
}
