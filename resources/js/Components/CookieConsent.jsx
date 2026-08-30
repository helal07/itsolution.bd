import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, 
    Cpu, 
    Code2, 
    Server, 
    Smartphone, 
    Zap, 
    Bot, 
    Settings, 
    X, 
    Cookie 
} from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // always required
        techStack: true,
        cloudPerformance: true,
        aiArchitect: true
    });

    useEffect(() => {
        // Check if consent has already been given
        const savedConsent = localStorage.getItem('its_software_cookie_consent');
        if (!savedConsent) {
            // Slight delay so page loads smoothly first
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const consentData = {
            essential: true,
            techStack: true,
            cloudPerformance: true,
            aiArchitect: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('its_software_cookie_consent', JSON.stringify(consentData));
        setIsVisible(false);
        setShowPreferences(false);
    };

    const handleAcceptEssential = () => {
        const consentData = {
            essential: true,
            techStack: false,
            cloudPerformance: false,
            aiArchitect: false,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('its_software_cookie_consent', JSON.stringify(consentData));
        setIsVisible(false);
        setShowPreferences(false);
    };

    const handleSaveCustom = () => {
        const consentData = {
            ...preferences,
            essential: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('its_software_cookie_consent', JSON.stringify(consentData));
        setIsVisible(false);
        setShowPreferences(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
            
            {/* 1. Main Cookie Banner Card */}
            {!showPreferences ? (
                <div className="bg-neutral-900/95 backdrop-blur-xl text-white rounded-3xl p-5 sm:p-6 border border-white/15 shadow-2xl space-y-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-heading font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                                <span>Software & Architecture Preferences</span>
                            </h4>
                            <p className="text-neutral-300 text-xs leading-relaxed">
                                We store software configuration data, technical framework preferences, and secure API tokens locally to deliver custom enterprise software, mobile apps, and web solutions.
                            </p>
                        </div>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleAcceptAll}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center whitespace-nowrap"
                        >
                            Accept All
                        </button>
                        
                        <button
                            onClick={handleAcceptEssential}
                            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-semibold transition-all text-center whitespace-nowrap"
                        >
                            Essential Only
                        </button>

                        <button
                            onClick={() => setShowPreferences(true)}
                            className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                            title="Customize Software Preferences"
                            aria-label="Customize Software Cookie Preferences"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                /* 2. Detailed Software-Specific Cookie Preferences Modal */
                <div className="bg-neutral-900/95 backdrop-blur-xl text-white rounded-3xl p-5 sm:p-6 border border-white/15 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-cyan-300" />
                            <h4 className="font-heading font-bold text-sm text-white">Software Architecture Settings</h4>
                        </div>
                        <button 
                            onClick={() => setShowPreferences(false)}
                            className="text-neutral-400 hover:text-white p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {/* Essential: Software Runtime & API Auth */}
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="pr-2">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                                    <p className="text-xs font-bold text-white">Software Runtime & API Auth</p>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5">Preserves secure API authorization tokens, quote scope configurations, and software session states.</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                Always Active
                            </span>
                        </div>

                        {/* Mobile & POS App Tech Stack */}
                        <label className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="pr-2">
                                <div className="flex items-center gap-1.5">
                                    <Smartphone className="w-3.5 h-3.5 text-primary-light" />
                                    <p className="text-xs font-bold text-white">Mobile & POS Tech Stack Preferences</p>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5">Stores framework selections (Flutter, React Native, iOS, Android, POS Terminal sync) for tailored architecture scopes.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.techStack}
                                onChange={(e) => setPreferences({ ...preferences, techStack: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-primary bg-neutral-800 border-neutral-700 cursor-pointer"
                            />
                        </label>

                        {/* Cloud Database & Performance */}
                        <label className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="pr-2">
                                <div className="flex items-center gap-1.5">
                                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                                    <p className="text-xs font-bold text-white">Cloud Database & Micro-Cache</p>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5">Monitors sub-second API latency, cached GraphQL payloads, and edge CDN delivery speed.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.cloudPerformance}
                                onChange={(e) => setPreferences({ ...preferences, cloudPerformance: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-primary bg-neutral-800 border-neutral-700 cursor-pointer"
                            />
                        </label>

                        {/* AI Software Architect Consultation State */}
                        <label className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="pr-2">
                                <div className="flex items-center gap-1.5">
                                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                                    <p className="text-xs font-bold text-white">AI Software Architect Consultation</p>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5">Preserves live chatbot developer answers, scope inquiries, and technical SLA consultation history.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.aiArchitect}
                                onChange={(e) => setPreferences({ ...preferences, aiArchitect: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-primary bg-neutral-800 border-neutral-700 cursor-pointer"
                            />
                        </label>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                        <button
                            onClick={handleSaveCustom}
                            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all"
                        >
                            Save Settings
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-semibold transition-all"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
