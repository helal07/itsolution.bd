import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    User, 
    UserCheck, 
    ExternalLink, 
    Quote, 
    Star, 
    CheckCircle2, 
    ArrowRight, 
    Layers,
    Building2
} from 'lucide-react';

export default function ClientRow({ client }) {
    return (
        <div className="group bg-white hover:bg-blue-50/20 rounded-2xl p-4 sm:p-5 border border-neutral-200/90 hover:border-primary/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                
                {/* 1. Client Identity with Man/Person Avatar Icon */}
                <div className="flex items-center gap-3.5 min-w-0 md:w-64 flex-shrink-0">
                    {/* Man / Person Avatar Box */}
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
                        {client.logo ? (
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement.innerHTML = '<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                                }}
                            />
                        ) : (
                            <User className="w-6 h-6 text-white" />
                        )}
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white" title="Verified Client">
                            ✓
                        </span>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-heading font-bold text-sm sm:text-base text-neutral-900 truncate group-hover:text-primary transition-colors">
                                {client.name}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2">
                            {client.website_url ? (
                                <a
                                    href={client.website_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-primary transition-colors truncate max-w-[130px]"
                                >
                                    <span>Website</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                            ) : (
                                <span className="text-[11px] text-neutral-400 font-medium">Enterprise Client</span>
                            )}

                            <span className="text-neutral-300">•</span>

                            <div className="flex items-center gap-0.5 text-amber-400">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-bold text-neutral-600 font-mono">5.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Slim Testimonial Quote Bubble */}
                {client.testimonial ? (
                    <div className="flex-1 min-w-0 md:px-2">
                        <div className="flex items-center gap-2 text-neutral-600 text-xs sm:text-sm italic line-clamp-2 md:line-clamp-1">
                            <Quote className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 rotate-180" />
                            <span className="truncate">{client.testimonial}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 hidden md:block"></div>
                )}

                {/* 3. Delivered Solutions Pill Links */}
                <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
                    {client.portfolios && client.portfolios.length > 0 ? (
                        client.portfolios.map((p) => (
                            <Link
                                key={p.id}
                                href={`/portfolio/${p.slug}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all duration-150 shadow-sm"
                            >
                                <Layers className="w-3 h-3" />
                                <span className="truncate max-w-[120px] sm:max-w-[150px]">{p.title}</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        ))
                    ) : (
                        <Link
                            href="/get-a-quote"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-primary text-neutral-700 hover:text-white text-xs font-semibold transition-all"
                        >
                            <span>Client Profile</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
