import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
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
    Clock, 
    FileText, 
    Printer,
    Share2,
    DollarSign,
    Layers,
    ShieldCheck,
    PenTool,
    Sparkles,
    Check
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ 
    quotes, 
    items = [], 
    metrics = {}, 
    currentStatus = 'all', 
    viewType = 'all',
    startDate = '', 
    endDate = '', 
    companyDetails = {} 
}) {
    const { siteSettings = {} } = usePage().props;
    const brandName = companyDetails.name || siteSettings?.site_name || 'IT Solution';
    const brandLogo = companyDetails.logo || siteSettings?.site_logo || '';
    const brandEmail = companyDetails.email || siteSettings?.contact_email || 'contact@itsolution.bd';
    const brandPhone = companyDetails.phone || siteSettings?.contact_phone || '+880 1800-000000';
    const brandAddress = companyDetails.address || siteSettings?.company_address || 'Level 8, Software Technology Park, Dhaka, Bangladesh';

    const quoteList = quotes.data || quotes;
    const [search, setSearch] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(startDate);
    const [filterEndDate, setFilterEndDate] = useState(endDate);
    const [activeTab, setActiveTab] = useState(viewType === 'work_orders' ? 'work_orders' : 'all');

    const [viewQuote, setViewQuote] = useState(null);
    const [editQuote, setEditQuote] = useState(null);
    const [copiedQuoteId, setCopiedQuoteId] = useState(null);
    const [sendingEmailId, setSendingEmailId] = useState(null);

    // Initial default 3 phases template
    const defaultPhases = [
        { name: 'Phase 1: Discovery, UI/UX & Wireframing', description: 'System requirements gathering, responsive UI/UX prototypes, and architecture design.', duration: '5-7 Days', cost: '' },
        { name: 'Phase 2: Core Engineering & Integrations', description: 'Backend business logic, database migrations, API development, and frontend implementation.', duration: '14-21 Days', cost: '' },
        { name: 'Phase 3: QA, Security Audit & Deployment', description: 'Cross-device user testing, bug fixes, production server setup, and handover.', duration: '5-7 Days', cost: '' },
    ];

    // Initial default 50-20-30 payment condition
    const defaultPaymentTerms = [
        { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: '' },
        { percentage: 20, condition: '20% Upon completion of Core Engineering Phase', amount: '' },
        { percentage: 30, condition: '30% Upon Final Handover, Training & Deployment', amount: '' },
    ];

    // Edit Form
    const editForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        item_id: '',
        project_title: '',
        valid_until: '',
        phases: [],
        subtotal: '',
        discount: 0,
        tax: 0,
        total_amount: '',
        payment_terms: [],
        terms_conditions: '',
        message: '',
        notes: '',
        status: 'new',
    });

    // Helper to calculate phases sum
    const calculatePhasesTotal = (phasesList) => {
        return phasesList.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
    };

    // Apply Standard 50-20-30 condition
    const applyStandard502030 = (formObj, isEdit = false) => {
        const total = parseFloat(formObj.data.total_amount) || parseFloat(formObj.data.subtotal) || 0;
        const terms = [
            { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: (total * 0.5).toFixed(2) },
            { percentage: 20, condition: '20% Upon completion of Core Engineering Phase', amount: (total * 0.2).toFixed(2) },
            { percentage: 30, condition: '30% Upon Final Handover, Training & Deployment', amount: (total * 0.3).toFixed(2) },
        ];
        formObj.setData('payment_terms', terms);
    };

    // Edit Phase handlers
    const handleEditPhaseChange = (index, field, value) => {
        const updated = [...editForm.data.phases];
        updated[index][field] = value;
        
        const newSubtotal = calculatePhasesTotal(updated);
        const disc = parseFloat(editForm.data.discount) || 0;
        const tx = parseFloat(editForm.data.tax) || 0;
        const newTotal = Math.max(0, newSubtotal - disc + tx);

        const updatedTerms = (editForm.data.payment_terms || defaultPaymentTerms).map(term => ({
            ...term,
            amount: ((newTotal * (parseFloat(term.percentage) || 0)) / 100).toFixed(2),
        }));

        editForm.setData({
            ...editForm.data,
            phases: updated,
            subtotal: newSubtotal,
            total_amount: newTotal,
            payment_terms: updatedTerms,
        });
    };

    const addEditPhase = () => {
        const updated = [
            ...editForm.data.phases,
            { name: `Phase ${editForm.data.phases.length + 1}: Deliverable`, description: '', duration: '7 Days', cost: '' }
        ];
        editForm.setData('phases', updated);
    };

    const removeEditPhase = (index) => {
        const updated = editForm.data.phases.filter((_, i) => i !== index);
        const newSubtotal = calculatePhasesTotal(updated);
        const disc = parseFloat(editForm.data.discount) || 0;
        const tx = parseFloat(editForm.data.tax) || 0;
        const newTotal = Math.max(0, newSubtotal - disc + tx);

        editForm.setData({
            ...editForm.data,
            phases: updated,
            subtotal: newSubtotal,
            total_amount: newTotal,
        });
    };

    const handleDateFilter = (start, end) => {
        setFilterStartDate(start);
        setFilterEndDate(end);
        const query = {};
        if (start) query.start_date = start;
        if (end) query.end_date = end;
        if (activeTab === 'work_orders') query.view_type = 'work_orders';
        router.get('/admin/quotes', query, { preserveState: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const query = {};
        if (tab === 'work_orders') query.view_type = 'work_orders';
        if (filterStartDate) query.start_date = filterStartDate;
        if (filterEndDate) query.end_date = filterEndDate;
        router.get('/admin/quotes', query, { preserveState: true });
    };

    const handleClearDateFilter = () => {
        setFilterStartDate('');
        setFilterEndDate('');
        router.get('/admin/quotes', activeTab === 'work_orders' ? { view_type: 'work_orders' } : {}, { preserveState: true });
    };

    const handleOpenEdit = (quote) => {
        setEditQuote(quote);
        const quotePhases = Array.isArray(quote.phases) && quote.phases.length > 0 
            ? quote.phases 
            : [{ name: 'Core Deliverables', description: quote.message || '', duration: 'Standard', cost: quote.total_amount || quote.estimated_budget || '' }];
        
        const quoteTerms = Array.isArray(quote.payment_terms) && quote.payment_terms.length > 0
            ? quote.payment_terms
            : defaultPaymentTerms;

        editForm.setData({
            name: quote.name || '',
            company_name: quote.company_name || '',
            email: quote.email || '',
            phone: quote.phone || '',
            item_id: quote.item_id || '',
            project_title: quote.project_title || (quote.item ? quote.item.name : ''),
            valid_until: quote.valid_until || '',
            phases: quotePhases,
            subtotal: quote.subtotal || quote.estimated_budget || '',
            discount: quote.discount || 0,
            tax: quote.tax || 0,
            total_amount: quote.total_amount || quote.estimated_budget || '',
            payment_terms: quoteTerms,
            terms_conditions: quote.terms_conditions || '',
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

    const handleSendEmail = (quote) => {
        if (!quote.email) {
            alert('Quotation does not have an email address.');
            return;
        }
        if (confirm(`Send official Quotation & Work Order Proposal to ${quote.email}?`)) {
            setSendingEmailId(quote.id);
            router.post(`/admin/quotes/${quote.id}/send-email`, {}, {
                preserveScroll: true,
                onFinish: () => setSendingEmailId(null),
            });
        }
    };

    const handleConvertToOrder = (quote) => {
        if (confirm(`Convert quotation #${quote.quote_number || quote.id} for "${quote.name}" into an active Order & Client account?`)) {
            router.post(`/admin/quotes/${quote.id}/convert`);
        }
    };

    const handleDelete = (quote) => {
        if (confirm(`Are you sure you want to delete quotation #${quote.quote_number || quote.id}?`)) {
            router.delete(`/admin/quotes/${quote.id}`, { preserveScroll: true });
        }
    };

    const handleCopyPublicLink = (quote) => {
        const url = quote.public_url || `${window.location.origin}/quotes/view/${quote.public_token}`;
        navigator.clipboard.writeText(url);
        setCopiedQuoteId(quote.id);
        setTimeout(() => setCopiedQuoteId(null), 2500);
    };

    const getWhatsAppUrl = (quote) => {
        const phone = quote.phone;
        if (!phone) return '#';
        let clean = phone.replace(/[^0-9+]/g, '');
        if (clean.startsWith('01')) clean = '880' + clean.substring(1);
        if (clean.startsWith('+')) clean = clean.replace('+', '');
        
        const url = quote.public_url || `${window.location.origin}/quotes/view/${quote.public_token}`;
        const total = parseFloat(quote.total_amount || quote.estimated_budget || 0).toLocaleString();
        
        const msg = encodeURIComponent(
            `Hello ${quote.name || 'Customer'},\n\nWe have prepared your Quotation Proposal (#${quote.quote_number || quote.id}) for "${quote.project_title || quote.item?.name || 'Project'}".\n\nTotal Proposed: ৳${total} BDT\n\nYou can review the complete phase breakdown, payment schedule & digitally sign the work order here:\n${url}\n\nBest regards,\n${brandName}`
        );
        return `https://wa.me/${clean}?text=${msg}`;
    };

    // Printable letterhead window
    const printQuotationDocument = (quote) => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) {
            alert('Popup blocker prevented opening print window. Please allow popups.');
            return;
        }

        const phasesList = Array.isArray(quote.phases) && quote.phases.length > 0 ? quote.phases : [
            { name: quote.project_title || quote.item?.name || 'Complete Software Development Solution', duration: 'Standard', cost: quote.total_amount || quote.estimated_budget || 0 }
        ];

        const termsList = Array.isArray(quote.payment_terms) && quote.payment_terms.length > 0 ? quote.payment_terms : [
            { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: (quote.total_amount * 0.5) },
            { percentage: 20, condition: '20% Upon completion of Core Engineering Phase', amount: (quote.total_amount * 0.2) },
            { percentage: 30, condition: '30% Upon Final Handover, Training & Deployment', amount: (quote.total_amount * 0.3) },
        ];

        const sub = parseFloat(quote.subtotal || quote.estimated_budget || 0);
        const disc = parseFloat(quote.discount || 0);
        const tx = parseFloat(quote.tax || 0);
        const tot = parseFloat(quote.total_amount || (sub - disc + tx));
        const isSigned = Boolean(quote.client_signature && quote.client_signed_at);
        const isWO = Boolean(quote.is_work_order || isSigned);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${isWO ? 'Work Order' : 'Quotation'} #${quote.quote_number || quote.id} - ${brandName}</title>
                <style>
                    @page { size: A4; margin: 12mm; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 11pt; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
                    .logo-area h1 { margin: 0; font-size: 22px; font-weight: 800; color: #1e3a8a; }
                    .logo-area p { margin: 3px 0 0; font-size: 10px; color: #64748b; max-width: 320px; }
                    .ref-area { text-align: right; }
                    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800; background: ${isWO ? '#dcfce7' : '#dbeafe'}; color: ${isWO ? '#166534' : '#1e40af'}; text-transform: uppercase; margin-bottom: 4px; }
                    .ref-title { font-size: 16px; font-weight: 800; font-family: monospace; }
                    .info-grid { display: flex; justify-content: space-between; margin-bottom: 24px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
                    .info-box { font-size: 11px; }
                    .info-box h4 { margin: 0 0 4px; text-transform: uppercase; color: #94a3b8; font-size: 9px; font-weight: 800; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
                    th { text-align: left; padding: 8px 10px; background: #f1f5f9; border-bottom: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 9px; }
                    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
                    .financial-box { margin-left: auto; width: 260px; font-size: 11px; margin-bottom: 24px; }
                    .financial-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
                    .financial-total { display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #0f172a; font-weight: 800; font-size: 13px; color: #1e3a8a; }
                    .milestone-section { margin-bottom: 24px; }
                    .milestone-grid { display: flex; gap: 12px; }
                    .milestone-card { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; font-size: 10px; }
                    .milestone-card strong { display: block; font-size: 13px; color: #1e3a8a; margin: 4px 0; }
                    .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
                    .sig-box { width: 45%; border-top: 1px dashed #94a3b8; text-align: center; padding-top: 8px; font-size: 11px; }
                    .sig-img { max-height: 50px; display: block; margin: 0 auto 6px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-area">
                        ${brandLogo ? `<img src="${brandLogo}" style="max-height: 42px; margin-bottom: 6px;" />` : ''}
                        <h1>${brandName}</h1>
                        <p>${brandAddress}<br>Phone: ${brandPhone} | Email: ${brandEmail}</p>
                    </div>
                    <div class="ref-area">
                        <div class="badge">${isWO ? 'Official Work Order' : 'Commercial Quotation'}</div>
                        <div class="ref-title">#${quote.quote_number || quote.id}</div>
                        <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
                            Date: ${new Date(quote.created_at || Date.now()).toLocaleDateString()}<br>
                            ${quote.valid_until ? `Valid Until: ${new Date(quote.valid_until).toLocaleDateString()}` : ''}
                        </div>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <h4>Quotation For:</h4>
                        <strong>${quote.name}</strong><br>
                        ${quote.company_name ? `${quote.company_name}<br>` : ''}
                        ${quote.phone ? `Phone: ${quote.phone}<br>` : ''}
                        ${quote.email ? `Email: ${quote.email}` : ''}
                    </div>
                    <div class="info-box" style="text-align: right;">
                        <h4>Project Scope:</h4>
                        <strong>${quote.project_title || quote.item?.name || 'Custom Tech Development'}</strong><br>
                        ${quote.item ? `Category: ${quote.item.name}<br>` : ''}
                        Status: <span style="text-transform: capitalize; font-weight: 700;">${quote.status}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 25px;">#</th>
                            <th>Phase Deliverables</th>
                            <th style="width: 120px;">Require Time</th>
                            <th style="width: 120px; text-align: right;">Cost (৳ BDT)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${phasesList.map((p, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>
                                    <strong>${p.name || `Phase ${i + 1}`}</strong>
                                    ${p.description ? `<div style="color: #64748b; font-size: 10px; margin-top: 2px;">${p.description}</div>` : ''}
                                </td>
                                <td>${p.duration || 'Flexible'}</td>
                                <td style="text-align: right; font-weight: 700; font-family: monospace;">৳${parseFloat(p.cost || 0).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="financial-box">
                    <div class="financial-row"><span>Subtotal:</span><strong>৳${sub.toLocaleString()}</strong></div>
                    ${disc > 0 ? `<div class="financial-row" style="color: #166534;"><span>Discount:</span><strong>-৳${disc.toLocaleString()}</strong></div>` : ''}
                    ${tx > 0 ? `<div class="financial-row"><span>Tax / VAT:</span><strong>+৳${tx.toLocaleString()}</strong></div>` : ''}
                    <div class="financial-total"><span>Total Contract:</span><span>৳${tot.toLocaleString()} BDT</span></div>
                </div>

                <div class="milestone-section">
                    <h4 style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; color: #475569;">Payment Conditions & Milestones:</h4>
                    <div class="milestone-grid">
                        ${termsList.map((t, i) => `
                            <div class="milestone-card">
                                <div style="font-weight: 700; color: #64748b;">Stage ${i + 1} (${t.percentage}%)</div>
                                <strong>৳${parseFloat(t.amount || (tot * (t.percentage / 100))).toLocaleString()}</strong>
                                <div style="color: #475569; font-size: 9px;">${t.condition || t.phase_name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="font-size: 10px; color: #64748b; margin-bottom: 24px; background: #fafafa; padding: 8px; border-radius: 4px;">
                    <strong>Terms & Work Order Agreement:</strong><br>
                    ${quote.terms_conditions || 'Project kickoff initiated upon 50% advance deposit. Revisions outside defined phases subject to separate addendum. Source code and deployment credentials released upon final 30% payment.'}
                </div>

                <div class="signatures">
                    <div class="sig-box">
                        <div style="height: 45px; display: flex; align-items: center; justify-content: center;">
                            <div style="font-weight: 800; color: #1e3a8a; font-style: italic;">${quote.company_signer_name || brandName}</div>
                        </div>
                        <strong>Authorized Signature & Stamp</strong><br>
                        ${brandName} Management
                    </div>
                    <div class="sig-box">
                        <div style="height: 45px; display: flex; align-items: center; justify-content: center;">
                            ${quote.client_signature?.startsWith('data:image') 
                                ? `<img src="${quote.client_signature}" class="sig-img" />`
                                : `<span style="font-weight: 700; color: ${isSigned ? '#166534' : '#94a3b8'};">${quote.client_signer_name || (isSigned ? 'Digitally Signed' : 'Pending Client Signature')}</span>`
                            }
                        </div>
                        <strong>Client Acceptance & Signature</strong><br>
                        ${quote.client_signer_name || quote.name} ${quote.client_signed_at ? `(${new Date(quote.client_signed_at).toLocaleDateString()})` : ''}
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 400);
    };

    // Filter quotes client side
    const filteredQuotes = quoteList.filter(q => {
        if (!search) return true;
        const query = search.toLowerCase();
        return (
            (q.name || '').toLowerCase().includes(query) ||
            (q.company_name || '').toLowerCase().includes(query) ||
            (q.email || '').toLowerCase().includes(query) ||
            (q.phone || '').toLowerCase().includes(query) ||
            (q.quote_number || '').toLowerCase().includes(query) ||
            (q.work_order_number || '').toLowerCase().includes(query) ||
            (q.project_title || '').toLowerCase().includes(query) ||
            (q.item?.name || '').toLowerCase().includes(query)
        );
    });

    return (
        <AdminLayout title="Quotations & Work Orders">
            <div className="space-y-5 max-w-7xl mx-auto pb-10">
                
                {/* 1. TOP HEADER & ADD BUTTON */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                                Quotations &amp; Work Orders
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                Multi-Phase &amp; Signature
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Engineer professional multi-phase quotations, automate 50-20-30 payment milestones, and execute digital signature work orders.
                        </p>
                    </div>

                    <Link
                        href="/admin/quotes/create"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Quotation</span>
                    </Link>
                </div>

                {/* 2. SUMMARY METRICS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Total Quotations</span>
                        <div className="text-2xl font-black text-slate-900">
                            {metrics.total_quotes ?? quoteList.length}
                        </div>
                        <span className="text-[10px] text-slate-500">Commercial proposals created</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Executed Work Orders
                        </span>
                        <div className="text-2xl font-black text-emerald-800">
                            {metrics.work_orders_count ?? 0}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">Digitally signed &amp; active contracts</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold text-amber-700 uppercase">Pending Inquiries</span>
                        <div className="text-2xl font-black text-amber-800">
                            {metrics.pending_count ?? 0}
                        </div>
                        <span className="text-[10px] text-amber-600 font-medium">In discussion &amp; sent</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold text-blue-700 uppercase">Total Pipeline Value</span>
                        <div className="text-2xl font-black text-blue-900 font-mono">
                            ৳{Number(metrics.pipeline_value || 0).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-blue-600 font-medium">Accumulated deal worth</span>
                    </div>
                </div>

                {/* 3. TABS, SEARCH & FILTER BAR */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
                    
                    {/* View Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => handleTabChange('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All Quotations
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('work_orders')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'work_orders' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Signed Work Orders</span>
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Ref, Client, Title, Phone..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </div>

                    {/* Date Filters */}
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

                {/* 4. MAIN QUOTATIONS TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[980px] text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-slate-200 bg-slate-50/80 text-[10px] font-mono">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3 whitespace-nowrap">Ref / Type</th>
                                    <th className="py-3.5 px-3">Client &amp; Company</th>
                                    <th className="py-3.5 px-3">Project &amp; Phases</th>
                                    <th className="py-3.5 px-3 whitespace-nowrap">Investment</th>
                                    <th className="py-3.5 px-3 whitespace-nowrap">Payment Plan</th>
                                    <th className="py-3.5 px-3 whitespace-nowrap">Digital Signature</th>
                                    <th className="py-3.5 px-3 whitespace-nowrap">Status</th>
                                    <th className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredQuotes.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-10 text-center text-slate-400">
                                            No quotation records found. Click "Create Quotation" to draft one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuotes.map((q) => {
                                        const total = parseFloat(q.total_amount || q.estimated_budget || 0);
                                        const isSigned = Boolean(q.client_signature && q.client_signed_at);
                                        const isWO = Boolean(q.is_work_order || isSigned);
                                        const phasesCount = Array.isArray(q.phases) ? q.phases.length : 0;

                                        return (
                                            <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                                                
                                                {/* Ref & Type */}
                                                <td className="py-3.5 pl-5 pr-3 whitespace-nowrap">
                                                    <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                        <span>#{q.quote_number || `QUO-${q.id}`}</span>
                                                    </div>
                                                    {isWO ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                                                            <ShieldCheck className="w-2.5 h-2.5" />
                                                            Work Order
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 block mt-0.5">
                                                            Proposal
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Client & Company */}
                                                <td className="py-3.5 px-3">
                                                    <div className="font-bold text-slate-900 text-sm">{q.name}</div>
                                                    {q.company_name ? (
                                                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                                            <Building2 className="w-3 h-3 text-slate-400" />
                                                            {q.company_name}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[11px] text-slate-400">{q.email}</div>
                                                    )}
                                                </td>

                                                {/* Project & Phases */}
                                                <td className="py-3.5 px-3 max-w-[220px]">
                                                    <div className="font-semibold text-slate-900 truncate">
                                                        {q.project_title || q.item?.name || 'Technical Development'}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                                        <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                                                            <Layers className="w-3 h-3" />
                                                            {phasesCount > 0 ? `${phasesCount} Phases` : 'Standard Scope'}
                                                        </span>
                                                        {q.valid_until && (
                                                            <span className="text-amber-600 font-mono text-[10px]">
                                                                Exp: {q.valid_until}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Investment */}
                                                <td className="py-3.5 px-3 whitespace-nowrap">
                                                    <div className="font-mono font-bold text-slate-900 text-sm">
                                                        ৳{total.toLocaleString()}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                                                        {q.currency || 'BDT'}
                                                    </div>
                                                </td>

                                                {/* Payment Plan */}
                                                <td className="py-3.5 px-3 whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">
                                                        <span>50% Adv: ৳{(total * 0.5).toLocaleString()}</span>
                                                    </div>
                                                    <span className="block text-[10px] text-slate-400 mt-0.5">
                                                        20% Milestone &bull; 30% Delivery
                                                    </span>
                                                </td>

                                                {/* Digital Signature */}
                                                <td className="py-3.5 px-3 whitespace-nowrap">
                                                    {isSigned ? (
                                                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                            <div>
                                                                <div>Signed by {q.client_signer_name || 'Client'}</div>
                                                                <span className="text-[10px] text-slate-400 font-mono block">
                                                                    {q.client_signed_at ? new Date(q.client_signed_at).toLocaleDateString() : ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-amber-600 font-medium text-xs">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>Pending Signature</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-3.5 px-3 whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                                        q.status === 'won' || q.status === 'signed'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : q.status === 'contacted'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : q.status === 'sent'
                                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            : q.status === 'lost'
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}>
                                                        {q.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        
                                                        {/* Quick Print Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => printQuotationDocument(q)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Print Quotation / Work Order"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </button>

                                                        {/* View / Modal Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewQuote(q)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                                            title="View Document Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* Action Dropdown Menu */}
                                                        <ActionDropdown>
                                                            <ActionItem
                                                                icon={Eye}
                                                                label="View Letterhead Document"
                                                                onClick={() => setViewQuote(q)}
                                                            />
                                                            <ActionItem
                                                                icon={Printer}
                                                                label="Print / Download PDF"
                                                                onClick={() => printQuotationDocument(q)}
                                                            />
                                                            <ActionItem
                                                                icon={Mail}
                                                                label={sendingEmailId === q.id ? "Sending..." : "Send Proposal via Email"}
                                                                onClick={() => handleSendEmail(q)}
                                                            />
                                                            {q.phone && (
                                                                <ActionItem
                                                                    icon={Send}
                                                                    label="Share on WhatsApp"
                                                                    onClick={() => window.open(getWhatsAppUrl(q), '_blank')}
                                                                />
                                                            )}
                                                            <ActionItem
                                                                icon={Share2}
                                                                label={copiedQuoteId === q.id ? "Link Copied!" : "Copy Public Signing Link"}
                                                                onClick={() => handleCopyPublicLink(q)}
                                                            />
                                                            <ActionItem
                                                                icon={Edit}
                                                                label="Edit Phases & Milestones"
                                                                onClick={() => handleOpenEdit(q)}
                                                            />
                                                            <ActionItem
                                                                icon={Briefcase}
                                                                label="Convert to Active Order"
                                                                onClick={() => handleConvertToOrder(q)}
                                                            />
                                                            <ActionItem
                                                                icon={Trash2}
                                                                label="Delete Quotation"
                                                                danger
                                                                onClick={() => handleDelete(q)}
                                                            />
                                                        </ActionDropdown>
                                                    </div>
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


            {/* ======================================================== */}
            {/* 2. EDIT QUOTATION MODAL (PHASES & PAYMENT TERMS) */}
            {/* ======================================================== */}
            <Modal show={Boolean(editQuote)} onClose={() => setEditQuote(null)} maxWidth="2xl">
                {editQuote && (
                    <div className="bg-white p-6 rounded-3xl text-slate-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
                                    <Edit className="w-5 h-5 text-blue-600" />
                                    Edit Quotation #{editQuote.quote_number || editQuote.id}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Modify phases, payment schedule and project scope.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditQuote(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Customer / Contact Person *</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-slate-700 font-bold mb-1">Project Scope Title</label>
                                    <input
                                        type="text"
                                        value={editForm.data.project_title}
                                        onChange={(e) => editForm.setData('project_title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Status</label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 capitalize font-bold"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="sent">Proposal Sent</option>
                                        <option value="signed">Signed</option>
                                        <option value="won">Won</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>
                            </div>

                            {/* Edit Phases */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 text-xs">Project Phases &amp; Deliverables</span>
                                    <button
                                        type="button"
                                        onClick={addEditPhase}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Phase</span>
                                    </button>
                                </div>

                                <div className="space-y-2.5">
                                    {editForm.data.phases.map((ph, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-800 text-[11px]">Phase #{idx + 1}</span>
                                                {editForm.data.phases.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEditPhase(idx)}
                                                        className="text-slate-400 hover:text-rose-600 p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                                <div className="sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        value={ph.name}
                                                        onChange={(e) => handleEditPhaseChange(idx, 'name', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={ph.duration}
                                                        onChange={(e) => handleEditPhaseChange(idx, 'duration', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={ph.cost}
                                                        onChange={(e) => handleEditPhaseChange(idx, 'cost', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <textarea
                                                    rows="2"
                                                    value={ph.description || ''}
                                                    onChange={(e) => handleEditPhaseChange(idx, 'description', e.target.value)}
                                                    placeholder="Scope details..."
                                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-1">
                                    <div>
                                        <label className="block text-slate-600 font-bold mb-1">Subtotal (৳)</label>
                                        <input
                                            type="number"
                                            value={editForm.data.subtotal}
                                            readOnly
                                            className="w-full px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 font-bold mb-1">Discount (৳)</label>
                                        <input
                                            type="number"
                                            value={editForm.data.discount}
                                            onChange={(e) => {
                                                const disc = parseFloat(e.target.value) || 0;
                                                const sub = parseFloat(editForm.data.subtotal) || 0;
                                                const tx = parseFloat(editForm.data.tax) || 0;
                                                editForm.setData({
                                                    ...editForm.data,
                                                    discount: disc,
                                                    total_amount: Math.max(0, sub - disc + tx),
                                                });
                                            }}
                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 font-bold mb-1">Total Amount (৳)</label>
                                        <input
                                            type="number"
                                            value={editForm.data.total_amount}
                                            readOnly
                                            className="w-full px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 font-mono font-bold text-blue-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditQuote(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                                >
                                    {editForm.processing ? 'Updating...' : 'Update Quotation'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* ======================================================== */}
            {/* 3. VIEW QUOTATION / WORK ORDER MODAL (CORPORATE PREVIEW) */}
            {/* ======================================================== */}
            <Modal show={Boolean(viewQuote)} onClose={() => setViewQuote(null)} maxWidth="2xl">
                {viewQuote && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl text-slate-900 max-h-[90vh] overflow-y-auto space-y-6">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                            <div>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                    viewQuote.is_work_order || viewQuote.client_signature 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {viewQuote.is_work_order || viewQuote.client_signature ? 'Executed Work Order' : 'Commercial Quotation'}
                                </span>
                                <h2 className="text-xl font-black text-slate-950 mt-1">
                                    #{viewQuote.quote_number || `QUO-${viewQuote.id}`}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Prepared by {brandName} &bull; Date: {new Date(viewQuote.created_at || Date.now()).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={() => setViewQuote(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Client details card */}
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Details</span>
                                <p className="font-bold text-slate-900 text-sm">{viewQuote.name}</p>
                                {viewQuote.company_name && <p className="text-slate-600">{viewQuote.company_name}</p>}
                                <p className="text-slate-500 font-mono mt-1">{viewQuote.phone || 'No phone'}</p>
                                <p className="text-blue-600">{viewQuote.email}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Scope &amp; Investment</span>
                                <p className="font-bold text-slate-900 text-sm">{viewQuote.project_title || viewQuote.item?.name || 'Technical Development'}</p>
                                <p className="font-mono font-black text-blue-700 text-base mt-1">
                                    ৳{parseFloat(viewQuote.total_amount || viewQuote.estimated_budget || 0).toLocaleString()} BDT
                                </p>
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700 mt-1">
                                    Status: {viewQuote.status}
                                </span>
                            </div>
                        </div>

                        {/* Phases Table */}
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-blue-600" />
                                Project Phases &amp; Deliverables
                            </h4>
                            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-100 text-slate-500 uppercase text-[10px]">
                                        <tr>
                                            <th className="p-2.5">Phase</th>
                                            <th className="p-2.5">Require Time</th>
                                            <th className="p-2.5 text-right">Cost (৳)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(Array.isArray(viewQuote.phases) && viewQuote.phases.length > 0 ? viewQuote.phases : [
                                            { name: viewQuote.project_title || viewQuote.item?.name || 'Turnkey Solution', duration: 'Standard', cost: viewQuote.total_amount || viewQuote.estimated_budget || 0 }
                                        ]).map((p, i) => (
                                            <tr key={i}>
                                                <td className="p-2.5">
                                                    <div className="font-bold text-slate-900">{p.name || `Phase ${i + 1}`}</div>
                                                    {p.description && <div className="text-slate-500 text-[11px]">{p.description}</div>}
                                                </td>
                                                <td className="p-2.5 text-slate-600">{p.duration || 'Flexible'}</td>
                                                <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                                    ৳{parseFloat(p.cost || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment Milestones (50-20-30) */}
                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                            <span className="text-[10px] font-black uppercase text-blue-700">Contractual Payment Schedule</span>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                                    <span className="text-[10px] text-slate-400 font-bold">50% Advance</span>
                                    <div className="font-mono font-bold text-slate-900">
                                        ৳{(parseFloat(viewQuote.total_amount || viewQuote.estimated_budget || 0) * 0.5).toLocaleString()}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Upon Signing</span>
                                </div>
                                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                                    <span className="text-[10px] text-slate-400 font-bold">20% Milestone</span>
                                    <div className="font-mono font-bold text-slate-900">
                                        ৳{(parseFloat(viewQuote.total_amount || viewQuote.estimated_budget || 0) * 0.2).toLocaleString()}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Core Phase</span>
                                </div>
                                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                                    <span className="text-[10px] text-slate-400 font-bold">30% Final</span>
                                    <div className="font-mono font-bold text-slate-900">
                                        ৳{(parseFloat(viewQuote.total_amount || viewQuote.estimated_budget || 0) * 0.3).toLocaleString()}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Signatures status */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 rounded-xl border border-slate-200 bg-white text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Company Representative:</span>
                                <div className="font-bold text-slate-900 mt-1">{viewQuote.company_signer_name || brandName}</div>
                                <span className="text-[10px] text-emerald-600 font-bold">Corporate Verified Seal</span>
                            </div>
                            <div className="p-3 rounded-xl border border-slate-200 bg-white text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Client Confirmation:</span>
                                {viewQuote.client_signature ? (
                                    <div>
                                        <div className="font-bold text-emerald-700 mt-1">{viewQuote.client_signer_name}</div>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Signed: {new Date(viewQuote.client_signed_at).toLocaleString()}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-amber-600 font-semibold mt-1">Pending Digital Signature</div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => printQuotationDocument(viewQuote)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print / PDF Document</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSendEmail(viewQuote)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Send Email</span>
                                </button>

                                {viewQuote.phone && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(getWhatsAppUrl(viewQuote), '_blank')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>WhatsApp</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleCopyPublicLink(viewQuote)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                >
                                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Copy Link</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleConvertToOrder(viewQuote)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                            >
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>Convert to Order</span>
                            </button>
                        </div>

                    </div>
                )}
            </Modal>

        </AdminLayout>
    );
}
