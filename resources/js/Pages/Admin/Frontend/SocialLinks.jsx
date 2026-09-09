import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Save, 
    Check, 
    Share2, 
    Globe, 
    ExternalLink 
} from 'lucide-react';

export default function SocialLinks({ settings, flash = {} }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        facebook_url: settings.facebook_url || '',
        linkedin_url: settings.linkedin_url || '',
        github_url: settings.github_url || '',
        youtube_url: settings.youtube_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/social-links', { 
            preserveScroll: true 
        });
    };

    return (
        <AdminLayout title="Social Links">
            <div className="space-y-5 max-w-5xl mx-auto pb-10">
                
                {/* Header Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Social Links & Channels
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure social media accounts and public links displayed across the footer and contact sections
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
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Official Social Media Profiles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block font-bold text-slate-800">
                                Facebook Page URL
                            </label>
                            <input
                                type="url"
                                value={data.facebook_url}
                                onChange={(e) => setData('facebook_url', e.target.value)}
                                placeholder="https://facebook.com/yourbrand"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block font-bold text-slate-800">
                                LinkedIn Company URL
                            </label>
                            <input
                                type="url"
                                value={data.linkedin_url}
                                onChange={(e) => setData('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/company/yourbrand"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block font-bold text-slate-800">
                                GitHub Organization URL
                            </label>
                            <input
                                type="url"
                                value={data.github_url}
                                onChange={(e) => setData('github_url', e.target.value)}
                                placeholder="https://github.com/yourorg"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block font-bold text-slate-800">
                                YouTube Channel URL
                            </label>
                            <input
                                type="url"
                                value={data.youtube_url}
                                onChange={(e) => setData('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/@yourchannel"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
