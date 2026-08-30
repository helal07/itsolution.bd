import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Plus, 
    X, 
    Search, 
    Mail, 
    Phone, 
    Calendar, 
    RotateCcw, 
    Eye, 
    Briefcase, 
    Edit, 
    Send, 
    Trash2, 
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    ExternalLink
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ quotes, items = [], currentStatus = 'all', startDate = '', endDate = '' }) {
    const quoteList = quotes.data || quotes;
    const [search, setSearch] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(startDate);
    const [filterEndDate, setFilterEndDate] = useState(endDate);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewQuote, setViewQuote] = useState(null);
    const [editQuote, setEditQuote] = useState(null);

    // 1. Create Form
    const createForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        item_id: items[0]?.id || '',
        estimated_budget: '',
        message: '',
        notes: '',
        status: 'new',
    });

    // 2. Edit Form
    const editForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        item_id: '',
        estimated_budget: '',
        message: '',
        notes: '',
        status: 'new',
    });

    const handleDateFilter = (start, end) => {
        setFilterStartDate(start);
        setFilterEndDate(end);
        const query = {};
        if (start) query.start_date = start;
        if (end) query.end_date = end;
        router.get('/admin/quotes', query, { preserveState: true });
    };

    const handleClearDateFilter = () => {
        setFilterStartDate('');
        setFilterEndDate('');
        router.get('/admin/quotes', {}, { preserveState: true });
    };

    const handleOpenCreate = () => {
        createForm.reset();
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post('/admin/quotes', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenEdit = (quote) => {
        setEditQuote(quote);
        editForm.setData({
            name: quote.name || '',
            company_name: quote.company_name || '',
            email: quote.email || '',
            phone: quote.phone || '',
            item_id: quote.item_id || '',
            estimated_budget: quote.estimated_budget || '',
            message: quote.message || '',
            notes: quote.notes || '',
            status: quote.status || 'new',
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editQuote) return;

        editForm.patch(`/admin/quotes/${editQuote.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditQuote(null);
            },
        });
    };

    const handleConvertToOrder = (quote) => {
        if (confirm(`Convert quotation for "${quote.name}" into an active Order & Client?`)) {
            router.post(`/admin/quotes/${quote.id}/convert`);
        }
    };

    const handleDelete = (quote) => {
        if (confirm(`Are you sure you want to delete quotation request from "${quote.name}"?`)) {
            router.delete(`/admin/quotes/${quote.id}`, { preserveScroll: true });
        }
    };

    const getWhatsAppUrl = (phone, name, service) => {
        if (!phone) return '#';
        let clean = phone.replace(/[^0-9+]/g, '');
        if (clean.startsWith('01')) clean = '880' + clean.substring(1);
        if (clean.startsWith('+')) clean = clean.replace('+', '');
        const msg = encodeURIComponent(`Hello ${name || 'Customer'},\n\nThank you for contacting IT SOLUTIONS regarding "${service || 'your software requirements'}". We are pleased to provide you with the quotation proposal.\n\nBest regards,\nIT SOLUTIONS`);
        return `https://wa.me/${clean}?text=${msg}`;
    };

    const filteredQuotes = quoteList.filter(q => {
        if (!search) return true;
        const query = search.toLowerCase();
        return (
            (q.name || '').toLowerCase().includes(query) ||
            (q.company_name || '').toLowerCase().includes(query) ||
            (q.email || '').toLowerCase().includes(query) ||
            (q.phone || '').toLowerCase().includes(query) ||
            (q.item?.name || '').toLowerCase().includes(query) ||
            (q.message || '').toLowerCase().includes(query) ||
            (q.notes || '').toLowerCase().includes(query)
        );
    });

    return (
        <AdminLayout title="Quotation">
            <div className="space-y-4 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Quotation
                    </h1>

                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Quotation</span>
                    </button>
                </div>

                {/* Search & Date Filter Bar */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
                    
                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, company, phone, email..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>

                    {/* Date Filter Range */}
                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] text-slate-500 font-medium">From:</span>
                            <input
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => handleDateFilter(e.target.value, filterEndDate)}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 font-mono focus:ring-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                            <span className="text-[11px] text-slate-500 font-medium">To:</span>
                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => handleDateFilter(filterStartDate, e.target.value)}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 font-mono focus:ring-0 cursor-pointer"
                            />
                        </div>

                        {(filterStartDate || filterEndDate) && (
                            <button
                                onClick={handleClearDateFilter}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Reset Date Filter"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[920px] text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono">
                                <tr>
                                    <th className="py-3 pl-5 pr-3 whitespace-nowrap">Date</th>
                                    <th className="py-3 px-3">Client</th>
                                    <th className="py-3 px-3 whitespace-nowrap">Contact</th>
                                    <th className="py-3 px-3">Service</th>
                                    <th className="py-3 px-3 whitespace-nowrap">Budget</th>
                                    <th className="py-3 px-3 whitespace-nowrap">Status</th>
                                    <th className="py-3 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredQuotes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-400">
                                            No quotation requests found. Click "Add Quotation" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuotes.map((q) => (
                                        <tr key={q.id} className="hover:bg-blue-50/40 transition-colors">
                                            
                                            {/* 1. Date */}
                                            <td className="py-3 pl-5 pr-3 whitespace-nowrap">
                                                <p className="font-mono text-slate-900 font-bold text-xs">
                                                    {new Date(q.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>

                                            {/* 2. Client & Company */}
                                            <td className="py-3 px-3">
                                                <p className="font-bold text-slate-900 text-xs">
                                                    {q.name}
                                                </p>
                                                {q.company_name && (
                                                    <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                                                        {q.company_name}
                                                    </p>
                                                )}
                                            </td>

                                            {/* 3. Contact (Separate Phone & Email) */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                {q.phone ? (
                                                    <p className="font-mono text-slate-800 font-medium text-xs">
                                                        {q.phone}
                                                    </p>
                                                ) : (
                                                    <p className="text-slate-400 text-xs">—</p>
                                                )}
                                                {q.email && (
                                                    <a href={`mailto:${q.email}`} className="text-[11px] text-blue-600 hover:underline block truncate max-w-[160px]">
                                                        {q.email}
                                                    </a>
                                                )}
                                            </td>

                                            {/* 4. Service */}
                                            <td className="py-3 px-3">
                                                <p className="font-bold text-slate-900 text-xs">
                                                    {q.item?.name || 'Custom Tech Solution'}
                                                </p>
                                                {q.message && (
                                                    <p className="text-[10px] text-slate-400 truncate max-w-[180px]" title={q.message}>
                                                        "{q.message}"
                                                    </p>
                                                )}
                                            </td>

                                            {/* 5. Budget */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                {q.estimated_budget ? (
                                                    <span className="font-mono font-bold text-emerald-600 text-xs">
                                                        ৳{parseFloat(q.estimated_budget).toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* 6. Status */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                    q.status === 'won' ? 'bg-emerald-50 text-emerald-700' :
                                                    q.status === 'contacted' ? 'bg-blue-50 text-blue-700' :
                                                    q.status === 'lost' ? 'bg-red-50 text-red-700' :
                                                    'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {q.status}
                                                </span>
                                            </td>

                                            {/* 7. Action Dropdown */}
                                            <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                                                <ActionDropdown label="Actions">
                                                    <div className="py-1">
                                                        <ActionItem onClick={() => setViewQuote(q)} icon={Eye} className="text-slate-700 hover:text-slate-900">
                                                            View Inquiry
                                                        </ActionItem>
                                                        <ActionItem onClick={() => handleConvertToOrder(q)} icon={Briefcase} className="text-blue-700 hover:text-blue-800 font-bold">
                                                            Convert to Order
                                                        </ActionItem>
                                                        <ActionItem onClick={() => handleOpenEdit(q)} icon={Edit} className="text-indigo-700 hover:text-indigo-800">
                                                            Edit Quote
                                                        </ActionItem>
                                                        {q.phone && (
                                                            <ActionItem 
                                                                onClick={() => window.open(getWhatsAppUrl(q.phone, q.name, q.item?.name), '_blank')} 
                                                                icon={Send} 
                                                                className="text-emerald-700 hover:text-emerald-800"
                                                            >
                                                                Send WhatsApp
                                                            </ActionItem>
                                                        )}
                                                    </div>

                                                    <div className="py-1 border-t border-slate-100">
                                                        <ActionItem onClick={() => handleDelete(q)} icon={Trash2} danger>
                                                            Delete
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

            {/* 1. ADD QUOTATION MODAL */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h2 className="font-bold text-base text-slate-900">
                            Add Quotation
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Customer / Lead Name *</label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Company / Organization</label>
                                <input
                                    type="text"
                                    value={createForm.data.company_name}
                                    onChange={(e) => createForm.setData('company_name', e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    placeholder="client@example.com"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                                <input
                                    type="text"
                                    value={createForm.data.phone}
                                    onChange={(e) => createForm.setData('phone', e.target.value)}
                                    placeholder="017XXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Service Offering</label>
                                <select
                                    value={createForm.data.item_id}
                                    onChange={(e) => createForm.setData('item_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    <option value="">-- Custom Solution --</option>
                                    {items.map(i => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Estimated Budget (৳ BDT)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={createForm.data.estimated_budget}
                                    onChange={(e) => createForm.setData('estimated_budget', e.target.value)}
                                    placeholder="e.g. 50000"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Requirement / Inquiry Message</label>
                            <textarea
                                rows="3"
                                value={createForm.data.message}
                                onChange={(e) => createForm.setData('message', e.target.value)}
                                placeholder="Describe project scope, deliverables, timeline..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    <option value="new">New Inquiry</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="won">Won (Deal Closed)</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Internal Notes</label>
                                <input
                                    type="text"
                                    value={createForm.data.notes}
                                    onChange={(e) => createForm.setData('notes', e.target.value)}
                                    placeholder="Follow up note..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                            >
                                Save Quotation
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 2. VIEW QUOTATION MODAL */}
            <Modal show={Boolean(viewQuote)} onClose={() => setViewQuote(null)} maxWidth="md">
                {viewQuote && (
                    <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-base text-slate-900">
                                    Quotation Inquiry
                                </h2>
                            </div>
                            <button
                                onClick={() => setViewQuote(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer / Company</span>
                                <p className="font-bold text-slate-900 text-sm">{viewQuote.name}</p>
                                {viewQuote.company_name && (
                                    <p className="text-slate-600 font-medium">{viewQuote.company_name}</p>
                                )}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Budget & Status</span>
                                <p className="font-bold font-mono text-emerald-600 text-sm">
                                    {viewQuote.estimated_budget ? `৳${parseFloat(viewQuote.estimated_budget).toLocaleString()}` : 'Not Specified'}
                                </p>
                                <span className="inline-block px-2 py-0.2 rounded-full text-[10px] font-bold capitalize bg-blue-50 text-blue-700">
                                    {viewQuote.status}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Information</span>
                                <div className="flex flex-wrap gap-4 pt-0.5">
                                    {viewQuote.phone && (
                                        <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{viewQuote.phone}</span>
                                        </div>
                                    )}
                                    {viewQuote.email && (
                                        <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                                            <a href={`mailto:${viewQuote.email}`} className="hover:underline">{viewQuote.email}</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Service Requested</span>
                                <p className="font-bold text-slate-900">{viewQuote.item?.name || 'Custom Tech Development'}</p>
                            </div>

                            {viewQuote.message && (
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Client Requirement</span>
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{viewQuote.message}</p>
                                </div>
                            )}

                            {viewQuote.notes && (
                                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1 col-span-2">
                                    <span className="text-[10px] font-bold text-amber-700 uppercase">Internal Notes</span>
                                    <p className="text-amber-900">{viewQuote.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleConvertToOrder(viewQuote)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>Convert to Order</span>
                                </button>

                                {viewQuote.phone && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(getWhatsAppUrl(viewQuote.phone, viewQuote.name, viewQuote.item?.name), '_blank')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 text-xs transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>WhatsApp</span>
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setViewQuote(null)}
                                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 3. EDIT QUOTATION MODAL */}
            <Modal show={Boolean(editQuote)} onClose={() => setEditQuote(null)} maxWidth="md">
                {editQuote && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="font-bold text-base text-slate-900">
                                Edit Quotation
                            </h2>
                            <button
                                type="button"
                                onClick={() => setEditQuote(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Customer / Lead Name *</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Company / Organization</label>
                                    <input
                                        type="text"
                                        value={editForm.data.company_name}
                                        onChange={(e) => editForm.setData('company_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Service Offering</label>
                                    <select
                                        value={editForm.data.item_id}
                                        onChange={(e) => editForm.setData('item_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    >
                                        <option value="">-- Custom Solution --</option>
                                        {items.map(i => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Estimated Budget (৳ BDT)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.estimated_budget}
                                        onChange={(e) => editForm.setData('estimated_budget', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Requirement / Inquiry Message</label>
                                <textarea
                                    rows="3"
                                    value={editForm.data.message}
                                    onChange={(e) => editForm.setData('message', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Status</label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    >
                                        <option value="new">New Inquiry</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="won">Won (Deal Closed)</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Internal Notes</label>
                                    <input
                                        type="text"
                                        value={editForm.data.notes}
                                        onChange={(e) => editForm.setData('notes', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditQuote(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                                >
                                    Update Quotation
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
