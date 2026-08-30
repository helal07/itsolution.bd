import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import HeroBanner from '../../Components/HeroBanner';
import LiveTelemetryRibbon from '../../Components/LiveTelemetryRibbon';
import FeaturedStrip from '../../Components/FeaturedStrip';
import CategoryCard from '../../Components/CategoryCard';
import ProjectScopeEstimator from '../../Components/ProjectScopeEstimator';
import ClientTestimonialsSection from '../../Components/ClientTestimonialsSection';
import PortfolioCard from '../../Components/PortfolioCard';
import { 
    Sparkles, 
    ArrowRight
} from 'lucide-react';

export default function Home({ hero, featuredItems = [], categories = [], featuredPortfolios = [], reviews = [] }) {
    return (
        <PublicLayout title="IT SOLUTIONS — Software & Apps">
            {/* 1. Hero Section */}
            <HeroBanner hero={hero} />

            {/* 2. Live Cyber Telemetry */}
            <LiveTelemetryRibbon />

            {/* 3. Featured Ready Apps */}
            <FeaturedStrip items={featuredItems} />

            {/* 4. Our Core Services */}
            <section className="py-12 sm:py-16 bg-neutral-50/70 border-b border-neutral-200/60">
                <div className="site-container space-y-6">
                    
                    {/* Short Section Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                                Our Services
                            </h2>
                        </div>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs hover:-translate-y-0.5 transition-all"
                        >
                            <span>Services</span>
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

            {/* 5. Project Scope Estimator */}
            <ProjectScopeEstimator />

            {/* 6. Clients */}
            {featuredPortfolios.length > 0 && (
                <section className="py-12 sm:py-16 bg-neutral-50/80 border-b border-neutral-200/60">
                    <div className="site-container space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                                Clients
                            </h2>

                            <Link
                                href="/clients"
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-bold shadow-2xs hover:-translate-y-0.5 transition-all"
                            >
                                <span>Clients</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {featuredPortfolios.map((portfolio) => (
                                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. Client Reviews */}
            <ClientTestimonialsSection reviews={reviews} />

            {/* 8. Short CTA */}
            <section className="py-12 sm:py-14 bg-gradient-to-r from-blue-950 via-primary-dark to-slate-900 text-white relative overflow-hidden border-t border-white/10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                        Build Your Project
                    </h2>
                    <p className="text-neutral-300 text-xs sm:text-sm">
                        Contact our team for a fast scope and architectural review.
                    </p>
                    <div className="pt-1">
                        <Link
                            href="/get-a-quote"
                            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span>Get Quote</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
