import React, { useState } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    RefreshCw, 
    Send, 
    Phone, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    X, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Copy, 
    Check, 
    Smartphone,
    Bell
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ reorders, stats, filters = {} }) {
    const reorderList = reorders.data || reorders;
    const [search, setSearch] = useState(filters.search || '');
    const [activeCycle, setActiveCycle] = useState(filters.cycle || 'all');
    const [activeStatus, setActiveStatus] = useState(filters.status || 'all');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [smsModalItem, setSmsModalItem] = useState(null);
    const [copiedPhoneId, setCopiedPhoneId] = useState(null);
    const [smsTemplateType, setSmsTemplateType] = useState('upcoming');
    const [customSmsMessage, setCustomSmsMessage] = useState('');

    const applyFilters = (newFilters) => {
        router.get('/admin/reorders', {
            search,
            cycle: activeCycle,
            status: activeStatus,
            ...newFilters
        }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    // Create Form
    const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        company_name: '',
        package_name: '',
        billing_cycle: 'monthly',
        price: '',
        currency: 'BDT',
        start_date: new Date().toISOString().split('T')[0],
        finish_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'active',
        notes: '',
    });

    // Edit Form
    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        company_name: '',
        package_name: '',
        billing_cycle: 'monthly',
        price: '',
        currency: 'BDT',
        start_date: '',
        finish_date: '',
        status: 'active',
        notes: '',
    });

    const openEditModal = (item) => {
        setEditingItem(item);
        setEditData({
            client_name: item.client_name || '',
            client_phone: item.client_phone || '',
            client_email: item.client_email || '',
            company_name: item.company_name || '',
            package_name: item.package_name || '',
            billing_cycle: item.billing_cycle || 'monthly',
            price: item.price || '',
            currency: item.currency || 'BDT',
            start_date: item.start_date || '',
            finish_date: item.finish_date || '',
            status: item.status || 'active',
            notes: item.notes || '',
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postCreate(route('admin.reorders.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        putEdit(route('admin.reorders.update', editingItem.id), {
            onSuccess: () => {
                setEditingItem(null);
                resetEdit();
            }
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete package for "${name}"?`)) {
            router.delete(route('admin.reorders.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleQuickRenew = (item) => {
        const cycle = item.billing_cycle === 'yearly' ? '1 Year' : '1 Month';
        if (confirm(`Extend subscription for ${item.client_name} by +${cycle}?`)) {
            router.put(route('admin.reorders.update', item.id), {
                action: 'renew_cycle'
            }, {
                preserveScroll: true
            });
        }
    };

    const formatWhatsAppUrl = (item) => {
        let phone = (item.client_phone || '').replace(/[^0-9+]/g, '');
        if (phone.startsWith('01')) phone = '880' + phone.substring(1);
        if (phone.startsWith('+')) phone = phone.replace('+', '');

        const days = item.days_remaining;
        let urgencyText = days < 0 
            ? `expired on ${item.finish_date}` 
            : (days === 0 ? `finishes TODAY (${item.finish_date})` : `finishes on ${item.finish_date} (in ${days} days)`);

        const message = `Dear ${item.client_name},\n\nThis is a renewal reminder from IT SOLUTIONS regarding your *${item.package_name}* (${item.billing_cycle} package).\n\nYour subscription ${urgencyText}.\nRenewal Amount: ৳${Number(item.price).toLocaleString()} BDT\n\nPlease let us know if you would like to renew.\n\nThank you,\n*IT SOLUTIONS*`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const handleSendWhatsApp = (item) => {
        const url = formatWhatsAppUrl(item);
        router.post(route('admin.reorders.reminder', item.id), { channel: 'whatsapp' }, {
            preserveScroll: true,
            onSuccess: () => window.open(url, '_blank')
        });
    };

    const openSmsModal = (item) => {
        setSmsModalItem(item);
        const type = item.days_remaining <= 0 ? 'expired' : (item.days_remaining <= 3 ? 'urgent' : 'upcoming');
        setSmsTemplateType(type);
        updateSmsText(item, type);
    };

    const updateSmsText = (item, type) => {
        const days = item.days_remaining;
        let msg = '';
        if (type === 'expired') {
            msg = `IT SOLUTIONS: Dear ${item.client_name}, your ${item.package_name} expired on ${item.finish_date}. Amount ৳${Number(item.price).toLocaleString()} BDT. Renew now to avoid service stop.`;
        } else if (type === 'urgent') {
            msg = `IT SOLUTIONS: Dear ${item.client_name}, your ${item.package_name} finishes on ${item.finish_date} (${days === 0 ? 'Today' : `in ${days} days`}). Renewal: ৳${Number(item.price).toLocaleString()} BDT.`;
        } else {
            msg = `IT SOLUTIONS: Reminder that your ${item.package_name} finishes on ${item.finish_date}. Renewal: ৳${Number(item.price).toLocaleString()} BDT. Thank you!`;
        }
        setCustomSmsMessage(msg);
    };

    const handleSendSms = (e) => {
        e.preventDefault();
        if (!smsModalItem) return;
        router.post(route('admin.reorders.reminder', smsModalItem.id), {
            channel: 'sms',
            message: customSmsMessage
        }, {
            preserveScroll: true,
            onSuccess: () => setSmsModalItem(null)
        });
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedPhoneId(id);
        setTimeout(() => setCopiedPhoneId(null), 2000);
    };

    const handleCycleSelectCreate = (cycle) => {
        const startDate = createData.start_date ? new Date(createData.start_date) : new Date();
        let finishDate = new Date(startDate);
        if (cycle === 'yearly') {
            finishDate.setFullYear(finishDate.getFullYear() + 1);
        } else {
            finishDate.setMonth(finishDate.getMonth() + 1);
        }
        setCreateData(prev => ({
            ...prev,
            billing_cycle: cycle,
            finish_date: finishDate.toISOString().split('T')[0]
        }));
    };

    return (
        <AdminLayout title="Reorder">
            <Head title="Reorder — Admin" />

            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Reorder
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 self-start sm:self-auto hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Package</span>
                    </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Active</span>
                        <p className="font-black text-2xl text-slate-900 mt-1">{stats.active}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs">
                        <span className="text-[11px] font-bold text-amber-700 uppercase">Expiring (≤7d)</span>
                        <p className="font-black text-2xl text-amber-600 mt-1">{stats.expiring_soon}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-xs">
                        <span className="text-[11px] font-bold text-red-700 uppercase">Expired</span>
                        <p className="font-black text-2xl text-red-600 mt-1">{stats.expired}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Total Packages</span>
                        <p className="font-black text-2xl text-blue-600 mt-1">{stats.total}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search client, package, phone..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                        {['all', 'monthly', 'yearly', 'expiring', 'expired'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    if (tab === 'all' || tab === 'monthly' || tab === 'yearly') {
                                        setActiveCycle(tab);
                                        applyFilters({ cycle: tab, status: activeStatus });
                                    } else {
                                        setActiveStatus(tab);
                                        applyFilters({ cycle: activeCycle, status: tab });
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                    (activeCycle === tab || activeStatus === tab)
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[850px] text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono border-b border-blue-100">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Client</th>
                                    <th className="py-3.5 px-3">Package</th>
                                    <th className="py-3.5 px-3">Cycle</th>
                                    <th className="py-3.5 px-3">Finish Date</th>
                                    <th className="py-3.5 px-3">Price</th>
                                    <th className="py-3.5 px-3">Status</th>
                                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {reorderList.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-400">
                                            No packages found.
                                        </td>
                                    </tr>
                                ) : (
                                    reorderList.map((item) => {
                                        const days = item.days_remaining;
                                        const isExpired = days < 0;
                                        const isExpiringSoon = days >= 0 && days <= 7;
                                        const isYearly = item.billing_cycle === 'yearly';

                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                                <td className="py-3.5 pl-5 pr-3">
                                                    <div className="font-bold text-slate-900">{item.client_name}</div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-[11px] text-slate-500 font-mono">{item.client_phone}</span>
                                                        <button 
                                                            onClick={() => copyToClipboard(item.client_phone, item.id)}
                                                            className="text-slate-400 hover:text-slate-600"
                                                            title="Copy phone"
                                                        >
                                                            {copiedPhoneId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3 font-semibold text-slate-800">
                                                    {item.package_name}
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                        isYearly ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                                                    }`}>
                                                        {item.billing_cycle}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3 font-mono">
                                                    <div className={`font-bold ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-slate-800'}`}>
                                                        {item.finish_date}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {isExpired ? `${Math.abs(days)}d overdue` : `${days}d left`}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                                                    ৳{Number(item.price).toLocaleString()}
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        isExpired ? 'bg-red-50 text-red-700 border border-red-200' : isExpiringSoon ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                        {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring' : 'Active'}
                                                    </span>
                                                </td>

                                                {/* Exact Actions Dropdown Button */}
                                                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => handleSendWhatsApp(item)} icon={Send} className="text-emerald-700 hover:text-emerald-800">
                                                                WhatsApp Reminder
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openSmsModal(item)} icon={Smartphone} className="text-blue-700 hover:text-blue-800">
                                                                SMS Reminder
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleQuickRenew(item)} icon={RefreshCw} className="text-amber-700 hover:text-amber-800">
                                                                {isYearly ? 'Renew (+1 Year)' : 'Renew (+1 Month)'}
                                                            </ActionItem>
                                                        </div>
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openEditModal(item)} icon={Edit2}>
                                                                Edit Package
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleDelete(item.id, item.client_name)} icon={Trash2} danger>
                                                                Delete Package
                                                            </ActionItem>
                                                        </div>
                                                    </ActionDropdown>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <div className="bg-white p-6 space-y-4 rounded-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h2 className="font-bold text-base text-slate-900">Add Package</h2>
                        <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={createData.client_name}
                                    onChange={(e) => setCreateData('client_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                                <input
                                    type="text"
                                    required
                                    value={createData.client_phone}
                                    onChange={(e) => setCreateData('client_phone', e.target.value)}
                                    placeholder="+8801..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Package Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={createData.package_name}
                                    onChange={(e) => setCreateData('package_name', e.target.value)}
                                    placeholder="e.g. ERP Cloud Hosting"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Price (৳ BDT) *</label>
                                <input
                                    type="number"
                                    required
                                    value={createData.price}
                                    onChange={(e) => setCreateData('price', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Cycle</label>
                                <select
                                    value={createData.billing_cycle}
                                    onChange={(e) => handleCycleSelectCreate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={createData.start_date}
                                    onChange={(e) => setCreateData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Finish Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={createData.finish_date}
                                    onChange={(e) => setCreateData('finish_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createProcessing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingItem} onClose={() => setEditingItem(null)} maxWidth="lg">
                <div className="bg-white p-6 space-y-4 rounded-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h2 className="font-bold text-base text-slate-900">Edit Package</h2>
                        <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.client_name}
                                    onChange={(e) => setEditData('client_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.client_phone}
                                    onChange={(e) => setEditData('client_phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Package Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.package_name}
                                    onChange={(e) => setEditData('package_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Price (৳ BDT) *</label>
                                <input
                                    type="number"
                                    required
                                    value={editData.price}
                                    onChange={(e) => setEditData('price', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Cycle</label>
                                <select
                                    value={editData.billing_cycle}
                                    onChange={(e) => setEditData('billing_cycle', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Finish Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={editData.finish_date}
                                    onChange={(e) => setEditData('finish_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editProcessing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* SMS Modal */}
            <Modal show={!!smsModalItem} onClose={() => setSmsModalItem(null)} maxWidth="md">
                {smsModalItem && (
                    <div className="bg-white p-6 space-y-4 rounded-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="font-bold text-base text-slate-900">Send SMS Reminder</h2>
                            <button onClick={() => setSmsModalItem(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendSms} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient</label>
                                <p className="text-xs font-bold text-slate-900">{smsModalItem.client_name} ({smsModalItem.client_phone})</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                                <textarea
                                    rows="4"
                                    value={customSmsMessage}
                                    onChange={(e) => setCustomSmsMessage(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setSmsModalItem(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                                >
                                    Send SMS
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
