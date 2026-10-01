import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

export default function ClientTestimonialsSection({ reviews = [] }) {
    const { isBn } = useLanguage();

    const fallbackReviews = [
        {
            id: 'fb-1',
            user: { name: 'Ahsan Habib' },
            project_name: 'Make Secure Pro & POS',
            project_name_bn: 'মেক সিকিউর প্রো ও পিওএস সিস্টেম',
            rating: 5,
            title: 'Flawless Security & Speed',
            title_bn: 'নিরাপত্তা ও দুর্দান্ত পারফর্ম্যান্স',
            comment: 'Built our enterprise POS with bank-grade security and offline sync. Operations run twice as fast!',
            comment_bn: 'আমাদের রিটেইল চেইনের জন্য ক্লাউড ও অফলাইন পিওএস তৈরি করে দিয়েছে। এখন অপারেশন দ্বিগুণ দ্রুত গতিতে চলছে!',
        },
        {
            id: 'fb-2',
            user: { name: 'Dr. Rafiqul Islam' },
            project_name: 'Cloud Diagnostic Portal',
            project_name_bn: 'ক্লাউড ডায়াগনস্টিক ও পেশেন্ট পোর্টাল',
            rating: 5,
            title: 'Exceptional Quality',
            title_bn: 'অসাধারণ গুণগত মান',
            comment: 'Patient management and real-time medical imaging portal was delivered right on schedule.',
            comment_bn: 'রোগীদের রিপোর্ট ও প্রেসক্রিপশন পোর্টাল নির্ধারিত সময়ের মধ্যেই অত্যন্ত নিখুঁতভাবে ডেলিভারি পেয়েছি।',
        },
        {
            id: 'fb-3',
            user: { name: 'Nusrat Jahan' },
            project_name: 'E-Commerce SuperApp',
            project_name_bn: 'ই-কমার্স সুপারঅ্যাপ ও পেমেন্ট',
            rating: 5,
            title: 'Modern UI & Payments',
            title_bn: 'আধুনিক ডিজাইন ও সহজ পেমেন্ট',
            comment: 'bKash and Nagad payment gateway integrations work seamlessly. Conversion jumped by 40%!',
            comment_bn: 'বিকাশ, নগদ ও কার্ড পেমেন্ট খুব সহজে কাজ করছে। আমাদের অনলাইন বিক্রয় ৪০% বৃদ্ধি পেয়েছে!',
        },
    ];

    const displayReviews = (reviews && reviews.length > 0) ? reviews : fallbackReviews;

    return (
        <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70 relative overflow-hidden">
            <div className="site-container space-y-6">
                
                {/* Short Header */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                        {isBn ? 'গ্রাহকদের মূল্যায়ন ও রিভিউ' : 'Client Reviews'}
                    </h2>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
                        <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                        </div>
                        <span className="font-heading font-bold text-xs text-neutral-900">5.0</span>
                    </div>
                </div>

                {/* Review Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {displayReviews.slice(0, 3).map((r) => {
                        const rTitle = isBn ? (r.title_bn || r.title || 'ক্লায়েন্ট রিভিউ') : (r.title || 'Great software build');
                        const rComment = isBn ? (r.comment_bn || r.comment) : r.comment;
                        const rProject = isBn ? (r.project_name_bn || r.project_name || 'সফটওয়্যার ডেভেলপমেন্ট') : (r.project_name || 'App Deployment');

                        return (
                            <div
                                key={r.id}
                                className="bg-neutral-50/70 rounded-2xl p-5 border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-amber-400">
                                            {[...Array(r.rating || 5)].map((_, idx) => (
                                                <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                                            ))}
                                        </div>
                                        <Quote className="w-4 h-4 text-neutral-300" />
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-heading font-bold text-sm text-neutral-900 line-clamp-1">
                                            "{rTitle}"
                                        </h4>
                                        <p className="text-neutral-600 text-xs leading-relaxed">
                                            {rComment}
                                        </p>
                                    </div>
                                </div>

                                {/* Client Metadata */}
                                <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-500 text-white flex items-center justify-center font-heading font-bold text-xs shadow-2xs">
                                            {(r.user?.name || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h5 className="font-heading font-bold text-xs text-neutral-900 flex items-center gap-1">
                                                <span>{r.user?.name || 'Client'}</span>
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            </h5>
                                            <p className="text-[10px] text-neutral-400 font-mono">
                                                {rProject}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
