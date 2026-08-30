import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Smartphone, 
    Globe, 
    Cpu, 
    ArrowRight, 
    Layers, 
    CheckCircle2, 
    Sparkles 
} from 'lucide-react';

export default function CategoryCard({ category }) {
    const getCategoryConfig = (slug) => {
        switch (slug) {
            case 'apps':
                return {
                    icon: <Smartphone className="w-7 h-7 text-primary" />,
                    gradient: 'from-blue-600/10 via-cyan-500/10 to-indigo-600/10',
                    borderHover: 'group-hover:border-primary/40',
                    glowHover: 'group-hover:shadow-blue-500/10',
                    iconBg: 'bg-blue-50 group-hover:bg-primary group-hover:text-white',
                    pills: ['iOS & Android Apps', 'React Native & Flutter', 'App Store Deployment']
                };
            case 'website':
                return {
                    icon: <Globe className="w-7 h-7 text-cyan-600" />,
                    gradient: 'from-cyan-600/10 via-teal-500/10 to-blue-600/10',
                    borderHover: 'group-hover:border-cyan-500/40',
                    glowHover: 'group-hover:shadow-cyan-500/10',
                    iconBg: 'bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white',
                    pills: ['Custom Web Portals', 'Headless eCommerce', 'SEO & Speed Optimization']
                };
            case 'software':
                return {
                    icon: <Cpu className="w-7 h-7 text-purple-600" />,
                    gradient: 'from-purple-600/10 via-indigo-500/10 to-blue-600/10',
                    borderHover: 'group-hover:border-purple-500/40',
                    glowHover: 'group-hover:shadow-purple-500/10',
                    iconBg: 'bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
                    pills: ['Enterprise ERP & SaaS', 'Cloud Microservices', 'Custom APIs & Systems']
                };
            default:
                return {
                    icon: <Layers className="w-7 h-7 text-primary" />,
                    gradient: 'from-blue-600/10 via-cyan-500/10 to-indigo-600/10',
                    borderHover: 'group-hover:border-primary/40',
                    glowHover: 'group-hover:shadow-blue-500/10',
                    iconBg: 'bg-blue-50 group-hover:bg-primary group-hover:text-white',
                    pills: ['Custom Architecture', 'Dedicated SLA Pods', 'Enterprise Support']
                };
        }
    };

    const config = getCategoryConfig(category.slug);

    return (
        <Link
            href={`/services/${category.slug}`}
            className={`group relative bg-white rounded-[2rem] p-7 sm:p-8 border border-neutral-200/80 shadow-card hover:shadow-2xl ${config.glowHover} ${config.borderHover} hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
            {/* Top decorative gradient ambient strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="space-y-6">
                {/* Icon & Category Item Counter */}
                <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110`}>
                        {config.icon}
                    </div>

                    {category.items_count !== undefined && (
                        <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-neutral-100/80 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                            {category.items_count} Solutions
                        </span>
                    )}
                </div>

                {/* Title & Description */}
                <div className="space-y-2.5">
                    <h3 className="font-heading font-black text-2xl text-neutral-900 group-hover:text-primary transition-colors duration-200">
                        {category.name}
                    </h3>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {category.description}
                    </p>
                </div>

                {/* Solution Highlights Pills */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                    {config.pills.map((pill, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span>{pill}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Interactive Action */}
            <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:text-primary transition-colors">
                <span className="uppercase tracking-wider font-mono">Explore Solutions</span>
                <div className="w-9 h-9 rounded-full bg-neutral-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
