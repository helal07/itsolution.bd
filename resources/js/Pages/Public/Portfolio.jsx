import React from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import PortfolioCarousel from '../../Components/PortfolioCarousel';
import PortfolioCard from '../../Components/PortfolioCard';
import { Layers, Globe, Cpu, ShoppingBag } from 'lucide-react';

export default function Portfolio({ portfolios, featuredCarousel = [], currentType = 'all' }) {
    const portfolioList = portfolios.data || portfolios;

    const filterTabs = [
        { id: 'all', label: 'All Works', icon: Layers },
        { id: 'website', label: 'Websites & Portals', icon: Globe },
        { id: 'software', label: 'Enterprise Software', icon: Cpu },
        { id: 'pos_software', label: 'POS Systems', icon: ShoppingBag },
    ];

    const handleFilterChange = (type) => {
        router.get('/portfolio', { type }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout title="Portfolio & Case Studies — Delivered Solutions">
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Clean Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                Portfolio & Case Studies
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                Explore production systems, bespoke software, and web applications delivered to our enterprise clients.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-2 bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200 self-start md:self-auto">
                            {filterTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = currentType === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleFilterChange(tab.id)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-white text-primary shadow-xs border border-neutral-200/80'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Hero Carousel */}
                    {featuredCarousel.length > 0 && currentType === 'all' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-neutral-400">
                                    Featured Case Studies
                                </h2>
                            </div>
                            <PortfolioCarousel portfolios={featuredCarousel} />
                        </div>
                    )}

                    {/* Portfolio Grid */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {portfolioList.map((portfolio) => (
                                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {portfolios.links && portfolios.links.length > 3 && (
                            <div className="flex justify-center items-center gap-2 pt-6">
                                {portfolios.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-primary text-white shadow-xs'
                                                : link.url
                                                ? 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                                                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
