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
    Clock, 
    Code2, 
    FileText, 
    Layers,
    Sliders,
    Eye
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

// Curated high-resolution IT service sample presets
const PRESET_PHOTOS = [
    { label: 'Web & Cloud App', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
    { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cloud & DevOps', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
    { label: 'AI & Data Science', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80' },
    { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
];

export default function Index({ items, categories = [] }) {
    const itemList = items.data || items;
    const [editingItem, setEditingItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const defaultThumbnail = PRESET_PHOTOS[0].url;

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: categories[0]?.id || 1,
        name: '',
        slug: '',
        short_description: '',
        description: '',
        thumbnail: defaultThumbnail,
        thumbnail_file: null,
        is_purchasable: false,
        is_featured: false,
        status: 'published',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setPreviewUrl(defaultThumbnail);
        setPhotoMode('upload');
        setData({
            category_id: categories[0]?.id || 1,
            name: '',
            slug: '',
            short_description: '',
            description: '',
            thumbnail: defaultThumbnail,
            thumbnail_file: null,
            is_purchasable: false,
            is_featured: false,
            status: 'published',
        });
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setPreviewUrl(item.thumbnail || defaultThumbnail);
        setPhotoMode(item.thumbnail?.startsWith('/storage/') ? 'upload' : 'url');
        setData({
            category_id: item.category_id,
            name: item.name,
            slug: item.slug,
            short_description: item.short_description || '',
            description: item.description || '',
            thumbnail: item.thumbnail || defaultThumbnail,
            thumbnail_file: null,
            is_purchasable: Boolean(item.is_purchasable),
            is_featured: Boolean(item.is_featured),
            status: item.status,
        });
        setModalOpen(true);
    };

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
        setData(prev => ({
            ...prev,
            thumbnail: url,
            thumbnail_file: null
        }));
        setPreviewUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingItem) {
            // For file uploads on updates, use POST with _method = 'PUT' for multipart/form-data support
            router.post(`/admin/items/${editingItem.id}`, {
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
            post('/admin/items', {
                forceFormData: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (item) => {
        if (confirm(`Delete "${item.name}"?`)) {
            router.delete(`/admin/items/${item.id}`);
        }
    };

    const filteredItems = itemList.filter(item => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(q) ||
            (item.slug || '').toLowerCase().includes(q) ||
            (item.short_description || '').toLowerCase().includes(q) ||
            (item.category?.name || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Services">
            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Service
                        </h1>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Service</span>
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
                            placeholder="Search service, category..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        {filteredItems.length} services
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono whitespace-nowrap">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Service & Photo</th>
                                    <th className="py-3.5 px-3">Category</th>
                                    <th className="py-3.5 px-3">Summary / Scope</th>
                                    <th className="py-3.5 px-3 text-center">Featured</th>
                                    <th className="py-3.5 px-3 text-center">Status</th>
                                    <th className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400">
                                            No services found. Click "Add Service" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="py-3.5 pl-5 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.thumbnail || defaultThumbnail}
                                                        alt=""
                                                        className="w-12 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shadow-2xs flex-shrink-0"
                                                        onError={(e) => { e.currentTarget.src = defaultThumbnail; }}
                                                    />
                                                    <div className="min-w-0 pr-2">
                                                        <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono truncate">{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                                                    {item.category?.name || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-slate-600 truncate">
                                                {item.short_description || item.description || '—'}
                                            </td>
                                            <td className="py-3.5 px-3 text-center">
                                                {item.is_featured ? (
                                                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-amber-200 inline-flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-3 text-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                    item.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                <ActionDropdown label="Actions">
                                                    <div className="py-1">
                                                        <ActionItem onClick={() => openEditModal(item)} icon={Edit2}>
                                                            Edit Service
                                                        </ActionItem>
                                                        <ActionItem onClick={() => handleDelete(item)} icon={Trash2} danger>
                                                            Delete Service
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

            {/* Comprehensive Service Create/Edit Modal with Photo Upload & Rich Details */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="2xl">
                <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <Layers className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-base text-slate-900">
                                {editingItem ? 'Edit Service' : 'Add New Service'}
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
                        
                        {/* 1. Category & Status Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Publication Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                >
                                    <option value="published">Published (Live in Store)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. Service Name & Slug */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Service Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. Enterprise Cloud Migration"
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
                                    placeholder="enterprise-cloud-migration"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3. Photo Upload & Preview Section */}
                        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-slate-800 font-bold">
                                    Service Cover Photo
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
                                
                                {/* Preview Card */}
                                <div className="sm:col-span-4">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs group">
                                        <img 
                                            src={previewUrl || defaultThumbnail} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = defaultThumbnail; }}
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
                                                <p className="font-bold text-slate-800 text-xs">Click to browse photo from computer</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP or SVG (Max 10MB)</p>
                                            </div>
                                            {data.thumbnail_file && (
                                                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {data.thumbnail_file.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {photoMode === 'url' && (
                                        <div className="space-y-1">
                                            <input
                                                type="url"
                                                value={data.thumbnail}
                                                onChange={(e) => {
                                                    setData('thumbnail', e.target.value);
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
                                            {PRESET_PHOTOS.map((preset, idx) => (
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

                        {/* 4. Short Summary Tagline */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">
                                Short Summary / Tagline
                            </label>
                            <input
                                type="text"
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                placeholder="e.g. End-to-end custom platform architecture with scalable 24/7 cloud infrastructure."
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                            />
                        </div>

                        {/* 5. Full Service Details Description & Scope */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">
                                Full Service Details, Scope & Technical Specifications
                            </label>
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the technical details, deliverables, system architecture, deliverables, warranty, and development process..."
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 resize-none font-sans leading-relaxed"
                            />
                        </div>

                        {/* 6. Featured Toggle */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-800 text-xs">Featured Service</p>
                                <p className="text-[10px] text-slate-500">Showcase this service in the featured solutions section on the homepage</p>
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
                                {editingItem ? 'Update Service' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
