import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Plus, Upload, Package } from 'lucide-react';

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

interface PageProps {
    orders: Order[];
    [key: string]: any;
}

export default function CreateComplaint({ orders }: PageProps) {
    const { toast } = useToast();
    const { flash } = usePage().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState('1');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast({ title: 'Success', description: flash.success });
        }
        if (flash?.error) {
            toast({ title: 'Error', description: flash.error, variant: 'destructive' });
        }
    }, [flash]);

    const selectedOrder = orders.find((o) => o.id.toString() === selectedOrderId);
    const orderProducts = selectedOrder?.items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
    })) || [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({ title: 'File too large', description: 'Image size must not exceed 2MB.', variant: 'destructive' });
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOrderId) {
            toast({ title: 'Validation Error', description: 'Please select an order.', variant: 'destructive' });
            return;
        }
        if (!selectedProduct) {
            toast({ title: 'Validation Error', description: 'Please select a product.', variant: 'destructive' });
            return;
        }
        if (!description.trim()) {
            toast({ title: 'Validation Error', description: 'Please provide a description of the damage.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('order_id', selectedOrderId);
        formData.append('product_id', selectedProduct.product_id?.toString() || '');
        formData.append('product_name', selectedProduct.product_name);
        formData.append('product_image', selectedProduct.product_image || '');
        formData.append('quantity', quantity);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        router.post('/complaints', formData as any, {
            forceFormData: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-8 px-4">
            <Head title="Submit Complaint" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00447C]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-4xl mx-auto">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 rounded-t-2xl">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <a href="/complaints" className="flex items-center gap-2 text-slate-600 hover:text-[#00447C] transition-colors">
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                <span className="text-sm font-medium">Back to Complaints</span>
                            </a>
                        </div>
                        <div className="mt-3">
                            <h1 className="text-xl font-bold text-slate-900">Submit Damaged Product Complaint</h1>
                            <p className="text-sm text-slate-500">Report damaged products and track resolution</p>
                        </div>
                    </div>
                </header>

                {/* Form */}
                <main className="relative bg-white/60 backdrop-blur-sm border-x border-slate-200/50 px-6 py-8 pb-32 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Select Order */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Order *</label>
                            <select
                                value={selectedOrderId}
                                onChange={(e) => { setSelectedOrderId(e.target.value); setSelectedProduct(null); }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent"
                            >
                                <option value="">Choose an order</option>
                                {orders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                        Order #{order.id} - {order.created_at} - ${order.total_amount.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                            {orders.length === 0 && (
                                <p className="mt-2 text-sm text-slate-500">No completed orders available.</p>
                            )}
                        </div>

                        {/* Select Product */}
                        {selectedOrder && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Product *</label>
                                <select
                                    value={selectedProduct?.id || ''}
                                    onChange={(e) => {
                                        const product = orderProducts.find((p) => p.id.toString() === e.target.value);
                                        setSelectedProduct(product);
                                    }}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent"
                                >
                                    <option value="">Choose a product from the order</option>
                                    {orderProducts.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.product_name} (Qty: {product.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity Affected *</label>
                            <input
                                type="number"
                                min="1"
                                max={selectedProduct?.quantity || 999}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent"
                            />
                            {selectedProduct && (
                                <p className="mt-1 text-xs text-slate-500">Maximum: {selectedProduct.quantity} units</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description of Damage *</label>
                            <textarea
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00447C] focus:border-transparent"
                                rows={4}
                                placeholder="Describe the damage in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={1000}
                            />
                            <p className="mt-1 text-xs text-slate-500">{description.length}/1000 characters</p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof Image</label>
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#00447C] transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                {imagePreview ? (
                                    <div>
                                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain mb-3" />
                                        <p className="text-sm text-slate-500">Click to change image</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                                        <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG up to 2MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#00447C] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
