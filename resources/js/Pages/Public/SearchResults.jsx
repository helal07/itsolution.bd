import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import ItemCard from '../../Components/ItemCard';
import PortfolioCard from '../../Components/PortfolioCard';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchResults({ query, items = [], portfolios = [] }) {
    const totalResults = items.length + portfolios.length;

    return (
        <PublicLayout title={`Search Results for "${query}"`}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Clean Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold">
                                <Search className="w-3.5 h-3.5" />
                                <span>Search Query</span>
                            </div>
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                Results for "<span className="text-primary">{query}</span>"
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm">
                                Found {totalResults} matching products, services, and portfolio case studies.
                            </p>
                        </div>
                    </div>

                    {/* Results Container */}
                    <div className="space-y-12">
                        {/* Items Results */}
                        {items.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                                    <h2 className="font-heading font-black text-xl sm:text-2xl text-neutral-900">
                                        Products & Services ({items.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {items.map((item) => (
                                        <ItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolios Results */}
                        {portfolios.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                                    <h2 className="font-heading font-black text-xl sm:text-2xl text-neutral-900">
                                        Case Studies & Projects ({portfolios.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {portfolios.map((portfolio) => (
                                        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {totalResults === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200/60 p-12 max-w-lg mx-auto space-y-4">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="font-heading font-black text-xl text-neutral-900">
                                    No matching records found
                                </h3>
                                <p className="text-neutral-500 text-xs sm:text-sm">
                                    We couldn't find anything matching "{query}". Try browsing our categorized offerings directly.
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href="/services"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold"
                                    >
                                        <span>Browse All Services</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
