import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import QuoteForm from '../../Components/QuoteForm';
import { Sparkles, MessageSquare, Clock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Quote({ categories = [], selectedItemId = null }) {
    return (
        <PublicLayout title="Request a Free Quote — IT SOLUTIONS">
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Clean Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                Request a Free Quote
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                Share your project vision, timeline, and requirements. Our lead software architect will review your scope and provide a detailed estimate within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Form & Consultation Process Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        
                        {/* Left: Interactive Form (7 cols) */}
                        <div className="lg:col-span-7">
                            <QuoteForm 
                                categories={categories} 
                                defaultItemId={selectedItemId} 
                            />
                        </div>

                        {/* Right: Consultation Process & Guarantees (5 cols) */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                            
                            {/* Roadmap Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                    <h3 className="font-heading font-black text-base text-neutral-900">
                                        Engineering Workflow
                                    </h3>
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-blue-50">
                                        4 Steps
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">
                                            1
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-heading font-bold text-sm text-neutral-900">Discovery & Architecture Review</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">We analyze your requirements, tech stack constraints, and user flows.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">
                                            2
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-heading font-bold text-sm text-neutral-900">Scope & Milestone Proposal</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">You receive a fixed-price roadmap, timeline, and architectural blueprint.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">
                                            3
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-heading font-bold text-sm text-neutral-900">Sprint Development & QA</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">Dedicated pods build your system with weekly demos and staging previews.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-emerald-200">
                                            4
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-heading font-bold text-sm text-neutral-900">Production Handover & SLA</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">Full source code delivery, cloud deployment, and 6-month warranty.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Guarantees */}
                            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
                                <h4 className="font-heading font-bold text-base text-white">
                                    Our Client Guarantees
                                </h4>
                                <div className="space-y-2.5 text-xs text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <span>Full NDA & Confidentiality Protection</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <span>100% Intellectual Property Ownership</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                        <span>24-Hour Scope Estimation Response</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
