import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatDate } from '@/Utils/dateFormat';
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
    Send,
    Copy,
    Check,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    ArrowUpRight,
    FileText,
    CalendarClock,
    Paperclip,
    CheckSquare,
    Trash2,
    Users
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

const PAYMENT_METHODS = ['bKash', 'Nagad', 'Bank Transfer', 'Card', 'Cash'];

export default function Index({ 
    orders, 
    clients = [], 
    users = [], 
    items = [], 
    employees = [],
    currentStatus = 'all',
    currentPaymentStatus = 'all',
    startDate = '', 
    endDate = '',
    orderStats = {
        total_invoiced: 0,
        total_discount: 0,
        total_net: 0,
        total_paid: 0,
        total_due: 0,
        total_count: 0,
        paid_count: 0,
        partial_count: 0,
        due_count: 0,
    }
}) {
    const { siteSettings = {} } = usePage().props;
    const brandName = siteSettings?.site_name || 'IT Solution';
    const brandTagline = siteSettings?.site_tagline || 'Enterprise Software & Digital Engineering';
    const brandAddress = siteSettings?.company_address || 'Dhaka, Bangladesh';
    const brandPhone = siteSettings?.contact_phone || '+880 1800-000000';
    const brandEmail = siteSettings?.contact_email || 'contact@itsolutions.com';

    const orderList = orders.data || orders;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editProgressOrder, setEditProgressOrder] = useState(null);
    const [paymentModalOrder, setPaymentModalOrder] = useState(null);
    const [viewModalOrder, setViewModalOrder] = useState(null);
    const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
    const [taskModalOrder, setTaskModalOrder] = useState(null);
    
    const [search, setSearch] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(currentPaymentStatus || 'all');
    const [selectedWorkStatus, setSelectedWorkStatus] = useState(currentStatus || 'all');
    const [filterStartDate, setFilterStartDate] = useState(startDate);
    const [filterEndDate, setFilterEndDate] = useState(endDate);
    const [copiedInvoice, setCopiedInvoice] = useState(false);

    // Task Conversion Form
    const taskForm = useForm({
        order_id: '',
        client_id: '',
        item_id: '',
        title: '',
        description: '',
        assigned_to: '',
        priority: 'high',
        status: 'pending',
        due_date: '',
        steps: [],
    });

    const openTaskModal = (order) => {
        setTaskModalOrder(order);

        let initialSteps = [];
        if (order.quote?.phases && Array.isArray(order.quote.phases) && order.quote.phases.length > 0) {
            initialSteps = order.quote.phases.map((p, idx) => ({
                title: `${idx + 1}. ${p.name || 'Phase Milestone'}${p.duration ? ` (${p.duration})` : ''}`,
                assigned_to: '',
            }));
        } else if (order.requirements && Array.isArray(order.requirements) && order.requirements.length > 0) {
            initialSteps = order.requirements.map((r, idx) => ({
                title: r.title || `Milestone ${idx + 1}`,
                assigned_to: '',
            }));
        } else {
            initialSteps = [
                { title: '1. Architecture, Requirement Review & Setup', assigned_to: '' },
                { title: '2. Core Engineering & Development Implementation', assigned_to: '' },
                { title: '3. Quality Assurance, Security Testing & Handover', assigned_to: '' },
            ];
        }

        taskForm.setData({
            order_id: order.id,
            client_id: order.client_id || '',
            item_id: order.item_id || '',
            title: `Deliverable: ${order.project_name || order.item?.name || `Order #${order.id}`}`,
            description: `Order #${order.id} for ${order.client?.name || order.user?.name || 'Client'}\nNet Payable: ৳${order.net_amount || order.amount} BDT\nScope: ${order.item?.name || order.project_name || 'Software Development'}`,
            assigned_to: '',
            priority: 'high',
            status: 'pending',
            due_date: order.due_date || order.delivery_date || '',
            steps: initialSteps,
        });
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        taskForm.post(route('admin.tasks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setTaskModalOrder(null);
            },
        });
    };

    const handleAddStep = () => {
        taskForm.setData('steps', [
            ...taskForm.data.steps,
            { title: '', assigned_to: taskForm.data.assigned_to || '' },
        ]);
    };

    const handleRemoveStep = (index) => {
        taskForm.setData('steps', taskForm.data.steps.filter((_, i) => i !== index));
    };

    const handleStepChange = (index, field, value) => {
        const updated = [...taskForm.data.steps];
        updated[index][field] = value;
        taskForm.setData('steps', updated);
    };

    // Apply combined filters to backend
    const applyFilters = (pStatus, wStatus, sDate, eDate) => {
        const query = {};
        if (pStatus && pStatus !== 'all') query.payment_status = pStatus;
        if (wStatus && wStatus !== 'all') query.status = wStatus;
        if (sDate) query.start_date = sDate;
        if (eDate) query.end_date = eDate;
        router.get('/admin/orders', query, { preserveState: true, preserveScroll: true });
    };

    const handlePaymentStatusTab = (status) => {
        setSelectedPaymentStatus(status);
        applyFilters(status, selectedWorkStatus, filterStartDate, filterEndDate);
    };

    const handleWorkStatusChange = (status) => {
        setSelectedWorkStatus(status);
        applyFilters(selectedPaymentStatus, status, filterStartDate, filterEndDate);
    };

    const handleDateFilter = (start, end) => {
        setFilterStartDate(start);
        setFilterEndDate(end);
        applyFilters(selectedPaymentStatus, selectedWorkStatus, start, end);
    };

    const handleClearFilters = () => {
        setSelectedPaymentStatus('all');
        setSelectedWorkStatus('all');
        setFilterStartDate('');
        setFilterEndDate('');
        setSearch('');
        router.get('/admin/orders', {}, { preserveState: true });
    };

    const handleCancelOrder = (order) => {
        if (confirm(`Are you sure you want to cancel the order for "${order.client?.name || order.project_name || 'Client'}"?`)) {
            router.patch(`/admin/orders/${order.id}`, { status: 'cancelled' }, { preserveScroll: true });
        }
    };

    const generateInvoiceRef = () => 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Order Form (with full billing & partial payment advance support)
    const { 
        data: createData, 
        setData: setCreateData, 
        post: postCreateOrder, 
        processing: createProcessing, 
        reset: resetCreate 
    } = useForm({
        client_id: clients[0]?.id || '',
        item_id: items[0]?.id || '',
        project_name: '',
        amount: '',
        discount: '0',
        paid_amount: '0',
        due_date: '',
        delivery_date: '',
        status: 'pending',
        progress: 0,
        payment_method: 'bKash',
        transaction_id: generateInvoiceRef(),
        notes: '',
    });

    // 2. Edit Progress Form
    const progressForm = useForm({
        progress: 0,
        status: 'pending',
    });

    // 3. Payment Collection Form
    const paymentForm = useForm({
        amount: '',
        payment_method: 'bKash',
        transaction_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const openCreateModal = () => {
        resetCreate();
        const initialItem = items[0];
        setCreateData({
            client_id: clients[0]?.id || '',
            item_id: initialItem?.id || '',
            project_name: initialItem ? initialItem.name : '',
            amount: initialItem?.price ? String(initialItem.price) : '',
            discount: '0',
            paid_amount: '0',
            due_date: '',
            delivery_date: '',
            status: 'pending',
            progress: 0,
            payment_method: 'bKash',
            transaction_id: generateInvoiceRef(),
            notes: '',
        });
        setIsCreateModalOpen(true);
    };

    const openEditProgressModal = (order) => {
        setEditProgressOrder(order);
        progressForm.setData({
            progress: order.progress ?? 0,
            status: order.status || 'pending',
        });
    };

    const openPaymentModal = (order) => {
        setPaymentModalOrder(order);
        const net = parseFloat(order.net_amount ?? (order.amount - (order.discount || 0)));
        const paid = parseFloat(order.paid_amount || 0);
        const due = Math.max(0, net - paid);
        paymentForm.setData({
            amount: due > 0 ? due : '',
            payment_method: order.payment_method || 'bKash',
            transaction_id: '',
            payment_date: new Date().toISOString().split('T')[0],
            notes: '',
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

        paymentForm.post(`/admin/orders/${paymentModalOrder.id}/payment`, {
            preserveScroll: true,
            onSuccess: () => {
                setPaymentModalOrder(null);
                paymentForm.reset();
            }
        });
    };

    // Calculate live numbers for Create Order Modal
    const createGross = parseFloat(createData.amount) || 0;
    const createDisc = parseFloat(createData.discount) || 0;
    const createNet = Math.max(0, createGross - createDisc);
    const createPaid = parseFloat(createData.paid_amount) || 0;
    const createDue = Math.max(0, createNet - createPaid);

    // Fail-Safe Print & Save Function
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
        const grossAmount = parseFloat(order.amount || 0);
        const discount = parseFloat(order.discount || 0);
        const netAmount = Math.max(0, grossAmount - discount);
        const paidAmount = parseFloat(order.paid_amount || 0);
        const dueAmount = Math.max(0, netAmount - paidAmount);
        const invoiceId = order.transaction_id || `INV-${order.id.toString().padStart(6, '0')}`;
        const date = formatDate(order.created_at);
        const dueDate = order.due_date ? formatDate(order.due_date) : null;
        const isPaid = order.payment_status === 'paid' || dueAmount <= 0;
        const isPartial = order.payment_status === 'partial' || (paidAmount > 0 && dueAmount > 0);

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
                        border: 1px solid ${isPaid ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444'};
                        background: ${isPaid ? '#ecfdf5' : isPartial ? '#fffbeb' : '#fef2f2'};
                        color: ${isPaid ? '#047857' : isPartial ? '#b45309' : '#b91c1c'};
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
                        width: 320px;
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
                        padding: 10px 14px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 800;
                        color: #0f172a;
                        margin-top: 6px;
                    }
                    .paid-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 14px;
                        background: #ecfdf5;
                        border: 1px solid #a7f3d0;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 800;
                        color: #065f46;
                        margin-top: 6px;
                    }
                    .due-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 14px;
                        background: ${dueAmount > 0 ? '#fef2f2' : '#f0fdf4'};
                        border: 1px solid ${dueAmount > 0 ? '#fecaca' : '#bbf7d0'};
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 900;
                        color: ${dueAmount > 0 ? '#b91c1c' : '#15803d'};
                        margin-top: 8px;
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
                            <div class="brand-title">${brandName}</div>
                            <div class="brand-sub">${brandTagline}</div>
                            <div class="brand-info">
                                ${brandAddress} &bull; Hotline: ${brandPhone}<br/>
                                ${brandEmail}
                            </div>
                        </div>
                        <div class="invoice-tag-box">
                            <div class="badge-stamp">${isPaid ? '✓ PAID & SETTLED' : isPartial ? '⏳ PARTIAL PAYMENT' : '⚠️ UNPAID / DUE'}</div>
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
                            ${dueDate ? `<div class="meta-row">Due Date: <strong style="color: #b91c1c;">${dueDate}</strong></div>` : ''}
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
                                    <div class="item-desc">${serviceName} &bull; Enterprise Deliverable</div>
                                </td>
                                <td style="text-align: center; font-weight: 700; font-family: 'JetBrains Mono', monospace;">1</td>
                                <td style="text-align: right; font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td style="text-align: right; font-weight: 800; font-family: 'JetBrains Mono', monospace;">৳${grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="totals-container">
                        <div class="totals-box">
                            <div class="totals-row">
                                <span>Gross Subtotal:</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            ${discount > 0 ? `
                            <div class="totals-row" style="color: #10b981;">
                                <span>Discount / Rebate:</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">-৳${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            ` : ''}
                            <div class="grand-total">
                                <span>Net Payable:</span>
                                <span style="font-family: 'JetBrains Mono', monospace;">৳${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</span>
                            </div>
                            <div class="paid-row">
                                <span>Amount Paid (প্রদান):</span>
                                <span style="font-family: 'JetBrains Mono', monospace;">৳${paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</span>
                            </div>
                            <div class="due-row">
                                <span>Balance Due (বাকি):</span>
                                <span style="font-family: 'JetBrains Mono', monospace;">৳${dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing <strong>${brandName}</strong>. For any inquiries, contact ${brandEmail}.</p>
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
        const net = parseFloat(order.net_amount ?? (order.amount - (order.discount || 0)));
        const paid = parseFloat(order.paid_amount || 0);
        const due = Math.max(0, net - paid);
        const text = `Invoice Reference: ${order.transaction_id || order.id}\nClient: ${order.client?.name || order.user?.name}\nProject: ${order.project_name || order.item?.name}\nTotal Bill: ৳${net.toLocaleString()} BDT\nPaid (প্রদান): ৳${paid.toLocaleString()} BDT\nDue (বাকি): ৳${due.toLocaleString()} BDT\nPayment Status: ${order.payment_status?.toUpperCase() || 'DUE'}`;
        navigator.clipboard.writeText(text);
        setCopiedInvoice(true);
        setTimeout(() => setCopiedInvoice(false), 2000);
    };

    // Filter list client-side by search query
    const filteredOrders = orderList.filter(o => {
        if (!search) return true;
        const q = search.toLowerCase();
        const clientName = o.client?.name || o.user?.name || '';
        const clientPhone = o.client?.phone || o.user?.phone || '';
        const projectName = o.project_name || '';
        const addedBy = o.added_by || '';
        const trxId = o.transaction_id || '';
        return (
            clientName.toLowerCase().includes(q) ||
            clientPhone.toLowerCase().includes(q) ||
            projectName.toLowerCase().includes(q) ||
            addedBy.toLowerCase().includes(q) ||
            trxId.toLowerCase().includes(q) ||
            (o.item?.name || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Orders & Billing">
            <div className="space-y-4 max-w-7xl mx-auto pb-10">
                
                {/* 1. Header & Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Orders &amp; Billing
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Track client projects, billing breakdown, paid installments &amp; outstanding dues.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Order / Bill</span>
                    </button>
                </div>

                {/* 2. Top Billing Financial Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Card 1: Total Net Invoiced */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">মোট বিল (Net Invoiced)</span>
                            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                <Receipt className="w-4 h-4" />
                            </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                            ৳{Math.round(orderStats.total_net).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>মোট {orderStats.total_count} টি অর্ডার</span>
                            {orderStats.total_discount > 0 && (
                                <span className="text-emerald-600 font-medium font-mono">ছাড়: ৳{Math.round(orderStats.total_discount).toLocaleString()}</span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Total Paid / Collected */}
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">মোট আদায় / পরিশোধ (Paid)</span>
                            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
                            ৳{Math.round(orderStats.total_paid).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{orderStats.paid_count} টি সম্পূর্ণ পেইড</span>
                            <span className="font-mono text-emerald-600 font-bold">
                                {orderStats.total_net > 0 ? Math.round((orderStats.total_paid / orderStats.total_net) * 100) : 0}% সংগৃহীত
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Total Due Balance */}
                    <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">মোট বাকি (Outstanding Due)</span>
                            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                            </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-red-600 font-mono tracking-tight">
                            ৳{Math.round(orderStats.total_due).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{orderStats.due_count} টি বাকি &bull; {orderStats.partial_count} টি আংশিক</span>
                            <span className="font-bold text-red-600 font-mono">
                                {orderStats.total_net > 0 ? Math.round((orderStats.total_due / orderStats.total_net) * 100) : 0}% বাকি
                            </span>
                        </div>
                    </div>

                    {/* Card 4: Quick Payment Status Filter Pills */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">পেমেন্ট ফিল্টার (Payment Status)</span>
                        <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => handlePaymentStatusTab('all')}
                                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                                    selectedPaymentStatus === 'all'
                                        ? 'bg-blue-600 text-white shadow-2xs'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                All ({orderStats.total_count})
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePaymentStatusTab('paid')}
                                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                                    selectedPaymentStatus === 'paid'
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                            >
                                Paid ({orderStats.paid_count})
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePaymentStatusTab('partial')}
                                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                                    selectedPaymentStatus === 'partial'
                                        ? 'bg-amber-600 text-white shadow-2xs'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                }`}
                            >
                                Partial ({orderStats.partial_count})
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePaymentStatusTab('due')}
                                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                                    selectedPaymentStatus === 'due'
                                        ? 'bg-red-600 text-white shadow-2xs'
                                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                }`}
                            >
                                Due ({orderStats.due_count})
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Search & Date Filter Bar */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-2xs">
                    
                    {/* Search Input */}
                    <div className="relative w-full lg:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search client, project, phone, invoice..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>

                    {/* Status & Date Filter Controls */}
                    <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
                        
                        {/* Work Status Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                            <span className="text-[11px] text-slate-500 font-semibold">Work:</span>
                            <select
                                value={selectedWorkStatus}
                                onChange={(e) => handleWorkStatusChange(e.target.value)}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 font-semibold focus:ring-0 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Date From */}
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

                        {/* Date To */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                            <span className="text-[11px] text-slate-500 font-medium">To:</span>
                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => handleDateFilter(filterStartDate, e.target.value)}
                                className="bg-transparent border-0 p-0 text-xs text-slate-800 font-mono focus:ring-0 cursor-pointer"
                            />
                        </div>

                        {(filterStartDate || filterEndDate || selectedPaymentStatus !== 'all' || selectedWorkStatus !== 'all' || search) && (
                            <button
                                onClick={handleClearFilters}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Reset All Filters"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Complete Orders Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[1050px] text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono">
                                <tr>
                                    <th className="py-3 pl-4 pr-2 whitespace-nowrap">Date &amp; Ref</th>
                                    <th className="py-3 px-3">Client</th>
                                    <th className="py-3 px-3">Project / Service</th>
                                    <th className="py-3 px-3 text-right whitespace-nowrap">মোট বিল (Net)</th>
                                    <th className="py-3 px-3 text-right whitespace-nowrap">প্রদান (Paid)</th>
                                    <th className="py-3 px-3 text-right whitespace-nowrap">বাকি (Due)</th>
                                    <th className="py-3 px-3 text-center whitespace-nowrap">পেমেন্ট স্ট্যাটাস</th>
                                    <th className="py-3 px-3 w-32">কাজের অগ্রগতি</th>
                                    <th className="py-3 pl-2 pr-4 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="p-10 text-center text-slate-400">
                                            No matching orders found. Try adjusting filters or click "Add Order / Bill" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((o) => {
                                        const customerName = o.client?.name || o.user?.name || 'Customer';
                                        const customerPhone = o.client?.phone || o.user?.phone || '';
                                        const progress = o.progress ?? (o.status === 'completed' ? 100 : o.status === 'processing' ? 50 : 0);
                                        
                                        const gross = parseFloat(o.amount || 0);
                                        const discount = parseFloat(o.discount || 0);
                                        const net = parseFloat(o.net_amount ?? (gross - discount));
                                        const paid = parseFloat(o.paid_amount || 0);
                                        const due = parseFloat(o.due_amount ?? Math.max(0, net - paid));
                                        
                                        const paymentStatus = o.payment_status || (due <= 0 ? 'paid' : paid > 0 ? 'partial' : 'due');

                                        return (
                                            <tr key={o.id} className="hover:bg-blue-50/40 transition-colors">
                                                
                                                {/* 1. Date & Invoice Reference */}
                                                <td className="py-3 pl-4 pr-2 whitespace-nowrap">
                                                    <p className="font-mono text-slate-900 font-bold text-xs">
                                                        {formatDate(o.created_at)}
                                                    </p>
                                                    <p className="text-[10px] text-blue-600 font-mono font-semibold">
                                                        #{o.transaction_id || `ORD-${o.id}`}
                                                    </p>
                                                </td>

                                                {/* 2. Client & Contact */}
                                                <td className="py-3 px-3">
                                                    <p className="font-bold text-slate-900 text-xs">
                                                        {customerName}
                                                    </p>
                                                    {customerPhone && (
                                                        <p className="text-[11px] text-slate-500 font-mono">
                                                            {customerPhone}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* 3. Project / Service */}
                                                <td className="py-3 px-3">
                                                    <p className="font-bold text-slate-900 text-xs">
                                                        {o.project_name || o.item?.name || 'Custom Project'}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                                        {o.item?.name && <span>{o.item.name}</span>}
                                                        <span>&bull;</span>
                                                        <span>{o.payment_method || 'Online'}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                        {o.quote && (
                                                            <Link
                                                                href={`/admin/quotes?search=${o.quote.quote_number || o.quote.id}`}
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200 transition"
                                                                title="View Origin Quotation / Work Order"
                                                            >
                                                                <FileText className="w-2.5 h-2.5" />
                                                                <span>#{o.quote.quote_number || `QUO-${o.quote.id}`}</span>
                                                            </Link>
                                                        )}
                                                        {o.requirements && o.requirements.length > 0 && (
                                                            <a
                                                                href={route('orders.requirements.show', o.id)}
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 hover:bg-purple-100 transition"
                                                            >
                                                                <Paperclip className="w-2.5 h-2.5" />
                                                                <span>{o.requirements.length} Briefing Media</span>
                                                            </a>
                                                        )}
                                                        {o.tasks && o.tasks.length > 0 && (
                                                            <Link
                                                                href={`/admin/tasks?search=${o.id}`}
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 transition"
                                                                title="View assigned tasks in HRM"
                                                            >
                                                                <CheckSquare className="w-2.5 h-2.5 text-amber-600" />
                                                                <span>{o.tasks.length} Task{o.tasks.length > 1 ? 's' : ''}</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 4. Net Bill (মোট বিল) */}
                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                    <p className="font-mono font-bold text-slate-900 text-xs">
                                                        ৳{Math.round(net).toLocaleString()}
                                                    </p>
                                                    {discount > 0 && (
                                                        <span className="text-[10px] text-emerald-600 font-mono">
                                                            (ছাড়: ৳{Math.round(discount).toLocaleString()})
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 5. Paid Amount (প্রদান) */}
                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                    <p className="font-mono font-bold text-emerald-600 text-xs">
                                                        ৳{Math.round(paid).toLocaleString()}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400">
                                                        {net > 0 ? `${Math.round((paid / net) * 100)}% পরিশোধ` : '—'}
                                                    </span>
                                                </td>

                                                {/* 6. Due Amount (বাকি) */}
                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                    {due > 0 ? (
                                                        <div>
                                                            <span className="inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-red-50 text-red-700 border border-red-200">
                                                                ৳{Math.round(due).toLocaleString()}
                                                            </span>
                                                            {o.due_date && (
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                                    তাগিদ: {formatDate(o.due_date)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[11px] text-slate-400 bg-slate-100">
                                                            ৳0 (Settled)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 7. Payment Status Badge */}
                                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide border ${
                                                        paymentStatus === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                            : paymentStatus === 'partial'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                                                            : 'bg-red-50 text-red-700 border-red-300'
                                                    }`}>
                                                        {paymentStatus === 'paid' ? '✓ Paid' : paymentStatus === 'partial' ? '⏳ Partial' : '⚠️ Due'}
                                                    </span>
                                                </td>

                                                {/* 8. Progress & Work Status */}
                                                <td className="py-3 px-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span className={`px-1.5 py-0.2 rounded-md font-bold capitalize ${
                                                                o.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                                                o.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                                                o.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                'bg-slate-100 text-slate-700'
                                                            }`}>
                                                                {o.status}
                                                            </span>
                                                            <span className="font-mono font-bold text-slate-600">{progress}%</span>
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

                                                {/* 9. Actions Dropdown */}
                                                <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openPaymentModal(o)} icon={CreditCard} className="text-emerald-700 hover:text-emerald-800">
                                                                Collect Payment
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openTaskModal(o)} icon={CheckSquare} className="text-amber-700 hover:text-amber-800">
                                                                Assign Tasks &amp; Team ({o.tasks?.length || 0})
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openEditProgressModal(o)} icon={Sliders} className="text-blue-700 hover:text-blue-800">
                                                                Edit Progress
                                                            </ActionItem>
                                                            <ActionItem onClick={() => window.location.href = route('orders.requirements.show', o.id)} icon={Paperclip} className="text-purple-700 hover:text-purple-800">
                                                                Requirements &amp; Media ({o.requirements?.length || 0})
                                                            </ActionItem>
                                                            <ActionItem onClick={() => setViewModalOrder(o)} icon={Eye} className="text-slate-700 hover:text-slate-900">
                                                                View Details
                                                            </ActionItem>
                                                            <ActionItem onClick={() => setInvoiceModalOrder(o)} icon={Receipt} className="text-indigo-700 hover:text-indigo-800">
                                                                Invoice &amp; Print
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleCancelOrder(o)} icon={Ban} danger>
                                                                Cancel Order
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

            {/* ============================================================== */}
            {/* 1. ADD ORDER & BILL MODAL (With Advance & Discount Support)   */}
            {/* ============================================================== */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <div className="bg-white p-5 sm:p-6 space-y-4 rounded-2xl text-slate-800">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h2 className="font-bold text-base text-slate-900">
                                Create Order &amp; Billing (নতুন অর্ডার ও ইনভয়েস)
                            </h2>
                            <p className="text-xs text-slate-500">Record full order details, discount and advance/partial payment.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                        
                        {/* Client Selector */}
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

                        {/* Project Name & Service */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Service Offering *</label>
                                <select
                                    value={createData.item_id}
                                    onChange={(e) => {
                                        const selectedItem = items.find(i => i.id == e.target.value);
                                        setCreateData(prev => ({
                                            ...prev,
                                            item_id: e.target.value,
                                            project_name: prev.project_name || (selectedItem ? selectedItem.name : ''),
                                            amount: selectedItem?.price ? String(selectedItem.price) : prev.amount
                                        }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    required
                                >
                                    <option value="">-- Select Service --</option>
                                    {items.map(i => (
                                        <option key={i.id} value={i.id}>{i.name} {i.price ? `(৳${i.price})` : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Project / Contract Title</label>
                                <input
                                    type="text"
                                    value={createData.project_name}
                                    onChange={(e) => setCreateData('project_name', e.target.value)}
                                    placeholder="e.g. ERP Development for..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Financial Inputs: Amount, Discount, Advance */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">মোট বিল / Amount (৳) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={createData.amount}
                                    onChange={(e) => setCreateData('amount', e.target.value)}
                                    placeholder="Amount"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">ছাড় / Discount (৳)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={createData.discount}
                                    onChange={(e) => setCreateData('discount', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-emerald-700 font-bold mb-1">অগ্রিম প্রদান / Paid (৳)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={createData.paid_amount}
                                    onChange={(e) => setCreateData('paid_amount', e.target.value)}
                                    placeholder="0 (যদি এডভান্স নেয়)"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-mono font-bold"
                                />
                            </div>
                        </div>

                        {/* Live Calculation Preview Banner */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                            <div>
                                <span className="text-[10px] text-slate-500 font-semibold uppercase">সর্বমোট প্রদেয় (Net):</span>
                                <p className="font-mono font-bold text-slate-900 text-sm">৳{createNet.toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-[10px] text-emerald-700 font-semibold uppercase">আদায় (Paid):</span>
                                <p className="font-mono font-bold text-emerald-700 text-sm">৳{createPaid.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-red-700 font-bold uppercase">অবশিষ্ট বাকি (Due):</span>
                                <p className={`font-mono font-black text-sm ${createDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    ৳{createDue.toLocaleString()} {createDue === 0 ? '(পেইড)' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Payment Method & Due Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড (Payment Method)</label>
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

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">বাকি পরিশোধের তারিখ (Due Date)</label>
                                <input
                                    type="date"
                                    value={createData.due_date}
                                    onChange={(e) => setCreateData('due_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>
                        </div>

                        {/* Work Status & Progress */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">কাজের অবস্থা (Work Status)</label>
                                <select
                                    value={createData.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        setCreateData(prev => ({
                                            ...prev,
                                            status: newStatus,
                                            progress: newStatus === 'completed' ? 100 : newStatus === 'processing' ? 50 : 0
                                        }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-slate-700 font-bold">অগ্রগতি (Progress)</label>
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

                        {/* Notes */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">মন্তব্য / Notes (Optional)</label>
                            <input
                                type="text"
                                value={createData.notes}
                                onChange={(e) => setCreateData('notes', e.target.value)}
                                placeholder="Any billing terms or project notes..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                                Create Order &amp; Invoice
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ============================================================== */}
            {/* 2. RECORD PAYMENT / COLLECT DUE MODAL                          */}
            {/* ============================================================== */}
            <Modal show={Boolean(paymentModalOrder)} onClose={() => setPaymentModalOrder(null)} maxWidth="md">
                {paymentModalOrder && (() => {
                    const net = parseFloat(paymentModalOrder.net_amount ?? (paymentModalOrder.amount - (paymentModalOrder.discount || 0)));
                    const paid = parseFloat(paymentModalOrder.paid_amount || 0);
                    const due = Math.max(0, net - paid);

                    return (
                        <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-base text-slate-900">
                                            পেমেন্ট গ্রহণ / Collect Payment
                                        </h2>
                                        <p className="text-[11px] text-slate-500">Record cash/bKash installment against this order.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPaymentModalOrder(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Current Billing Snapshot */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">মোট বিল (Net)</span>
                                    <span className="font-mono font-black text-slate-900 text-sm">৳{Math.round(net).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">আদায়কৃত (Paid)</span>
                                    <span className="font-mono font-black text-emerald-600 text-sm">৳{Math.round(paid).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-red-600 font-bold uppercase block">বর্তমান বাকি (Due)</span>
                                    <span className="font-mono font-black text-red-600 text-sm">৳{Math.round(due).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Quick Pay Full Due Button */}
                            {due > 0 && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => paymentForm.setData('amount', due)}
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                                    >
                                        সম্পূর্ণ বাকি পরিশোধ করুন (৳{Math.round(due).toLocaleString()})
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">
                                        জমা / পেমেন্ট এর পরিমাণ (৳ BDT) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={due > 0 ? due : undefined}
                                        value={paymentForm.data.amount}
                                        onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড *</label>
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

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">তারিখ (Date) *</label>
                                        <input
                                            type="date"
                                            value={paymentForm.data.payment_date}
                                            onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">TrxID / Reference (ঐচ্ছিক)</label>
                                    <input
                                        type="text"
                                        value={paymentForm.data.transaction_id}
                                        onChange={(e) => paymentForm.setData('transaction_id', e.target.value)}
                                        placeholder="e.g. BKASH-9X1234 or Bank slip"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">মন্তব্য / Notes</label>
                                    <input
                                        type="text"
                                        value={paymentForm.data.notes}
                                        onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                        placeholder="e.g. 2nd milestone installment received"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentModalOrder(null)}
                                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={paymentForm.processing || !paymentForm.data.amount}
                                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    );
                })()}
            </Modal>

            {/* ============================================================== */}
            {/* 3. EDIT PROGRESS MODAL                                         */}
            {/* ============================================================== */}
            <Modal show={Boolean(editProgressOrder)} onClose={() => setEditProgressOrder(null)} maxWidth="sm">
                {editProgressOrder && (
                    <div className="bg-white p-5 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-base text-slate-900">
                                    Edit Progress &amp; Status
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
                                Client: {editProgressOrder.client?.name || editProgressOrder.user?.name}
                            </p>
                        </div>

                        <form onSubmit={handleProgressSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Work Status</label>
                                <select
                                    value={progressForm.data.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        progressForm.setData(prev => ({
                                            ...prev,
                                            status: newStatus,
                                            progress: newStatus === 'completed' ? 100 : newStatus === 'processing' && prev.progress < 50 ? 50 : prev.progress
                                        }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

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
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* ============================================================== */}
            {/* 4. VIEW ORDER DETAILS MODAL (Full Billing & Payments Breakdown)*/}
            {/* ============================================================== */}
            <Modal show={Boolean(viewModalOrder)} onClose={() => setViewModalOrder(null)} maxWidth="lg">
                {viewModalOrder && (() => {
                    const gross = parseFloat(viewModalOrder.amount || 0);
                    const discount = parseFloat(viewModalOrder.discount || 0);
                    const net = parseFloat(viewModalOrder.net_amount ?? (gross - discount));
                    const paid = parseFloat(viewModalOrder.paid_amount || 0);
                    const due = parseFloat(viewModalOrder.due_amount ?? Math.max(0, net - paid));
                    const payments = viewModalOrder.payments || [];

                    return (
                        <div className="bg-white p-6 space-y-5 rounded-2xl text-slate-800">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-lg text-slate-900">
                                            Order &amp; Billing Details
                                        </h2>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            due <= 0 ? 'bg-emerald-50 text-emerald-700' : paid > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {due <= 0 ? '✓ Paid' : paid > 0 ? '⏳ Partial' : '⚠️ Due'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600 font-mono font-bold mt-0.5">
                                        #{viewModalOrder.transaction_id || `ORD-${viewModalOrder.id}`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewModalOrder(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Client & Project Overview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Info</span>
                                    <p className="font-bold text-slate-900 text-sm">{viewModalOrder.client?.name || viewModalOrder.user?.name}</p>
                                    <p className="text-slate-600 font-mono">{viewModalOrder.client?.phone || viewModalOrder.user?.phone || '—'}</p>
                                    <p className="text-slate-500">{viewModalOrder.client?.email || viewModalOrder.user?.email || ''}</p>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project / Service</span>
                                    <p className="font-bold text-slate-900 text-sm">{viewModalOrder.project_name || viewModalOrder.item?.name}</p>
                                    <p className="text-slate-500">{viewModalOrder.item?.name}</p>
                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                                        <span>Status: <strong className="capitalize text-slate-700">{viewModalOrder.status}</strong></span>
                                        <span>&bull;</span>
                                        <span>Progress: <strong className="text-blue-600 font-mono">{viewModalOrder.progress ?? 0}%</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary Card */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Financial Breakdown (হিসাব বিবরণী)</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                        <span className="text-[10px] text-slate-500 uppercase block">মূল বিল (Gross)</span>
                                        <span className="font-mono font-bold text-slate-800 text-sm">৳{gross.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                        <span className="text-[10px] text-emerald-600 uppercase block">ছাড় (Discount)</span>
                                        <span className="font-mono font-bold text-emerald-600 text-sm">৳{discount.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/30">
                                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">প্রদান (Paid)</span>
                                        <span className="font-mono font-black text-emerald-700 text-sm">৳{paid.toLocaleString()}</span>
                                    </div>
                                    <div className={`p-2.5 rounded-lg border ${due > 0 ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white'}`}>
                                        <span className={`text-[10px] font-bold uppercase block ${due > 0 ? 'text-red-600' : 'text-slate-400'}`}>বাকি (Due)</span>
                                        <span className={`font-mono font-black text-sm ${due > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                            ৳{due.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                {viewModalOrder.due_date && (
                                    <p className="text-[11px] text-slate-500 text-right pt-1">
                                        বাকি পরিশোধের শেষ তারিখ: <strong className="font-mono text-slate-800">{formatDate(viewModalOrder.due_date)}</strong>
                                    </p>
                                )}
                            </div>

                            {/* Payment Ledger / History */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                                    Payment Transactions Ledger ({payments.length})
                                </span>
                                {payments.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                                        No payment transactions logged yet for this order.
                                    </p>
                                ) : (
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-200">
                                                <tr>
                                                    <th className="p-2.5 pl-3">Date</th>
                                                    <th className="p-2.5">Method</th>
                                                    <th className="p-2.5">TrxID</th>
                                                    <th className="p-2.5 text-right">Amount</th>
                                                    <th className="p-2.5 pr-3">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {payments.map(p => (
                                                    <tr key={p.id}>
                                                        <td className="p-2.5 pl-3 font-mono text-slate-600">{formatDate(p.payment_date)}</td>
                                                        <td className="p-2.5 font-semibold text-slate-800">{p.payment_method}</td>
                                                        <td className="p-2.5 font-mono text-slate-500">{p.transaction_id || '—'}</td>
                                                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">৳{parseFloat(p.amount).toLocaleString()}</td>
                                                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">{p.notes || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                {due > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const ord = viewModalOrder;
                                            setViewModalOrder(null);
                                            openPaymentModal(ord);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 text-xs shadow-xs"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span>Collect Payment (৳{due.toLocaleString()})</span>
                                    </button>
                                )}
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const ord = viewModalOrder;
                                            setViewModalOrder(null);
                                            setInvoiceModalOrder(ord);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 text-xs"
                                    >
                                        View Invoice
                                    </button>
                                    <button
                                        onClick={() => setViewModalOrder(null)}
                                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </Modal>

            {/* ============================================================== */}
            {/* 5. PROFESSIONAL INVOICE RECEIPT MODAL (Print-Ready & Saveable) */}
            {/* ============================================================== */}
            <Modal show={Boolean(invoiceModalOrder)} onClose={() => setInvoiceModalOrder(null)} maxWidth="3xl">
                {invoiceModalOrder && (() => {
                    const gross = parseFloat(invoiceModalOrder.amount || 0);
                    const discount = parseFloat(invoiceModalOrder.discount || 0);
                    const net = parseFloat(invoiceModalOrder.net_amount ?? (gross - discount));
                    const paid = parseFloat(invoiceModalOrder.paid_amount || 0);
                    const due = parseFloat(invoiceModalOrder.due_amount ?? Math.max(0, net - paid));
                    const isPaid = invoiceModalOrder.payment_status === 'paid' || due <= 0;
                    const isPartial = invoiceModalOrder.payment_status === 'partial' || (paid > 0 && due > 0);

                    return (
                        <div className="bg-white p-6 sm:p-8 space-y-6 rounded-3xl text-slate-800">
                            
                            {/* Printable Invoice Container */}
                            <div className="space-y-6 bg-white">
                                
                                {/* Top Header & Stamp */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                                                {brandName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <h3 className="font-black text-2xl text-slate-900 tracking-tight">{brandName}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold">{brandTagline}</p>
                                        <div className="text-[11px] text-slate-400 font-medium mt-2 space-y-0.5">
                                            <p>{brandAddress} &bull; Hotline: {brandPhone}</p>
                                            <p>{brandEmail}</p>
                                        </div>
                                    </div>

                                    <div className="sm:text-right space-y-2">
                                        <div className={`inline-block px-3.5 py-1 rounded-xl font-bold text-xs uppercase tracking-wider border shadow-2xs ${
                                            isPaid
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                : isPartial
                                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                                : 'bg-red-50 text-red-700 border-red-300'
                                        }`}>
                                            {isPaid ? '✓ PAID & SETTLED' : isPartial ? '⏳ PARTIAL PAYMENT' : '⚠️ UNPAID / DUE'}
                                        </div>
                                        <h2 className="font-black text-3xl text-slate-900 tracking-tight">
                                            INVOICE
                                        </h2>
                                        <p className="font-mono font-bold text-xs text-blue-600">
                                            #{invoiceModalOrder.transaction_id || `INV-${invoiceModalOrder.id.toString().padStart(6, '0')}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Client & Metadata Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Billed To (গ্রাহকের তথ্য)
                                        </span>
                                        <h4 className="font-black text-base text-slate-900">{invoiceModalOrder.client?.name || invoiceModalOrder.user?.name}</h4>
                                        {invoiceModalOrder.client?.contact_person && (
                                            <p className="text-slate-600 font-semibold">{invoiceModalOrder.client.contact_person}</p>
                                        )}
                                        <p className="text-slate-600 font-mono text-xs">{invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone || '—'}</p>
                                        {invoiceModalOrder.client?.email && (
                                            <p className="text-slate-400 text-[11px]">{invoiceModalOrder.client.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5 sm:text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Invoice Details (ইনভয়েস বিবরণ)
                                        </span>
                                        <p className="text-slate-700">
                                            <span className="text-slate-400">Issue Date:</span> <strong className="font-semibold text-slate-900 ml-1">{formatDate(invoiceModalOrder.created_at)}</strong>
                                        </p>
                                        {invoiceModalOrder.due_date && (
                                            <p className="text-slate-700">
                                                <span className="text-slate-400">Due Date (বাকি পরিশোধ):</span> <strong className="font-bold text-red-600 ml-1">{formatDate(invoiceModalOrder.due_date)}</strong>
                                            </p>
                                        )}
                                        <p className="text-slate-700">
                                            <span className="text-slate-400">Payment Gateway:</span> <strong className="font-bold text-slate-900 ml-1">{invoiceModalOrder.payment_method || 'Online'}</strong>
                                        </p>
                                        {invoiceModalOrder.added_by && (
                                            <p className="text-slate-400 text-[11px]">
                                                Created By: {invoiceModalOrder.added_by}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Itemized Table */}
                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                            <tr>
                                                <th className="py-3 px-4 w-12 text-center">#</th>
                                                <th className="py-3 px-4">Project / Deliverable Description</th>
                                                <th className="py-3 px-4 text-center w-16">Qty</th>
                                                <th className="py-3 px-4 text-right w-36">Rate</th>
                                                <th className="py-3 px-4 text-right w-36">Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="py-4 px-4 text-center font-mono text-slate-400">01</td>
                                                <td className="py-4 px-4">
                                                    <p className="font-bold text-slate-900 text-sm">
                                                        {invoiceModalOrder.project_name || invoiceModalOrder.item?.name || 'Custom Software Development'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        {invoiceModalOrder.item?.name} &bull; Enterprise Tech Deliverable
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4 text-center font-bold text-slate-700">1</td>
                                                <td className="py-4 px-4 text-right font-bold text-slate-800 tabular-nums">
                                                    ৳{gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-4 px-4 text-right font-extrabold text-slate-900 tabular-nums">
                                                    ৳{gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Calculation with Paid & Due */}
                                <div className="flex justify-end pt-2">
                                    <div className="w-full sm:w-80 space-y-2 text-xs">
                                        <div className="flex justify-between py-1.5 px-2 border-b border-slate-100 text-slate-600">
                                            <span className="font-medium">Gross Subtotal:</span>
                                            <span className="font-bold text-slate-900 tabular-nums">
                                                ৳{gross.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between py-1.5 px-2 border-b border-slate-100 text-emerald-600">
                                                <span className="font-medium">Discount / Rebate (ছাড়):</span>
                                                <span className="font-bold tabular-nums">
                                                    -৳{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="font-bold text-slate-700">Net Payable (মোট বিল):</span>
                                            <span className="font-extrabold text-slate-900 tabular-nums text-sm">
                                                ৳{net.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800">
                                            <span className="font-bold">Amount Paid (পরিশোধ / আদায়):</span>
                                            <span className="font-black text-emerald-700 tabular-nums text-sm">
                                                ৳{paid.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                            </span>
                                        </div>
                                        <div className={`flex justify-between py-3 px-3.5 rounded-xl border text-sm ${
                                            due > 0 ? 'bg-red-50/90 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        }`}>
                                            <span className="font-black">Balance Due (বর্তমান বাকি):</span>
                                            <span className="font-black tabular-nums text-base">
                                                ৳{due.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => handlePrintInvoice(invoiceModalOrder)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 text-xs transition-colors shadow-xs active:scale-95 cursor-pointer"
                                    >
                                        <Printer className="w-4 h-4" />
                                        <span>Print &amp; Save PDF</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleCopyInvoiceSummary(invoiceModalOrder)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors shadow-2xs cursor-pointer"
                                    >
                                        {copiedInvoice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                                        <span>{copiedInvoice ? 'Copied!' : 'Copy Summary'}</span>
                                    </button>

                                    {(invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const phone = invoiceModalOrder.client?.phone || invoiceModalOrder.user?.phone;
                                                let clean = phone.replace(/[^0-9+]/g, '');
                                                if (clean.startsWith('01')) clean = '880' + clean.substring(1);
                                                if (clean.startsWith('+')) clean = clean.replace('+', '');
                                                const message = encodeURIComponent(`Hello ${invoiceModalOrder.client?.name || 'Customer'},\n\nHere is your Invoice #${invoiceModalOrder.transaction_id || invoiceModalOrder.id} for "${invoiceModalOrder.project_name || invoiceModalOrder.item?.name}".\n\nTotal Bill: ৳${net.toLocaleString()} BDT\nPaid: ৳${paid.toLocaleString()} BDT\nDue: ৳${due.toLocaleString()} BDT\nStatus: ${isPaid ? 'PAID & SETTLED' : isPartial ? 'PARTIALLY PAID' : 'DUE'}\n\nThank you for choosing ${brandName}!`);
                                                window.open(`https://wa.me/${clean}?text=${message}`, '_blank');
                                            }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 text-xs transition-colors shadow-2xs cursor-pointer"
                                        >
                                            <Send className="w-4 h-4 text-emerald-600" />
                                            <span>Send WhatsApp</span>
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setInvoiceModalOrder(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>

            {/* ============================================================== */}
            {/* 6. CONVERT TO TASK & ASSIGN TEAM MODAL                         */}
            {/* ============================================================== */}
            <Modal show={Boolean(taskModalOrder)} onClose={() => setTaskModalOrder(null)} maxWidth="2xl">
                {taskModalOrder && (
                    <form onSubmit={handleTaskSubmit} className="bg-white p-5 sm:p-6 space-y-4 rounded-2xl text-slate-800">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base text-slate-900">
                                        Assign Tasks &amp; Team (অর্ডার থেকে টাস্ক তৈরি ও কর্মী অ্যাসাইন)
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Order #{taskModalOrder.transaction_id || taskModalOrder.id} &bull; {taskModalOrder.client?.name || taskModalOrder.user?.name || 'Client'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTaskModalOrder(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick Summary Banner */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div>
                                <span className="text-slate-500">Deliverable Project:</span>{' '}
                                <span className="font-bold text-slate-900">{taskModalOrder.project_name || taskModalOrder.item?.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Net Amount:</span>{' '}
                                <span className="font-mono font-bold text-emerald-700">৳{Math.round(taskModalOrder.net_amount || taskModalOrder.amount).toLocaleString()} BDT</span>
                            </div>
                            {taskModalOrder.delivery_date && (
                                <div>
                                    <span className="text-slate-500">Target Delivery:</span>{' '}
                                    <span className="font-mono font-bold text-slate-700">{formatDate(taskModalOrder.delivery_date)}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3.5">
                            {/* Task Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Task / Project Headline *
                                </label>
                                <input
                                    type="text"
                                    value={taskForm.data.title}
                                    onChange={(e) => taskForm.setData('title', e.target.value)}
                                    placeholder="e.g. Full-Stack Development for Sadia Online Shop"
                                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                    required
                                />
                            </div>

                            {/* Primary Assignee & Priority & Due Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Primary Team Assignee (মূল কর্মী)
                                    </label>
                                    <select
                                        value={taskForm.data.assigned_to}
                                        onChange={(e) => taskForm.setData('assigned_to', e.target.value)}
                                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                    >
                                        <option value="">Unassigned (পরে অ্যাসাইন করবেন)</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name} {emp.designation ? `(${emp.designation})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Priority (অগ্রাধিকার)
                                    </label>
                                    <select
                                        value={taskForm.data.priority}
                                        onChange={(e) => taskForm.setData('priority', e.target.value)}
                                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none capitalize"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                        <option value="urgent">Urgent Priority 🔥</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Target Deadline (ডেডলাইন)
                                    </label>
                                    <input
                                        type="date"
                                        value={taskForm.data.due_date}
                                        onChange={(e) => taskForm.setData('due_date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            {/* Subtasks / Phases Checklist */}
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Sliders className="w-3.5 h-3.5 text-amber-600" />
                                        Project Phases &amp; Execution Steps ({taskForm.data.steps.length})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddStep}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 hover:bg-amber-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>Add Phase Step</span>
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {taskForm.data.steps.map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                                            <span className="font-mono font-bold text-slate-400 text-[10px] w-5 text-center">
                                                #{idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                                                placeholder="Step / Milestone Title..."
                                                className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                            <select
                                                value={step.assigned_to || ''}
                                                onChange={(e) => handleStepChange(idx, 'assigned_to', e.target.value)}
                                                className="w-36 px-2 py-1 text-[11px] border border-slate-200 rounded-md bg-white text-slate-600"
                                            >
                                                <option value="">(Main Assignee)</option>
                                                {employees.map((emp) => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStep(idx)}
                                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                                                title="Remove Step"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description & Technical Directives */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Task Briefing &amp; Scope Directives (কাজের বিবরণ ও নির্দেশনা)
                                </label>
                                <textarea
                                    rows="3"
                                    value={taskForm.data.description}
                                    onChange={(e) => taskForm.setData('description', e.target.value)}
                                    placeholder="Provide details for the developer or team..."
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none leading-relaxed"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setTaskModalOrder(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={taskForm.processing}
                                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <CheckSquare className="w-4 h-4" />
                                <span>{taskForm.processing ? 'Assigning...' : 'Assign & Dispatch to Team'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}
