import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ItemCard({ item, categorySlug }) {
    const catSlug = categorySlug || item.category?.slug || (item.category_id === 1 ? 'apps' : item.category_id === 2 ? 'website' : item.category_id === 3 ? 'software' : 'services');
    const detailUrl = `/services/${catSlug}/${item.slug}`;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-card hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            {/* Clickable Thumbnail Header */}
            <Link 
                href={detailUrl} 
                className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 cursor-pointer"
            >
                <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                    }}
                />
                
                {item.is_featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                    </div>
                )}
            </Link>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    <Link href={detailUrl} className="block">
                        <h3 className="font-heading font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                            {item.name}
                        </h3>
                    </Link>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {item.short_description}
                    </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <Link
                        href={detailUrl}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                        href={`/get-a-quote?item_id=${item.id}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Get Quote
                    </Link>
                </div>
            </div>
        </div>
    );
}
