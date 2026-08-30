import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Search, 
    Image as ImageIcon, 
    Sparkles, 
    CheckCircle2, 
    Upload, 
    Link as LinkIcon, 
    ExternalLink, 
    FolderGit2, 
    Globe, 
    Calendar,
    Building2,
    Layers
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

// Curated high-resolution portfolio sample presets
const PRESET_PROJECT_IMAGES = [
    { label: 'eCommerce Store', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80' },
    { label: 'SaaS Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80' },
    { label: 'POS Terminal', url: 'https://images.unsplash.com/photo-1556742049-0a67e557229b?w=900&auto=format&fit=crop&q=80' },
    { label: 'Fintech Portal', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&auto=format&fit=crop&q=80' },
    { label: 'Mobile App Project', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=80' },
    { label: 'Corporate Website', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80' },
];

export default function Index({ portfolios, items = [], clients = [] }) {
    const portfolioList = portfolios.data || portfolios;
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const defaultCover = PRESET_PROJECT_IMAGES[0].url;

    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: '',
        client_id: '',
        title: '',
        slug: '',
        type: 'website',
        cover_image: defaultCover,
        cover_image_file: null,
        description: '',
        project_url: '',
        is_featured: true,
        completed_at: new Date().toISOString().split('T')[0],
    });

    const openCreateModal = () => {
        setEditingPortfolio(null);
        reset();
        setPreviewUrl(defaultCover);
        setPhotoMode('upload');
        setData({
            item_id: items[0]?.id || '',
            client_id: clients[0]?.id || '',
            title: '',
            slug: '',
            type: 'website',
            cover_image: defaultCover,
            cover_image_file: null,
            description: '',
            project_url: '',
            is_featured: true,
            completed_at: new Date().toISOString().split('T')[0],
        });
        setModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingPortfolio(p);
        setPreviewUrl(p.cover_image || defaultCover);
        setPhotoMode(p.cover_image?.startsWith('/storage/') ? 'upload' : 'url');
        setData({
            item_id: p.item_id || '',
            client_id: p.client_id || '',
            title: p.title,
            slug: p.slug,
            type: p.type,
            cover_image: p.cover_image || defaultCover,
            cover_image_file: null,
            description: p.description || '',
            project_url: p.project_url || '',
            is_featured: Boolean(p.is_featured),
            completed_at: p.completed_at ? p.completed_at.split('T')[0] : '',
        });
        setModalOpen(true);
    };

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
        setData(prev => ({
            ...prev,
            cover_image: url,
            cover_image_file: null
        }));
        setPreviewUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPortfolio) {
            router.post(`/admin/portfolios/${editingPortfolio.id}`, {
                _method: 'put',
                ...data,
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/portfolios', {
                forceFormData: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (p) => {
        if (confirm(`Delete project "${p.title}"?`)) {
            router.delete(`/admin/portfolios/${p.id}`);
        }
    };

    const filteredPortfolios = portfolioList.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (p.title || '').toLowerCase().includes(q) ||
            (p.type || '').toLowerCase().includes(q) ||
            (p.client?.name || '').toLowerCase().includes(q) ||
            (p.project_url || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Portfolio">
            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Portfolio
                        </h1>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search project title, client, URL..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        {filteredPortfolios.length} projects
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono whitespace-nowrap">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Project & Photo</th>
                                    <th className="py-3.5 px-3">Discipline</th>
                                    <th className="py-3.5 px-3">Client / Company</th>
                                    <th className="py-3.5 px-3">Live Website URL</th>
                                    <th className="py-3.5 px-3 text-center">Featured</th>
                                    <th className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredPortfolios.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400">
                                            No portfolio projects found. Click "Add Project" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPortfolios.map((p) => (
                                        <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="py-3.5 pl-5 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={p.cover_image || defaultCover}
                                                        alt=""
                                                        className="w-12 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shadow-2xs flex-shrink-0"
                                                        onError={(e) => { e.currentTarget.src = defaultCover; }}
                                                    />
                                                    <div className="min-w-0 pr-2">
                                                        <p className="font-bold text-slate-900 text-sm truncate">{p.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono truncate">{p.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold capitalize">
                                                    {p.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <p className="font-bold text-slate-900 truncate">{p.client?.name || '—'}</p>
                                                {p.item?.name && (
                                                    <p className="text-[10px] text-slate-400 truncate">{p.item.name}</p>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-3">
                                                {p.project_url ? (
                                                    <a 
                                                        href={p.project_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-mono text-[11px] truncate max-w-xs"
                                                    >
                                                        <span className="truncate">{p.project_url.replace(/^https?:\/\//, '')}</span>
                                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-3 text-center">
                                                {p.is_featured ? (
                                                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-amber-200 inline-flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                <ActionDropdown label="Actions">
                                                    <div className="py-1">
                                                        <ActionItem onClick={() => openEditModal(p)} icon={Edit2}>
                                                            Edit Project
                                                        </ActionItem>
                                                        <ActionItem onClick={() => handleDelete(p)} icon={Trash2} danger>
                                                            Delete Project
                                                        </ActionItem>
                                                    </div>
                                                </ActionDropdown>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Comprehensive Project / Website Create/Edit Modal */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="2xl">
                <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <FolderGit2 className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-base text-slate-900">
                                {editingPortfolio ? 'Edit Project' : 'Add New Portfolio Project'}
                            </h2>
                        </div>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        
                        {/* 1. Project Type & Linked Service */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Project Discipline / Type *</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                    required
                                >
                                    <option value="website">Website / eCommerce Platform</option>
                                    <option value="software">Enterprise Software System</option>
                                    <option value="pos_software">POS & Retail Management Software</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Associated Service Offering</label>
                                <select
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">-- General / Custom Solution --</option>
                                    {items.map((it) => (
                                        <option key={it.id} value={it.id}>{it.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 2. Project Title & Slug */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Project / Website Title *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g. Apex Health CRM & Patient Portal"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">URL Slug *</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="apex-health-crm"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3. Client & Live Website Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Client / Company Name</label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">-- Internal / Confidential Client --</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Live Website / Project URL</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={data.project_url}
                                        onChange={(e) => setData('project_url', e.target.value)}
                                        placeholder="https://clientdomain.com"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono text-[11px]"
                                    />
                                    {data.project_url && (
                                        <a 
                                            href={data.project_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors flex-shrink-0"
                                            title="Open link in new tab"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 4. Multi-Mode Project Cover Image Upload */}
                        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-slate-800 font-bold">
                                    Project Cover Screenshot / Photo *
                                </label>
                                
                                {/* Photo Source Tabs */}
                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-100 text-[11px]">
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('upload')}
                                        className={`px-2 py-1 rounded-md font-semibold transition-all ${
                                            photoMode === 'upload' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> Upload File</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('url')}
                                        className={`px-2 py-1 rounded-md font-semibold transition-all ${
                                            photoMode === 'url' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Image URL</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('presets')}
                                        className={`px-2 py-1 rounded-md font-semibold transition-all ${
                                            photoMode === 'presets' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Presets</span>
                                    </button>
                                </div>
                            </div>

                            {/* Photo Mode Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                
                                {/* Live Aspect-Ratio Preview Card */}
                                <div className="sm:col-span-4">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs group">
                                        <img 
                                            src={previewUrl || defaultCover} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = defaultCover; }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                            Preview
                                        </div>
                                    </div>
                                </div>

                                {/* Inputs for active mode */}
                                <div className="sm:col-span-8 space-y-2">
                                    {photoMode === 'upload' && (
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                                className="hidden"
                                            />
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-4 border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl bg-white text-center cursor-pointer transition-all hover:bg-blue-50/50"
                                            >
                                                <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                                                <p className="font-bold text-slate-800 text-xs">Click to browse project image from computer</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP or SVG (Max 10MB)</p>
                                            </div>
                                            {data.cover_image_file && (
                                                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {data.cover_image_file.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {photoMode === 'url' && (
                                        <div className="space-y-1">
                                            <input
                                                type="url"
                                                value={data.cover_image}
                                                onChange={(e) => {
                                                    setData('cover_image', e.target.value);
                                                    setPreviewUrl(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 font-mono text-[11px]"
                                            />
                                            <p className="text-[10px] text-slate-400">Enter a direct image link URL</p>
                                        </div>
                                    )}

                                    {photoMode === 'presets' && (
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {PRESET_PROJECT_IMAGES.map((preset, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(preset.url)}
                                                    className={`p-1.5 rounded-lg border text-left text-[10px] transition-all truncate flex items-center gap-1 ${
                                                        previewUrl === preset.url ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{preset.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 5. Completion Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Launch / Completion Date</label>
                                <input
                                    type="date"
                                    value={data.completed_at}
                                    onChange={(e) => setData('completed_at', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div className="flex items-center sm:pt-6">
                                <div className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Featured Project</p>
                                        <p className="text-[10px] text-slate-500">Highlight on homepage portfolio showcase</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 6. Full Project Details, Tech Specs & Website Overview */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">
                                Full Project Case Study & Website Scope Details
                            </label>
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the client's challenge, architecture implemented, tech stack used (e.g. React, Laravel, AWS), key deliverables, and business results..."
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 resize-none font-sans leading-relaxed"
                            />
                        </div>

                        {/* 7. Action Buttons */}
                        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs disabled:opacity-50 active:scale-95 transition-all"
                            >
                                {editingPortfolio ? 'Update Project' : 'Save Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
