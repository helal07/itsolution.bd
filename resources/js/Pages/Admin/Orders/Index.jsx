import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Plus, 
    X, 
    Search, 
    CreditCard,
    Sliders,
    Eye,
    Receipt,
    Ban,
    UserCheck,
    Calendar,
    RotateCcw,
    Printer,
    Download,
    Send,
    Copy,
    Check
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

const PAYMENT_METHODS = ['bKash', 'Nagad', 'Bank Transfer', 'Card', 'Cash'];

export default function Index({ orders, clients = [], users = [], items = [], startDate = '', endDate = '' }) {
    const orderList = orders.data || orders;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editProgressOrder, setEditProgressOrder] = useState(null);
    const [paymentModalOrder, setPaymentModalOrder] = useState(null);
    const [viewModalOrder, setViewModalOrder] = useState(null);
    const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
    const [search, setSearch] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(startDate);
    const [filterEndDate, setFilterEndDate] = useState(endDate);
    const [copiedInvoice, setCopiedInvoice] = useState(false);

    const handleDateFilter = (start, end) => {
        setFilterStartDate(start);
        setFilterEndDate(end);
        const query = {};
        if (start) query.start_date = start;
        if (end) query.end_date = end;
        router.get('/admin/orders', query, { preserveState: true });
    };

    const handleClearDateFilter = () => {
        setFilterStartDate('');
        setFilterEndDate('');
        router.get('/admin/orders', {}, { preserveState: true });
    };

    const handleCancelOrder = (order) => {
        if (confirm(`Are you sure you want to cancel the order for "${order.client?.name || order.project_name || 'Client'}"?`)) {
            router.patch(`/admin/orders/${order.id}`, { status: 'cancelled' }, { preserveScroll: true });
        }
    };

    const generateInvoiceRef = () => 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Order Form
    const { data: createData, setData: setCreateData, post: postCreateOrder, processing: createProcessing, reset: resetCreate } = useForm({
        client_id: clients[0]?.id || '',
        item_id: items[0]?.id || '',
        project_name: '',
        amount: '',
        status: 'pending',
        progress: 0,
        payment_method: 'bKash',
        transaction_id: generateInvoiceRef(),
        delivery_date: '',
    });

    // 2. Edit Progress Form (ONLY PROGRESS EDIT)
    const progressForm = useForm({
        progress: 0,
    });

    // 3. Payment Update Form
    const paymentForm = useForm({
        status: 'paid',
        payment_method: 'bKash',
        amount: '',
    });

    const openCreateModal = () => {
        resetCreate();
        setCreateData({
            client_id: clients[0]?.id || '',
            item_id: items[0]?.id || '',
            project_name: '',
            amount: '',
            status: 'pending',
            progress: 0,
            payment_method: 'bKash',
            transaction_id: generateInvoiceRef(),
            delivery_date: '',
        });
        setIsCreateModalOpen(true);
    };

    const openEditProgressModal = (order) => {
        setEditProgressOrder(order);
        progressForm.setData({
            progress: order.progress ?? 0,
        });
    };

    const openPaymentModal = (order) => {
        setPaymentModalOrder(order);
        paymentForm.setData({
            status: order.status === 'paid' ? 'paid' : 'paid',
            payment_method: order.payment_method || 'bKash',
            amount: order.amount || '',
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postCreateOrder('/admin/orders', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            }
        });
    };

    const handleProgressSubmit = (e) => {
        e.preventDefault();
        if (!editProgressOrder) return;

        progressForm.patch(`/admin/orders/${editProgressOrder.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditProgressOrder(null);
            }
        });
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!paymentModalOrder) return;

        paymentForm.patch(`/admin/orders/${paymentModalOrder.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setPaymentModalOrder(null);
            }
        });
    };

    // Dedicated Fail-Safe Print & Save Function
    const handlePrintInvoice = (order) => {
        if (!order) return;
        const printWindow = window.open('', '_blank', 'width=900,height=1000');
        if (!printWindow) {
            alert('Please allow popups to print or save the invoice.');
            return;
        }

        const clientName = order.client?.name || order.user?.name || 'Valued Customer';
        const clientContact = order.client?.contact_person || '';
        const clientPhone = order.client?.phone || order.user?.phone || '—';
        const projectName = order.project_name || order.item?.name || 'Software Development';
        const serviceName = order.item?.name || 'Custom Tech Solution';
        const amount = parseFloat(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 });
        const invoiceId = order.transaction_id || `INV-${order.id.toString().padStart(6, '0')}`;
        const date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const isPaid = order.status === 'paid';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Invoice_${invoiceId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        background: #ffffff;
                        color: #0f172a;
                        padding: 40px 48px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 24px;
                        margin-bottom: 24px;
                    }
                    .brand-title {
                        font-size: 24px;
                        font-weight: 900;
                        color: #1e40af;
                        letter-spacing: -0.5px;
                    }
                    .brand-sub {
                        font-size: 12px;
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .brand-info {
                        font-size: 11px;
                        color: #94a3b8;
                        font-family: 'JetBrains Mono', monospace;
                        margin-top: 8px;
                        line-height: 1.5;
                    }
                    .invoice-tag-box {
                        text-align: right;
                    }
                    .badge-stamp {
                        display: inline-block;
                        padding: 6px 14px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                        border: 1px solid ${isPaid ? '#10b981' : '#f59e0b'};
                        background: ${isPaid ? '#ecfdf5' : '#fffbeb'};
                        color: ${isPaid ? '#047857' : '#b45309'};
                    }
                    .invoice-title {
                        font-size: 26px;
                        font-weight: 900;
                        color: #0f172a;
                        letter-spacing: -0.5px;
                    }
                    .invoice-num {
                        font-family: 'JetBrains Mono', monospace;
                        font-weight: 700;
                        font-size: 13px;
                        color: #2563eb;
                        margin-top: 2px;
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 24px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 18px 20px;
                        margin-bottom: 28px;
                        font-size: 12px;
                    }
                    .meta-label {
                        font-size: 10px;
                        font-weight: 800;
                        text-transform: uppercase;
                        color: #94a3b8;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    }
                    .client-name {
                        font-size: 14px;
                        font-weight: 800;
                        color: #0f172a;
                    }
                    .client-meta {
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .meta-row {
                        margin-bottom: 4px;
                        color: #475569;
                    }
                    .meta-row strong {
                        color: #0f172a;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 24px;
                        font-size: 12px;
                    }
                    th {
                        background: #f1f5f9;
                        border-top: 1px solid #cbd5e1;
                        border-bottom: 2px solid #cbd5e1;
                        padding: 12px 14px;
                        font-weight: 800;
                        text-transform: uppercase;
                        font-size: 10px;
                        color: #475569;
                        letter-spacing: 0.5px;
                    }
                    td {
                        padding: 16px 14px;
                        border-bottom: 1px solid #f1f5f9;
                        vertical-align: top;
                    }
                    .item-title {
                        font-size: 13px;
                        font-weight: 800;
                        color: #0f172a;
                    }
                    .item-desc {
                        font-size: 11px;
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .totals-container {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 36px;
                    }
                    .totals-box {
                        width: 280px;
                        font-size: 12px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 6px 0;
                        color: #475569;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .grand-total {
                        display: flex;
                        justify-content: space-between;
                        padding: 14px 16px;
                        background: #eff6ff;
                        border: 1px solid #bfdbfe;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 900;
                        color: #1e40af;
                        margin-top: 10px;
                    }
                    .footer {
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 24px;
                        font-size: 11px;
                        color: #94a3b8;
                        line-height: 1.6;
                    }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 15mm; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div>
                            <div class="brand-title">IT SOLUTIONS</div>
                            <div class="brand-sub">Enterprise Software & Digital Engineering</div>
                            <div class="brand-info">
                                Dhaka, Bangladesh &bull; Hotline: +880 1800-000000<br/>
                                support@itsolutions.com &bull; www.itsolutions.com
                            </div>
                        </div>
                        <div class="invoice-tag-box">
                            <div class="badge-stamp">${isPaid ? '✓ PAID & SETTLED' : '⏳ PENDING INVOICE'}</div>
                            <div class="invoice-title">INVOICE</div>
                            <div class="invoice-num">#${invoiceId}</div>
                        </div>
                    </div>

                    <div class="grid-2">
                        <div>
                            <div class="meta-label">Billed To</div>
                            <div class="client-name">${clientName}</div>
                            ${clientContact ? `<div class="client-meta">${clientContact}</div>` : ''}
                            <div class="client-meta" style="font-family: 'JetBrains Mono', monospace;">${clientPhone}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="meta-label">Invoice Details</div>
                            <div class="meta-row">Issue Date: <strong>${date}</strong></div>
                            <div class="meta-row">Payment Method: <strong>${order.payment_method || 'Online'}</strong></div>
                            <div class="meta-row">Added By: <strong>${order.added_by || 'Admin'}</strong></div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px; text-align: center;">#</th>
                                <th>Project / Service Deliverable</th>
                                <th style="width: 60px; text-align: center;">Qty</th>
                                <th style="width: 130px; text-align: right;">Price</th>
                                <th style="width: 140px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: center; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">01</td>
                                <td>
                                    <div class="item-title">${projectName}</div>
                                    <div class="item-desc">${serviceName} &bull; Custom Tech Deliverable</div>
                                </td>
                                <td style="text-align: center; font-weight: 700; font-family: 'JetBrains Mono', monospace;">1</td>
                                <td style="text-align: right; font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${amount}</td>
                                <td style="text-align: right; font-weight: 800; font-family: 'JetBrains Mono', monospace;">৳${amount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="totals-container">
                        <div class="totals-box">
                            <div class="totals-row">
                                <span>Subtotal:</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${amount} BDT</span>
                            </div>
                            <div class="totals-row">
                                <span>VAT / Tax (0%):</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳0.00 BDT</span>
                            </div>
                            <div class="grand-total">
                                <span>Grand Total:</span>
                                <span style="font-family: 'JetBrains Mono', monospace;">৳${amount} BDT</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing <strong>IT SOLUTIONS</strong>. For any inquiries, contact support@itsolutions.com.</p>
                        <p style="margin-top: 4px; font-size: 10px; color: #cbd5e1;">Generated electronically &bull; Valid without signature</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 350);
    };

    const handleCopyInvoiceSummary = (order) => {
        if (!order) return;
        const text = `Invoice Reference: ${order.transaction_id || order.id}\nClient: ${order.client?.name || order.user?.name}\nProject: ${order.project_name || order.item?.name}\nTotal: ৳${parseFloat(order.amount).toLocaleString()} BDT\nStatus: ${order.status.toUpperCase()}`;
        navigator.clipboard.writeText(text);
        setCopiedInvoice(true);
        setTimeout(() => setCopiedInvoice(false), 2000);
    };

    const filteredOrders = orderList.filter(o => {
        if (!search) return true;
        const q = search.toLowerCase();
        const clientName = o.client?.name || o.user?.name || '';
        const clientPhone = o.client?.phone || o.user?.phone || '';
        const projectName = o.project_name || '';
        const addedBy = o.added_by || '';
        return (
            clientName.toLowerCase().includes(q) ||
            clientPhone.toLowerCase().includes(q) ||
            projectName.toLowerCase().includes(q) ||
            addedBy.toLowerCase().includes(q) ||
            (o.item?.name || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Orders">
            <div className="space-y-4 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Orders
                    </h1>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Order</span>
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
                            placeholder="Search client, project, phone, added by..."
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
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                                    <th className="py-3 px-3">Project</th>
                                    <th className="py-3 px-3 whitespace-nowrap">Amount</th>
                                    <th className="py-3 px-3 w-36">Status & Progress</th>
                                    <th className="py-3 px-3 whitespace-nowrap">Added By</th>
                                    <th className="py-3 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-slate-400">
                                            No orders found for the selected date range. Click "Add Order" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((o) => {
                                        const customerName = o.client?.name || o.user?.name || 'Customer';
                                        const customerPhone = o.client?.phone || o.user?.phone || '';
                                        const progress = o.progress ?? (o.status === 'completed' ? 100 : o.status === 'processing' ? 50 : o.status === 'paid' ? 25 : 0);

                                        return (
                                            <tr key={o.id} className="hover:bg-blue-50/40 transition-colors">
                                                
                                                {/* 1. Date */}
                                                <td className="py-3 pl-5 pr-3 whitespace-nowrap">
                                                    <p className="font-mono text-slate-900 font-bold text-xs">
                                                        {new Date(o.created_at).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>

                                                {/* 2. Client */}
                                                <td className="py-3 px-3">
                                                    <p className="font-bold text-slate-900 text-xs">
                                                        {customerName}
                                                    </p>
                                                </td>

                                                {/* 3. Contact */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    {customerPhone ? (
                                                        <span className="font-mono text-slate-700 font-medium text-xs">
                                                            {customerPhone}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">—</span>
                                                    )}
                                                </td>

                                                {/* 4. Project */}
                                                <td className="py-3 px-3">
                                                    <p className="font-bold text-slate-900 text-xs">
                                                        {o.project_name || o.item?.name || 'Project'}
                                                    </p>
                                                    {o.item?.name && (
                                                        <p className="text-[10px] text-slate-400">
                                                            {o.item.name}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* 5. Amount */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    <p className="font-mono font-bold text-emerald-600 text-xs">
                                                        ৳{parseFloat(o.amount).toLocaleString()}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400">
                                                        {o.payment_method || 'Online'}
                                                    </span>
                                                </td>

                                                {/* 6. Status & Progress */}
                                                <td className="py-3 px-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span className={`px-2 py-0.2 rounded-full font-bold capitalize ${
                                                                o.status === 'completed' || o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                                                o.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                                                o.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                'bg-amber-50 text-amber-700'
                                                            }`}>
                                                                {o.status}
                                                            </span>
                                                            <span className="font-mono font-bold text-slate-700">{progress}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full transition-all duration-300 rounded-full ${
                                                                    progress >= 100 ? 'bg-emerald-500' :
                                                                    progress >= 50 ? 'bg-blue-500' :
                                                                    progress >= 25 ? 'bg-indigo-500' : 'bg-amber-500'
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 7. Added By */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                                        <UserCheck className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                                        <span>{o.added_by || 'Admin'}</span>
                                                    </span>
                                                </td>

                                                {/* 8. Actions */}
                                                <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openPaymentModal(o)} icon={CreditCard} className="text-emerald-700 hover:text-emerald-800">
                                                                Payment
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openEditProgressModal(o)} icon={Sliders} className="text-blue-700 hover:text-blue-800">
                                                                Progress
                                                            </ActionItem>
                                                            <ActionItem onClick={() => setViewModalOrder(o)} icon={Eye} className="text-slate-700 hover:text-slate-900">
                                                                View
                                                            </ActionItem>
                                                            <ActionItem onClick={() => setInvoiceModalOrder(o)} icon={Receipt} className="text-indigo-700 hover:text-indigo-800">
                                                                Invoice
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleCancelOrder(o)} icon={Ban} danger>
                                                                Cancel
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

            {/* 1. Add Order Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h2 className="font-bold text-base text-slate-900">
                            Add Order
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
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Customer / Client *</label>
                            <select
                                value={createData.client_id}
                                onChange={(e) => setCreateData('client_id', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                required
                            >
                                <option value="">-- Select Client --</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.phone ? `(${c.phone})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={createData.project_name}
                                    onChange={(e) => setCreateData('project_name', e.target.value)}
                                    placeholder="Project Name"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Service Offering *</label>
                                <select
                                    value={createData.item_id}
                                    onChange={(e) => {
                                        const selectedItem = items.find(i => i.id == e.target.value);
                                        setCreateData(prev => ({
                                            ...prev,
                                            item_id: e.target.value,
                                            project_name: prev.project_name || (selectedItem ? selectedItem.name : '')
                                        }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    required
                                >
                                    <option value="">-- Select Service --</option>
                                    {items.map(i => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Amount (৳ BDT) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={createData.amount}
                                    onChange={(e) => setCreateData('amount', e.target.value)}
                                    placeholder="Amount"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                                <select
                                    value={createData.payment_method}
                                    onChange={(e) => setCreateData('payment_method', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    {PAYMENT_METHODS.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                    value={createData.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        setCreateData(prev => ({
                                            ...prev,
                                            status: newStatus,
                                            progress: newStatus === 'completed' ? 100 : newStatus === 'processing' ? 50 : newStatus === 'paid' ? 25 : 0
                                        }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="paid">Paid</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-slate-700 font-bold">Progress</label>
                                    <span className="font-mono font-bold text-blue-600">{createData.progress}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={createData.progress}
                                    onChange={(e) => setCreateData('progress', parseInt(e.target.value))}
                                    className="w-full accent-blue-600 cursor-pointer"
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
                                disabled={createProcessing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 2. ONLY PROGRESS EDIT MODAL */}
            <Modal show={Boolean(editProgressOrder)} onClose={() => setEditProgressOrder(null)} maxWidth="sm">
                {editProgressOrder && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-base text-slate-900">
                                    Edit Progress
                                </h2>
                            </div>
                            <button
                                onClick={() => setEditProgressOrder(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <p className="truncate">{editProgressOrder.project_name || editProgressOrder.item?.name}</p>
                            <p className="text-[11px] text-slate-500 font-normal mt-0.5 truncate">
                                {editProgressOrder.client?.name || editProgressOrder.user?.name}
                            </p>
                        </div>

                        <form onSubmit={handleProgressSubmit} className="space-y-4 text-xs">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-slate-700 font-bold">Progress Percentage</label>
                                    <span className="font-mono font-black text-blue-600 text-base">{progressForm.data.progress}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={progressForm.data.progress}
                                    onChange={(e) => progressForm.setData('progress', parseInt(e.target.value))}
                                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                                />

                                <div className="grid grid-cols-5 gap-1 pt-3">
                                    {[0, 25, 50, 75, 100].map((pct) => (
                                        <button
                                            type="button"
                                            key={pct}
                                            onClick={() => progressForm.setData('progress', pct)}
                                            className={`py-1 px-1 rounded-lg text-center font-mono font-bold text-[10px] border transition-all ${
                                                progressForm.data.progress === pct
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditProgressOrder(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={progressForm.processing}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs active:scale-95 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* 3. PAYMENT METHOD MODAL */}
            <Modal show={Boolean(paymentModalOrder)} onClose={() => setPaymentModalOrder(null)} maxWidth="sm">
                {paymentModalOrder && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <h2 className="font-bold text-base text-slate-900">
                                    Payment Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setPaymentModalOrder(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <div>
                                <p className="font-bold text-slate-900">{paymentModalOrder.client?.name || 'Customer'}</p>
                                <p className="text-[11px] text-slate-500 font-mono">{paymentModalOrder.project_name || paymentModalOrder.item?.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-black text-sm text-emerald-600">৳{parseFloat(paymentModalOrder.amount).toLocaleString()}</p>
                                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${
                                    paymentModalOrder.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                    {paymentModalOrder.status}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Payment Status</label>
                                <select
                                    value={paymentForm.data.status}
                                    onChange={(e) => paymentForm.setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                                >
                                    <option value="paid">Paid (Mark Settled)</option>
                                    <option value="pending">Pending (Unpaid)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Payment Gateway / Method</label>
                                <select
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    {PAYMENT_METHODS.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setPaymentModalOrder(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={paymentForm.processing}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs active:scale-95 transition-all"
                                >
                                    Update Payment
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* 4. VIEW ORDER MODAL */}
            <Modal show={Boolean(viewModalOrder)} onClose={() => setViewModalOrder(null)} maxWidth="md">
                {viewModalOrder && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-base text-slate-900">
                                    Order Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setViewModalOrder(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                                <p className="font-bold text-slate-900">{viewModalOrder.client?.name || viewModalOrder.user?.name}</p>
                                <p className="text-slate-500 font-mono text-[11px]">{viewModalOrder.client?.phone || viewModalOrder.user?.phone || '—'}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Amount & Status</span>
                                <p className="font-bold font-mono text-emerald-600">৳{parseFloat(viewModalOrder.amount).toLocaleString()}</p>
                                <p className="text-slate-500 text-[11px] capitalize">{viewModalOrder.status} &bull; {viewModalOrder.payment_method}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Project / Deliverable</span>
                                <p className="font-bold text-slate-900">{viewModalOrder.project_name || viewModalOrder.item?.name}</p>
                                <p className="text-slate-500 text-[11px]">{viewModalOrder.item?.name}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                                <p className="font-bold font-mono text-blue-600">{viewModalOrder.progress ?? 0}%</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Created Timeline</span>
                                <p className="font-mono text-slate-700">{new Date(viewModalOrder.created_at).toLocaleDateString()}</p>
                                <p className="text-slate-400 text-[10px]">By {viewModalOrder.added_by || 'Admin'}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setViewModalOrder(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 5. PROFESSIONAL INVOICE RECEIPT MODAL (Print-Ready & Saveable) */}
            <Modal show={Boolean(invoiceModalOrder)} onClose={() => setInvoiceModalOrder(null)} maxWidth="lg">
                {invoiceModalOrder && (
                    <div className="bg-white p-6 sm:p-8 space-y-6 rounded-2xl text-slate-800">
                        
                        {/* Printable Invoice Container */}
                        <div className="space-y-6 bg-white">
                            
                            {/* Top Header & Stamp */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                                            IT
                                        </div>
                                        <h3 className="font-black text-xl text-slate-900 tracking-tight">IT SOLUTIONS</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Digital Agency & Software Engineering</p>
                                    <div className="text-[11px] text-slate-400 font-mono mt-2 space-y-0.5">
                                        <p>Dhaka, Bangladesh &bull; Hotline: +880 1800-000000</p>
                                        <p>support@itsolutions.com &bull; www.itsolutions.com</p>
                                    </div>
                                </div>

                                <div className="sm:text-right space-y-2">
                                    <div className={`inline-block px-3 py-1 rounded-lg font-mono font-black text-xs uppercase tracking-wider border ${
                                        invoiceModalOrder.status === 'paid'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                            : 'bg-amber-50 text-amber-700 border-amber-300'
                                    }`}>
                                        {invoiceModalOrder.status === 'paid' ? '✓ PAID & SETTLED' : '⏳ PENDING INVOICE'}
                                    </div>
                                    <h2 className="font-black text-2xl text-slate-900 tracking-tight">
                                        INVOICE
                                    </h2>
                                    <p className="font-mono font-bold text-xs text-blue-600">
                                        #{invoiceModalOrder.transaction_id || `INV-${invoiceModalOrder.id.toString().padStart(6, '0')}`}
                                    </p>
                                </div>
                            </div>

                            {/* Client & Metadata Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Billed To
                                    </span>
                                    <h4 className="font-bold text-sm text-slate-900">{invoiceModalOrder.client?.name || invoiceModalOrder.user?.name}</h4>
                                    {invoiceModalOrder.client?.contact_person && (
                                        <p className="text-slate-600 font-medium">{invoiceModalOrder.client.contact_person}</p>
                                    )}
                                    <p className="text-slate-500 font-mono">{invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone || '—'}</p>
                                </div>

                                <div className="space-y-1 sm:text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Invoice Details
                                    </span>
                                    <p className="text-slate-700">
                                        <span className="text-slate-400">Issue Date:</span> <span className="font-mono font-bold">{new Date(invoiceModalOrder.created_at).toLocaleDateString()}</span>
                                    </p>
                                    <p className="text-slate-700">
                                        <span className="text-slate-400">Payment Method:</span> <span className="font-bold text-slate-900">{invoiceModalOrder.payment_method || 'Online'}</span>
                                    </p>
                                    <p className="text-slate-700">
                                        <span className="text-slate-400">Added By:</span> <span className="font-semibold text-slate-700">{invoiceModalOrder.added_by || 'Admin'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Itemized Table */}
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="p-3">#</th>
                                            <th className="p-3">Project / Deliverable</th>
                                            <th className="p-3 text-center">Qty</th>
                                            <th className="p-3 text-right">Price</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-mono text-slate-400">01</td>
                                            <td className="p-3">
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {invoiceModalOrder.project_name || invoiceModalOrder.item?.name || 'Custom Software Development'}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {invoiceModalOrder.item?.name} &bull; Enterprise Solution
                                                </p>
                                            </td>
                                            <td className="p-3 text-center font-mono font-bold text-slate-700">1</td>
                                            <td className="p-3 text-right font-mono font-bold text-slate-700">
                                                ৳{parseFloat(invoiceModalOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                                                ৳{parseFloat(invoiceModalOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Calculation */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-64 space-y-2 text-xs">
                                    <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                                        <span>Subtotal:</span>
                                        <span className="font-mono font-bold text-slate-900">
                                            ৳{parseFloat(invoiceModalOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                                        <span>VAT / Tax (0%):</span>
                                        <span className="font-mono font-bold text-slate-900">৳0.00 BDT</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-sm">
                                        <span className="font-bold text-slate-900">Grand Total:</span>
                                        <span className="font-mono font-black text-blue-600">
                                            ৳{parseFloat(invoiceModalOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Modal Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* 1. Print & Save as PDF */}
                                <button
                                    type="button"
                                    onClick={() => handlePrintInvoice(invoiceModalOrder)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 text-xs transition-colors shadow-xs active:scale-95 cursor-pointer"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Print & Save PDF</span>
                                </button>

                                {/* 2. Copy Summary */}
                                <button
                                    type="button"
                                    onClick={() => handleCopyInvoiceSummary(invoiceModalOrder)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors shadow-2xs cursor-pointer"
                                >
                                    {copiedInvoice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                                    <span>{copiedInvoice ? 'Copied!' : 'Copy Summary'}</span>
                                </button>

                                {/* 3. WhatsApp Direct Send */}
                                {(invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const phone = invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone;
                                            let clean = phone.replace(/[^0-9+]/g, '');
                                            if (clean.startsWith('01')) clean = '880' + clean.substring(1);
                                            if (clean.startsWith('+')) clean = clean.replace('+', '');
                                            const message = encodeURIComponent(`Hello ${invoiceModalOrder.client?.name || 'Customer'},\n\nHere is your Invoice #${invoiceModalOrder.transaction_id || invoiceModalOrder.id} for "${invoiceModalOrder.project_name || invoiceModalOrder.item?.name}".\n\nTotal Amount: ৳${parseFloat(invoiceModalOrder.amount).toLocaleString()} BDT\nStatus: ${invoiceModalOrder.status.toUpperCase()}\n\nThank you for choosing IT SOLUTIONS!`);
                                            window.open(`https://wa.me/${clean}?text=${message}`, '_blank');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 text-xs transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Send className="w-4 h-4 text-emerald-600" />
                                        <span>Send WhatsApp</span>
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setInvoiceModalOrder(null)}
                                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
