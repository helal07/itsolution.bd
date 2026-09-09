import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Save, 
    Check, 
    Sparkles, 
    Upload, 
    Image as ImageIcon,
    Layers,
    CheckCircle2
} from 'lucide-react';

export default function HeroBanner({ settings, flash = {} }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        hero_headline: settings.hero_headline || '',
        hero_subheadline: settings.hero_subheadline || '',
        hero_badge: settings.hero_badge || '',
        hero_image_1: settings.hero_image_1 || '',
        hero_image_1_file: null,
        hero_image_2: settings.hero_image_2 || '',
        hero_image_2_file: null,
        hero_image_1_tag: settings.hero_image_1_tag || '',
        hero_image_2_tag: settings.hero_image_2_tag || '',
    });

    const [hero1Preview, setHero1Preview] = useState(settings.hero_image_1 || '');
    const [hero2Preview, setHero2Preview] = useState(settings.hero_image_2 || '');

    const hero1InputRef = useRef(null);
    const hero2InputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/hero-banner', { 
            forceFormData: true, 
            preserveScroll: true 
        });
    };

    const handleHero1FileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image_1_file', file);
            setHero1Preview(URL.createObjectURL(file));
        }
    };

    const handleHero2FileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image_2_file', file);
            setHero2Preview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout title="Hero Banner">
            <div className="space-y-5 max-w-5xl mx-auto pb-10">
                
                {/* Header Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Home Hero Banner
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure homepage main headline, callout badge & featured showcase images
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
                        Hero Banner Content & Media
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        
                        {/* Text Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Badge Text (Top Pill)</label>
                                <input
                                    type="text"
                                    value={data.hero_badge}
                                    onChange={(e) => setData('hero_badge', e.target.value)}
                                    placeholder="e.g. PREMIUM IT SOLUTIONS & WEB ENGINEERING"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Main Headline</label>
                                <input
                                    type="text"
                                    value={data.hero_headline}
                                    onChange={(e) => setData('hero_headline', e.target.value)}
                                    placeholder="e.g. We Build World-Class Apps, Websites & Enterprise Software"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Subheadline Description</label>
                                <textarea
                                    rows={4}
                                    value={data.hero_subheadline}
                                    onChange={(e) => setData('hero_subheadline', e.target.value)}
                                    placeholder="Enter descriptive copy explaining your core value proposition..."
                                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none text-xs leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Image Uploads */}
                        <div className="space-y-4">
                            
                            {/* Hero Image 1 (Main) Selection Box */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800">Hero Image 1 (Primary Showcase)</span>
                                    <button
                                        type="button"
                                        onClick={() => hero1InputRef.current?.click()}
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                    >
                                        Browse File
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div 
                                        onClick={() => hero1InputRef.current?.click()}
                                        className="w-24 h-16 rounded-xl bg-white border border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xs group flex-shrink-0"
                                        title="Click to select main hero image"
                                    >
                                        {hero1Preview ? (
                                            <img src={hero1Preview} alt="Hero 1" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="file"
                                            ref={hero1InputRef}
                                            accept="image/*"
                                            onChange={handleHero1FileSelect}
                                            className="hidden"
                                        />
                                        <input
                                            type="text"
                                            value={data.hero_image_1}
                                            onChange={(e) => {
                                                setData('hero_image_1', e.target.value);
                                                setHero1Preview(e.target.value);
                                            }}
                                            placeholder="Or enter direct image URL"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={data.hero_image_1_tag}
                                            onChange={(e) => setData('hero_image_1_tag', e.target.value)}
                                            placeholder="Caption tag (e.g. Enterprise Cloud & Web Apps)"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image 2 (Accent) Selection Box */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800">Hero Image 2 (Secondary Accent)</span>
                                    <button
                                        type="button"
                                        onClick={() => hero2InputRef.current?.click()}
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                    >
                                        Browse File
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div 
                                        onClick={() => hero2InputRef.current?.click()}
                                        className="w-24 h-16 rounded-xl bg-white border border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xs group flex-shrink-0"
                                        title="Click to select accent hero image"
                                    >
                                        {hero2Preview ? (
                                            <img src={hero2Preview} alt="Hero 2" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="file"
                                            ref={hero2InputRef}
                                            accept="image/*"
                                            onChange={handleHero2FileSelect}
                                            className="hidden"
                                        />
                                        <input
                                            type="text"
                                            value={data.hero_image_2}
                                            onChange={(e) => {
                                                setData('hero_image_2', e.target.value);
                                                setHero2Preview(e.target.value);
                                            }}
                                            placeholder="Or enter direct image URL"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={data.hero_image_2_tag}
                                            onChange={(e) => setData('hero_image_2_tag', e.target.value)}
                                            placeholder="Caption tag (e.g. Mobile & High Scale Systems)"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
