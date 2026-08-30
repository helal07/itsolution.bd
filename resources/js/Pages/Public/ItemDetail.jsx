import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import PortfolioCard from '../../Components/PortfolioCard';
import ItemCard from '../../Components/ItemCard';
import QuoteForm from '../../Components/QuoteForm';
import { 
    MessageSquare, 
    ShieldCheck, 
    Zap, 
    CheckCircle2, 
    ArrowRight, 
    Sparkles,
    Lock,
    Maximize2,
    X,
    Clock,
    Phone,
    Mail
} from 'lucide-react';

export default function ItemDetail({ category, item, relatedPortfolios = [], relatedItems = [] }) {
    const images = (item.images && item.images.length > 0) 
        ? item.images.map(img => img.image_path)
        : [item.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'];

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const activeImage = images[activeImageIndex] || images[0];

    const highlights = [
        'Full Clean Source Code & Architecture',
        'Production Cloud Deployment & Setup',
        'Admin Dashboard & Role-Based Access',
        '6 Months Maintenance & Technical Support',
    ];

    return (
        <PublicLayout title={`${item.name} — ${category.name}`}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column: Image & Details (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Image Preview Box */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-3">
                                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 group">
                                    <img
                                        src={activeImage}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute top-3 right-3 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 text-white backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                                        title="View Fullscreen"
                                    >
                                        <Maximize2 className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Zoom Screen</span>
                                    </button>
                                </div>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                                        {images.map((img, idx) => {
                                            const isActive = idx === activeImageIndex;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                    className={`w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                                        isActive
                                                            ? 'border-primary ring-2 ring-primary/20 shadow-xs'
                                                            : 'border-neutral-200 opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${item.name} ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80';
                                                        }}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Product Details Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-primary border border-blue-200">
                                            {category.name}
                                        </span>
                                        {item.is_featured && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                <span>Featured</span>
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900">
                                        {item.name}
                                    </h1>
                                </div>

                                <div className="text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-neutral-100 pt-4">
                                    {item.description || item.short_description}
                                </div>

                                {/* Inclusions Checklist */}
                                <div className="border-t border-neutral-100 pt-5 space-y-3">
                                    <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-400">
                                        System Highlights & Inclusions
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {highlights.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-800">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <span>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Inquire & Scope Request Card (5 cols) */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                            
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                
                                <div className="space-y-1 pb-4 border-b border-neutral-100">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary font-mono bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block">
                                        {category.name} Solution
                                    </span>
                                    <h3 className="font-heading font-black text-xl text-neutral-900 pt-2">
                                        Interested in this application?
                                    </h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        Get a tailored proposal, custom module additions, or cloud deployment assistance.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Link
                                        href={`/get-a-quote?item_id=${item.id}`}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Request a Free Quote</span>
                                    </Link>
                                </div>

                                {/* Quick Guarantees */}
                                <div className="pt-2 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-600">
                                    <div className="flex items-center gap-2.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <span>6 Months Technical Warranty & Support</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span>Full Source Code & Commercial Ownership</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        <span>24-Hour Scope Estimation Response</span>
                                    </div>
                                </div>

                            </div>

                            {/* Direct Quote Request Form */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="font-heading font-bold text-sm text-neutral-900">
                                        Quick Inquiry
                                    </h4>
                                    <span className="text-[11px] text-primary font-semibold">24h SLA response</span>
                                </div>
                                <QuoteForm 
                                    categories={[category]} 
                                    defaultItemId={item.id} 
                                />
                            </div>

                        </div>

                    </div>

                    {/* Related Portfolios / Case Studies */}
                    {relatedPortfolios.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-neutral-200/80 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading font-black text-xl text-neutral-900">
                                    Related Case Studies
                                </h2>
                                <Link
                                    href="/portfolio"
                                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPortfolios.map((p) => (
                                    <PortfolioCard key={p.id} portfolio={p} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Offerings in Same Category */}
                    {relatedItems.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-neutral-200/80 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading font-black text-xl text-neutral-900">
                                    More in {category.name}
                                </h2>
                                <Link 
                                    href={`/services/${category.slug}`} 
                                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedItems.map((relItem) => (
                                    <ItemCard key={relItem.id} item={relItem} categorySlug={category.slug} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Lightbox Zoom Modal */}
            {lightboxOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={activeImage}
                            alt={item.name}
                            className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
