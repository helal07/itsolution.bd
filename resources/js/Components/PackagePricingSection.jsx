import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Check, 
    ArrowRight, 
    Sparkles, 
    Phone, 
    MessageCircle, 
    Globe, 
    ShoppingCart, 
    Building2,
    ShieldCheck,
    Clock,
    Zap
} from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

export default function PackagePricingSection() {
    const { siteSettings = {} } = usePage().props;
    const { t, isBn } = useLanguage();
    const hotline = siteSettings.contact_phone || '+880 1800-000000';
    const whatsapp = siteSettings.whatsapp_number || '+880 1800-000000';

    const packages = [
        {
            id: 'starter',
            name: t('pkg1Title'),
            tagline: t('pkg1Tagline'),
            price: t('pkg1Price'),
            originalPrice: t('pkg1Original'),
            popular: false,
            badge: isBn ? 'দ্রুত ডেলিভারি' : 'Fast Delivery',
            icon: Globe,
            features: [
                t('pkg1F1'),
                t('pkg1F2'),
                t('pkg1F3'),
                t('pkg1F4'),
                t('pkg1F5'),
                t('pkg1F6'),
                t('pkg1F7'),
                t('pkg1F8'),
            ],
            cta: t('pkg1Btn'),
            href: '/get-a-quote?plan=starter',
        },
        {
            id: 'ecommerce',
            name: t('pkg2Title'),
            tagline: t('pkg2Tagline'),
            price: t('pkg2Price'),
            originalPrice: t('pkg2Original'),
            popular: true,
            badge: t('popularBadge'),
            icon: ShoppingCart,
            features: [
                t('pkg2F1'),
                t('pkg2F2'),
                t('pkg2F3'),
                t('pkg2F4'),
                t('pkg2F5'),
                t('pkg2F6'),
                t('pkg2F7'),
                t('pkg2F8'),
                t('pkg2F9'),
            ],
            cta: t('pkg2Btn'),
            href: '/get-a-quote?plan=ecommerce',
        },
        {
            id: 'enterprise',
            name: t('pkg3Title'),
            tagline: t('pkg3Tagline'),
            price: t('pkg3Price'),
            originalPrice: t('pkg3Original'),
            popular: false,
            badge: isBn ? 'কাস্টম সলিউশন' : 'Custom Engineering',
            icon: Building2,
            features: [
                t('pkg3F1'),
                t('pkg3F2'),
                t('pkg3F3'),
                t('pkg3F4'),
                t('pkg3F5'),
                t('pkg3F6'),
                t('pkg3F7'),
                t('pkg3F8'),
            ],
            cta: t('pkg3Btn'),
            href: '/get-a-quote?plan=enterprise',
        },
    ];

    return (
        <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
            <div className="site-container space-y-12">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('pricingBadge')}</span>
                    </div>

                    <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                        {t('pricingHeading')}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {t('pricingSubheading')}
                    </p>
                </div>

                {/* 3 Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                    {packages.map((pkg) => {
                        const Icon = pkg.icon;
                        return (
                            <div 
                                key={pkg.id}
                                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                                    pkg.popular 
                                        ? 'bg-white border-2 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-4 ring-cyan-100/50 md:-translate-y-2' 
                                        : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                                            {pkg.badge}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className={`p-3 rounded-2xl ${pkg.popular ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-700'}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {!pkg.popular && (
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                {pkg.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-heading font-black text-xl text-slate-900">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                        {pkg.tagline}
                                    </p>

                                    {/* Pricing */}
                                    <div className="my-6 pb-6 border-b border-slate-100">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-mono font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                                                ৳ {pkg.price}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                                                {t('currencyCode')}
                                            </span>
                                            {pkg.originalPrice && (
                                                <span className="text-xs text-slate-400 line-through ml-2 font-mono">
                                                    ৳ {pkg.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                                            {t('priceOneTimeNote')}
                                        </span>
                                    </div>

                                    {/* Deliverables List */}
                                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                                        {pkg.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span className="leading-tight">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <Link
                                        href={pkg.href}
                                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 ${
                                            pkg.popular
                                                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-blue-500/25'
                                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                                        }`}
                                    >
                                        <span>{pkg.cta}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    <Link
                                        href="/portfolio"
                                        className="w-full py-2 px-3 rounded-xl font-bold text-[11px] text-slate-500 hover:text-blue-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                    >
                                        <span>{t('viewLiveDemos')}</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 24/7 Helpline Support Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 flex-shrink-0">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {t('supportBadge')}
                                </span>
                            </div>
                            <h3 className="font-heading font-black text-lg sm:text-xl text-white mt-1">
                                {t('supportHeading')}
                            </h3>
                            <p className="text-xs text-slate-300 mt-0.5">
                                {t('supportDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center flex-shrink-0">
                        <a
                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello, I would like to consult regarding website & software development packages.')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{t('supportWhatsappBtn')}</span>
                        </a>

                        <a
                            href={`tel:${hotline}`}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all active:scale-95"
                        >
                            <Phone className="w-4 h-4 text-cyan-300" />
                            <span>{t('supportCallBtn')} {hotline}</span>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
