import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Save, 
    Check, 
    TrendingUp, 
    ShieldCheck, 
    Sparkles, 
    Award, 
    Star 
} from 'lucide-react';

export default function TrustMatrix({ settings, flash = {} }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        hero_stat1_value: settings.hero_stat1_value || '100+',
        hero_stat1_label: settings.hero_stat1_label || 'Projects Delivered',
        hero_stat2_value: settings.hero_stat2_value || '99.9%',
        hero_stat2_label: settings.hero_stat2_label || 'Uptime Guarantee',
        hero_stat3_value: settings.hero_stat3_value || '5.0 ★',
        hero_stat3_label: settings.hero_stat3_label || 'Client Rating',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/trust-matrix', { 
            preserveScroll: true 
        });
    };

    return (
        <AdminLayout title="Trust Matrix">
            <div className="space-y-5 max-w-5xl mx-auto pb-10">
                
                {/* Header Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Trust Matrix & Live Counters
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure the 3 live performance badges, credibility stats & trust metrics on the homepage
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {recentlySuccessful ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Saved</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Key Credibility Counters
                        </h2>
                        <span className="text-[11px] text-blue-600 font-bold">
                            Appears right beside the hero section on desktop & mobile
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Metric 1 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/50 to-slate-50 border border-blue-100/80 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                                    Metric Card 1
                                </span>
                                <Award className="w-4 h-4 text-blue-500" />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Counter Number / Metric
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat1_value}
                                    onChange={(e) => setData('hero_stat1_value', e.target.value)}
                                    placeholder="e.g. 100+"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-base font-black text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Description Label
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat1_label}
                                    onChange={(e) => setData('hero_stat1_label', e.target.value)}
                                    placeholder="e.g. Projects Delivered"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-50/50 to-slate-50 border border-indigo-100/80 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                                    Metric Card 2
                                </span>
                                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Counter Number / Metric
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat2_value}
                                    onChange={(e) => setData('hero_stat2_value', e.target.value)}
                                    placeholder="e.g. 99.9%"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-base font-black text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Description Label
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat2_label}
                                    onChange={(e) => setData('hero_stat2_label', e.target.value)}
                                    placeholder="e.g. Uptime Guarantee"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/50 to-slate-50 border border-amber-100/80 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                                    Metric Card 3
                                </span>
                                <Star className="w-4 h-4 text-amber-500" />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Counter Number / Metric
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat3_value}
                                    onChange={(e) => setData('hero_stat3_value', e.target.value)}
                                    placeholder="e.g. 5.0 ★"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-base font-black text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Description Label
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_stat3_label}
                                    onChange={(e) => setData('hero_stat3_label', e.target.value)}
                                    placeholder="e.g. Client Rating"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                                />
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
