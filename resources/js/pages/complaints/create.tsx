import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Plus, Upload, Package, Calendar, DollarSign, Trash2, X } from 'lucide-react';

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    distributor_name: string;
    items: Array<{
        id: number;
        product_id: number | null;
        product_name: string;
        product_image: string | null;
        quantity: number;
        price: number;
    }>;
}

interface ComplaintProduct {
    id: string; // Temporary ID for UI
    product_id: number | null;
    product_name: string;
    product_image: string | null;
    quantity: string;
    proof_image: File | null;
    proof_image_preview: string | null;
    max_quantity: number;
}

interface PageProps {
    orders: Order[];
    [key: string]: any;
}

export default function CreateComplaint({ orders }: PageProps) {
    const { toast } = useToast();
    const { flash } = usePage().props;
    const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [complaintProducts, setComplaintProducts] = useState<ComplaintProduct[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOrder = orders.find((o) => o.id.toString() === selectedOrderId);
    const orderProducts = selectedOrder?.items || [];

    const addProduct = () => {
        const newProduct: ComplaintProduct = {
            id: `temp_${Date.now()}_${Math.random()}`,
            product_id: null,
            product_name: '',
            product_image: null,
            quantity: '1',
            proof_image: null,
            proof_image_preview: null,
            max_quantity: 0,
        };
        setComplaintProducts([...complaintProducts, newProduct]);
    };

    const removeProduct = (id: string) => {
        setComplaintProducts(complaintProducts.filter(p => p.id !== id));
    };

    const updateProduct = (id: string, field: keyof ComplaintProduct, value: any) => {
        setComplaintProducts(complaintProducts.map(p => {
            if (p.id === id) {
                const updated = { ...p, [field]: value };
                
                // If product selection changed, update max_quantity and product details
                if (field === 'product_id' && value) {
                    const orderProduct = orderProducts.find(op => op.product_id === parseInt(value));
                    if (orderProduct) {
                        updated.product_name = orderProduct.product_name;
                        updated.product_image = orderProduct.product_image;
                        updated.max_quantity = orderProduct.quantity;
                        updated.quantity = Math.min(parseInt(p.quantity) || 1, orderProduct.quantity).toString();
                    }
                }
                
                return updated;
            }
            return p;
        }));
    };

    const handleImageChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({ title: 'File too large', description: 'Image size must not exceed 2MB.', variant: 'destructive' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Update both fields at once to avoid race condition
                setComplaintProducts(complaintProducts.map(p => {
                    if (p.id === productId) {
                        return {
                            ...p,
                            proof_image: file,
                            proof_image_preview: reader.result as string,
                        };
                    }
                    return p;
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOrderId) {
            toast({ title: 'Validation Error', description: 'Please select an order.', variant: 'destructive' });
            return;
        }
        if (complaintProducts.length === 0) {
            toast({ title: 'Validation Error', description: 'Please add at least one product.', variant: 'destructive' });
            return;
        }
        
        // Validate all products
        for (let i = 0; i < complaintProducts.length; i++) {
            const product = complaintProducts[i];
            if (!product.product_id) {
                toast({ title: 'Validation Error', description: `Please select a product for item #${i + 1}.`, variant: 'destructive' });
                return;
            }
            if (!product.quantity || parseInt(product.quantity) < 1) {
                toast({ title: 'Validation Error', description: `Please enter a valid quantity for ${product.product_name}.`, variant: 'destructive' });
                return;
            }
            if (parseInt(product.quantity) > product.max_quantity) {
                toast({ title: 'Validation Error', description: `Quantity for ${product.product_name} cannot exceed ${product.max_quantity}.`, variant: 'destructive' });
                return;
            }
            if (!product.proof_image) {
                toast({ title: 'Validation Error', description: `Please upload a proof image for ${product.product_name}.`, variant: 'destructive' });
                return;
            }
        }
        if (!description.trim()) {
            toast({ title: 'Validation Error', description: 'Please provide a description of the damage.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('order_id', selectedOrderId);
        formData.append('description', description);

        // Use flat structure for better file upload support
        complaintProducts.forEach((product, index) => {
            formData.append(`products[${index}][product_id]`, product.product_id?.toString() || '');
            formData.append(`products[${index}][product_name]`, product.product_name);
            formData.append(`products[${index}][product_image]`, product.product_image || '');
            formData.append(`products[${index}][quantity]`, product.quantity);
            if (product.proof_image) {
                formData.append(`products[${index}][proof_image]`, product.proof_image);
            }
        });

        // Use Inertia router with forceFormData
        router.post('/complaints', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Success redirect with flash message will handle showing toast
                console.log('Complaint submitted successfully');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast({ 
                        title: 'Validation Error', 
                        description: firstError as string, 
                        variant: 'destructive' 
                    });
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-4 px-3 md:py-8">
            <Head title="Submit Complaint" />

            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#00447C]/3 via-transparent to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-5xl mx-auto">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 rounded-t-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00447C]/5 via-transparent to-[#00447C]/5"></div>
                    <div className="relative px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3 mb-3">
                            <a href="/complaints" className="flex items-center gap-2 text-slate-600 hover:text-[#00447C] transition-colors">
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                <span className="text-sm font-medium">Back to Complaints</span>
                            </a>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Submit Damaged Product Complaint</h1>
                                <p className="text-xs text-slate-500 font-medium">Report damaged products and track resolution</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Form Content */}
                <main className="relative bg-white/60 backdrop-blur-sm border-x border-slate-200/50 px-4 md:px-6 py-6 md:py-8 pb-32 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selected Order Info */}
                        {selectedOrder && (
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl blur-lg opacity-10"></div>
                                <div className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Selected Order Details</h3>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                            <span className="text-xs font-semibold text-blue-700">{selectedOrder.created_at}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Order ID</span>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                    <Package className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-lg md:text-xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">#{selectedOrder.id}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                                    <DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-lg md:text-xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 bg-clip-text text-transparent">LKR {selectedOrder.total_amount.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Distributor</span>
                                            </div>
                                            <div className="text-sm md:text-base font-bold text-slate-900 truncate">{selectedOrder.distributor_name}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
                                            </div>
                                            <div className="text-sm md:text-base font-bold text-emerald-600 capitalize">{selectedOrder.status}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Select Order */}
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-sm">
                            <label className="block text-sm font-bold text-slate-900 mb-3">
                                Select Order <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedOrderId}
                                onChange={(e) => { setSelectedOrderId(e.target.value); setComplaintProducts([]); }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent transition-all"
                            >
                                <option value="">Choose an order to complain about</option>
                                {orders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                        Order #{order.id} - {order.created_at} - LKR {order.total_amount.toFixed(2)} ({order.distributor_name})
                                    </option>
                                ))}
                            </select>
                            {orders.length === 0 && (
                                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800">
                                        No completed orders available. You can only submit complaints for approved or completed orders.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Damaged Products */}
                        {selectedOrder && (
                            <>
                                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-bold text-slate-900">
                                            Damaged Products <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addProduct}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00447C] to-[#005a9e] text-white text-sm font-semibold rounded-lg hover:from-[#003366] hover:to-[#004a8c] transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Product
                                        </button>
                                    </div>

                                    {complaintProducts.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                                            <Package className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500">No products added yet</p>
                                            <p className="text-xs text-slate-400 mt-1">Click "Add Product" to start</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {complaintProducts.map((product, index) => (
                                            <div key={product.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(product.id)}
                                                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                                                >
                                                    <X className="h-4 w-4 text-red-600" />
                                                </button>

                                                <div className="pr-8">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00447C] to-[#005a9e] flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white">{index + 1}</span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-slate-900">Product #{index + 1}</h4>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* Product Selection */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                                Product <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={product.product_id || ''}
                                                                onChange={(e) => updateProduct(product.id, 'product_id', e.target.value)}
                                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent transition-all"
                                                            >
                                                                <option value="">Select a product</option>
                                                                {orderProducts
                                                                    .filter(op => !complaintProducts.some(cp => cp.product_id === op.product_id && cp.id !== product.id))
                                                                    .map((op) => (
                                                                        <option key={op.product_id} value={op.product_id}>
                                                                            {op.product_name} (Qty: {op.quantity})
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                                Quantity <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={product.max_quantity || 999}
                                                                value={product.quantity}
                                                                onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent transition-all"
                                                                placeholder="Qty"
                                                            />
                                                            {product.max_quantity > 0 && (
                                                                <p className="mt-1 text-[10px] text-slate-500">
                                                                    Max: {product.max_quantity}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Proof Image */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                                Proof Image <span className="text-red-500">*</span>
                                                            </label>
                                                            <div
                                                                className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center cursor-pointer hover:border-[#00447C] transition-colors h-[78px] flex items-center justify-center"
                                                                onClick={() => fileInputRefs.current[product.id]?.click()}
                                                            >
                                                                <input
                                                                    ref={(el) => { fileInputRefs.current[product.id] = el; }}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(product.id, e)}
                                                                    className="hidden"
                                                                />
                                                                {product.proof_image_preview ? (
                                                                    <img src={product.proof_image_preview} alt="Preview" className="max-h-16 mx-auto rounded object-contain" />
                                                                ) : (
                                                                    <div>
                                                                        <Upload className="mx-auto h-5 w-5 text-slate-400" />
                                                                        <p className="text-[10px] text-slate-500 mt-1">Upload</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-sm">
                            <label className="block text-sm font-bold text-slate-900 mb-3">
                                Description of Damage <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent transition-all"
                                rows={5}
                                placeholder="Describe the damage in detail. What kind of damage did you observe? When did you discover it?..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={1000}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-slate-500">Be specific about the type and extent of damage</p>
                                <p className={`text-xs font-medium ${description.length >= 900 ? 'text-amber-600' : 'text-slate-500'}`}>
                                    {description.length}/1000
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#00447C] to-[#005a9e] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#003366] hover:to-[#004a8c] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
                        >
                            <Plus className="h-5 w-5" />
                            {isSubmitting ? 'Submitting Complaint...' : `Submit Complaint (${complaintProducts.length} product${complaintProducts.length !== 1 ? 's' : ''})`}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
