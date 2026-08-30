import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Building2, Sparkles } from 'lucide-react';

export default function PortfolioCard({ portfolio }) {
    const formatType = (type) => {
        switch (type) {
            case 'pos_software':
                return 'POS Software';
            case 'software':
                return 'Enterprise Software';
            case 'website':
                return 'Website / eCommerce';
            default:
                return type;
        }
    };

    return (
        <Link
            href={`/portfolio/${portfolio.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-card hover:shadow-2xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                    src={portfolio.cover_image}
                    alt={portfolio.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                    }}
                />
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {formatType(portfolio.type)}
                </div>

                {portfolio.is_featured && (
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-primary text-white shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    {portfolio.client && (
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            <span>{portfolio.client.name}</span>
                        </div>
                    )}

                    <h3 className="font-heading font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                        {portfolio.title}
                    </h3>

                    {portfolio.description && (
                        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {portfolio.description}
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-dark">
                    <span>View Case Study</span>
                    <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
