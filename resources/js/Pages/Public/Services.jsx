import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Smartphone, Globe, Cpu, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';

export default function Services({ categories = [] }) {
    const { isBn } = useLanguage();

    const getIcon = (slug) => {
        switch (slug) {
            case 'apps':
                return <Smartphone className="w-7 h-7 text-primary" />;
            case 'website':
                return <Globe className="w-7 h-7 text-primary" />;
            case 'software':
                return <Cpu className="w-7 h-7 text-primary" />;
            default:
                return <Layers className="w-7 h-7 text-primary" />;
        }
    };

    return (
        <PublicLayout title={isBn ? "আমাদের সার্ভিস ও সলিউশন — অ্যাপস, ওয়েবসাইট ও সফটওয়্যার" : "Our Services & Solutions — Apps, Websites & Enterprise Software"}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary border border-blue-100 text-xs font-bold font-mono uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span>{isBn ? 'সম্পূর্ণ ডিজিটাল ইঞ্জিনিয়ারিং' : 'Full-Lifecycle Digital Engineering'}</span>
                            </div>
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                {isBn ? 'আমাদের সার্ভিস ও সলিউশনসমূহ' : 'Our Services & Solutions'}
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                                {isBn 
                                    ? 'আমাদের ক্যাটাগরিভিত্তিক ডিজিটাল সলিউশনসমূহ এক্সপ্লোর করুন। সর্বোচ্চ কার্যক্ষমতা, হাই সিকিউরিটি ও সহজ স্কেলেবিলিটির জন্য প্রতিটি সিস্টেম বিশেষভাবে নির্মিত।' 
                                    : 'Explore our categorized digital solutions. Every system is architected for peak performance, bank-grade security, and effortless scale.'}
                            </p>
                        </div>
                    </div>

                    {/* Three-Column Category Architecture */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {categories.map((category) => {
                            const catName = isBn ? (category.name_bn || category.name) : category.name;
                            const catDesc = isBn ? (category.description_bn || category.description) : category.description;

                            return (
                                <div
                                    key={category.id}
                                    className="group relative bg-white rounded-[2rem] p-7 sm:p-8 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 overflow-hidden"
                                >
                                    <div className="space-y-6">
                                        
                                        {/* Category Header Link */}
                                        <div className="space-y-3 pb-5 border-b border-neutral-100">
                                            <div className="flex items-center justify-between">
                                                <div className="w-13 h-13 rounded-2xl bg-blue-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary shadow-xs transition-all duration-300 group-hover:scale-105">
                                                    {getIcon(category.slug)}
                                                </div>
                                                <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-mono font-bold">
                                                    {(category.published_items || []).length} {isBn ? 'সলিউশন' : 'Solutions'}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/services/${category.slug}`}
                                                className="block"
                                            >
                                                <h2 className="font-heading font-black text-xl sm:text-2xl text-neutral-900 group-hover:text-primary transition-colors flex items-center justify-between">
                                                    <span>{catName}</span>
                                                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </h2>
                                            </Link>

                                            {catDesc && (
                                                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                                    {catDesc}
                                                </p>
                                            )}
                                        </div>

                                        {/* Items List Under Category */}
                                        <div className="space-y-3">
                                            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                                                {isBn ? 'প্রোডাক্ট ও সিস্টেমসমূহ' : 'Available Products & Systems'}
                                            </h3>

                                            <div className="space-y-2">
                                                {(category.published_items || []).map((item) => {
                                                    const itName = isBn ? (item.name_bn || item.name) : item.name;
                                                    const itDesc = isBn ? (item.short_description_bn || item.short_description) : item.short_description;

                                                    return (
                                                        <Link
                                                            key={item.id}
                                                            href={`/services/${category.slug}/${item.slug}`}
                                                            className="group/item flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50/70 border border-neutral-100 hover:border-blue-200 transition-all duration-200"
                                                        >
                                                            <div className="space-y-0.5 pr-2">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-heading font-bold text-xs sm:text-sm text-neutral-900 group-hover/item:text-primary transition-colors">
                                                                        {itName}
                                                                    </p>
                                                                    {item.is_featured && (
                                                                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded">
                                                                            HOT
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {itDesc && (
                                                                    <p className="text-[11px] text-neutral-500 line-clamp-1">
                                                                        {itDesc}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="text-right pl-2 flex-shrink-0">
                                                                <span className="text-[11px] font-bold text-primary group-hover/item:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                                                                    <span>{isBn ? 'দেখুন' : 'Explore'}</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Footer CTA */}
                                    <div className="pt-4 border-t border-neutral-100">
                                        <Link
                                            href={`/services/${category.slug}`}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-neutral-900 hover:bg-primary text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs"
                                        >
                                            <span>{isBn ? `${catName} এর সকল প্যাকেজ দেখুন` : `View All ${catName} Packages`}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
