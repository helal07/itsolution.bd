import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children, title }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#050811] text-white font-sans selection:bg-primary selection:text-white relative overflow-hidden">
            {title && <Head title={`${title} — IT SOLUTIONS`} />}

            {/* Dynamic Ambient Background Glows */}
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[46rem] h-[28rem] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-48 right-[-10%] w-[36rem] h-[36rem] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-5s' }} />
            <div className="absolute top-1/3 left-[-15%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

            {/* Radial Masked Subtle Grid Matrix */}
            <div 
                className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" 
            />

            {/* Top Navigation Bar */}
            <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D3B66] via-primary to-primary-light flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 ring-1 ring-white/20">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-black text-lg tracking-tight text-white leading-none">
                            IT <span className="text-primary-light">SOLUTIONS</span>
                        </span>
                        <span className="text-[9px] tracking-widest uppercase font-semibold text-neutral-400 mt-0.5">
                            Client Hub
                        </span>
                    </div>
                </Link>

                {/* Right: Operational Status & Back Link */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>System Operational</span>
                    </div>

                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all shadow-xs hover:border-white/20"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Website</span>
                    </Link>
                </div>
            </header>

            {/* Centered Floating Card Area */}
            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-[450px]">
                    <div className="bg-[#0b1222]/85 backdrop-blur-3xl rounded-[2rem] p-7 sm:p-9 border border-white/[0.12] shadow-[0_0_60px_-15px_rgba(30,136,229,0.25)] relative overflow-hidden">
                        {/* Top animated cyan/blue glow line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-light to-cyan-400" />
                        
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 text-center text-xs text-neutral-400">
                <span>&copy; {new Date().getFullYear()} IT SOLUTIONS. All rights reserved.</span>
            </footer>
        </div>
    );
}
