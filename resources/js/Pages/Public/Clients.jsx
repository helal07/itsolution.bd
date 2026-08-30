import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import ClientRow from '../../Components/ClientRow';
import { 
    Star, 
    ShieldCheck, 
    HeartHandshake, 
    ArrowRight, 
    Building2
} from 'lucide-react';

export default function Clients({ clients }) {
    const clientList = clients.data || clients;

    return (
        <PublicLayout title="Clients & Global Partners — IT SOLUTIONS">
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Clean Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                Our Clients & Partners
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                Trusted by established enterprises, fast-growing startups, and industry leaders across the globe.
                            </p>
                        </div>

                        <Link
                            href="/get-a-quote"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs self-start md:self-auto"
                        >
                            <span>Become a Partner</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* 4-Column Trust & Metric Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-50 text-primary flex-shrink-0">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-heading font-black text-2xl text-neutral-900 leading-none">99.4%</p>
                                <p className="text-xs text-neutral-500 font-medium mt-1">Client Retention Rate</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 flex-shrink-0">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-heading font-black text-2xl text-neutral-900 leading-none">5.0 ★</p>
                                <p className="text-xs text-neutral-500 font-medium mt-1">Verified Rating</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-heading font-black text-2xl text-neutral-900 leading-none">100%</p>
                                <p className="text-xs text-neutral-500 font-medium mt-1">On-Time Milestone SLA</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-2xs flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 flex-shrink-0">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-heading font-black text-2xl text-neutral-900 leading-none">12+ Countries</p>
                                <p className="text-xs text-neutral-500 font-medium mt-1">Global Deployment Base</p>
                            </div>
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="space-y-4">
                        {clientList.map((client) => (
                            <ClientRow key={client.id} client={client} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {clients.links && clients.links.length > 3 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                            {clients.links.map((link, idx) => (
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
        </PublicLayout>
    );
}
