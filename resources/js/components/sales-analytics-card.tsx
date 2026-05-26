import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Package, Banknote, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface SalesAnalyticsCardProps {
    topProducts: ProductSalesData[];
    monthlySales: MonthlySalesData[];
    totalRevenue: number;
    totalProductsSold: number;
}

export default function SalesAnalyticsCard({
    topProducts,
    monthlySales,
    totalRevenue,
    totalProductsSold,
}: SalesAnalyticsCardProps) {
    const productChartData = useMemo(
        () => ({
            labels: topProducts.map((p) => p.product_name),
            datasets: [
                {
                    label: 'Quantity Sold',
                    data: topProducts.map((p) => p.total_quantity),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)',
                        'rgba(168, 85, 247, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)',
                        'rgb(14, 165, 233)',
                        'rgb(168, 85, 247)',
                        'rgb(249, 115, 22)',
                        'rgb(34, 197, 94)',
                    ],
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        }),
        [topProducts],
    );

    const monthlyChartData = useMemo(
        () => ({
            labels: monthlySales.map((m) => {
                const [year, month] = m.month.split('-');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[parseInt(month) - 1]} ${year}`;
            }),
            datasets: [
                {
                    label: 'Revenue',
                    data: monthlySales.map((m) => Number(m.revenue)),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        }),
        [monthlySales],
    );

    const productChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                title: {
                    display: true,
                    text: 'Quantity Sold',
                    font: { size: 11 },
                },
            },
            x: {
                grid: { display: false },
                ticks: {
                    maxRotation: 45,
                    font: { size: 10 },
                },
            },
        },
    };

    const monthlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (context: any) => {
                        return `Revenue: LKR ${context.parsed.y.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                title: {
                    display: true,
                    text: 'Revenue (LKR)',
                    font: { size: 11 },
                },
                ticks: {
                    callback: (value: any) => {
                        if (value >= 1000) {
                            return 'LKR ' + (value / 1000).toFixed(0) + 'k';
                        }
                        return 'LKR ' + value;
                    },
                },
            },
            x: {
                grid: { display: false },
                ticks: {
                    maxRotation: 45,
                    font: { size: 10 },
                },
            },
        },
    };

    return (
        <Card className="col-span-full border-white/50 bg-white/90 shadow-2xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Sales Analytics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border bg-white/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Products Sold</p>
                            <p className="text-xl font-bold">{totalProductsSold}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border bg-white/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <Banknote className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
                            <p className="text-xl font-bold">LKR {Number(totalRevenue).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border bg-white/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                            <TrendingUp className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Monthly Avg</p>
                            <p className="text-xl font-bold">
                                LKR {monthlySales.length > 0
                                    ? Number(monthlySales.reduce((s, m) => s + Number(m.revenue), 0) / monthlySales.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                    : '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                            Top Selling Products
                        </h4>
                        <div className="h-72">
                            {topProducts.length > 0 ? (
                                <Bar data={productChartData} options={productChartOptions} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    No sales data yet
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                            Monthly Sales Trend
                        </h4>
                        <div className="h-72">
                            {monthlySales.length > 0 ? (
                                <Bar data={monthlyChartData} options={monthlyChartOptions} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    No sales data yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
