import React, { useState } from 'react';
import { 
    Smartphone, 
    Globe, 
    Database, 
    ShieldCheck, 
    Zap, 
    Code2, 
    Server, 
    Cpu,
    CheckCircle2,
    Layers
} from 'lucide-react';

export default function TechStackMatrix() {
    const [activeDomain, setActiveDomain] = useState('mobile');

    const domains = [
        {
            id: 'mobile',
            label: 'Mobile Engineering',
            icon: Smartphone,
            headline: 'Native Performance on iOS & Android',
            description: 'We develop pixel-perfect, responsive mobile experiences using Flutter, React Native, Swift, and Kotlin with offline SQLite sync and biometrics.',
            techs: ['Flutter 3.x', 'React Native', 'Swift (iOS)', 'Kotlin (Android)', 'SQLite Local DB', 'Firebase Push'],
            metrics: [
                { label: 'Frame Rate', val: '60 FPS Smooth' },
                { label: 'Offline Support', val: '100% Synced' },
                { label: 'App Store SLA', val: 'Guaranteed Pass' }
            ]
        },
        {
            id: 'web',
            label: 'Web & Cloud Platforms',
            icon: Globe,
            headline: 'Sub-second SSR & Modern SPAs',
            description: 'Engineered with React 19, Inertia.js, Vite, and modern Tailwind CSS for instant page transitions and high-conversion client experiences.',
            techs: ['React 19', 'Inertia.js', 'Vite Bundler', 'Tailwind CSS', 'Next.js', 'TypeScript'],
            metrics: [
                { label: 'Lighthouse Score', val: '95+ Score' },
                { label: 'First Contentful Paint', val: '<0.4s' },
                { label: 'Mobile Responsive', val: '100% Fluid' }
            ]
        },
        {
            id: 'backend',
            label: 'Backend & High Scale',
            icon: Server,
            headline: 'Robust Laravel 12 & Microservices',
            description: 'Scalable APIs, background queuing via Redis, distributed jobs, and multi-tenant database partitioning.',
            techs: ['Laravel 12 (PHP 8.2+)', 'PostgreSQL / MySQL', 'Redis In-Memory', 'Docker Containers', 'REST & GraphQL', 'AWS Cloud'],
            metrics: [
                { label: 'API Response Time', val: '<45ms Average' },
                { label: 'Database Pooling', val: 'High Concurrency' },
                { label: 'Uptime Protocol', val: '99.99% SLA' }
            ]
        },
        {
            id: 'security',
            label: 'Cyber Defense & OWASP',
            icon: ShieldCheck,
            headline: 'Zero-Trust Data Protection',
            description: 'Bank-grade 256-bit AES encryption, multi-factor biometric authentication, automated SQL injection immunity, and CSRF protection.',
            techs: ['AES-256 GCM', 'TLS 1.3 Strict', 'OWASP Top 10 Audited', 'Role-Based Access (RBAC)', '2FA Tokens', 'Automated Penetration Tests'],
            metrics: [
                { label: 'Encryption Level', val: 'Military Grade' },
                { label: 'Data Leak Defense', val: 'Active Shield' },
                { label: 'SLA Monitoring', val: '24/7 Monitored' }
            ]
        }
    ];

    const current = domains.find(d => d.id === activeDomain) || domains[0];

    return (
        <section className="py-20 sm:py-24 bg-neutral-50/70 border-b border-neutral-200/70 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-bold tracking-wide">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="uppercase font-mono tracking-wider">Technology Stack</span>
                    </div>
                    <h2 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                        Engineered with <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">Modern Standards</span>
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm">
                        Explore our technology stacks, architectural benchmarks, and engineering standards.
                    </p>
                </div>

                {/* Domain Switcher Tabs */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {domains.map((d) => {
                        const Icon = d.icon;
                        const isActive = activeDomain === d.id;
                        return (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => setActiveDomain(d.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                        : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{d.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Domain Showcase Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                    
                    {/* Left Details (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono">
                                Architecture Deep-Dive
                            </span>
                            <h3 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900">
                                {current.headline}
                            </h3>
                            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                                {current.description}
                            </p>
                        </div>

                        {/* Tech Pills Grid */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                Core Frameworks & Tooling
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {current.techs.map((t, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1.5 rounded-xl bg-neutral-50 text-neutral-800 border border-neutral-200/70 text-xs font-mono font-semibold shadow-2xs flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{t}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Metrics Card (5 cols) */}
                    <div className="lg:col-span-5 bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                            <span className="text-xs font-mono font-bold text-cyan-400">Benchmark Telemetry</span>
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>

                        <div className="space-y-3">
                            {current.metrics.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                                    <span className="text-neutral-400">{m.label}</span>
                                    <span className="font-mono font-black text-cyan-300">{m.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 text-[11px] text-neutral-400 text-center font-mono">
                            Verified on Production Cloud Infrastructure
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
