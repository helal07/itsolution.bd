import React from 'react';
import { useLanguage } from '../Context/LanguageContext';

export default function BrandMarquee() {
    const { t } = useLanguage();
    const brands = [
        { name: 'bKash', label: 'Payment Partner', logoText: 'bKash' },
        { name: 'Nagad', label: 'FinTech', logoText: 'নগদ' },
        { name: 'Grameenphone', label: 'Telecom Partner', logoText: 'grameenphone' },
        { name: 'Robi Axiata', label: 'Network', logoText: 'robi' },
        { name: 'BRAC Enterprises', label: 'Corporate Client', logoText: 'BRAC' },
        { name: 'PRAN-RFL', label: 'FMCG E-commerce', logoText: 'PRAN' },
        { name: 'Apex Footwear', label: 'Retail Portal', logoText: 'Apex' },
        { name: 'Square Health', label: 'Pharma ERP', logoText: 'SQUARE' },
        { name: 'Walton Hi-Tech', label: 'POS & Billing', logoText: 'WALTON' },
        { name: 'Aarong Lifestyle', label: 'Fashion App', logoText: 'aarong' },
    ];

    // Duplicate list for seamless infinite loop
    const marqueeList = [...brands, ...brands];

    return (
        <section className="py-8 bg-slate-50/80 border-y border-slate-200/80 overflow-hidden">
            <div className="site-container mb-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t('marqueeHeading')}
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient fades on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee flex items-center gap-8 sm:gap-12 py-2">
                    {marqueeList.map((brand, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200/70 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all duration-300 group flex-shrink-0 cursor-default"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {brand.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <span className="font-heading font-extrabold text-sm text-slate-800 tracking-tight block leading-tight group-hover:text-blue-600 transition-colors">
                                    {brand.logoText}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium block">
                                    {brand.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
