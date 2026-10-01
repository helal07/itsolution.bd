import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    ArrowRight, 
    Sparkles, 
    Star, 
    Laptop, 
    Smile, 
    Headphones, 
    Search, 
    ShoppingCart, 
    Plus, 
    ShieldCheck, 
    Truck, 
    CreditCard,
    Lock,
    CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

export default function HeroBanner({ hero }) {
    const { siteSettings = {} } = usePage().props;
    const { t, isBn } = useLanguage();
    const whatsapp = siteSettings.whatsapp_number || siteSettings.contact_phone || '+880 1800-000000';
    const cleanPhone = whatsapp.replace(/[^0-9]/g, '');

    const badgeText = isBn ? (hero?.badge_bn || hero?.badge || t('heroBadge')) : (hero?.badge || t('heroBadge'));
    const headlineText = isBn 
        ? (hero?.headline_bn || hero?.headline || t('heroHeadlineMain')) 
        : (hero?.headline || `${t('heroHeadlineMain')} ${t('heroHeadlineHighlight')}`);
    const descText = isBn ? (hero?.subheadline_bn || hero?.subheadline || t('heroDesc')) : (hero?.subheadline || t('heroDesc'));

    const stat1Num = hero?.stat1_value || t('heroStat1Num');
    const stat1Label = isBn ? (hero?.stat1_label_bn || hero?.stat1_label || t('heroStat1Label')) : (hero?.stat1_label || t('heroStat1Label'));

    const stat2Num = hero?.stat2_value || t('heroStat2Num');
    const stat2Label = isBn ? (hero?.stat2_label_bn || hero?.stat2_label || t('heroStat2Label')) : (hero?.stat2_label || t('heroStat2Label'));

    const stat3Num = hero?.stat3_value || t('heroStat3Num');
    const stat3Label = isBn ? (hero?.stat3_label_bn || hero?.stat3_label || t('heroStat3Label')) : (hero?.stat3_label || t('heroStat3Label'));

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            
            {/* Soft Ambient Light Blobs */}
            <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative site-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                    
                    {/* Left Column: Human Centered Agency Messaging */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                        
                        {/* Trust Milestone Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                            <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-800">
                                {badgeText}
                            </span>
                        </div>

                        {/* Main Relatable Headline */}
                        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] text-slate-900 tracking-tight leading-[1.2]">
                            {headlineText}
                        </h1>

                        {/* Relatable Subtitle */}
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                            {descText}
                        </p>

                        {/* 3 Authentic Trust Stat Cards */}
                        <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-lg">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Laptop className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-heading font-black text-sm text-slate-900 leading-tight">
                                        {stat1Num}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold truncate">
                                        {stat1Label}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Smile className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-heading font-black text-sm text-slate-900 leading-tight">
                                        {stat2Num}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold truncate">
                                        {stat2Label}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                                    <Headphones className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-heading font-black text-sm text-slate-900 leading-tight">
                                        {stat3Num}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold truncate">
                                        {stat3Label}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dual Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                            >
                                <span>{t('heroBtnPackages')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I would like free consultation regarding software/website development.')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm shadow-xs hover:border-slate-300 active:scale-95 transition-all"
                            >
                                <span>{t('heroBtnConsult')}</span>
                            </a>
                        </div>

                    </div>

                    {/* Right Column: Tangible Browser Frame Mockup */}
                    <div className="lg:col-span-6 relative">
                        
                        {/* Floating Animated Badges */}
                        <div className="animate-float-1 absolute -top-4 -left-4 sm:-left-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-lg text-[11px] font-bold text-slate-800">
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            <span>{t('heroFloatSecure')}</span>
                        </div>

                        <div className="animate-float-2 absolute top-1/2 -right-4 sm:-right-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-lg text-[11px] font-bold text-slate-800">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('heroFloatDelivery')}</span>
                        </div>

                        <div className="animate-float-3 absolute -bottom-4 left-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-lg text-[11px] font-bold text-slate-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                            <span>{t('heroFloatTerms')}</span>
                        </div>

                        {/* macOS Browser Window Frame */}
                        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden relative z-10 transition-transform hover:scale-[1.01] duration-300">
                            
                            {/* Browser Top Bar */}
                            <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <div className="flex-1 max-w-sm mx-auto bg-white px-3 py-1 rounded-full border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
                                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>itsolution.bd/ecom-demo</span>
                                </div>
                            </div>

                            {/* Browser Content: Live Software & E-Com Preview */}
                            <div className="p-4 sm:p-5 bg-slate-50/60 space-y-3.5">
                                
                                {/* Mini Header */}
                                <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                            IT
                                        </div>
                                        <span className="font-bold text-xs text-slate-800 hidden xs:inline">E-Shop</span>
                                    </div>
                                    <div className="flex-1 max-w-[180px] bg-slate-100 rounded-lg px-2.5 py-1 text-[10px] text-slate-400 flex items-center gap-1.5">
                                        <Search className="w-3 h-3 text-slate-400" />
                                        <span>{t('browserSearchPlaceholder')}</span>
                                    </div>
                                    <div className="relative p-1.5 rounded-lg bg-slate-100 text-slate-700">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                                            3
                                        </span>
                                    </div>
                                </div>

                                {/* Promo Mini Banner */}
                                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden flex items-center justify-between">
                                    <div className="space-y-0.5 z-10">
                                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black uppercase">
                                            {t('browserPromoBadge')}
                                        </span>
                                        <div className="font-bold text-xs">{t('browserPromoTitle')}</div>
                                    </div>
                                    <button className="z-10 px-3 py-1 rounded-full bg-white text-blue-700 font-bold text-[10px] shadow-xs cursor-pointer">
                                        {t('browserPromoBtn')}
                                    </button>
                                </div>

                                {/* Category Pills */}
                                <div className="flex items-center gap-1.5 text-[10px] font-bold overflow-hidden">
                                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-xs">{t('browserCatAll')}</span>
                                    <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{t('browserCatEcom')}</span>
                                    <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{t('browserCatWeb')}</span>
                                    <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{t('browserCatApp')}</span>
                                </div>

                                {/* 3 Product Cards in BDT */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1 relative">
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-rose-100 text-rose-700">
                                            Hot
                                        </span>
                                        <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{t('browserProd1Name')}</div>
                                        <div className="font-mono font-black text-xs text-blue-600">{isBn ? '৳ ১,২৯৯' : '৳ 1,299'}</div>
                                        <div className="text-[9px] text-amber-500 font-bold">★ 4.9 (120)</div>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1 relative">
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-700">
                                            New
                                        </span>
                                        <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{t('browserProd2Name')}</div>
                                        <div className="font-mono font-black text-xs text-blue-600">{isBn ? '৳ ৮৯৯' : '৳ 899'}</div>
                                        <div className="text-[9px] text-amber-500 font-bold">★ 4.8 (85)</div>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1 relative">
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-cyan-100 text-cyan-700">
                                            Pro
                                        </span>
                                        <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{t('browserProd3Name')}</div>
                                        <div className="font-mono font-black text-xs text-blue-600">{isBn ? '৳ ২,৪৯৯' : '৳ 2,499'}</div>
                                        <div className="text-[9px] text-amber-500 font-bold">★ 5.0 (42)</div>
                                    </div>
                                </div>

                                {/* Checkout Footer Bar */}
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-900 font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{t('browserCartSummary')}</span>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">
                                        {t('browserCheckoutBtn')}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
