import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    ArrowRight, 
    Sparkles, 
    Layers,
    Smartphone
} from 'lucide-react';

export default function HeroBanner({ hero }) {
    const photo1 = hero?.image_1 || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80';
    const photo2 = hero?.image_2 || 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80';
    const photo1Tag = hero?.image_1_tag || 'Cloud & Web';
    const photo2Tag = hero?.image_2_tag || 'Mobile Apps';

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1128] via-[#091538] to-neutral-950 text-white py-8 sm:py-12 lg:py-16">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
            <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative site-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-14 items-center">
                    
                    {/* Left Column (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                        
                        {/* Glowing Category Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-[11px] font-bold tracking-wide backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                            </span>
                            <Sparkles className="w-3 h-3 text-cyan-300 flex-shrink-0" />
                            <span className="uppercase font-mono tracking-wider">
                                {hero?.badge || 'SOFTWARE & APPS'}
                            </span>
                        </div>

                        {/* Short Main Headline */}
                        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] tracking-tight text-white leading-tight">
                            {hero?.headline ? (
                                hero.headline
                            ) : (
                                <>
                                    Software & Apps{' '}
                                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                                        Built to Scale
                                    </span>
                                </>
                            )}
                        </h1>

                        {/* Short Subheadline */}
                        <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
                            {hero?.subheadline || 'Custom mobile apps, web systems, and enterprise software engineering.'}
                        </p>

                        {/* Action CTAs */}
                        <div className="pt-1 flex items-center gap-2.5">
                            <Link
                                href="/get-a-quote"
                                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                            >
                                <span>Get Quote</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                            >
                                <span>Services</span>
                            </Link>
                        </div>

                        {/* Trust Metrics Strip */}
                        <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2.5 max-w-md">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                                <p className="font-heading font-black text-base sm:text-lg text-white">
                                    {hero?.stat1_value || '100+'}
                                </p>
                                <p className="text-[10px] text-neutral-400 font-medium">Projects</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                                <p className="font-heading font-black text-base sm:text-lg text-cyan-300">
                                    {hero?.stat2_value || '99.9%'}
                                </p>
                                <p className="text-[10px] text-neutral-400 font-medium">Uptime</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                                <p className="font-heading font-black text-base sm:text-lg text-amber-300">
                                    {hero?.stat3_value || '5.0 ★'}
                                </p>
                                <p className="text-[10px] text-neutral-400 font-medium">Rating</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Visual Showcase (5 Cols) */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-purple-600/20 rounded-3xl blur-xl -z-10 opacity-70" />

                        <div className="relative space-y-[-2rem] sm:space-y-[-3rem]">
                            
                            {/* Photo 1 */}
                            <div className="relative group rounded-2xl overflow-hidden border border-white/20 bg-neutral-900/80 shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1">
                                <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-800">
                                    <img
                                        src={photo1}
                                        alt="Software"
                                        fetchPriority="high"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />
                                
                                <div className="absolute top-2.5 left-2.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-950/80 border border-white/20 text-white text-[10px] font-semibold backdrop-blur-md">
                                        <Layers className="w-3 h-3 text-cyan-400" />
                                        <span>{photo1Tag}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Photo 2 */}
                            <div className="relative ml-auto w-4/5 z-20 group rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-neutral-900/90 shadow-2xl transition-all duration-300 hover:border-cyan-400 hover:scale-[1.02] hover:-translate-y-1">
                                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-800">
                                    <img
                                        src={photo2}
                                        alt="Mobile"
                                        fetchPriority="high"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

                                <div className="absolute top-2 left-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/85 border border-cyan-400/30 text-cyan-200 text-[10px] font-semibold backdrop-blur-md">
                                        <Smartphone className="w-3 h-3 text-cyan-300" />
                                        <span>{photo2Tag}</span>
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
