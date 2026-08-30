import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import ItemCard from '../../Components/ItemCard';
import { Smartphone, Globe, Cpu, Layers, ArrowRight } from 'lucide-react';

export default function CategoryDetail({ category, items, otherCategories = [] }) {
    const getIcon = (slug) => {
        switch (slug) {
            case 'apps':
                return <Smartphone className="w-5 h-5 text-primary" />;
            case 'website':
                return <Globe className="w-5 h-5 text-primary" />;
            case 'software':
                return <Cpu className="w-5 h-5 text-primary" />;
            default:
                return <Layers className="w-5 h-5 text-primary" />;
        }
    };

    const itemList = items.data || items;

    return (
        <PublicLayout title={`${category.name} Solutions & Products`}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Category Header Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-xs">
                                {getIcon(category.slug)}
                            </div>
                            <div className="space-y-1">
                                <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                    {category.name} Solutions
                                </h1>
                                {category.description && (
                                    <p className="text-neutral-600 text-xs sm:text-sm max-w-2xl">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Category Selector Tabs */}
                        <div className="flex flex-wrap items-center gap-2 bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200 self-start md:self-auto">
                            <span className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-primary shadow-xs border border-neutral-200/80">
                                {category.name}
                            </span>
                            {otherCategories.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/services/${c.slug}`}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white/60 transition-all"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="space-y-8">
                        {itemList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {itemList.map((item) => (
                                    <ItemCard key={item.id} item={item} categorySlug={category.slug} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200/60 p-12 space-y-3">
                                <h3 className="font-heading font-bold text-xl text-neutral-800">No items available in this category yet.</h3>
                                <p className="text-neutral-500 text-sm">Check back soon or explore our other service categories.</p>
                                <Link href="/services" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold">
                                    <span>Browse All Categories</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {items.links && items.links.length > 3 && (
                            <div className="flex justify-center items-center gap-2 pt-6">
                                {items.links.map((link, idx) => (
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
