import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Building2, 
    Search,
    Upload,
    Link as LinkIcon,
    Image as ImageIcon,
    CheckCircle2,
    Phone,
    Mail,
    User,
    Star,
    Send,
    Copy,
    Check,
    ShoppingBag,
    CreditCard,
    DollarSign,
    Receipt,
    Wallet
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

// Brand logo presets
const PRESET_CLIENT_LOGOS = [
    { label: 'Corporate', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80' },
    { label: 'Retail', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
    { label: 'FinTech', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=300&auto=format&fit=crop&q=80' },
    { label: 'Logistics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80' },
];

const MULTI_PAY_METHODS = ['bKash', 'Nagad', 'Bank Transfer', 'Card', 'Cash'];

export default function Index({ clients, services = [], users = [] }) {
    const clientList = clients.data || clients;
    const [editingClient, setEditingClient] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [ordersModalClient, setOrdersModalClient] = useState(null);
    const [paymentsModalClient, setPaymentsModalClient] = useState(null);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

    const [search, setSearch] = useState('');
    const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'
    const [previewUrl, setPreviewUrl] = useState('');
    const [copiedPhoneId, setCopiedPhoneId] = useState(null);
    const fileInputRef = useRef(null);

    const defaultLogo = PRESET_CLIENT_LOGOS[0].url;

    // Client Add / Edit Form
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        logo: defaultLogo,
        logo_file: null,
        testimonial: '',
        rating: 5,
        status: 'active',
        sort_order: 0,
    });

    // Payment Form
    const paymentForm = useForm({
        amount: '',
        payment_method: 'bKash',
        transaction_id: '',
        notes: '',
        payment_date: new Date().toISOString().split('T')[0],
        order_id: '',
    });

    // Invoice Form
    const orderForm = useForm({
        item_id: services[0]?.id || '',
        amount: '',
        status: 'pending',
        payment_method: 'bKash',
    });

    const openCreateModal = () => {
        setEditingClient(null);
        reset();
        setPreviewUrl(defaultLogo);
        setPhotoMode('upload');
        setData({
            name: '',
            contact_person: '',
            phone: '',
            email: '',
            address: '',
            logo: defaultLogo,
            logo_file: null,
            testimonial: '',
            rating: 5,
            status: 'active',
            sort_order: 0,
        });
        setModalOpen(true);
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setPreviewUrl(client.logo || defaultLogo);
        setPhotoMode(client.logo?.startsWith('/storage/') ? 'upload' : 'url');
        setData({
            name: client.name || '',
            contact_person: client.contact_person || '',
            phone: client.phone || '',
            email: client.email || '',
            address: client.address || '',
            logo: client.logo || defaultLogo,
            logo_file: null,
            testimonial: client.testimonial || '',
            rating: client.rating || 5,
            status: client.status || 'active',
            sort_order: client.sort_order || 0,
        });
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo_file', file);
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
            logo: url,
            logo_file: null
        }));
        setPreviewUrl(url);
    };

    const handleCopyPhone = (phone, id) => {
        navigator.clipboard.writeText(phone);
        setCopiedPhoneId(id);
        setTimeout(() => setCopiedPhoneId(null), 2000);
    };

    const handleWhatsApp = (phone) => {
        let clean = (phone || '').replace(/[^0-9+]/g, '');
        if (clean.startsWith('01')) clean = '880' + clean.substring(1);
        if (clean.startsWith('+')) clean = clean.replace('+', '');
        window.open(`https://wa.me/${clean}`, '_blank');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingClient) {
            router.post(`/admin/clients/${editingClient.id}`, {
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
            post('/admin/clients', {
                forceFormData: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (client) => {
        if (confirm(`Delete "${client.name}"?`)) {
            router.delete(`/admin/clients/${client.id}`);
        }
    };

    // Financial Calculation
    const getFinancials = (client) => {
        const clientOrders = client.orders || [];
        const clientPayments = client.payments || [];

        const totalInvoiced = clientOrders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
        const totalPaidFromPayments = clientPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        
        const totalPaidOrders = clientOrders
            .filter(o => o.status === 'paid')
            .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

        const totalPaid = Math.max(totalPaidFromPayments, totalPaidOrders);
        const dueBalance = Math.max(0, totalInvoiced - totalPaid);

        return { totalInvoiced, totalPaid, dueBalance, ordersCount: clientOrders.length };
    };

    const openOrdersModal = (client) => {
        setOrdersModalClient(client);
        setIsCreateOrderOpen(false);
    };

    const openPaymentsModal = (client) => {
        const { dueBalance } = getFinancials(client);
        setPaymentsModalClient(client);
        paymentForm.setData({
            amount: dueBalance > 0 ? dueBalance : '',
            payment_method: 'bKash',
            transaction_id: '',
            notes: '',
            payment_date: new Date().toISOString().split('T')[0],
            order_id: client.orders?.find(o => o.status === 'pending')?.id || '',
        });
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!paymentsModalClient) return;

        paymentForm.post(`/admin/clients/${paymentsModalClient.id}/payments`, {
            preserveScroll: true,
            onSuccess: () => {
                paymentForm.reset();
                setPaymentsModalClient(null);
            },
        });
    };

    const handleCreateOrderSubmit = (e) => {
        e.preventDefault();
        if (!ordersModalClient) return;

        orderForm.post(`/admin/clients/${ordersModalClient.id}/orders`, {
            preserveScroll: true,
            onSuccess: () => {
                orderForm.reset();
                setIsCreateOrderOpen(false);
            },
        });
    };

    const filteredClients = clientList.filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (c.name || '').toLowerCase().includes(q) ||
            (c.contact_person || '').toLowerCase().includes(q) ||
            (c.phone || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Clients">
            <div className="space-y-5 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Clients
                    </h1>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Client</span>
                    </button>
                </div>

                {/* Search & Counter */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search clients..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>
                    <div className="text-xs text-slate-400 font-medium px-1">
                        {filteredClients.length} clients
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono whitespace-nowrap">
                                <tr>
                                    <th className="py-3 pl-5 pr-3">Client</th>
                                    <th className="py-3 px-3">Contact</th>
                                    <th className="py-3 px-3">Financials</th>
                                    <th className="py-3 px-3 text-center">Orders</th>
                                    <th className="py-3 px-3">Rating</th>
                                    <th className="py-3 px-3 text-center">Status</th>
                                    <th className="py-3 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-400">
                                            No clients found. Click "Add Client" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map((client) => {
                                        const { totalInvoiced, dueBalance, ordersCount } = getFinancials(client);

                                        return (
                                            <tr key={client.id} className="hover:bg-blue-50/40 transition-colors">
                                                
                                                {/* Client Name & Logo */}
                                                <td className="py-3 pl-5 pr-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                                                            {client.logo ? (
                                                                <img 
                                                                    src={client.logo} 
                                                                    alt="" 
                                                                    className="w-full h-full object-cover rounded" 
                                                                    onError={(e) => { e.currentTarget.src = defaultLogo; }}
                                                                />
                                                            ) : (
                                                                <Building2 className="w-4 h-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 pr-2">
                                                            <p className="font-bold text-slate-900 text-xs truncate">{client.name}</p>
                                                            <p className="text-[11px] text-slate-400 truncate">
                                                                {client.contact_person || 'Customer'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="py-3 px-3">
                                                    <div className="space-y-0.5">
                                                        {client.phone ? (
                                                            <div className="flex items-center gap-1 font-mono text-slate-800 text-[11px]">
                                                                <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                                                <span className="truncate">{client.phone}</span>
                                                                <button
                                                                    onClick={() => handleCopyPhone(client.phone, client.id)}
                                                                    className="text-slate-400 hover:text-slate-600 ml-0.5"
                                                                    title="Copy"
                                                                >
                                                                    {copiedPhoneId === client.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-[11px]">—</span>
                                                        )}
                                                        {client.email && (
                                                            <p className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                                                                <Mail className="w-3 h-3 flex-shrink-0" />
                                                                <span>{client.email}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Financials */}
                                                <td className="py-3 px-3 font-mono">
                                                    <div className="text-[11px]">
                                                        <span className="text-slate-800 font-semibold">৳{totalInvoiced.toLocaleString()}</span>
                                                        {dueBalance > 0 && (
                                                            <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded">
                                                                Due: ৳{dueBalance.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Orders */}
                                                <td className="py-3 px-3 text-center font-mono">
                                                    <button
                                                        onClick={() => openOrdersModal(client)}
                                                        className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                                                    >
                                                        {ordersCount}
                                                    </button>
                                                </td>

                                                {/* Rating */}
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-0.5 text-amber-500">
                                                        {[...Array(client.rating || 5)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-current" />
                                                        ))}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                        client.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        client.status === 'lead' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {client.status || 'Active'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openOrdersModal(client)} icon={ShoppingBag} className="text-blue-700 hover:text-blue-800">
                                                                View Orders
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openPaymentsModal(client)} icon={CreditCard} className="text-emerald-700 hover:text-emerald-800">
                                                                Payments
                                                            </ActionItem>
                                                        </div>
                                                        <div className="py-1">
                                                            {client.phone && (
                                                                <ActionItem onClick={() => handleWhatsApp(client.phone)} icon={Send} className="text-emerald-700 hover:text-emerald-800">
                                                                    WhatsApp
                                                                </ActionItem>
                                                            )}
                                                            <ActionItem onClick={() => openEditModal(client)} icon={Edit2}>
                                                                Edit
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleDelete(client)} icon={Trash2} danger>
                                                                Delete
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

            {/* 1. View Orders Popup */}
            <Modal show={Boolean(ordersModalClient)} onClose={() => setOrdersModalClient(null)} maxWidth="lg">
                {ordersModalClient && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-sm sm:text-base text-slate-900">
                                    Orders — {ordersModalClient.name}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setOrdersModalClient(null);
                                    setIsCreateOrderOpen(false);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Top Action */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">
                                {ordersModalClient.orders?.length || 0} Invoices
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsCreateOrderOpen(!isCreateOrderOpen)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-2xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isCreateOrderOpen ? 'Close' : 'Add Invoice'}</span>
                            </button>
                        </div>

                        {/* Quick Invoice Creation Form */}
                        {isCreateOrderOpen && (
                            <form onSubmit={handleCreateOrderSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Service *</label>
                                        <select
                                            value={orderForm.data.item_id}
                                            onChange={(e) => orderForm.setData('item_id', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                                            required
                                        >
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Amount (৳ BDT) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={orderForm.data.amount}
                                            onChange={(e) => orderForm.setData('amount', e.target.value)}
                                            placeholder="Amount"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Status</label>
                                        <select
                                            value={orderForm.data.status}
                                            onChange={(e) => orderForm.setData('status', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Method</label>
                                        <select
                                            value={orderForm.data.payment_method}
                                            onChange={(e) => orderForm.setData('payment_method', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                                        >
                                            {MULTI_PAY_METHODS.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOrderOpen(false)}
                                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={orderForm.processing}
                                        className="px-4 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs"
                                    >
                                        Save Invoice
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Invoices List Table */}
                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5">Invoice</th>
                                        <th className="p-2.5">Service</th>
                                        <th className="p-2.5">Amount</th>
                                        <th className="p-2.5">Status</th>
                                        <th className="p-2.5">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {!ordersModalClient.orders || ordersModalClient.orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-center text-slate-400">
                                                No orders found.
                                            </td>
                                        </tr>
                                    ) : (
                                        ordersModalClient.orders.map(o => (
                                            <tr key={o.id} className="hover:bg-slate-50/60">
                                                <td className="p-2.5 font-mono font-bold text-blue-600 text-[11px]">
                                                    {o.transaction_id || `ORD-#${o.id}`}
                                                </td>
                                                <td className="p-2.5 font-semibold text-slate-900">
                                                    {o.item?.name || 'Service'}
                                                </td>
                                                <td className="p-2.5 font-mono font-bold text-slate-900">
                                                    ৳{parseFloat(o.amount).toLocaleString()}
                                                </td>
                                                <td className="p-2.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                        o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="p-2.5 font-mono text-slate-400 text-[11px]">
                                                    {new Date(o.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 2. Payments Popup */}
            <Modal show={Boolean(paymentsModalClient)} onClose={() => setPaymentsModalClient(null)} maxWidth="lg">
                {paymentsModalClient && (() => {
                    const { totalInvoiced, totalPaid, dueBalance } = getFinancials(paymentsModalClient);

                    return (
                        <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                    <h2 className="font-bold text-sm sm:text-base text-slate-900">
                                        Payments — {paymentsModalClient.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setPaymentsModalClient(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Stat Summary */}
                            <div className="grid grid-cols-3 gap-2.5 text-center">
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Total</p>
                                    <p className="text-sm sm:text-base font-bold text-slate-900 font-mono">৳{totalInvoiced.toLocaleString()}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-[10px] text-emerald-700 uppercase font-mono font-semibold">Paid</p>
                                    <p className="text-sm sm:text-base font-bold text-emerald-700 font-mono">৳{totalPaid.toLocaleString()}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl border ${dueBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className={`text-[10px] uppercase font-mono font-semibold ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>Due</p>
                                    <p className={`text-sm sm:text-base font-bold font-mono ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>
                                        ৳{dueBalance.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Record Form */}
                            <form onSubmit={handlePaymentSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Amount (৳ BDT) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={paymentForm.data.amount}
                                            onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                            placeholder="Amount"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Date *</label>
                                        <input
                                            type="date"
                                            value={paymentForm.data.payment_date}
                                            onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Multi-Pay Method Pills */}
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                                        Payment Method *
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {MULTI_PAY_METHODS.map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => paymentForm.setData('payment_method', m)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                                    paymentForm.data.payment_method === m
                                                        ? 'bg-blue-600 text-white font-bold'
                                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Trx ID / Ref</label>
                                        <input
                                            type="text"
                                            value={paymentForm.data.transaction_id}
                                            onChange={(e) => paymentForm.setData('transaction_id', e.target.value)}
                                            placeholder="Optional"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-[11px]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Note</label>
                                        <input
                                            type="text"
                                            value={paymentForm.data.notes}
                                            onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                            placeholder="Optional"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        disabled={paymentForm.processing}
                                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            </form>

                            {/* Payment History */}
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono border-b border-slate-200">
                                        <tr>
                                            <th className="p-2.5">Date</th>
                                            <th className="p-2.5">Method</th>
                                            <th className="p-2.5">Amount</th>
                                            <th className="p-2.5">Trx ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {!paymentsModalClient.payments || paymentsModalClient.payments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-5 text-center text-slate-400">
                                                    No payments recorded.
                                                </td>
                                            </tr>
                                        ) : (
                                            paymentsModalClient.payments.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50/60">
                                                    <td className="p-2.5 font-mono text-slate-600">
                                                        {p.payment_date}
                                                    </td>
                                                    <td className="p-2.5 font-semibold text-slate-800">
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]">
                                                            {p.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold text-emerald-600">
                                                        ৳{parseFloat(p.amount).toLocaleString()}
                                                    </td>
                                                    <td className="p-2.5 font-mono text-slate-500 text-[11px]">
                                                        {p.transaction_id || '—'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    );
                })()}
            </Modal>

            {/* 3. Add / Edit Client Modal */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg">
                <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold text-base text-slate-900">
                                {editingClient ? 'Edit Client' : 'Add Client'}
                            </h2>
                        </div>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                        
                        {/* Company & Rep */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Company / Client Name"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                                <input
                                    type="text"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    placeholder="Representative Name"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Phone & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Phone number"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email address"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Address</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Office address or city"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-slate-700 font-bold">Logo</label>
                                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('upload')}
                                        className={`px-2 py-0.5 rounded-md font-semibold ${
                                            photoMode === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-600'
                                        }`}
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('url')}
                                        className={`px-2 py-0.5 rounded-md font-semibold ${
                                            photoMode === 'url' ? 'bg-blue-600 text-white' : 'text-slate-600'
                                        }`}
                                    >
                                        URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPhotoMode('presets')}
                                        className={`px-2 py-0.5 rounded-md font-semibold ${
                                            photoMode === 'presets' ? 'bg-blue-600 text-white' : 'text-slate-600'
                                        }`}
                                    >
                                        Presets
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
                                    <img 
                                        src={previewUrl || defaultLogo} 
                                        alt="" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = defaultLogo; }}
                                    />
                                </div>

                                <div className="flex-1">
                                    {photoMode === 'upload' && (
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-2 px-3 border border-dashed border-blue-300 rounded-xl bg-white text-center hover:bg-blue-50 text-blue-600 font-bold"
                                            >
                                                Choose Logo File
                                            </button>
                                        </div>
                                    )}

                                    {photoMode === 'url' && (
                                        <input
                                            type="url"
                                            value={data.logo}
                                            onChange={(e) => {
                                                setData('logo', e.target.value);
                                                setPreviewUrl(e.target.value);
                                            }}
                                            placeholder="https://..."
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-[11px]"
                                        />
                                    )}

                                    {photoMode === 'presets' && (
                                        <div className="grid grid-cols-2 gap-1">
                                            {PRESET_CLIENT_LOGOS.map((preset, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(preset.url)}
                                                    className="p-1 rounded border text-left text-[10px] truncate bg-white hover:bg-slate-50"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status & Rating */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    <option value="active">Active</option>
                                    <option value="lead">Lead</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Rating</label>
                                <select
                                    value={data.rating}
                                    onChange={(e) => setData('rating', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-amber-600"
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                </select>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Testimonial</label>
                            <textarea
                                rows={2}
                                value={data.testimonial}
                                onChange={(e) => setData('testimonial', e.target.value)}
                                placeholder="Customer review or feedback..."
                                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
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
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs active:scale-95 transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
