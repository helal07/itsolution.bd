import React, { useState, useRef } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
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

    // Category bilingual management state
    const [catModalOpen, setCatModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [catForm, setCatForm] = useState({
        name: '',
        name_bn: '',
        description: '',
        description_bn: '',
        sort_order: 1,
    });
    const [catSaving, setCatSaving] = useState(false);

    const openCategoryEdit = (cat) => {
        setEditingCategory(cat);
        setCatForm({
            name: cat.name || '',
            name_bn: cat.name_bn || '',
            description: cat.description || '',
            description_bn: cat.description_bn || '',
            sort_order: cat.sort_order || 1,
        });
        setCatModalOpen(true);
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        if (!editingCategory) return;
        setCatSaving(true);
        router.put(`/admin/categories/${editingCategory.id}`, catForm, {
            onSuccess: () => {
                setCatModalOpen(false);
                setEditingCategory(null);
                setCatSaving(false);
            },
            onError: () => {
                setCatSaving(false);
            }
        });
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
                            Services & Solutions
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage service offerings and bilingual (English &amp; বাংলা) translations.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setCatModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <Layers className="w-4 h-4 text-cyan-400" />
                            <span>Manage Categories (ক্যাটাগরি সমূহ)</span>
                        </button>

                        <Link
                            href="/admin/items/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Service</span>
                        </Link>
                    </div>
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
                                                        {item.name_bn && (
                                                            <p className="text-[11px] text-blue-600 font-semibold truncate">{item.name_bn}</p>
                                                        )}
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
                                                        <ActionItem onClick={() => router.visit(`/admin/items/${item.id}/edit`)} icon={Edit2}>
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

            {/* Category Bilingual Management Modal */}
            <Modal show={catModalOpen} onClose={() => setCatModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="font-heading font-black text-xl text-slate-900">
                                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Manage Service Categories'}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Configure category names and descriptions in both English &amp; বাংলা (Bengali).
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setCatModalOpen(false);
                                setEditingCategory(null);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!editingCategory ? (
                        <div className="py-4 space-y-3">
                            <p className="text-xs font-semibold text-slate-600">
                                Select a category to edit English and Bengali translations:
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {categories.map((cat) => (
                                    <div 
                                        key={cat.id} 
                                        className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-heading font-black text-slate-900 text-sm">{cat.name}</span>
                                                {cat.name_bn && (
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                        {cat.name_bn}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1">{cat.description || 'No English description'}</p>
                                            {cat.description_bn && (
                                                <p className="text-xs text-blue-600/80 line-clamp-1">{cat.description_bn}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openCategoryEdit(cat)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex-shrink-0 cursor-pointer shadow-2xs"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Edit Translations</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveCategory} className="py-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1 text-xs">
                                        Category Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={catForm.name}
                                        onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1.5">
                                        <span>ক্যাটাগরির নাম (বাংলা)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={catForm.name_bn}
                                        onChange={(e) => setCatForm({ ...catForm, name_bn: e.target.value })}
                                        placeholder="যেমন: মোবাইল অ্যাপস সলিউশন"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1 text-xs">
                                        Description (English)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={catForm.description}
                                        onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1.5">
                                        <span>বিবরণ (বাংলা)</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">BN</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={catForm.description_bn}
                                        onChange={(e) => setCatForm({ ...catForm, description_bn: e.target.value })}
                                        placeholder="বাংলায় ক্যাটাগরির বিস্তারিত বিবরণ..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                                >
                                    ← Back to Categories
                                </button>
                                <button
                                    type="submit"
                                    disabled={catSaving}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                                >
                                    {catSaving ? 'Saving...' : 'Save Category Translations'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AdminLayout>
    );
}
