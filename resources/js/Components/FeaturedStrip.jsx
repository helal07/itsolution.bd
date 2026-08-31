import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Sparkles, 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Code2, 
    ExternalLink,
    Layers,
    Terminal
} from 'lucide-react';

export default function FeaturedStrip({ items = [] }) {
    if (!items || items.length === 0) return null;

    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = items[activeIndex] || items[0];
    const activeItemCatSlug = activeItem?.category?.slug || (activeItem?.category_id === 1 ? 'apps' : activeItem?.category_id === 2 ? 'website' : activeItem?.category_id === 3 ? 'software' : 'services');
    const activeItemUrl = `/services/${activeItemCatSlug}/${activeItem?.slug}`;

    return (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/70 to-neutral-100/60 border-b border-neutral-200/70 relative overflow-hidden">
            {/* Background Decorative Ambient Blobs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="site-container space-y-10">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-primary text-xs font-bold tracking-wide shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="uppercase font-mono tracking-wider">Enterprise Software & Digital Products</span>
                        </div>
                        <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight leading-tight">
                            Latest <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">Products</span>
                        </h2>
                        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                            Explore our software systems, custom platforms, and mobile apps engineered for immediate deployment.
                        </p>
                    </div>

                    {/* Interactive Pill Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 bg-neutral-200/60 p-1.5 rounded-2xl border border-neutral-200 backdrop-blur-sm self-start lg:self-end max-w-full">
                        {items.map((item, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                        isActive
                                            ? 'bg-neutral-900 text-white shadow-md shadow-black/20 scale-[1.02]'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/80'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Showcase Card */}
                {activeItem && (
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0c142b] via-[#091538] to-[#040817] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-white/15 overflow-hidden transition-all duration-500">
                        <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                            
                            {/* Left: Product Info (7 cols) */}
                            <div className="lg:col-span-7 space-y-6 text-left">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="px-3.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                                        {activeItem.category?.name || 'Featured System'}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <Link href={activeItemUrl} className="block group/title">
                                        <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white group-hover/title:text-cyan-300 transition-colors tracking-tight leading-tight">
                                            {activeItem.name}
                                        </h3>
                                    </Link>
                                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
                                        {activeItem.description || activeItem.short_description}
                                    </p>
                                </div>

                                {/* Key Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-300">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-neutral-200 font-medium">Enterprise Security & Role Auth</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-neutral-200 font-medium">High Concurrency & Fast APIs</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                                            <Code2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-neutral-200 font-medium">Clean Modular Architecture</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                                            <Terminal className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-neutral-200 font-medium">Full Documentation & SLA</span>
                                    </div>
                                </div>

                                {/* Action CTAs */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                                    <Link
                                        href={`/get-a-quote?item_id=${activeItem.id}`}
                                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary-hover hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                    >
                                        <span>Request Quote</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <Link
                                        href={activeItemUrl}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md hover:border-white/30 transition-all"
                                    >
                                        <span>View Details</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Clickable Visual Card (5 cols) */}
                            <div className="lg:col-span-5 relative">
                                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-[2.5rem] blur-xl -z-10" />

                                <Link 
                                    href={activeItemUrl}
                                    className="block relative group rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-900/90 aspect-[16/11] sm:aspect-[4/3] transition-all duration-500 hover:border-cyan-400/50 hover:scale-[1.02] cursor-pointer"
                                >
                                    <img
                                        src={activeItem.thumbnail}
                                        alt={activeItem.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                    {/* Floating Visual Badge */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-white/15 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-cyan-400" />
                                            <span className="text-xs font-bold text-white truncate">{activeItem.name}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800 flex items-center gap-1">
                                            <span>Click to View</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
