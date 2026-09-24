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
    Wallet,
    Calendar,
    Filter,
    TrendingUp,
    TrendingDown,
    Printer,
    Eye,
    AlertCircle,
    ChevronDown,
    FileText,
    ArrowRight,
    BarChart3,
    Clock,
    Download
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

// Month names in Bengali for the report
const MONTH_NAMES = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

export default function Index({ clients, services = [], users = [], billingStats = {}, filters = {} }) {
    const clientList = clients.data || clients;
    const [editingClient, setEditingClient] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [ordersModalClient, setOrdersModalClient] = useState(null);
    const [paymentsModalClient, setPaymentsModalClient] = useState(null);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    const [search, setSearch] = useState('');
    const [clientFilter, setClientFilter] = useState('all'); // all | due | paid | active_sub
    const [showFilters, setShowFilters] = useState(false);
    const [photoMode, setPhotoMode] = useState('upload');
    const [previewUrl, setPreviewUrl] = useState('');
    const [copiedPhoneId, setCopiedPhoneId] = useState(null);
    const fileInputRef = useRef(null);

    // Report date filters
    const [reportMonth, setReportMonth] = useState(filters.report_month || '');
    const [reportFrom, setReportFrom] = useState(filters.report_from || '');
    const [reportTo, setReportTo] = useState(filters.report_to || '');

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

    // Invoice / Order Form — now with advance & discount
    const orderForm = useForm({
        item_id: services[0]?.id || '',
        amount: '',
        paid_amount: '',
        discount: '0',
        status: 'pending',
        payment_method: 'bKash',
        due_date: '',
        notes: '',
    });

    // ============== Report Filter Handlers ==============
    const handleReportMonthChange = (month) => {
        setReportMonth(month);
        setReportFrom('');
        setReportTo('');
        router.get('/admin/clients', { report_month: month }, { preserveState: true, preserveScroll: true });
    };

    const handleReportDateRange = () => {
        if (reportFrom && reportTo) {
            setReportMonth('');
            router.get('/admin/clients', { report_from: reportFrom, report_to: reportTo }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleClearReportFilter = () => {
        setReportMonth('');
        setReportFrom('');
        setReportTo('');
        router.get('/admin/clients', {}, { preserveState: true, preserveScroll: true });
    };

    // ============== Client CRUD Handlers ==============
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

    // ============== Financial Calculations ==============
    const getFinancials = (client) => {
        const clientOrders = client.orders || [];
        const clientPayments = client.payments || [];

        const totalInvoiced = clientOrders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
        const totalDiscount = clientOrders.reduce((sum, o) => sum + parseFloat(o.discount || 0), 0);
        const totalNet = totalInvoiced - totalDiscount;
        const totalPaid = clientOrders.reduce((sum, o) => sum + parseFloat(o.paid_amount || 0), 0);
        const dueBalance = Math.max(0, totalNet - totalPaid);

        return { totalInvoiced, totalDiscount, totalNet, totalPaid, dueBalance, ordersCount: clientOrders.length };
    };

    // ============== Orders Modal ==============
    const openOrdersModal = (client) => {
        setOrdersModalClient(client);
        setIsCreateOrderOpen(false);
        orderForm.setData({
            item_id: services[0]?.id || '',
            amount: '',
            paid_amount: '',
            discount: '0',
            status: 'pending',
            payment_method: 'bKash',
            due_date: '',
            notes: '',
        });
    };

    // ============== Payments Modal ==============
    const openPaymentsModal = (client) => {
        const { dueBalance } = getFinancials(client);
        setPaymentsModalClient(client);
        // Auto-select oldest due order
        const dueOrders = (client.orders || []).filter(o => o.payment_status !== 'paid');
        paymentForm.setData({
            amount: dueBalance > 0 ? dueBalance : '',
            payment_method: 'bKash',
            transaction_id: '',
            notes: '',
            payment_date: new Date().toISOString().split('T')[0],
            order_id: dueOrders[0]?.id || '',
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

    // Computed order due for invoice form
    const computedDue = () => {
        const amt = parseFloat(orderForm.data.amount) || 0;
        const disc = parseFloat(orderForm.data.discount) || 0;
        const paid = parseFloat(orderForm.data.paid_amount) || 0;
        return Math.max(0, amt - disc - paid);
    };

    // ============== Client Filters ==============
    const filteredClients = clientList.filter(c => {
        // Text search
        if (search) {
            const q = search.toLowerCase();
            const match = (
                (c.name || '').toLowerCase().includes(q) ||
                (c.contact_person || '').toLowerCase().includes(q) ||
                (c.phone || '').toLowerCase().includes(q) ||
                (c.email || '').toLowerCase().includes(q)
            );
            if (!match) return false;
        }

        // Financial filter
        if (clientFilter === 'due') {
            const { dueBalance } = getFinancials(c);
            return dueBalance > 0;
        }
        if (clientFilter === 'paid') {
            const { dueBalance, ordersCount } = getFinancials(c);
            return ordersCount > 0 && dueBalance === 0;
        }

        return true;
    });

    // Print invoice handler
    const handlePrintInvoice = () => {
        const printArea = document.getElementById('invoice-print-area');
        if (!printArea) return;
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', sans-serif; padding: 32px; color: #1e293b; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                    th { background: #f8fafc; font-size: 10px; text-transform: uppercase; color: #64748b; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #3b82f6; }
                    .logo-side h1 { font-size: 22px; color: #1e40af; font-weight: 900; }
                    .logo-side p { font-size: 11px; color: #64748b; margin-top: 4px; }
                    .inv-number { text-align: right; }
                    .inv-number h2 { font-size: 14px; color: #3b82f6; }
                    .inv-number p { font-size: 11px; color: #64748b; }
                    .section-title { font-size: 10px; text-transform: uppercase; color: #3b82f6; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
                    .detail-box p { font-size: 12px; margin-bottom: 3px; }
                    .detail-box strong { color: #1e293b; }
                    .summary-box { margin-top: 16px; text-align: right; }
                    .summary-box table { width: 280px; margin-left: auto; }
                    .summary-box td { padding: 4px 8px; font-size: 12px; }
                    .summary-box .total-row td { font-weight: 900; font-size: 14px; border-top: 2px solid #1e293b; }
                    .paid-row td { color: #16a34a; }
                    .due-row td { color: #dc2626; font-weight: 700; }
                    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
                    .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; }
                    .status-paid { background: #dcfce7; color: #16a34a; }
                    .status-partial { background: #fef3c7; color: #d97706; }
                    .status-due { background: #fee2e2; color: #dc2626; }
                    @media print { body { padding: 16px; } }
                </style>
            </head>
            <body>${printArea.innerHTML}</body>
            </html>
        `);
        win.document.close();
        setTimeout(() => { win.print(); }, 300);
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
            case 'partial':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Partial</span>;
            case 'due':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Due</span>;
            case 'refunded':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Refunded</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    return (
        <AdminLayout title="Clients & Billing">
            <div className="space-y-5 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Clients & Billing
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">ক্লায়েন্ট ডিরেক্টরি • ইনভয়েস • পেমেন্ট লেজার</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Client</span>
                    </button>
                </div>

                {/* ============== BILLING REPORT STATS ============== */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 border border-blue-100 shadow-xs space-y-4">
                    
                    {/* Report Filters Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold text-sm text-slate-900">
                                Billing Report
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                {billingStats.range_label || 'All Time'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Month Picker */}
                            <input
                                type="month"
                                value={reportMonth}
                                onChange={(e) => handleReportMonthChange(e.target.value)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                            />
                            <span className="text-[10px] text-slate-400 font-medium">or</span>
                            {/* Date Range */}
                            <input
                                type="date"
                                value={reportFrom}
                                onChange={(e) => setReportFrom(e.target.value)}
                                className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                                placeholder="From"
                            />
                            <span className="text-slate-400 text-xs">→</span>
                            <input
                                type="date"
                                value={reportTo}
                                onChange={(e) => setReportTo(e.target.value)}
                                className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                                placeholder="To"
                            />
                            <button
                                onClick={handleReportDateRange}
                                disabled={!reportFrom || !reportTo}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold disabled:opacity-40 hover:bg-blue-500 transition-colors"
                            >
                                <Filter className="w-3.5 h-3.5" />
                            </button>
                            {(reportMonth || reportFrom) && (
                                <button
                                    onClick={handleClearReportFilter}
                                    className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Total Invoiced / মোট বিক্রি */}
                        <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs">
                            <div className="flex items-center gap-1.5 mb-1">
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <p className="text-[10px] text-slate-500 uppercase font-mono font-semibold">মোট বিক্রি</p>
                            </div>
                            <p className="text-lg font-black text-slate-900 font-mono">
                                ৳{(billingStats.total_invoiced || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {billingStats.total_orders || 0} invoices
                                {billingStats.total_discount > 0 && ` • ৳${billingStats.total_discount.toLocaleString()} discount`}
                            </p>
                        </div>

                        {/* Total Collected / আদায় */}
                        <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <p className="text-[10px] text-emerald-700 uppercase font-mono font-semibold">আদায়</p>
                            </div>
                            <p className="text-lg font-black text-emerald-700 font-mono">
                                ৳{(billingStats.total_collected || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-emerald-600 mt-0.5">
                                {billingStats.paid_orders || 0} fully paid • {billingStats.partial_orders || 0} partial
                            </p>
                        </div>

                        {/* Total Due / বাকি */}
                        <div className={`p-3 rounded-xl bg-white border shadow-2xs ${(billingStats.total_due || 0) > 0 ? 'border-red-200' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                <p className="text-[10px] text-red-700 uppercase font-mono font-semibold">বাকি</p>
                            </div>
                            <p className={`text-lg font-black font-mono ${(billingStats.total_due || 0) > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                ৳{(billingStats.total_due || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-red-500 mt-0.5">
                                {billingStats.due_orders || 0} due orders • {billingStats.due_clients || 0} বাকি ক্লায়েন্ট
                            </p>
                        </div>

                        {/* Net Revenue */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500 shadow-xs text-white">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Wallet className="w-3.5 h-3.5 text-blue-200" />
                                <p className="text-[10px] text-blue-200 uppercase font-mono font-semibold">নিট রেভিনিউ</p>
                            </div>
                            <p className="text-lg font-black font-mono">
                                ৳{(billingStats.total_net || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-blue-200 mt-0.5">
                                After discount
                            </p>
                        </div>
                    </div>
                </div>

                {/* ============== SEARCH, FILTER & COUNTER ============== */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search clients..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                            { key: 'all', label: 'All', icon: null },
                            { key: 'due', label: '🔴 বাকি ক্লায়েন্ট', icon: null },
                            { key: 'paid', label: '🟢 Fully Paid', icon: null },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setClientFilter(f.key)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    clientFilter === f.key
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                        <span className="text-xs text-slate-400 font-medium px-1 ml-1">
                            {filteredClients.length} clients
                        </span>
                    </div>
                </div>

                {/* ============== CLIENTS TABLE ============== */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono whitespace-nowrap">
                                <tr>
                                    <th className="py-3 pl-5 pr-3">Client</th>
                                    <th className="py-3 px-3">Contact</th>
                                    <th className="py-3 px-3">মোট বিল</th>
                                    <th className="py-3 px-3">আদায়</th>
                                    <th className="py-3 px-3">বাকি</th>
                                    <th className="py-3 px-3 text-center">Orders</th>
                                    <th className="py-3 px-3">Rating</th>
                                    <th className="py-3 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-slate-400">
                                            No clients found. Click "Add Client" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map((client) => {
                                        const { totalInvoiced, totalNet, totalPaid, dueBalance, ordersCount } = getFinancials(client);

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

                                                {/* মোট বিল */}
                                                <td className="py-3 px-3 font-mono">
                                                    <span className="text-slate-800 font-bold text-[11px]">
                                                        ৳{totalNet.toLocaleString()}
                                                    </span>
                                                </td>

                                                {/* আদায় */}
                                                <td className="py-3 px-3 font-mono">
                                                    <span className="text-emerald-700 font-bold text-[11px]">
                                                        ৳{totalPaid.toLocaleString()}
                                                    </span>
                                                </td>

                                                {/* বাকি */}
                                                <td className="py-3 px-3 font-mono">
                                                    {dueBalance > 0 ? (
                                                        <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[11px]">
                                                            ৳{dueBalance.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 text-[11px]">৳0</span>
                                                    )}
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

                                                {/* Actions */}
                                                <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openOrdersModal(client)} icon={ShoppingBag} className="text-blue-700 hover:text-blue-800">
                                                                Invoices & Orders
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openPaymentsModal(client)} icon={CreditCard} className="text-emerald-700 hover:text-emerald-800">
                                                                {getFinancials(client).dueBalance > 0 ? 'Collect Due' : 'Payments'}
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

            {/* ============================================================ */}
            {/* 1. VIEW ORDERS / INVOICES MODAL                              */}
            {/* ============================================================ */}
            <Modal show={Boolean(ordersModalClient)} onClose={() => setOrdersModalClient(null)} maxWidth="2xl">
                {ordersModalClient && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-sm sm:text-base text-slate-900">
                                    Invoices — {ordersModalClient.name}
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

                        {/* Summary Mini-Stats */}
                        {(() => {
                            const { totalNet, totalPaid, dueBalance, ordersCount } = getFinancials(ordersModalClient);
                            return (
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">মোট</p>
                                        <p className="text-sm font-bold text-slate-900 font-mono">৳{totalNet.toLocaleString()}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                                        <p className="text-[10px] text-emerald-700 uppercase font-mono font-semibold">আদায়</p>
                                        <p className="text-sm font-bold text-emerald-700 font-mono">৳{totalPaid.toLocaleString()}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg border ${dueBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                        <p className={`text-[10px] uppercase font-mono font-semibold ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>বাকি</p>
                                        <p className={`text-sm font-bold font-mono ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>৳{dueBalance.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Top Actions */}
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
                                <span>{isCreateOrderOpen ? 'Close' : 'New Invoice'}</span>
                            </button>
                        </div>

                        {/* ===== CREATE INVOICE FORM (with Advance/Discount) ===== */}
                        {isCreateOrderOpen && (
                            <form onSubmit={handleCreateOrderSubmit} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-blue-200 space-y-3">
                                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                                    <Receipt className="w-3.5 h-3.5" />
                                    Create New Invoice
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                    {/* Service */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Service *</label>
                                        <select
                                            value={orderForm.data.item_id}
                                            onChange={(e) => {
                                                orderForm.setData('item_id', e.target.value);
                                                const item = services.find(s => s.id == e.target.value);
                                                if (item?.price) orderForm.setData('amount', item.price);
                                            }}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                                            required
                                        >
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} {s.price ? `(৳${parseFloat(s.price).toLocaleString()})` : ''}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Total Amount */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Total Amount (৳) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={orderForm.data.amount}
                                            onChange={(e) => orderForm.setData('amount', e.target.value)}
                                            placeholder="মোট বিল"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold"
                                            required
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Discount (৳)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={orderForm.data.discount}
                                            onChange={(e) => orderForm.setData('discount', e.target.value)}
                                            placeholder="ডিসকাউন্ট"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                                        />
                                    </div>

                                    {/* Advance Paid */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Advance Paid (৳)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={orderForm.data.paid_amount}
                                            onChange={(e) => orderForm.setData('paid_amount', e.target.value)}
                                            placeholder="অগ্রিম পেমেন্ট"
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-mono font-bold focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Live Due Calculator */}
                                {(orderForm.data.amount || orderForm.data.paid_amount) && (
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono">
                                        <span className="text-slate-500">মোট: ৳{(parseFloat(orderForm.data.amount) || 0).toLocaleString()}</span>
                                        {parseFloat(orderForm.data.discount) > 0 && (
                                            <span className="text-orange-600">- ৳{parseFloat(orderForm.data.discount).toLocaleString()} disc</span>
                                        )}
                                        {parseFloat(orderForm.data.paid_amount) > 0 && (
                                            <span className="text-emerald-600">- ৳{(parseFloat(orderForm.data.paid_amount) || 0).toLocaleString()} paid</span>
                                        )}
                                        <span className="ml-auto font-bold text-red-600">
                                            বাকি: ৳{computedDue().toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                                    {/* Payment Method */}
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

                                    {/* Status */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Status</label>
                                        <select
                                            value={orderForm.data.status}
                                            onChange={(e) => orderForm.setData('status', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={orderForm.data.due_date}
                                            onChange={(e) => orderForm.setData('due_date', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1 text-xs">Notes</label>
                                    <input
                                        type="text"
                                        value={orderForm.data.notes}
                                        onChange={(e) => orderForm.setData('notes', e.target.value)}
                                        placeholder="Optional note..."
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs"
                                    />
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
                                        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs hover:bg-blue-500 transition-all"
                                    >
                                        Save Invoice
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ===== INVOICES LIST TABLE ===== */}
                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5">Invoice</th>
                                        <th className="p-2.5">Service</th>
                                        <th className="p-2.5">মোট</th>
                                        <th className="p-2.5">আদায়</th>
                                        <th className="p-2.5">বাকি</th>
                                        <th className="p-2.5">Status</th>
                                        <th className="p-2.5">Date</th>
                                        <th className="p-2.5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {!ordersModalClient.orders || ordersModalClient.orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="p-6 text-center text-slate-400">
                                                No orders found. Click "New Invoice" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        ordersModalClient.orders.map(o => {
                                            const oNet = parseFloat(o.amount || 0) - parseFloat(o.discount || 0);
                                            const oPaid = parseFloat(o.paid_amount || 0);
                                            const oDue = Math.max(0, oNet - oPaid);
                                            return (
                                                <tr key={o.id} className="hover:bg-slate-50/60">
                                                    <td className="p-2.5 font-mono font-bold text-blue-600 text-[11px]">
                                                        {o.transaction_id || `ORD-#${o.id}`}
                                                    </td>
                                                    <td className="p-2.5 font-semibold text-slate-900 text-[11px]">
                                                        {o.item?.name || o.project_name || 'Service'}
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold text-slate-900 text-[11px]">
                                                        ৳{oNet.toLocaleString()}
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold text-emerald-600 text-[11px]">
                                                        ৳{oPaid.toLocaleString()}
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold text-[11px]">
                                                        {oDue > 0 ? (
                                                            <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">৳{oDue.toLocaleString()}</span>
                                                        ) : (
                                                            <span className="text-slate-300">৳0</span>
                                                        )}
                                                    </td>
                                                    <td className="p-2.5">
                                                        {getPaymentStatusBadge(o.payment_status || (oPaid >= oNet ? 'paid' : oPaid > 0 ? 'partial' : 'due'))}
                                                    </td>
                                                    <td className="p-2.5 font-mono text-slate-400 text-[11px]">
                                                        {new Date(o.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-2.5">
                                                        <button
                                                            onClick={() => setInvoiceOrder(o)}
                                                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="View Invoice"
                                                        >
                                                            <Printer className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ============================================================ */}
            {/* 2. PAYMENTS / COLLECT DUE MODAL                              */}
            {/* ============================================================ */}
            <Modal show={Boolean(paymentsModalClient)} onClose={() => setPaymentsModalClient(null)} maxWidth="lg">
                {paymentsModalClient && (() => {
                    const { totalNet, totalPaid, dueBalance } = getFinancials(paymentsModalClient);
                    const dueOrders = (paymentsModalClient.orders || []).filter(o => {
                        const oNet = parseFloat(o.amount || 0) - parseFloat(o.discount || 0);
                        const oPaid = parseFloat(o.paid_amount || 0);
                        return oNet > oPaid;
                    });

                    return (
                        <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                    <h2 className="font-bold text-sm sm:text-base text-slate-900">
                                        {dueBalance > 0 ? 'Collect Due' : 'Payments'} — {paymentsModalClient.name}
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
                                    <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">মোট</p>
                                    <p className="text-sm sm:text-base font-bold text-slate-900 font-mono">৳{totalNet.toLocaleString()}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-[10px] text-emerald-700 uppercase font-mono font-semibold">আদায়</p>
                                    <p className="text-sm sm:text-base font-bold text-emerald-700 font-mono">৳{totalPaid.toLocaleString()}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl border ${dueBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className={`text-[10px] uppercase font-mono font-semibold ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>বাকি</p>
                                    <p className={`text-sm sm:text-base font-bold font-mono ${dueBalance > 0 ? 'text-red-700' : 'text-blue-700'}`}>
                                        ৳{dueBalance.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Record Form */}
                            <form onSubmit={handlePaymentSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                                    <Wallet className="w-3.5 h-3.5" />
                                    Record Payment / কিস্তি জমা
                                </h3>
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

                                {/* Link to specific order */}
                                {dueOrders.length > 0 && (
                                    <div className="text-xs">
                                        <label className="block text-slate-700 font-bold mb-1">Against Invoice (Optional)</label>
                                        <select
                                            value={paymentForm.data.order_id}
                                            onChange={(e) => paymentForm.setData('order_id', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-[11px]"
                                        >
                                            <option value="">Auto-distribute to oldest due</option>
                                            {dueOrders.map(o => {
                                                const oNet = parseFloat(o.amount || 0) - parseFloat(o.discount || 0);
                                                const oDue = Math.max(0, oNet - parseFloat(o.paid_amount || 0));
                                                return (
                                                    <option key={o.id} value={o.id}>
                                                        {o.transaction_id || `#${o.id}`} — {o.item?.name || 'Service'} — Due: ৳{oDue.toLocaleString()}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

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
                                            <th className="p-2.5">Invoice</th>
                                            <th className="p-2.5">Trx ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {!paymentsModalClient.payments || paymentsModalClient.payments.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-5 text-center text-slate-400">
                                                    No payments recorded.
                                                </td>
                                            </tr>
                                        ) : (
                                            paymentsModalClient.payments.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50/60">
                                                    <td className="p-2.5 font-mono text-slate-600 text-[11px]">
                                                        {p.payment_date}
                                                    </td>
                                                    <td className="p-2.5">
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                                                            {p.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold text-emerald-600">
                                                        ৳{parseFloat(p.amount).toLocaleString()}
                                                    </td>
                                                    <td className="p-2.5 font-mono text-slate-500 text-[10px]">
                                                        {p.order_id ? `#${p.order_id}` : '—'}
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

            {/* ============================================================ */}
            {/* 3. PRINTABLE INVOICE MODAL                                   */}
            {/* ============================================================ */}
            <Modal show={Boolean(invoiceOrder)} onClose={() => setInvoiceOrder(null)} maxWidth="2xl">
                {invoiceOrder && (() => {
                    const oNet = parseFloat(invoiceOrder.amount || 0) - parseFloat(invoiceOrder.discount || 0);
                    const oPaid = parseFloat(invoiceOrder.paid_amount || 0);
                    const oDue = Math.max(0, oNet - oPaid);
                    const client = ordersModalClient || {};
                    const pStatus = invoiceOrder.payment_status || (oPaid >= oNet ? 'paid' : oPaid > 0 ? 'partial' : 'due');

                    return (
                        <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Invoice Preview
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        Print
                                    </button>
                                    <button
                                        onClick={() => setInvoiceOrder(null)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Print Area */}
                            <div id="invoice-print-area" className="p-6 rounded-xl border border-slate-200 bg-white space-y-6">
                                {/* Invoice Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div className="logo-side">
                                        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#1e40af', margin: 0 }}>IT SOLUTION BD</h1>
                                        <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Premium Software & IT Services</p>
                                        <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>📞 +880 1770-820880 • ✉ info@itsolution.com.bd</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#3b82f6', margin: 0 }}>INVOICE</h2>
                                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>{invoiceOrder.transaction_id || `INV-${invoiceOrder.id}`}</p>
                                        <p style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(invoiceOrder.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <span className={`status-badge ${pStatus === 'paid' ? 'status-paid' : pStatus === 'partial' ? 'status-partial' : 'status-due'}`} style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, marginTop: '4px', background: pStatus === 'paid' ? '#dcfce7' : pStatus === 'partial' ? '#fef3c7' : '#fee2e2', color: pStatus === 'paid' ? '#16a34a' : pStatus === 'partial' ? '#d97706' : '#dc2626' }}>
                                            {pStatus === 'paid' ? 'PAID' : pStatus === 'partial' ? 'PARTIAL' : 'DUE'}
                                        </span>
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '2px solid #3b82f6' }} />

                                {/* Bill To */}
                                <div>
                                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#3b82f6', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>Bill To</p>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{client.name || 'Client'}</p>
                                    {client.contact_person && <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>Attn: {client.contact_person}</p>}
                                    {client.phone && <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>📱 {client.phone}</p>}
                                    {client.email && <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>✉ {client.email}</p>}
                                </div>

                                {/* Items Table */}
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '10px', textTransform: 'uppercase', color: '#64748b' }}>Description</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '10px', textTransform: 'uppercase', color: '#64748b' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>
                                                {invoiceOrder.item?.name || invoiceOrder.project_name || 'Service'}
                                                {invoiceOrder.notes && <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: 400, marginTop: '2px' }}>{invoiceOrder.notes}</span>}
                                            </td>
                                            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: '12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                                                ৳{parseFloat(invoiceOrder.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Summary */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <table style={{ width: '260px', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '4px 8px', fontSize: '11px', color: '#64748b' }}>Subtotal</td>
                                                <td style={{ padding: '4px 8px', fontSize: '11px', textAlign: 'right', fontFamily: 'monospace' }}>৳{parseFloat(invoiceOrder.amount).toLocaleString()}</td>
                                            </tr>
                                            {parseFloat(invoiceOrder.discount) > 0 && (
                                                <tr>
                                                    <td style={{ padding: '4px 8px', fontSize: '11px', color: '#d97706' }}>Discount</td>
                                                    <td style={{ padding: '4px 8px', fontSize: '11px', textAlign: 'right', fontFamily: 'monospace', color: '#d97706' }}>-৳{parseFloat(invoiceOrder.discount).toLocaleString()}</td>
                                                </tr>
                                            )}
                                            <tr style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 700 }}>Net Amount</td>
                                                <td style={{ padding: '4px 8px', fontSize: '12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>৳{oNet.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '4px 8px', fontSize: '11px', color: '#16a34a' }}>Paid</td>
                                                <td style={{ padding: '4px 8px', fontSize: '11px', textAlign: 'right', fontFamily: 'monospace', color: '#16a34a', fontWeight: 700 }}>৳{oPaid.toLocaleString()}</td>
                                            </tr>
                                            <tr style={{ borderTop: '2px solid #1e293b' }}>
                                                <td style={{ padding: '6px 8px', fontSize: '14px', fontWeight: 900, color: oDue > 0 ? '#dc2626' : '#16a34a' }}>
                                                    {oDue > 0 ? 'Balance Due' : 'Fully Paid'}
                                                </td>
                                                <td style={{ padding: '6px 8px', fontSize: '14px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 900, color: oDue > 0 ? '#dc2626' : '#16a34a' }}>
                                                    ৳{oDue.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Due Date */}
                                {invoiceOrder.due_date && oDue > 0 && (
                                    <p style={{ fontSize: '10px', color: '#dc2626', textAlign: 'right' }}>
                                        ⏰ Payment Due by: {new Date(invoiceOrder.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                )}

                                {/* Footer */}
                                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                    <p>Thank you for your business! • IT Solution BD</p>
                                    <p>🌐 itsolution.com.bd</p>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </Modal>

            {/* ============================================================ */}
            {/* 4. ADD / EDIT CLIENT MODAL (unchanged)                       */}
            {/* ============================================================ */}
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
