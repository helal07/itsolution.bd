import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import HeroBanner from '../../Components/HeroBanner';
import BrandMarquee from '../../Components/BrandMarquee';
import PackagePricingSection from '../../Components/PackagePricingSection';
import FeaturedStrip from '../../Components/FeaturedStrip';
import CategoryCard from '../../Components/CategoryCard';
import ProjectScopeEstimator from '../../Components/ProjectScopeEstimator';
import ClientTestimonialsSection from '../../Components/ClientTestimonialsSection';
import PortfolioCard from '../../Components/PortfolioCard';
import FloatingSupportWidget from '../../Components/FloatingSupportWidget';
import { 
    Sparkles, 
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';

export default function Home({ hero, featuredItems = [], categories = [], featuredPortfolios = [], reviews = [] }) {
    const { t } = useLanguage();

    return (
        <PublicLayout title="Software, E-Commerce & Web Solutions">
            {/* 1. Human-Crafted Agency Hero Banner */}
            <HeroBanner hero={hero} />

            {/* 2. Client & Partner Brand Logo Marquee */}
            <BrandMarquee />

            {/* 3. Featured Ready Software & Apps */}
            <FeaturedStrip items={featuredItems} />

            {/* 4. Our Core Services & Tech Solutions */}
            <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="site-container space-y-8">
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1.5 max-w-xl">
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                                {t('servicesBadge')}
                            </span>
                            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                                {t('servicesHeading')}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {t('servicesSubheading')}
                            </p>
                        </div>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:-translate-y-0.5 transition-all self-start sm:self-auto"
                        >
                            <span>{t('servicesAllBtn')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Transparent Package Pricing Section (Inspired by itsheba.bd) */}
            <div id="packages">
                <PackagePricingSection />
            </div>

            {/* 6. Interactive Scope & Budget Estimator */}
            <ProjectScopeEstimator />

            {/* 7. Client Success Stories & Live Portfolios */}
            {featuredPortfolios.length > 0 && (
                <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
                    <div className="site-container space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                                    {t('portfolioBadge')}
                                </span>
                                <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                                    {t('portfolioHeading')}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600">
                                    {t('portfolioDesc')}
                                </p>
                            </div>

                            <Link
                                href="/portfolio"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all self-start sm:self-auto"
                            >
                                <span>{t('portfolioAllBtn')}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredPortfolios.map((portfolio) => (
                                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 8. Genuine Client Reviews & Google Ratings */}
            <ClientTestimonialsSection reviews={reviews} />

            {/* 9. Final Human Call to Action */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-t border-slate-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-bold backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        <span>{t('ctaBadge')}</span>
                    </div>

                    <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                        {t('ctaHeading')}
                    </h2>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                        {t('ctaDesc')}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/get-a-quote"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
                        >
                            <span>{t('ctaBtnQuote')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md active:scale-95 transition-all"
                        >
                            <span>{t('ctaBtnServices')}</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 10. Sticky WhatsApp Floating Chat Widget */}
            <FloatingSupportWidget />
        </PublicLayout>
    );
}
