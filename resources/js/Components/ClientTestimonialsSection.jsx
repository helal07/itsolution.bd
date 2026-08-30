import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function ClientTestimonialsSection({ reviews = [] }) {
    const fallbackReviews = [
        {
            id: 'fb-1',
            user: { name: 'Ahsan Habib' },
            project_name: 'Make Secure Pro & POS',
            rating: 5,
            title: 'Flawless Security & Speed',
            comment: 'Built our enterprise POS with bank-grade security and offline sync. Operations run twice as fast!',
        },
        {
            id: 'fb-2',
            user: { name: 'Dr. Rafiqul Islam' },
            project_name: 'Cloud Diagnostic Portal',
            rating: 5,
            title: 'Exceptional Quality',
            comment: 'Patient management and real-time medical imaging portal was delivered right on schedule.',
        },
        {
            id: 'fb-3',
            user: { name: 'Nusrat Jahan' },
            project_name: 'E-Commerce SuperApp',
            rating: 5,
            title: 'Modern UI & Payments',
            comment: 'bKash and Nagad payment gateway integrations work seamlessly. Conversion jumped by 40%!',
        },
    ];

    const displayReviews = (reviews && reviews.length > 0) ? reviews : fallbackReviews;

    return (
        <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70 relative overflow-hidden">
            <div className="site-container space-y-6">
                
                {/* Short Header */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                        Client Reviews
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
                    {displayReviews.slice(0, 3).map((r) => (
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
                                        "{r.title || 'Great software build'}"
                                    </h4>
                                    <p className="text-neutral-600 text-xs leading-relaxed">
                                        {r.comment}
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
                                            {r.project_name || 'App Deployment'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
