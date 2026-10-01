import React, { useRef, useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Printer, 
    Share2, 
    Send, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    Building2, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    FileText, 
    Download, 
    Layers, 
    DollarSign, 
    AlertCircle, 
    Eraser,
    PenTool,
    ArrowRight
} from 'lucide-react';

export default function QuoteView({ quote, companyDetails = {} }) {
    const brandName = companyDetails.name || 'IT Solution';
    const brandLogo = companyDetails.logo || '';
    const brandEmail = companyDetails.email || 'contact@itsolution.bd';
    const brandPhone = companyDetails.phone || '+880 1800-000000';
    const brandAddress = companyDetails.address || 'Level 8, Software Technology Park, Dhaka, Bangladesh';

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const isSigned = Boolean(quote.client_signature && quote.client_signed_at);
    const isWorkOrder = Boolean(quote.is_work_order || isSigned);

    const signForm = useForm({
        signer_name: quote.name || '',
        signature: '',
        terms_accepted: false,
    });

    // Canvas drawing initialization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [isSigned]);

    const getCanvasPos = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e) => {
        if (isSigned) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || isSigned) return;
        if (e.cancelable && e.type === 'touchmove') {
            e.preventDefault();
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pos = getCanvasPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setHasDrawn(true);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            signForm.setData('signature', canvas.toDataURL('image/png'));
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        signForm.setData('signature', '');
    };

    const handleSignSubmit = (e) => {
        e.preventDefault();
        if (!hasDrawn || !signForm.data.signature) {
            alert('Please draw your digital signature on the signature pad before submitting.');
            return;
        }
        if (!signForm.data.terms_accepted) {
            alert('Please accept and agree to the terms & conditions.');
            return;
        }

        signForm.post(`/quotes/sign/${quote.public_token}`, {
            preserveScroll: true,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
    };

    // Calculate totals
    const phases = Array.isArray(quote.phases) ? quote.phases : [];
    const subtotal = parseFloat(quote.subtotal || quote.estimated_budget || 0);
    const discount = parseFloat(quote.discount || 0);
    const tax = parseFloat(quote.tax || 0);
    const totalAmount = parseFloat(quote.total_amount || (subtotal - discount + tax));

    // Default payment terms if empty
    const defaultTerms = [
        { percentage: 50, condition: '50% Advance upon Work Order Confirmation & Kickoff', amount: (totalAmount * 0.5) },
        { percentage: 20, condition: '20% After Milestone / Core Phase Delivery', amount: (totalAmount * 0.2) },
        { percentage: 30, condition: '30% After Final Quality Assurance & Live Handover', amount: (totalAmount * 0.3) },
    ];
    const paymentTerms = (Array.isArray(quote.payment_terms) && quote.payment_terms.length > 0)
        ? quote.payment_terms
        : defaultTerms;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
            <Head title={`${isWorkOrder ? 'Work Order' : 'Quotation'} #${quote.quote_number || quote.id} — ${brandName}`} />

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 14mm;
                    }
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        font-size: 11pt;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-card {
                        box-shadow: none !important;
                        border: 1px solid #cbd5e1 !important;
                        background: #ffffff !important;
                        color: #0f172a !important;
                    }
                    .print-dark-text {
                        color: #0f172a !important;
                    }
                    .print-muted-text {
                        color: #475569 !important;
                    }
                    .print-badge {
                        border: 1px solid #000 !important;
                        color: #000 !important;
                        background: transparent !important;
                    }
                }
            `}} />

            {/* TOP BAR / ACTIONS (hidden on print) */}
            <div className="max-w-4xl mx-auto mb-6 no-print">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isWorkOrder ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold text-sm sm:text-base text-white">
                                    {isWorkOrder ? 'Official Work Order' : 'Commercial Quotation'}
                                </h1>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    isWorkOrder ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                    #{quote.quote_number || `QUO-${quote.id}`}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Prepared by {brandName} for {quote.name} {quote.company_name ? `(${quote.company_name})` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                        >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                            <span>Print / PDF</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                        >
                            <Share2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
                        </button>

                        {brandPhone && (
                            <a
                                href={`https://wa.me/${brandPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${brandName}, I am reviewing quotation #${quote.quote_number || quote.id} regarding "${quote.project_title || quote.item?.name || 'Project'}".`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>WhatsApp Us</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* DOCUMENT WRAPPER (Paper Simulation) */}
            <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden print-card print:border-none print:shadow-none print:rounded-none">
                
                {/* 1. DOCUMENT HEADER */}
                <div className="p-8 sm:p-10 border-b border-slate-200 bg-slate-50/70 print:bg-transparent">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        {/* Company Logo & Branding */}
                        <div className="space-y-2">
                            {brandLogo ? (
                                <img src={brandLogo} alt={brandName} className="h-12 max-w-[200px] object-contain" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl">
                                        {brandName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-2xl font-black tracking-tight text-slate-950">{brandName}</span>
                                </div>
                            )}
                            <p className="text-xs text-slate-500 font-medium max-w-sm leading-relaxed">
                                {brandAddress}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-blue-600" /> {brandPhone}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-blue-600" /> {brandEmail}
                                </span>
                            </div>
                        </div>

                        {/* Document Type & Reference Details */}
                        <div className="text-left sm:text-right space-y-1.5 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200 w-full sm:w-auto">
                            <div className="inline-block">
                                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider ${
                                    isWorkOrder 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}>
                                    {isWorkOrder ? 'WORK ORDER / CONTRACT' : 'QUOTATION PROPOSAL'}
                                </span>
                            </div>
                            <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                #{quote.quote_number || `QUO-${quote.id}`}
                            </div>
                            {isWorkOrder && quote.work_order_number && (
                                <div className="text-xs font-bold text-emerald-700 font-mono">
                                    Order Ref: {quote.work_order_number}
                                </div>
                            )}
                            <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                                <div><strong>Date:</strong> {quote.created_at ? new Date(quote.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                                {quote.valid_until && (
                                    <div className="text-amber-700 font-medium">
                                        <strong>Valid Until:</strong> {new Date(quote.valid_until).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RECIPIENT & PROJECT SCOPE */}
                <div className="p-8 sm:p-10 border-b border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Client Info */}
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Proposal Prepared For:</span>
                            <h3 className="text-lg font-black text-slate-900">{quote.name}</h3>
                            {quote.company_name && (
                                <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {quote.company_name}
                                </p>
                            )}
                            <div className="pt-2 text-xs text-slate-600 space-y-1">
                                {quote.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{quote.email}</span>
                                    </div>
                                )}
                                {quote.phone && (
                                    <div className="flex items-center gap-2 font-mono">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{quote.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-8">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Project / Scope:</span>
                            <h3 className="text-lg font-black text-slate-900">
                                {quote.project_title || quote.item?.name || 'Custom Tech Development Solution'}
                            </h3>
                            {quote.item && (
                                <p className="text-xs text-slate-500 font-medium">
                                    Product/Service: {quote.item.name}
                                </p>
                            )}
                            {quote.message && (
                                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                                    "{quote.message}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. PHASES, TIME & COST BREAKDOWN */}
                <div className="p-8 sm:p-10 border-b border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600" />
                                Project Phases &amp; Deliverables
                            </h3>
                            <p className="text-xs text-slate-500">
                                Sequential execution milestones, duration, and investment allocation.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b-2 border-slate-900/10 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                    <th className="py-3 px-3 w-12 text-center">#</th>
                                    <th className="py-3 px-3">Phase / Deliverable</th>
                                    <th className="py-3 px-3 w-36">Require Time</th>
                                    <th className="py-3 px-3 w-36 text-right">Cost (৳ BDT)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {phases.length > 0 ? (
                                    phases.map((ph, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <div className="font-bold text-slate-900 text-sm">{ph.name || `Phase ${idx + 1}`}</div>
                                                {ph.description && (
                                                    <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed whitespace-pre-line">
                                                        {ph.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-3 font-semibold text-slate-700">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px]">
                                                    <Clock className="w-3 h-3 text-blue-600" />
                                                    {ph.duration || 'Flexible'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                                                ৳{parseFloat(ph.cost || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-3.5 px-3 text-center font-bold text-slate-400">1</td>
                                        <td className="py-3.5 px-3">
                                            <div className="font-bold text-slate-900 text-sm">
                                                {quote.project_title || quote.item?.name || 'Turnkey Solution Engineering'}
                                            </div>
                                            <div className="text-slate-500 text-[11px] mt-0.5">
                                                Complete development, deployment, integrations &amp; testing.
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px]">
                                                <Clock className="w-3 h-3 text-blue-600" /> Standard Timeline
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                                            ৳{subtotal.toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end pt-4">
                        <div className="w-full sm:w-72 space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-mono font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-600 font-medium">
                                    <span>Discount / Waiver:</span>
                                    <span className="font-mono font-bold">-৳{discount.toLocaleString()}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                                    <span>Tax / VAT:</span>
                                    <span className="font-mono font-bold">+৳{tax.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-2 border-t-2 border-slate-900 text-slate-950 font-black text-base">
                                <span>Total Investment:</span>
                                <span className="font-mono text-blue-700">৳{totalAmount.toLocaleString()} BDT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. PAYMENT CONDITIONS & MILESTONES (50% Advance / 20% Phase / 30% Delivery) */}
                <div className="p-8 sm:p-10 border-b border-slate-200 bg-slate-50/50">
                    <div className="space-y-3">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Contractual Payment Schedule</span>
                            <h3 className="text-base font-black text-slate-900 tracking-tight">
                                Milestone &amp; Payment Conditions
                            </h3>
                            <p className="text-xs text-slate-500">
                                Invoices will be raised and payable according to the following agreed schedule:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {paymentTerms.map((term, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase text-slate-400">
                                            Stage {idx + 1}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                                            {term.percentage}%
                                        </span>
                                    </div>
                                    <div className="font-mono font-black text-lg text-slate-900">
                                        ৳{parseFloat(term.amount || (totalAmount * (term.percentage / 100))).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        {term.condition || term.phase_name || `Payment Milestone ${idx + 1}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. TERMS & CONDITIONS */}
                <div className="p-8 sm:p-10 border-b border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
                    <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                        Terms of Engagement &amp; Work Order Agreement
                    </h4>
                    <p>
                        {quote.terms_conditions || (
                            `1. Scope Acceptance: Signing or approving this document confirms agreement to the deliverables, phases, and schedule specified above.
2. Advance Kickoff: Project kickoff begins upon receipt of the initial 50% advance deposit.
3. Revisions & Changes: Scope changes outside of the listed deliverables will be assessed under an addendum with separate estimates.
4. Final Delivery: Full source code, deployment credentials, and asset handover will occur following final 30% milestone settlement.
5. Warranty: All custom software delivered carries a 30-day post-handover warranty for bug fixes.`
                        )}
                    </p>
                </div>

                {/* 6. DIGITAL SIGNATURES & CONFIRMATION SECTION */}
                <div className="p-8 sm:p-10 bg-slate-50/70">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    Authorized Confirmation &amp; Digital Signatures
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Mutual agreement executing this Quotation into a formal binding Work Order.
                                </p>
                            </div>

                            {isSigned && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Digitally Signed &amp; Executed</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            
                            {/* COMPANY AUTHORIZED SIGNATURE */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Service Provider / Company Authorization:
                                </span>
                                
                                <div className="h-24 flex items-center justify-center border-b border-dashed border-slate-300">
                                    {quote.company_signature ? (
                                        <img src={quote.company_signature} alt="Company Signature" className="max-h-20 object-contain" />
                                    ) : (
                                        <div className="text-center">
                                            <div className="font-serif italic font-bold text-xl text-blue-900 tracking-wide">
                                                {quote.company_signer_name || brandName}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-emerald-600 mt-1">
                                                Verified Corporate Seal &bull; {brandName}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs text-slate-700 space-y-0.5">
                                    <div className="font-bold">{quote.company_signer_name || 'Managing Director & Authorized Signatory'}</div>
                                    <div className="text-slate-500">{brandName} Operations</div>
                                    <div className="text-[10px] text-slate-400">
                                        Date: {quote.company_signed_at ? new Date(quote.company_signed_at).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* CLIENT DIGITAL SIGNATURE */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Client / Authorized Representative Confirmation:
                                </span>

                                {isSigned ? (
                                    <>
                                        <div className="h-24 flex items-center justify-center border-b border-dashed border-slate-300 bg-emerald-50/30 rounded-lg">
                                            {quote.client_signature?.startsWith('data:image') ? (
                                                <img src={quote.client_signature} alt="Client Signature" className="max-h-20 object-contain" />
                                            ) : (
                                                <div className="font-serif italic font-bold text-xl text-slate-900">
                                                    {quote.client_signer_name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-slate-700 space-y-0.5">
                                            <div className="font-bold text-emerald-700">{quote.client_signer_name}</div>
                                            <div className="text-slate-500">{quote.company_name || 'Authorized Client'}</div>
                                            <div className="text-[10px] text-slate-400">
                                                Signed: {new Date(quote.client_signed_at).toLocaleString()} &bull; IP: {quote.client_signer_ip || 'Verified'}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Interactive Signature Pad Form (Client Sign) */
                                    <form onSubmit={handleSignSubmit} className="space-y-3 no-print">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-700 flex items-center gap-1">
                                                    <PenTool className="w-3.5 h-3.5 text-blue-600" />
                                                    Draw Digital Signature *
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={clearCanvas}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                                                >
                                                    <Eraser className="w-3 h-3" /> Clear
                                                </button>
                                            </div>

                                            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl bg-slate-50 overflow-hidden relative">
                                                <canvas
                                                    ref={canvasRef}
                                                    width={360}
                                                    height={110}
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                    className="w-full h-24 touch-none cursor-crosshair bg-white"
                                                />
                                                {!hasDrawn && (
                                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 font-medium">
                                                        Sign here using finger or mouse
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Signer Full Name *</label>
                                            <input
                                                type="text"
                                                value={signForm.data.signer_name}
                                                onChange={(e) => signForm.setData('signer_name', e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-blue-500"
                                                placeholder="e.g. John Doe"
                                                required
                                            />
                                        </div>

                                        <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                                            <input
                                                type="checkbox"
                                                checked={signForm.data.terms_accepted}
                                                onChange={(e) => signForm.setData('terms_accepted', e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 mt-0.5 focus:ring-blue-500"
                                                required
                                            />
                                            <span className="text-[11px] leading-tight">
                                                I confirm this quotation and accept the terms to initiate this project as a binding Work Order.
                                            </span>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={signForm.processing || !hasDrawn}
                                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{signForm.processing ? 'Processing...' : 'Confirm & Sign Work Order'}</span>
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* 7. FOOTER */}
                <div className="p-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white space-y-1">
                    <p>
                        Thank you for your business &bull; <strong>{brandName}</strong> &bull; Valid digital proposal
                    </p>
                    <p className="text-[10px] text-slate-400">
                        Generated by {brandName} Work Order Automation System &bull; Confidential
                    </p>
                </div>

            </div>
        </div>
    );
}
