import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Package, AlertTriangle, Warehouse, TrendingUp, TrendingDown, Eye, EyeOff, ChevronLeft, HelpCircle, LayoutDashboard, Settings, Plus, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
    stock_quantity: number;
}

interface Stats {
    total_products: number;
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
}

interface Props {
    products: Product[];
    stats: Stats;
}

function getStockStatusBadge(status: string): string {
    switch (status) {
        case 'in_stock':
            return 'bg-emerald-500 text-white';
        case 'low_stock':
            return 'bg-amber-500 text-white';
        case 'out_of_stock':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
}

function getStockStatusLabel(status: string): string {
    switch (status) {
        case 'in_stock':
            return 'In Stock';
        case 'low_stock':
            return 'Low Stock';
        case 'out_of_stock':
            return 'Out of Stock';
        default:
            return status;
    }
}

export default function WarehouseInventory({ products, stats }: Props) {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [restockProduct, setRestockProduct] = useState<Product | null>(null);
    const [processingProductId, setProcessingProductId] = useState<number | null>(null);
    
    const form = useForm({
        quantity: 0,
    });

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStockFilter = stockFilter === 'all' || product.stock_status === stockFilter;
            const shouldShowOutOfStock = showOutOfStock || product.stock_status !== 'out_of_stock';
            return matchesSearch && matchesStockFilter && shouldShowOutOfStock;
        });

    const handleRestockClick = (product: Product) => {
        setRestockProduct(product);
        form.setData('quantity', 0);
    };

    const handleRestockSubmit = () => {
        if (restockProduct && form.data.quantity > 0) {
            setProcessingProductId(restockProduct.id);
            form.post(`/distributor/warehouse-inventory/${restockProduct.id}/restock`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Restock success, new props:', page.props);
                    toast({
                        title: 'Stock added!',
                        description: `${restockProduct.name} quantity increased by ${form.data.quantity} units.`,
                    });
                    setRestockProduct(null);
                    setProcessingProductId(null);
                    form.setData('quantity', 0);
                },
                onError: (errors) => {
                    console.error('Restock error:', errors);
                    toast({
                        title: 'Failed to add stock',
                        description: 'There was an error updating the stock quantity.',
                        variant: 'destructive',
                    });
                    setProcessingProductId(null);
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            <Head title="Warehouse Inventory" />

            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00447C]/5 via-transparent to-[#00447C]/5"></div>
                <div className="relative px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/distributor/home">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#00447C]/20 rounded-lg blur-md opacity-0 hover:opacity-100 transition-opacity"></div>
                                    <ChevronLeft className="relative h-6 w-6 text-[#00447C] hover:scale-110 transition-transform" />
                                </div>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#00447C]/20 rounded-xl blur-md"></div>
                                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00447C] to-[#003d6f] flex items-center justify-center shadow-lg">
                                        <Warehouse className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900">Warehouse Inventory</h1>
                                    <p className="text-xs text-slate-500 font-medium">View all products and stock levels</p>
                                </div>
                            </div>
                        </div>
                        <button className="group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <HelpCircle className="relative h-6 w-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative bg-white/60 backdrop-blur-sm border-x border-slate-200/50 px-4 md:px-6 py-6 md:py-8 pb-40">
                <div className="max-w-7xl mx-auto space-y-6">
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
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">{stats.total_products}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">In Stock</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{stats.in_stock}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Low Stock</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                        <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-amber-600 to-amber-500 bg-clip-text text-transparent">{stats.low_stock}</div>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Out of Stock</span>
                                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                        <TrendingDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-red-600 to-red-500 bg-clip-text text-transparent">{stats.out_of_stock}</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white border-slate-200/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={showOutOfStock ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowOutOfStock(!showOutOfStock)}
                                className="h-9"
                            >
                                {showOutOfStock ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                                {showOutOfStock ? 'Hide Out of Stock' : 'Show All'}
                            </Button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">No products found</h3>
                                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-5 gap-3">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <Badge className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 ${getStockStatusBadge(product.stock_status)}`}>
                                            {getStockStatusLabel(product.stock_status)}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-2 space-y-2">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{product.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-[#00447C]">LKR {product.price.toFixed(2)}</span>
                                            <span className="text-xs text-slate-600 font-medium">{product.stock_quantity} units</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    product.stock_status === 'in_stock'
                                                        ? 'bg-emerald-500'
                                                        : product.stock_status === 'low_stock'
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                                }`}
                                                style={{ width: `${Math.min(100, (product.stock_quantity / 100) * 100)}%` }}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleRestockClick(product)}
                                            disabled={processingProductId === product.id}
                                            className="w-full text-xs h-8"
                                            variant="outline"
                                            size="sm"
                                        >
                                            {processingProductId === product.id ? (
                                                <>
                                                    <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Add Stock
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Restock Dialog */}
            <Dialog open={!!restockProduct} onOpenChange={(open) => {
                if (!open && processingProductId === null) {
                    setRestockProduct(null);
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Stock to Warehouse</DialogTitle>
                        <DialogDescription>
                            {restockProduct && `Add inventory quantity for ${restockProduct.name}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity to Add</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', parseInt(e.target.value) || 0)}
                                className="w-full"
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>Current stock: <Badge>{restockProduct?.stock_quantity || 0} units</Badge></p>
                            <p className="mt-1">New stock: <Badge>{(restockProduct?.stock_quantity || 0) + form.data.quantity} units</Badge></p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRestockProduct(null)} disabled={processingProductId !== null}>
                            Cancel
                        </Button>
                        <Button onClick={handleRestockSubmit} disabled={processingProductId !== null || form.data.quantity <= 0}>
                            {processingProductId !== null ? (
                                <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Stock
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spacer */}
            <div className="h-20"></div>

            {/* Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 z-50">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00447C] via-[#003d6f] to-[#00284a]"></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}></div>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="relative container px-4 py-4">
                    <div className="flex justify-center">
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="group relative flex flex-col items-center gap-1.5 p-2"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <Icon className="relative h-5 w-5 text-white/60 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5" />
                                        </div>
                                        <span className="text-[10px] text-white/50 font-medium tracking-wider uppercase group-hover:text-white/80 transition-colors duration-500">
                                            {link.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="relative w-1.5 h-1.5">
                            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-blue-400/40 animate-ping"></div>
                            <div className="relative w-1.5 h-1.5 rounded-full bg-blue-400/60"></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const navLinks = [
    { name: 'Home', icon: LayoutDashboard, href: '/distributor/home' },
    { name: 'Orders', icon: Package, href: '/distributor/incoming-orders' },
    { name: 'Inventory', icon: Warehouse, href: '/distributor/warehouse-inventory' },
    { name: 'Profile', icon: User, href: '/user/profile' },
];
