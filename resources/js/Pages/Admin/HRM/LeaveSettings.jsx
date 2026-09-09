import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    CalendarCheck, 
    Plus, 
    Trash2, 
    Edit2, 
    Save, 
    Check, 
    CalendarDays, 
    ShieldCheck, 
    SlidersHorizontal, 
    FileText, 
    AlertCircle, 
    Sparkles, 
    CheckCircle2, 
    Info, 
    X,
    Clock,
    Briefcase
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function LeaveSettings({ leaveTypes: initialLeaveTypes = [], settings: initialSettings = {}, flash = {} }) {
    const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
    const [editingType, setEditingType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Leave Types & Policy Form
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        leave_types: initialLeaveTypes,
        allow_carry_forward: initialSettings.allow_carry_forward ?? '0',
        max_carry_forward_days: initialSettings.max_carry_forward_days ?? '5',
        require_proof_days: initialSettings.require_proof_days ?? '3',
    });

    // Modal Add / Edit Form State
    const [modalData, setModalData] = useState({
        id: '',
        name: '',
        days: 10,
        is_paid: true,
        enabled: true,
        description: '',
        color: 'blue'
    });

    const handleSaveGlobal = (e) => {
        e.preventDefault();
        post('/admin/leave-settings', {
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        setEditingType(null);
        setModalData({
            id: '',
            name: '',
            days: 10,
            is_paid: true,
            enabled: true,
            description: '',
            color: 'blue'
        });
        setShowModal(true);
    };

    const openEditModal = (type, index) => {
        setEditingType(index);
        setModalData({ ...type });
        setShowModal(true);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        const updatedList = [...data.leave_types];
        
        // Auto-generate ID if blank
        const cleanId = (modalData.id || modalData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')).trim();
        const entry = {
            ...modalData,
            id: cleanId,
            days: parseFloat(modalData.days) || 0,
        };

        if (editingType !== null) {
            updatedList[editingType] = entry;
        } else {
            updatedList.push(entry);
        }

        setData('leave_types', updatedList);
        setLeaveTypes(updatedList);
        setShowModal(false);
    };

    const handleDeleteType = (index) => {
        if (!confirm('Are you sure you want to remove this leave type?')) return;
        const updatedList = data.leave_types.filter((_, i) => i !== index);
        setData('leave_types', updatedList);
        setLeaveTypes(updatedList);
    };

    const handleToggleEnabled = (index) => {
        const updatedList = [...data.leave_types];
        updatedList[index].enabled = !updatedList[index].enabled;
        setData('leave_types', updatedList);
        setLeaveTypes(updatedList);
    };

    const handleQuickDaysChange = (index, value) => {
        const updatedList = [...data.leave_types];
        updatedList[index].days = parseFloat(value) || 0;
        setData('leave_types', updatedList);
        setLeaveTypes(updatedList);
    };

    const totalDaysAvailable = data.leave_types
        .filter(t => t.enabled && t.is_paid)
        .reduce((sum, t) => sum + (parseFloat(t.days) || 0), 0);

    const activeTypesCount = data.leave_types.filter(t => t.enabled).length;

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        rose: 'bg-rose-50 text-rose-700 border-rose-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <AdminLayout title="Leave Settings & Quotas">
            <Head title="HRM — Leave Types & Annual Quotas" />

            <div className="space-y-6 max-w-6xl mx-auto pb-12">
                
                {/* Header Bar */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                            <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Leave Settings & Quota Policies
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure allowable leave categories, annual day limits, paid entitlements & approval rules
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4 text-blue-600" />
                            <span>Add Leave Type</span>
                        </button>

                        <button
                            onClick={handleSaveGlobal}
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {recentlySuccessful ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Saved</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{processing ? 'Saving...' : 'Save Settings'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Summary Metric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Leave Types</p>
                            <h3 className="text-xl font-black text-slate-900">{activeTypesCount} Categories</h3>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Paid Quota</p>
                            <h3 className="text-xl font-black text-slate-900">{totalDaysAvailable} Days / Year</h3>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Carry Forward Rule</p>
                            <h3 className="text-xl font-black text-slate-900">
                                {data.allow_carry_forward === '1' ? `Max ${data.max_carry_forward_days} Days` : 'Disabled'}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Main Leave Types List Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-extrabold text-slate-900">Configured Leave Types & Days Quota</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Define allowable annual allowances that staff can request and track</p>
                        </div>

                        <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-xl">
                            {data.leave_types.length} Defined Types
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5">Leave Name & ID</th>
                                    <th className="px-5 py-3.5">Annual Quota (Days)</th>
                                    <th className="px-5 py-3.5">Pay Status</th>
                                    <th className="px-5 py-3.5">Description & Purpose</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.leave_types.map((type, idx) => {
                                    const badgeStyle = colorClasses[type.color || 'blue'] || colorClasses.blue;
                                    return (
                                        <tr key={type.id || idx} className={`hover:bg-slate-50/70 transition-colors ${!type.enabled ? 'opacity-50 bg-slate-50/30' : ''}`}>
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleEnabled(idx)}
                                                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                                        type.enabled ? 'bg-blue-600' : 'bg-slate-300'
                                                    }`}
                                                    title={type.enabled ? 'Click to disable' : 'Click to enable'}
                                                >
                                                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                                        type.enabled ? 'translate-x-4' : 'translate-x-0'
                                                    }`} />
                                                </button>
                                            </td>
                                            
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${badgeStyle}`}>
                                                        {type.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        ({type.id})
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="365"
                                                        step="0.5"
                                                        value={type.days}
                                                        onChange={(e) => handleQuickDaysChange(idx, e.target.value)}
                                                        className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-xs focus:bg-white focus:border-blue-500 transition-all text-center"
                                                    />
                                                    <span className="text-slate-500 font-semibold">Days/yr</span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {type.is_paid ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                        Paid Leave
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                                        Unpaid (LWP)
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 max-w-xs text-slate-600 text-[11px] leading-relaxed truncate" title={type.description}>
                                                {type.description || 'No description provided'}
                                            </td>

                                            <td className="px-5 py-4 text-right space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(type, idx)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteType(idx)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Remove Type"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global Leave Policies Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        General HRM Leave Rules & Approvals
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={data.allow_carry_forward === '1'}
                                    onChange={(e) => setData('allow_carry_forward', e.target.checked ? '1' : '0')}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span>Allow Carry Forward</span>
                            </label>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Unused leave balances roll over to the next calendar year.
                            </p>
                            {data.allow_carry_forward === '1' && (
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Rollover Days</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={data.max_carry_forward_days}
                                        onChange={(e) => setData('max_carry_forward_days', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <label className="block font-bold text-slate-800">Medical Document Threshold</label>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Consecutive sick leave days requiring a doctor certificate.
                            </p>
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={data.require_proof_days}
                                    onChange={(e) => setData('require_proof_days', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                                />
                                <span className="text-[10px] text-slate-400 block mt-1">Days or more</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <label className="block font-bold text-slate-800">HR Approver Notification</label>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                All leave requests automatically notify Executive Admins for review and approval decisions.
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Real-time Alerts Active</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal: Add / Edit Leave Type */}
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                <form onSubmit={handleModalSubmit} className="p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-blue-600" />
                            <h3 className="font-extrabold text-sm text-slate-900">
                                {editingType !== null ? 'Edit Leave Category' : 'Add New Leave Category'}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Category Title / Name</label>
                            <input
                                type="text"
                                required
                                value={modalData.name}
                                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                placeholder="e.g. Study Leave, Paternity Leave"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Code / Identifier</label>
                                <input
                                    type="text"
                                    value={modalData.id}
                                    onChange={(e) => setModalData({ ...modalData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                    placeholder="e.g. study_leave"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Annual Quota (Days)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="365"
                                    step="0.5"
                                    value={modalData.days}
                                    onChange={(e) => setModalData({ ...modalData, days: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Description / Policy Details</label>
                            <textarea
                                rows={2}
                                value={modalData.description}
                                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                placeholder="State when employees are eligible for this leave..."
                                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Color Theme</label>
                                <select
                                    value={modalData.color}
                                    onChange={(e) => setModalData({ ...modalData, color: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                >
                                    <option value="blue">Blue (Standard)</option>
                                    <option value="emerald">Emerald (Green)</option>
                                    <option value="rose">Rose (Red/Medical)</option>
                                    <option value="amber">Amber (Warning/Emergency)</option>
                                    <option value="purple">Purple (Special)</option>
                                    <option value="slate">Slate (Neutral/Unpaid)</option>
                                </select>
                            </div>

                            <div className="flex flex-col justify-end">
                                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer font-bold text-slate-800">
                                    <input
                                        type="checkbox"
                                        checked={modalData.is_paid}
                                        onChange={(e) => setModalData({ ...modalData, is_paid: e.target.checked })}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Paid Leave</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs active:scale-95 transition-all"
                        >
                            {editingType !== null ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
