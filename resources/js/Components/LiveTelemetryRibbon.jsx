import React from 'react';
import { ShieldCheck, Server, Zap, Lock, Headphones, Activity, CheckCircle2 } from 'lucide-react';

export default function LiveTelemetryRibbon() {
    return (
        <div className="bg-neutral-900 text-white border-y border-neutral-800 py-3.5 relative overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute top-0 left-1/4 w-96 h-full bg-primary/15 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-full bg-cyan-500/10 blur-2xl pointer-events-none" />

            <div className="site-container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center justify-between">
                    
                    {/* Telemetry 1 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                            <Server className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="font-heading font-black text-xs text-white">99.99% Cloud SLA</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">High-Availability Uptime</p>
                        </div>
                    </div>

                    {/* Telemetry 2 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                                <span className="font-heading font-black text-xs text-white">TLS 1.3 & AES-256</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">End-to-End Encryption</p>
                        </div>
                    </div>

                    {/* Telemetry 3 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                                <span className="font-heading font-black text-xs text-white">&lt;45ms Low Latency</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">Edge CDN Routing</p>
                        </div>
                    </div>

                    {/* Telemetry 4 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <Headphones className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                                <span className="font-heading font-black text-xs text-white">24/7 Support Desk</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">Dedicated Engineering SLA</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
