import React, { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    Save, 
    Layers, 
    Upload, 
    Link as LinkIcon, 
    Sparkles, 
    Check, 
    Globe, 
    FileText, 
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

const PRESET_PHOTOS = [
    { label: 'Web & Cloud App', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
    { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cloud & DevOps', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
    { label: 'AI & Data Science', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80' },
    { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
];

export default function Create({ categories = [] }) {
    const defaultThumbnail = PRESET_PHOTOS[0].url;
    const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'
    const [previewUrl, setPreviewUrl] = useState(defaultThumbnail);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        category_id: categories[0]?.id || '',
        name: '',
        name_bn: '',
        slug: '',
        short_description: '',
        short_description_bn: '',
        description: '',
        description_bn: '',
        thumbnail: defaultThumbnail,
        thumbnail_file: null,
        is_purchasable: false,
        is_featured: false,
        status: 'published',
    });

    const handleNameChange = (val) => {
        setData((prev) => ({
            ...prev,
            name: val,
            slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                : prev.slug,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail_file', file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectPreset = (url) => {
        setData((prev) => ({
            ...prev,
            thumbnail: url,
            thumbnail_file: null,
        }));
        setPreviewUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/items', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Add New Service">
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                
                {/* Header & Breadcrumb */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/items" 
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                                    Add New Service
                                </h1>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                    Full Page Editor
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Add full service profile with dual-language (English &amp; বাংলা) descriptions.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/items"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Publish Service'}</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Bilingual Details (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Title & Slug Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    <span>Service Title & URL Slug</span>
                                </h2>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                    Dual Language
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Service Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="e.g. Enterprise Cloud Migration"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <span>সার্ভিসের নাম (বাংলা)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name_bn}
                                        onChange={(e) => setData('name_bn', e.target.value)}
                                        placeholder="যেমন: এন্টারপ্রাইজ ক্লাউড মাইগ্রেশন"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {errors.name_bn && <p className="text-rose-500 text-xs mt-1">{errors.name_bn}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    URL Slug (Unique Link Identifier) *
                                </label>
                                <div className="flex items-center">
                                    <span className="px-3.5 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-200 text-slate-500 text-xs font-mono">
                                        /services/
                                    </span>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="cloud-migration"
                                        className="flex-1 px-3.5 py-2.5 rounded-r-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                </div>
                                {errors.slug && <p className="text-rose-500 text-xs mt-1">{errors.slug}</p>}
                            </div>
                        </div>

                        {/* Summary & Taglines Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                    <span>Short Summaries & Taglines</span>
                                </h2>
                                <span className="text-[11px] text-slate-400">
                                    Shown in catalog cards & search snippets
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Short Summary / Tagline (English)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        placeholder="One-line summary for cards and search snippets..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {errors.short_description && <p className="text-rose-500 text-xs mt-1">{errors.short_description}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <span>সংক্ষিপ্ত বিবরণ (বাংলা Tagline)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.short_description_bn}
                                        onChange={(e) => setData('short_description_bn', e.target.value)}
                                        placeholder="সার্ভিস কার্ডের জন্য এক লাইনের মূল হাইলাইট..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {errors.short_description_bn && <p className="text-rose-500 text-xs mt-1">{errors.short_description_bn}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Full Detailed Content Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-600" />
                                    <span>Full Service Specifications & Description</span>
                                </h2>
                                <span className="text-[11px] text-slate-400">
                                    Displayed on the single service detail page
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Full Details (English)
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Comprehensive breakdown of features, workflows, and specifications..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                    {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <span>বিস্তারিত বিবরণ (বাংলা)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={data.description_bn}
                                        onChange={(e) => setData('description_bn', e.target.value)}
                                        placeholder="ফিচার, কাজের প্রক্রিয়া এবং টেকনিক্যাল তথ্যাদি বিস্তারিত লিখুন..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                    {errors.description_bn && <p className="text-rose-500 text-xs mt-1">{errors.description_bn}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Settings & Media (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Status & Category Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Publishing & Taxonomy
                            </h2>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.name_bn ? `(${c.name_bn})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-rose-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Publication Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="published">Published (Live in Store)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t border-slate-100 space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Feature on Homepage</span>
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.is_purchasable}
                                        onChange={(e) => setData('is_purchasable', e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-800">
                                        Enable Direct Order / Purchase
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Cover Image / Thumbnail Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Service Cover Photo
                            </h2>

                            {/* Mode Switcher Tabs */}
                            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setPhotoMode('upload')}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                        photoMode === 'upload' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPhotoMode('url')}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                        photoMode === 'url' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Image URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPhotoMode('presets')}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                        photoMode === 'presets' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Presets
                                </button>
                            </div>

                            {/* Preview Thumbnail */}
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                                <img
                                    src={previewUrl || defaultThumbnail}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = defaultThumbnail; }}
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Current Preview</span>
                                </div>
                            </div>

                            {/* Upload Controls */}
                            {photoMode === 'upload' && (
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Choose Local Image File</span>
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center">JPG, PNG, WebP up to 4MB</p>
                                </div>
                            )}

                            {photoMode === 'url' && (
                                <div>
                                    <input
                                        type="text"
                                        value={data.thumbnail}
                                        onChange={(e) => {
                                            setData('thumbnail', e.target.value);
                                            setPreviewUrl(e.target.value);
                                        }}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Enter a direct high-res image link</p>
                                </div>
                            )}

                            {photoMode === 'presets' && (
                                <div className="grid grid-cols-2 gap-2">
                                    {PRESET_PHOTOS.map((p, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSelectPreset(p.url)}
                                            className={`p-1.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                                                previewUrl === p.url ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <img src={p.url} alt={p.label} className="w-full h-12 rounded-lg object-cover mb-1" />
                                            <span className="block text-[10px] font-bold text-slate-700 truncate">{p.label}</span>
                                            {previewUrl === p.url && (
                                                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Save Action Box */}
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
                            <div>
                                <h3 className="font-extrabold text-sm text-white">Ready to Publish?</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    This will create the service product and make it accessible across the catalog and navigation menu.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Publishing...' : 'Publish Service'}</span>
                            </button>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
