import { Head } from '@inertiajs/react';
import ActivePromotions from '@/components/active-promotions';
import { ChevronRight, Package } from 'lucide-react';

export default function RetailerPromotions() {
    return (

        <><header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00447C]/5 via-transparent to-[#00447C]/5"></div>
            <div className="relative px-4 md:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#00447C] transition-colors">
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                            <Package className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700 whitespace-nowrap"> Promotions</span>
                        </div>
                    </div>
                </div>
            </div>
        </header><div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <Head title="Promotions" />

                <main className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-4">Promotions</h1>
                    <ActivePromotions />
                </main>
            </div></>
    );
}