import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    Sparkles, 
    ExternalLink, 
    FolderGit2, 
    Globe, 
    Calendar,
    Building2,
    Layers
} from 'lucide-react';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

const PRESET_PROJECT_IMAGES = [
    { label: 'eCommerce Store', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80' },
];

export default function Index({ portfolios, items = [], clients = [] }) {
    const portfolioList = portfolios.data || portfolios;
    const [search, setSearch] = useState('');
    const defaultCover = PRESET_PROJECT_IMAGES[0].url;

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
            (p.title_bn || '').toLowerCase().includes(q) ||
            (p.slug || '').toLowerCase().includes(q) ||
            (p.project_url || '').toLowerCase().includes(q) ||
            (p.client?.name || '').toLowerCase().includes(q) ||
            (p.item?.name || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Portfolios & Projects">
            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Portfolios & Case Studies
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Showcase live web apps, software systems, and mobile apps with dual-language (English &amp; বাংলা) details.
                        </p>
                    </div>
                    <Link
                        href="/admin/portfolios/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                    </Link>
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
                                                        {p.title_bn && (
                                                            <p className="text-[11px] text-blue-600 font-semibold truncate">{p.title_bn}</p>
                                                        )}
                                                        <p className="text-[10px] text-slate-400 font-mono truncate">/{p.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold capitalize">
                                                    {p.type ? p.type.replace('_', ' ') : 'Website'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <div className="text-slate-800 font-semibold text-xs truncate max-w-xs">
                                                    {p.client?.name || <span className="text-slate-400 font-normal italic">Self Project</span>}
                                                </div>
                                                {p.item && (
                                                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                                        <Layers className="w-3 h-3 text-slate-400" />
                                                        <span>{p.item.name}</span>
                                                    </div>
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
                                                        <ActionItem onClick={() => router.visit(`/admin/portfolios/${p.id}/edit`)} icon={Edit2}>
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
        </AdminLayout>
    );
}
