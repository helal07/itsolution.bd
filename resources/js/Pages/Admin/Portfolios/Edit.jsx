import React, { useState, useRef } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    Save, 
    FolderGit2, 
    Upload, 
    Link as LinkIcon, 
    Sparkles, 
    Check, 
    Globe, 
    FileText, 
    Image as ImageIcon,
    Calendar,
    Building2,
    Layers,
    ExternalLink,
    Trash2
} from 'lucide-react';

const PRESET_PROJECT_IMAGES = [
    { label: 'eCommerce Store', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80' },
    { label: 'SaaS Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80' },
    { label: 'POS Terminal', url: 'https://images.unsplash.com/photo-1556742049-0a67e557229b?w=900&auto=format&fit=crop&q=80' },
    { label: 'Fintech Portal', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&auto=format&fit=crop&q=80' },
    { label: 'Mobile App Project', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=80' },
    { label: 'Corporate Website', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80' },
];

export default function Edit({ portfolio, items = [], clients = [] }) {
    const defaultCover = PRESET_PROJECT_IMAGES[0].url;
    const initialCover = portfolio.cover_image || defaultCover;
    const [photoMode, setPhotoMode] = useState(initialCover.startsWith('/storage/') ? 'upload' : 'url');
    const [previewUrl, setPreviewUrl] = useState(initialCover);
    const fileInputRef = useRef(null);

    const { data, setData, processing, errors } = useForm({
        item_id: portfolio.item_id || '',
        client_id: portfolio.client_id || '',
        title: portfolio.title || '',
        title_bn: portfolio.title_bn || '',
        slug: portfolio.slug || '',
        type: portfolio.type || 'website',
        cover_image: initialCover,
        cover_image_file: null,
        description: portfolio.description || '',
        description_bn: portfolio.description_bn || '',
        project_url: portfolio.project_url || '',
        is_featured: Boolean(portfolio.is_featured),
        completed_at: portfolio.completed_at ? portfolio.completed_at.split('T')[0] : '',
    });

    const handleTitleChange = (val) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                : prev.slug,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image_file', file);
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
            cover_image: url,
            cover_image_file: null,
        }));
        setPreviewUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/admin/portfolios/${portfolio.id}`, {
            _method: 'put',
            ...data,
        }, {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${portfolio.title}"? This cannot be undone.`)) {
            router.delete(`/admin/portfolios/${portfolio.id}`);
        }
    };

    return (
        <AdminLayout title={`Edit Project: ${portfolio.title}`}>
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                
                {/* Header & Breadcrumb */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/portfolios" 
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                                    Edit Project: {portfolio.title}
                                </h1>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    Full Page Editor
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Modify project case study details, bilingual translations (English &amp; বাংলা), and screenshots.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {portfolio.project_url && (
                            <a
                                href={portfolio.project_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                <span>Live Demo</span>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Update Project'}</span>
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
                                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                                    <span>Project Title & URL Slug</span>
                                </h2>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                    Dual Language (EN + BN)
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Project Title (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="e.g. ApexStore Headless E-Commerce"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <span>প্রজেক্টের নাম (বাংলা)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title_bn}
                                        onChange={(e) => setData('title_bn', e.target.value)}
                                        placeholder="যেমন: এপেক্সস্টোর হেডলেস ই-কমার্স"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {errors.title_bn && <p className="text-rose-500 text-xs mt-1">{errors.title_bn}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        URL Slug (Unique Link) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="apexstore-headless"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    {errors.slug && <p className="text-rose-500 text-xs mt-1">{errors.slug}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Live Demo / Project URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={data.project_url}
                                        onChange={(e) => setData('project_url', e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {errors.project_url && <p className="text-rose-500 text-xs mt-1">{errors.project_url}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Project Descriptions Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                    <span>Case Study & Architecture Description</span>
                                </h2>
                                <span className="text-[11px] text-slate-400">
                                    Highlight the problem, stack and deliverables
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Description (English)
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailed description of the client's problem, technologies used, and outcomes achieved..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                    {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <span>বিবরণ (বাংলা কেস স্টাডি)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={data.description_bn}
                                        onChange={(e) => setData('description_bn', e.target.value)}
                                        placeholder="বাংলায় প্রজেক্টের লক্ষ্য, ব্যবহৃত টেকনোলজি এবং ফলাফল সম্পর্কে বিস্তারিত লিখুন..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                    {errors.description_bn && <p className="text-rose-500 text-xs mt-1">{errors.description_bn}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Meta & Media (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Association & Type Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Project Meta & Taxonomy
                            </h2>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Type *</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="website">Web Application / Portal</option>
                                    <option value="mobile_app">Mobile Application (iOS / Android)</option>
                                    <option value="software">Desktop / Enterprise Software</option>
                                    <option value="ui_ux">UI/UX Design Concept</option>
                                    <option value="ecommerce">E-Commerce System</option>
                                    <option value="api">API / Backend System</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Related Service</span>
                                </label>
                                <select
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">None / Standalone</option>
                                    {items.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.name} {i.name_bn ? `(${i.name_bn})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Client Name</span>
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">Internal / Demonstration</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Completion Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.completed_at}
                                    onChange={(e) => setData('completed_at', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Showcase on Homepage</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Cover Image / Thumbnail Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Project Showcase Image
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

                            {/* Preview Cover */}
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                                <img
                                    src={previewUrl || defaultCover}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = defaultCover; }}
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Current Cover</span>
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
                                        <span>Change Local Image File</span>
                                    </button>
                                    <p className="text-[10px] text-slate-400 text-center">JPG, PNG, WebP up to 4MB</p>
                                </div>
                            )}

                            {photoMode === 'url' && (
                                <div>
                                    <input
                                        type="text"
                                        value={data.cover_image}
                                        onChange={(e) => {
                                            setData('cover_image', e.target.value);
                                            setPreviewUrl(e.target.value);
                                        }}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Enter a direct high-res screenshot URL</p>
                                </div>
                            )}

                            {photoMode === 'presets' && (
                                <div className="grid grid-cols-2 gap-2">
                                    {PRESET_PROJECT_IMAGES.map((p, idx) => (
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
                                <h3 className="font-extrabold text-sm text-white">Save Changes?</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Updates will be visible in the portfolio showcase and client success stories immediately.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving...' : 'Save & Update Project'}</span>
                            </button>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
