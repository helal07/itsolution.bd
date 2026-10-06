import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { 
    ArrowLeft, 
    Save, 
    Plus, 
    Trash2, 
    Sparkles, 
    Check, 
    FileText, 
    ShieldCheck, 
    DollarSign, 
    Layers, 
    Calendar, 
    User, 
    Building2, 
    Mail, 
    Phone, 
    Clock, 
    Briefcase,
    HelpCircle,
    CheckCircle2,
    X,
    UserPlus,
    Search
} from 'lucide-react';

export default function Create({ items = [], clients = [], companyDetails = {} }) {
    // Initial default 3 phases template
    const defaultPhases = [
        { name: 'Phase 1: Discovery, UI/UX & Wireframing', description: 'System requirements gathering, interactive UI/UX prototypes, and architecture design.', duration: '5-7 Days', cost: '' },
        { name: 'Phase 2: Core Engineering & Integrations', description: 'Backend business logic, database migrations, REST/GraphQL APIs, and frontend implementation.', duration: '14-21 Days', cost: '' },
        { name: 'Phase 3: QA, Security Audit & Deployment', description: 'Cross-device user testing, vulnerability audit, production deployment, and client handover.', duration: '5-7 Days', cost: '' },
    ];

    // Initial default 50-20-30 payment condition
    const defaultPaymentTerms = [
        { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: '' },
        { percentage: 20, condition: '20% Upon completion of Core Engineering Phase', amount: '' },
        { percentage: 30, condition: '30% Upon Final Handover, Training & Deployment', amount: '' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        save_as_new_client: true,
        name: '',
        company_name: '',
        email: '',
        phone: '',
        item_id: items[0]?.id || '',
        project_title: '',
        valid_until: '',
        currency: 'BDT',
        phases: defaultPhases,
        subtotal: '',
        discount: 0,
        tax: 0,
        total_amount: '',
        payment_terms: defaultPaymentTerms,
        terms_conditions: '',
        message: '',
        notes: '',
        status: 'new',
    });

    const calculatePhasesTotal = (phasesList) => {
        return phasesList.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
    };

    const updateTotals = (phasesList, discValue, taxValue, termsList) => {
        const sub = calculatePhasesTotal(phasesList);
        const disc = parseFloat(discValue) || 0;
        const tx = parseFloat(taxValue) || 0;
        const total = Math.max(0, sub - disc + tx);

        const currentTerms = termsList || data.payment_terms || defaultPaymentTerms;
        const updatedTerms = currentTerms.map(term => ({
            ...term,
            amount: ((total * (parseFloat(term.percentage) || 0)) / 100).toFixed(2),
        }));

        setData(prev => ({
            ...prev,
            phases: phasesList,
            subtotal: sub,
            discount: discValue,
            tax: taxValue,
            total_amount: total,
            payment_terms: updatedTerms,
        }));
    };

    const handlePhaseChange = (index, field, value) => {
        const updatedPhases = [...data.phases];
        updatedPhases[index][field] = value;
        updateTotals(updatedPhases, data.discount, data.tax, data.payment_terms);
    };

    const addPhase = () => {
        const updatedPhases = [
            ...data.phases,
            { name: `Phase ${data.phases.length + 1}: Custom Milestone`, description: 'Custom scope deliverables...', duration: '7 Days', cost: '' }
        ];
        updateTotals(updatedPhases, data.discount, data.tax, data.payment_terms);
    };

    const removePhase = (index) => {
        if (data.phases.length <= 1) return;
        const updatedPhases = data.phases.filter((_, i) => i !== index);
        updateTotals(updatedPhases, data.discount, data.tax, data.payment_terms);
    };

    const handleDiscountChange = (val) => {
        updateTotals(data.phases, val, data.tax, data.payment_terms);
    };

    const handleTaxChange = (val) => {
        updateTotals(data.phases, data.discount, val, data.payment_terms);
    };

    const resetPaymentMilestones = () => {
        const total = parseFloat(data.total_amount) || 0;
        const freshTerms = [
            { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: (total * 0.5).toFixed(2) },
            { percentage: 20, condition: '20% Upon completion of Core Engineering Phase', amount: (total * 0.2).toFixed(2) },
            { percentage: 30, condition: '30% Upon Final Handover, Training & Deployment', amount: (total * 0.3).toFixed(2) },
        ];
        setData('payment_terms', freshTerms);
    };

    const [showAddClientModal, setShowAddClientModal] = useState(false);

    const quickClientForm = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
    });

    const handleClientSelect = (clientId) => {
        if (!clientId) {
            handleClearClient();
            return;
        }
        const selected = clients.find(c => String(c.id) === String(clientId));
        if (selected) {
            setData(prev => ({
                ...prev,
                client_id: selected.id,
                name: selected.contact_person || selected.name || '',
                company_name: selected.name || '',
                email: selected.email || '',
                phone: selected.phone || '',
            }));
        }
    };

    const handleClearClient = () => {
        setData(prev => ({
            ...prev,
            client_id: '',
            name: '',
            company_name: '',
            email: '',
            phone: '',
        }));
    };

    const handleCreateQuickClient = (e) => {
        e.preventDefault();
        quickClientForm.post('/admin/clients', {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowAddClientModal(false);
                const newlyCreated = (page.props.clients || []).find(
                    c => (quickClientForm.data.email && c.email === quickClientForm.data.email) || c.name === quickClientForm.data.name
                );
                if (newlyCreated) {
                    handleClientSelect(newlyCreated.id);
                } else {
                    setData(prev => ({
                        ...prev,
                        name: quickClientForm.data.contact_person || quickClientForm.data.name,
                        company_name: quickClientForm.data.name,
                        email: quickClientForm.data.email || '',
                        phone: quickClientForm.data.phone || '',
                    }));
                }
                quickClientForm.reset();
            },
        });
    };

    const activeClient = clients.find(c => String(c.id) === String(data.client_id));

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/quotes');
    };

    return (
        <AdminLayout title="Create Quotation">
            <div className="space-y-6 max-w-7xl mx-auto pb-16">
                
                {/* Header & Breadcrumb */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/quotes" 
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                                    Create Commercial Quotation
                                </h1>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                    Full Page Engine
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Formulate project phases, cost estimates, milestone payment conditions, and legally binding work orders.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/quotes"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Generating...' : 'Save & Generate Quotation'}</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Scope, Phases & Terms (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Step 1: Client Information */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span>Step 1: Client &amp; Organization Particulars</span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddClientModal(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 cursor-pointer shadow-2xs"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>+ নতুন ক্লায়েন্ট যোগ করুন (Quick Add)</span>
                                    </button>
                                    <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Recipient Details</span>
                                </div>
                            </div>

                            {/* Saved Clients Selector Bar */}
                            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                        <span>সেভড ক্লায়েন্ট তালিকা থেকে নির্বাচন করুন (Select From Saved Clients):</span>
                                    </label>
                                    {data.client_id ? (
                                        <button
                                            type="button"
                                            onClick={handleClearClient}
                                            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                            <span>সিলেকশন মুছুন / নতুন তথ্য লিখুন</span>
                                        </button>
                                    ) : (
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            পুরাতন ক্লায়েন্ট সিলেক্ট করলে তথ্য স্বয়ংক্রিয়ভাবে বসে যাবে
                                        </span>
                                    )}
                                </div>

                                {/* Dropdown Selector */}
                                <div className="grid grid-cols-1 gap-2">
                                    <select
                                        value={data.client_id}
                                        onChange={(e) => handleClientSelect(e.target.value)}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                            data.client_id 
                                                ? 'bg-blue-50/50 border-blue-300 text-blue-950 font-bold focus:ring-blue-200' 
                                                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                    >
                                        <option value="">-- নতুন ক্লায়েন্ট / ম্যানুয়ালি ইনপুট দিন (New Client / Manual Input) --</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} {c.contact_person && c.contact_person !== c.name ? `[যোগাযোগ: ${c.contact_person}]` : ''} {c.phone ? `• 📱 ${c.phone}` : ''} {c.email ? `• ✉️ ${c.email}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selected Client Live Pill / Banner */}
                                {activeClient ? (
                                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <div className="truncate">
                                                <strong className="text-emerald-950">{activeClient.name}</strong>
                                                {activeClient.contact_person && activeClient.contact_person !== activeClient.name && (
                                                    <span className="text-emerald-800"> ({activeClient.contact_person})</span>
                                                )}
                                                <span className="text-emerald-700 text-[11px] font-mono">
                                                    {activeClient.email ? ` • ${activeClient.email}` : ''}
                                                    {activeClient.phone ? ` • ${activeClient.phone}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 shrink-0">
                                            ✓ সেভড ক্লায়েন্ট
                                        </span>
                                    </div>
                                ) : (
                                    /* Option to save new client in directory */
                                    <div className="pt-1 flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                                            <input
                                                type="checkbox"
                                                checked={data.save_as_new_client}
                                                onChange={(e) => setData('save_as_new_client', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span>এই ক্লায়েন্টকে ক্লায়েন্ট ডিরেক্টরিতে সেভ করুন (Save as New Client in Directory)</span>
                                        </label>
                                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                                            ভবিষ্যতে নতুন অর্ডারের জন্য সংরক্ষিত থাকবে
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Client / Contact Person Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Helal Uddin"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Company / Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        placeholder="e.g. Apex Global Corp"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Email Address (For PDF Proposal Dispatch) *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="client@company.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                        required
                                    />
                                    {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Phone / WhatsApp Number (For 1-Click Sharing)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+880 1800 000000"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Project Scope & Validity */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-indigo-600" />
                                    <span>Step 2: Project Scope &amp; Validity Schedule</span>
                                </h2>
                                <span className="text-[11px] font-bold text-slate-400">Proposal Term</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Project Scope Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.project_title}
                                        onChange={(e) => setData('project_title', e.target.value)}
                                        placeholder="e.g. Enterprise Multi-Branch POS & Mobile Ordering App"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    {errors.project_title && <p className="text-rose-500 text-xs mt-1">{errors.project_title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Quotation Valid Until
                                    </label>
                                    <input
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 cursor-pointer font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Base Software Catalog Service
                                    </label>
                                    <select
                                        value={data.item_id}
                                        onChange={(e) => setData('item_id', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500"
                                    >
                                        <option value="">-- Custom Engineering Architecture --</option>
                                        {items.map((i) => (
                                            <option key={i.id} value={i.id}>
                                                {i.name} (৳{parseFloat(i.price || 0).toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Billing Currency
                                    </label>
                                    <select
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-blue-500 font-mono"
                                    >
                                        <option value="BDT">BDT (৳ Bangladeshi Taka)</option>
                                        <option value="USD">USD ($ United States Dollar)</option>
                                        <option value="EUR">EUR (€ Euro)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Project Phases Breakdown */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-cyan-600" />
                                        <span>Step 3: Multi-Phase Project Breakdown &amp; Costs</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Specify milestones, timeline durations, and deliverables. Subtotal auto-calculates.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addPhase}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Add Another Phase</span>
                                </button>
                            </div>

                            <div className="space-y-4 pt-1">
                                {data.phases.map((phase, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative group hover:border-blue-200 transition-all"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={phase.name}
                                                    onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                                                    placeholder="Phase Title"
                                                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-xs focus:border-blue-500 w-64 sm:w-80"
                                                    required
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={phase.duration}
                                                        onChange={(e) => handlePhaseChange(idx, 'duration', e.target.value)}
                                                        placeholder="e.g. 5-7 Days"
                                                        className="w-20 text-[11px] font-semibold text-slate-700 outline-none"
                                                    />
                                                </div>

                                                {data.phases.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhase(idx)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                        title="Delete Phase"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                            <div className="sm:col-span-9">
                                                <textarea
                                                    rows={2}
                                                    value={phase.description}
                                                    onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                                                    placeholder="Detailed deliverables, technologies, and specs covered in this phase..."
                                                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs leading-relaxed focus:border-blue-500 resize-none"
                                                />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                                    Phase Cost (৳)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">৳</span>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={phase.cost}
                                                        onChange={(e) => handlePhaseChange(idx, 'cost', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-6 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 4: Milestone Payment Schedule (50-20-30) */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                        <span>Step 4: Milestone Payment Schedule (Work Order Terms)</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Standard payment condition: 50% Advance, 20% In-Progress, 30% Delivery.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetPaymentMilestones}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Reset 50-20-30 Percentages</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                                {(data.payment_terms || defaultPaymentTerms).map((term, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-800 text-xs">Milestone {idx + 1}</span>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    value={term.percentage}
                                                    onChange={(e) => {
                                                        const updated = [...data.payment_terms];
                                                        updated[idx].percentage = e.target.value;
                                                        const total = parseFloat(data.total_amount) || 0;
                                                        updated[idx].amount = ((total * (parseFloat(e.target.value) || 0)) / 100).toFixed(2);
                                                        setData('payment_terms', updated);
                                                    }}
                                                    className="w-12 px-1.5 py-0.5 text-center font-bold text-xs rounded border border-slate-200 bg-white"
                                                />
                                                <span className="text-xs font-bold text-slate-600">%</span>
                                            </div>
                                        </div>

                                        <textarea
                                            rows={2}
                                            value={term.condition}
                                            onChange={(e) => {
                                                const updated = [...data.payment_terms];
                                                updated[idx].condition = e.target.value;
                                                setData('payment_terms', updated);
                                            }}
                                            className="w-full p-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 resize-none focus:border-blue-500"
                                        />

                                        <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/60">
                                            <span className="text-slate-400 font-semibold text-[11px]">Due Amount:</span>
                                            <span className="font-mono font-black text-slate-900 text-sm">
                                                ৳{parseFloat(term.amount || ((data.total_amount || 0) * (term.percentage / 100))).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 5: Notes & Conditions */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-600" />
                                    <span>Step 5: Client Notes, Terms &amp; Execution Strategy</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Client Requirement Specifications
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Record client instructions, specific technical stack preferences, or integrations required..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs resize-none focus:bg-white focus:border-blue-500 leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Internal Engineering Notes (Confidential)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Notes for project managers and developer allocation (not shown to client)..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs resize-none focus:bg-white focus:border-blue-500 leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Special Legal Terms &amp; Warranties (Printed on Quotation &amp; Work Order)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.terms_conditions}
                                    onChange={(e) => setData('terms_conditions', e.target.value)}
                                    placeholder="e.g. 1 Year complimentary server maintenance and bug-fixing warranty included. All IP rights transferred upon final payment."
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs resize-none focus:bg-white focus:border-blue-500 leading-relaxed"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Calculations & Dispatch (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Financial Calculation Box */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Financial Investment Summary
                            </h2>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-semibold">Phases Subtotal:</span>
                                    <span className="font-mono font-bold text-slate-900 text-sm">
                                        ৳{Number(data.subtotal || calculatePhasesTotal(data.phases)).toLocaleString()}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                        Discount (৳)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.discount}
                                        onChange={(e) => handleDiscountChange(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                        VAT / Tax (৳)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.tax}
                                        onChange={(e) => handleTaxChange(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-1">
                                    <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">
                                        Total Commercial Value
                                    </span>
                                    <div className="text-3xl font-black font-mono tracking-tight">
                                        ৳{Number(data.total_amount || 0).toLocaleString()}
                                    </div>
                                    <span className="text-[10px] text-blue-200 block">
                                        Includes all milestone phases and scope items
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Initial Proposal Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="new">New Inquiry (Draft)</option>
                                    <option value="contacted">Contacted / In Discovery</option>
                                    <option value="sent">Proposal Sent to Client</option>
                                    <option value="approved">Client Approved (Pending Signature)</option>
                                    <option value="won">Won / Contract Confirmed</option>
                                </select>
                            </div>
                        </div>

                        {/* Agency Letterhead Particulars */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Letterhead &amp; Header Identity
                            </h2>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex items-center gap-2.5">
                                    {companyDetails.logo ? (
                                        <img src={companyDetails.logo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-slate-200" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                            IT
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-extrabold text-xs text-slate-900 truncate">
                                            {companyDetails.name || 'IT Solution'}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 block truncate">
                                            {companyDetails.email}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-tight">
                                    {companyDetails.address}
                                </p>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                This header identity will be embossed onto the generated Letterhead PDF, Email Template, and Digital Work Order.
                            </p>
                        </div>

                        {/* Save Action Box */}
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
                            <div>
                                <h3 className="font-extrabold text-sm text-white">Generate Quotation Document?</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Upon generation, a unique quotation number and secure public digital signing link will be minted.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Generating Document...' : 'Save & Mint Quotation'}</span>
                            </button>
                        </div>

                    </div>

                </form>

            </div>

            {/* Quick Add Client Modal */}
            <Modal show={showAddClientModal} onClose={() => setShowAddClientModal(false)} maxWidth="lg">
                <div className="p-6 bg-white rounded-2xl space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-sm">নতুন ক্লায়েন্ট যোগ করুন (Quick Add Client)</h3>
                                <p className="text-[11px] text-slate-500">ডিরেক্টরিতে সেভ হবে এবং সাথে সাথে কোটেশনে সিলেক্ট হয়ে যাবে</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAddClientModal(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateQuickClient} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Company / Client Name (প্রতিষ্ঠান বা ক্লায়েন্টের নাম) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={quickClientForm.data.name}
                                onChange={(e) => quickClientForm.setData('name', e.target.value)}
                                placeholder="যেমন: টেকনো সফটওয়্যার বা হেলিম উদ্দিন"
                                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500"
                                required
                            />
                            {quickClientForm.errors.name && (
                                <p className="text-rose-600 text-[11px] mt-1 font-semibold">{quickClientForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Contact Person Name (যোগাযোগকারী ব্যক্তি)
                            </label>
                            <input
                                type="text"
                                value={quickClientForm.data.contact_person}
                                onChange={(e) => quickClientForm.setData('contact_person', e.target.value)}
                                placeholder="যেমন: মো: হেলাল উদ্দিন"
                                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Email Address (ইমেইল)
                                </label>
                                <input
                                    type="email"
                                    value={quickClientForm.data.email}
                                    onChange={(e) => quickClientForm.setData('email', e.target.value)}
                                    placeholder="client@company.com"
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500 font-mono"
                                />
                                {quickClientForm.errors.email && (
                                    <p className="text-rose-600 text-[11px] mt-1 font-semibold">{quickClientForm.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Phone / WhatsApp Number (ফোন/হোয়াটসঅ্যাপ)
                                </label>
                                <input
                                    type="text"
                                    value={quickClientForm.data.phone}
                                    onChange={(e) => quickClientForm.setData('phone', e.target.value)}
                                    placeholder="+880 1800 000000"
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Address (ঠিকানা)
                            </label>
                            <input
                                type="text"
                                value={quickClientForm.data.address}
                                onChange={(e) => quickClientForm.setData('address', e.target.value)}
                                placeholder="মিরপুর, ঢাকা - ১২১৬"
                                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500"
                            />
                        </div>

                        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowAddClientModal(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                                বাতিল (Cancel)
                            </button>
                            <button
                                type="submit"
                                disabled={quickClientForm.processing}
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{quickClientForm.processing ? 'সেভ হচ্ছে...' : 'সেভ করুন ও সিলেক্ট করুন'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
