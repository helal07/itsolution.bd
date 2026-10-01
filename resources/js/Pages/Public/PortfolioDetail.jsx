import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import PortfolioCard from '../../Components/PortfolioCard';
import { 
    Building2, 
    ExternalLink, 
    Calendar, 
    ArrowRight, 
    CheckCircle2, 
    Sparkles,
    Maximize2,
    X
} from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';

export default function PortfolioDetail({ portfolio, relatedPortfolios = [] }) {
    const { isBn } = useLanguage();
    const images = (portfolio.images && portfolio.images.length > 0)
        ? portfolio.images.map(img => img.image_path)
        : [portfolio.cover_image];

    const [activeImage, setActiveImage] = useState(images[0]);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const title = isBn ? (portfolio.title_bn || portfolio.title) : portfolio.title;
    const description = isBn ? (portfolio.description_bn || portfolio.description) : portfolio.description;

    const formatType = (type) => {
        if (isBn) {
            switch (type) {
                case 'pos_software':
                    return 'পিওএস সফটওয়্যার';
                case 'software':
                    return 'এন্টারপ্রাইজ সফটওয়্যার';
                case 'website':
                    return 'ওয়েবসাইট / ই-কমার্স';
                default:
                    return type;
            }
        }
        return type.replace('_', ' ');
    };

    return (
        <PublicLayout title={`${title} — Case Study`}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Project Header Meta Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono tracking-wider bg-blue-50 text-primary border border-blue-200">
                                    {formatType(portfolio.type)}
                                </span>
                                {portfolio.is_featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span>{isBn ? 'স্পেশাল কেস স্টাডি' : 'Featured Case Study'}</span>
                                    </span>
                                )}
                            </div>

                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
                                {title}
                            </h1>
                        </div>

                        {portfolio.project_url && (
                            <a
                                href={portfolio.project_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-primary text-white text-xs font-bold transition-all shadow-xs self-start md:self-auto"
                            >
                                <span>{isBn ? 'লাইভ প্রজেক্ট দেখুন' : 'Visit Live Deployment'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        
                        {/* Left: Main Case Study Body (8 cols) */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Media Preview Box */}
                            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/80 shadow-xs space-y-4">
                                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 group">
                                    <img
                                        src={activeImage}
                                        alt={portfolio.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute top-4 right-4 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 text-white backdrop-blur-md shadow-lg border border-white/20 transition-all hover:scale-110 active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Zoom</span>
                                    </button>
                                </div>

                                {images.length > 1 && (
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImage(img)}
                                                className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                                    activeImage === img ? 'border-primary shadow-md scale-105' : 'border-neutral-200 opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Case Study Scope Details */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-neutral-900">
                                    {isBn ? 'প্রজেক্টের বিবরণ ও আর্কিটেকচার' : 'Project Scope & Solution Architecture'}
                                </h2>

                                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                    {description}
                                </p>

                                <div className="pt-6 border-t border-neutral-100 space-y-4">
                                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-400">
                                        {isBn ? 'মূল সাফল্য ও আউটকাম' : 'Key Highlights & Outcomes'}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-700">
                                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span>{isBn ? 'দ্রুত ডাটাবেজ রেসপন্স টাইম' : 'Sub-second Database Response Times'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span>{isBn ? 'সম্পূর্ণ রেসপনসিভ ইউজার ইন্টারফেস' : 'Fully Responsive UI & Native Experience'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span>{isBn ? 'অটোমেটেড ক্লাউড ইনফ্রাস্ট্রাকচার' : 'Automated CI/CD & Cloud Infrastructure'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span>{isBn ? '৯৯.৯% আপটাইম ও ডেপ্লয়মেন্ট' : 'Zero-Downtime Deployment Achieved'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Meta Sidebar (4 cols) */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                                    {isBn ? 'প্রজেক্ট বিবরণ' : 'Project Summary'}
                                </h3>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    {portfolio.client && (
                                        <div className="space-y-1">
                                            <span className="text-neutral-400 block font-medium">{isBn ? 'ক্লায়েন্ট' : 'Client'}</span>
                                            <div className="flex items-center gap-2 font-bold text-neutral-800">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                <span>{portfolio.client.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <span className="text-neutral-400 block font-medium">{isBn ? 'ক্যাটাগরি' : 'Discipline'}</span>
                                        <p className="font-bold text-neutral-800 capitalize">
                                            {formatType(portfolio.type)}
                                        </p>
                                    </div>

                                    {portfolio.completed_at && (
                                        <div className="space-y-1">
                                            <span className="text-neutral-400 block font-medium">{isBn ? 'সমাপ্তির তারিখ' : 'Completion Date'}</span>
                                            <div className="flex items-center gap-2 font-bold text-neutral-800">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>{new Date(portfolio.completed_at).toLocaleDateString(isBn ? 'bn-BD' : undefined, { year: 'numeric', month: 'long' })}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                 {/* Link to related service item */}
                                {portfolio.item && (
                                    <div className="pt-6 border-t border-neutral-100 space-y-3">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                            {isBn ? 'মূল সফটওয়্যার প্রোডাক্ট' : 'Base Software Product'}
                                        </span>
                                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                                            <p className="font-heading font-bold text-sm text-neutral-900">
                                                {isBn ? (portfolio.item.name_bn || portfolio.item.name) : portfolio.item.name}
                                            </p>
                                            <p className="text-xs text-neutral-600 line-clamp-2">
                                                {isBn ? (portfolio.item.short_description_bn || portfolio.item.short_description) : portfolio.item.short_description}
                                            </p>
                                            <Link
                                                href={`/services/${portfolio.item.category?.slug || 'services'}/${portfolio.item.slug}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark pt-1"
                                            >
                                                <span>{isBn ? 'প্রোডাক্টের বিবরণ দেখুন' : 'View Product Specs'}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Box */}
                            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
                                <h4 className="font-heading font-bold text-lg text-white">
                                    {isBn ? 'অনুরূপ সলিউশন প্রয়োজন?' : 'Need a Similar Solution?'}
                                </h4>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    {isBn 
                                        ? 'আপনার ব্যবসা প্রতিষ্ঠানের জন্য কাস্টম সফটওয়্যার বা ওয়েব প্ল্যাটফর্ম তৈরি করতে আমাদের সাথে যোগাযোগ করুন।' 
                                        : 'Our dedicated engineering pods can build, test, and deploy custom platforms tailored to your business.'}
                                </p>
                                <Link
                                    href="/get-a-quote"
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition-all"
                                >
                                    <span>{isBn ? 'প্রজেক্ট কোটেশন রিকোয়েস্ট' : 'Request Project Scope'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related Portfolios */}
                    {relatedPortfolios.length > 0 && (
                        <div className="mt-16 pt-10 border-t border-neutral-200/80 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-neutral-900">
                                    {isBn ? `আরও ${formatType(portfolio.type)} প্রজেক্ট` : `More ${portfolio.type.replace('_', ' ')} Projects`}
                                </h3>
                                <Link href="/portfolio" className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1">
                                    <span>{isBn ? 'সব দেখুন' : 'Browse All'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPortfolios.map((rel) => (
                                    <PortfolioCard key={rel.id} portfolio={rel} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={activeImage}
                            alt={portfolio.title}
                            className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
