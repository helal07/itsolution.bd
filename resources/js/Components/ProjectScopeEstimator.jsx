import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Calculator, 
    Smartphone, 
    Globe, 
    ShieldCheck, 
    Database, 
    Check, 
    ArrowRight, 
    Clock, 
    Users, 
    Cpu
} from 'lucide-react';

export default function ProjectScopeEstimator() {
    const [projectType, setProjectType] = useState('mobile');
    const [selectedFeatures, setSelectedFeatures] = useState(['auth', 'database']);
    const [timelinePreference, setTimelinePreference] = useState('standard');

    const projectTypes = [
        { id: 'mobile', label: 'Mobile App', icon: Smartphone, defaultDays: 14, team: '2 Mobile Devs + UI' },
        { id: 'web', label: 'Web Portal', icon: Globe, defaultDays: 12, team: '2 Full-Stack Devs' },
        { id: 'security', label: 'Cyber Security', icon: ShieldCheck, defaultDays: 10, team: 'Cyber Sec Lead' },
        { id: 'custom', label: 'Cloud Systems', icon: Database, defaultDays: 16, team: 'Lead Architect + Devs' },
    ];

    const availableFeatures = [
        { id: 'auth', label: '2FA & Biometric Auth', days: 2 },
        { id: 'payment', label: 'Payment Gateway', days: 3 },
        { id: 'database', label: 'Real-Time Sync', days: 3 },
        { id: 'chat', label: 'Live Chat / WebSockets', days: 3 },
        { id: 'pos', label: 'POS & Inventory', days: 4 },
        { id: 'sla', label: '24/7 SLA Monitoring', days: 1 },
    ];

    const toggleFeature = (id) => {
        if (selectedFeatures.includes(id)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== id));
        } else {
            setSelectedFeatures([...selectedFeatures, id]);
        }
    };

    const currentType = projectTypes.find(t => t.id === projectType) || projectTypes[0];
    const totalFeatureDays = selectedFeatures.reduce((acc, fId) => {
        const feat = availableFeatures.find(f => f.id === fId);
        return acc + (feat ? feat.days : 0);
    }, 0);

    const baseDays = currentType.defaultDays + totalFeatureDays;
    const finalDays = timelinePreference === 'express' ? Math.max(7, Math.round(baseDays * 0.65)) : baseDays;
    const weeksEstimate = Math.ceil(finalDays / 5);

    const getFeaturesSummary = () => {
        const labels = selectedFeatures.map(fId => availableFeatures.find(f => f.id === fId)?.label).filter(Boolean);
        return `${currentType.label} with ${labels.join(', ')} (${timelinePreference === 'express' ? 'Express' : 'Standard'})`;
    };

    return (
        <section className="py-14 sm:py-20 bg-neutral-900 text-white relative overflow-hidden border-b border-neutral-800">
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
            <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="site-container space-y-8 relative z-10">
                
                {/* Compact Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-cyan-300 text-[11px] font-bold">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Scope & Timeline Planner</span>
                    </div>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                        Instant Scope & Timeline Estimator
                    </h2>
                </div>

                {/* Interactive Configurator Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Configuration Steps (7 cols) */}
                    <div className="lg:col-span-7 bg-neutral-800/80 rounded-2xl p-5 sm:p-6 border border-neutral-700/80 space-y-5 backdrop-blur-md">
                        
                        {/* Step 1: Select Platform */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                1. Solution Architecture
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {projectTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = projectType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setProjectType(type.id)}
                                            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 hover:-translate-y-0.5 ${
                                                isSelected 
                                                    ? 'bg-primary text-white border-primary shadow-xs' 
                                                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600 text-neutral-300'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-heading font-bold text-xs">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 2: Choose Features */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                2. Modules
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableFeatures.map((feat) => {
                                    const isChecked = selectedFeatures.includes(feat.id);
                                    return (
                                        <button
                                            key={feat.id}
                                            type="button"
                                            onClick={() => toggleFeature(feat.id)}
                                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between hover:scale-[1.02] ${
                                                isChecked
                                                    ? 'bg-blue-500/20 border-cyan-400 text-white shadow-2xs'
                                                    : 'bg-neutral-900/40 border-neutral-700/80 text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            <span className="truncate">{feat.label}</span>
                                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0 ml-1 ${
                                                isChecked ? 'bg-cyan-400 border-cyan-400 text-neutral-950' : 'border-neutral-600'
                                            }`}>
                                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 3: Velocity Preference */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                3. Velocity
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTimelinePreference('standard')}
                                    className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                        timelinePreference === 'standard'
                                            ? 'bg-primary text-white border-primary shadow-xs'
                                            : 'bg-neutral-900/40 border-neutral-700 text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    Standard Sprint
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTimelinePreference('express')}
                                    className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                        timelinePreference === 'express'
                                            ? 'bg-amber-500 text-white border-amber-400 shadow-xs'
                                            : 'bg-neutral-900/40 border-neutral-700 text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    ⚡ Express Launch
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right: Output Card (5 cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-700 shadow-xl space-y-4">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block font-mono">
                                    ESTIMATED SPRINT
                                </span>
                                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                                    ~{weeksEstimate} {weeksEstimate === 1 ? 'Week' : 'Weeks'}
                                </h3>
                                <p className="text-[11px] text-neutral-400 font-mono">
                                    {finalDays} business days
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                                <div className="flex items-center gap-1.5 text-neutral-300">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <span>Pod:</span>
                                </div>
                                <span className="font-bold text-white text-right">{currentType.team}</span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                                <div className="flex items-center gap-1.5 text-neutral-300">
                                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Modules:</span>
                                </div>
                                <span className="font-mono font-bold text-cyan-300">{selectedFeatures.length} Selected</span>
                            </div>
                        </div>

                        {/* Short CTA Button */}
                        <div className="pt-1">
                            <Link
                                href={`/get-a-quote?project_type=${encodeURIComponent(projectType)}&message=${encodeURIComponent(`Scope request: ${getFeaturesSummary()}`)}`}
                                className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                            >
                                <span>Get Quote</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}
