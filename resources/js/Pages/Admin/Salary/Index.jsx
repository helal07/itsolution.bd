import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Banknote, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Coins, 
    Download, 
    Edit3, 
    Eye, 
    Filter, 
    HelpCircle, 
    Layers, 
    Plus, 
    Printer, 
    RefreshCw, 
    Sparkles, 
    Trash2, 
    TrendingDown, 
    TrendingUp, 
    User, 
    Users, 
    X,
    CreditCard,
    DollarSign
} from 'lucide-react';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AdminSalaryIndex({
    salaries = [],
    employees = [],
    stats = {},
    selectedMonth,
    selectedYear
}) {
    const [month, setMonth] = useState(selectedMonth || new Date().getMonth() + 1);
    const [year, setYear] = useState(selectedYear || new Date().getFullYear());
    
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null); // salary item
    const [showPayModal, setShowPayModal] = useState(null); // salary item
    const [showPayslipModal, setShowPayslipModal] = useState(null); // salary item
    
    // Auto-Generate Form
    const { data: genData, setData: setGenData, post: postGenerate, processing: generating } = useForm({
        month: month,
        year: year,
        working_days: 26,
        employee_id: '',
    });

    const handleFilterChange = (newMonth, newYear) => {
        setMonth(newMonth);
        setYear(newYear);
        router.get('/admin/salary', { month: newMonth, year: newYear }, { preserveState: true, preserveScroll: true });
    };

    const handleGenerateSubmit = (e) => {
        e.preventDefault();
        postGenerate('/admin/salary/generate', {
            preserveScroll: true,
            onSuccess: () => {
                setShowGenerateModal(false);
            }
        });
    };

    // Edit Form
    const [editBaseSalary, setEditBaseSalary] = useState(0);
    const [editBonus, setEditBonus] = useState(0);
    const [editDeduction, setEditDeduction] = useState(0);
    const [editPresentDays, setEditPresentDays] = useState(0);
    const [editWorkingDays, setEditWorkingDays] = useState(26);
    const [editNote, setEditNote] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    const openEditModal = (sal) => {
        setShowEditModal(sal);
        setEditBaseSalary(sal.base_salary);
        setEditBonus(sal.bonus);
        setEditDeduction(sal.deduction);
        setEditPresentDays(sal.present_days);
        setEditWorkingDays(sal.working_days);
        setEditNote(sal.note || '');
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!showEditModal) return;
        setSavingEdit(true);

        router.put(`/admin/salary/${showEditModal.id}`, {
            base_salary: editBaseSalary,
            bonus: editBonus,
            deduction: editDeduction,
            present_days: editPresentDays,
            working_days: editWorkingDays,
            note: editNote,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(null);
                setSavingEdit(false);
            },
            onError: () => setSavingEdit(false)
        });
    };

    // Mark Paid Form
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [transactionRef, setTransactionRef] = useState('');
    const [payNote, setPayNote] = useState('');
    const [savingPay, setSavingPay] = useState(false);

    const openPayModal = (sal) => {
        setShowPayModal(sal);
        setPaymentMethod('Bank Transfer');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setTransactionRef('');
        setPayNote('');
    };

    const handlePaySubmit = (e) => {
        e.preventDefault();
        if (!showPayModal) return;
        setSavingPay(true);

        router.post(`/admin/salary/${showPayModal.id}/pay`, {
            payment_method: paymentMethod,
            payment_date: paymentDate,
            transaction_ref: transactionRef,
            note: payNote,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPayModal(null);
                setSavingPay(false);
            },
            onError: () => setSavingPay(false)
        });
    };

    const handleDelete = (sal) => {
        if (confirm(`Are you sure you want to delete salary entry for ${sal.employee?.name}?`)) {
            router.delete(`/admin/salary/${sal.id}`, { preserveScroll: true });
        }
    };

    const handlePrintPayslip = () => {
        window.print();
    };

    const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

    return (
        <AdminLayout title="Salary & Payroll">
            <Head title="Staff Salary & Payroll Management" />

            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Banknote className="w-5 h-5" />
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Salary & Payroll Sheet
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Live attendance linking, automated absent deduction & payslip generation
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Month Picker */}
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                            <select
                                value={month}
                                onChange={(e) => handleFilterChange(Number(e.target.value), year)}
                                className="text-xs font-bold text-slate-700 bg-transparent border-none p-1 focus:ring-0 cursor-pointer"
                            >
                                {MONTH_NAMES.map((m, idx) => (
                                    <option key={idx + 1} value={idx + 1}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => handleFilterChange(month, Number(e.target.value))}
                                className="text-xs font-bold text-slate-700 bg-transparent border-none p-1 focus:ring-0 cursor-pointer"
                            >
                                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={() => {
                                setGenData('month', month);
                                setGenData('year', year);
                                setShowGenerateModal(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Auto-Generate Payroll</span>
                        </button>
                    </div>
                </div>

                {/* Payroll Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Total Net Payout */}
                    <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">Total Net Payout</span>
                        <p className="text-2xl font-black tracking-tight">৳{(stats.total_net_payout || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-blue-100">{monthLabel}</p>
                    </div>

                    {/* Total Base */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Base Payroll</span>
                        <p className="text-xl font-black text-slate-900">৳{(stats.total_base_payroll || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Total agreed base</p>
                    </div>

                    {/* Total Bonus */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Total Bonuses</span>
                        <p className="text-xl font-black text-emerald-600">+৳{(stats.total_bonus || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Incentives & overtime</p>
                    </div>

                    {/* Total Deductions */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Attendance Deductions</span>
                        <p className="text-xl font-black text-rose-600">-৳{(stats.total_deductions || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Unpaid / absent days</p>
                    </div>

                    {/* Paid vs Pending */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Disbursement Status</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                {stats.paid_count || 0} Paid
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                                {stats.pending_count || 0} Due
                            </span>
                        </div>
                    </div>
                </div>

                {/* Salary Sheet Table */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-slate-900">Payroll Sheet for {monthLabel}</h3>
                            <p className="text-xs text-slate-500">Live attendance calculated records for all staff</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
                            {salaries.length} Records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-3 px-4">Employee</th>
                                    <th className="py-3 px-4">Base Salary</th>
                                    <th className="py-3 px-4">Working Days</th>
                                    <th className="py-3 px-4">Present / Leave / Absent</th>
                                    <th className="py-3 px-4">Bonus</th>
                                    <th className="py-3 px-4">Deduction</th>
                                    <th className="py-3 px-4">Net Salary</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {salaries.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-12 text-center text-slate-400 space-y-2">
                                            <Banknote className="w-10 h-10 mx-auto text-slate-300" />
                                            <p className="font-semibold text-slate-600">No payroll entries generated for {monthLabel}.</p>
                                            <button
                                                onClick={() => {
                                                    setGenData('month', month);
                                                    setGenData('year', year);
                                                    setShowGenerateModal(true);
                                                }}
                                                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span>Generate Payroll Now</span>
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    salaries.map((sal) => {
                                        const emp = sal.employee || {};
                                        return (
                                            <tr key={sal.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="font-bold text-slate-900">{emp.name || 'Staff Member'}</div>
                                                    <div className="text-[10px] text-slate-400">{emp.designation || 'Team Member'}</div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                                                    ৳{Number(sal.base_salary).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono">
                                                    {sal.working_days} days
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded" title="Present Days">
                                                            {sal.present_days}P
                                                        </span>
                                                        <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded" title="Approved Leaves">
                                                            {sal.leave_days}L
                                                        </span>
                                                        <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded" title="Absent Days">
                                                            {sal.absent_days}A
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono font-medium text-emerald-600">
                                                    +৳{Number(sal.bonus).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono font-medium text-rose-600">
                                                    -৳{Number(sal.deduction).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono font-black text-sm text-blue-700">
                                                    ৳{Number(sal.net_salary).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                        sal.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}>
                                                        {sal.status === 'paid' ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                    {sal.payment_method && (
                                                        <span className="block text-[10px] text-slate-400 mt-0.5">{sal.payment_method}</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                                    {/* Print / View Payslip */}
                                                    <button
                                                        onClick={() => setShowPayslipModal(sal)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        title="View & Print Payslip"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEditModal(sal)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        title="Adjust Bonus/Deductions"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>

                                                    {/* Mark Paid */}
                                                    {sal.status !== 'paid' && (
                                                        <button
                                                            onClick={() => openPayModal(sal)}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                                                        >
                                                            Pay
                                                        </button>
                                                    )}

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(sal)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

            </div>

            {/* ================= MODAL: AUTO GENERATE PAYROLL ================= */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                                    <Sparkles className="w-4 h-4" />
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900">
                                    Auto-Generate Monthly Payroll
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Month</label>
                                    <select
                                        value={genData.month}
                                        onChange={(e) => setGenData('month', Number(e.target.value))}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        {MONTH_NAMES.map((m, idx) => (
                                            <option key={idx + 1} value={idx + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                                    <select
                                        value={genData.year}
                                        onChange={(e) => setGenData('year', Number(e.target.value))}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        {[2024, 2025, 2026, 2027, 2028].map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Working Days in Month</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={genData.working_days}
                                    onChange={(e) => setGenData('working_days', Number(e.target.value))}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Target Employees</label>
                                <select
                                    value={genData.employee_id}
                                    onChange={(e) => setGenData('employee_id', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All Active Employees ({employees.length})</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                                <p className="font-bold flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Automated Calculation Rules:</span>
                                </p>
                                <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5">
                                    <li>Reads all live selfie check-in records for this month.</li>
                                    <li>Adds approved leaves from leave management.</li>
                                    <li>Computes absent days = Working Days - (Present + Leave).</li>
                                    <li>Deducts daily salary rate for absent days.</li>
                                </ul>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowGenerateModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    {generating ? 'Calculating...' : 'Generate Payroll'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: EDIT / ADJUST SALARY ================= */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-extrabold text-base text-slate-900">
                                Adjust Payroll: {showEditModal.employee?.name}
                            </h3>
                            <button
                                onClick={() => setShowEditModal(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Base Salary (৳)</label>
                                <input
                                    type="number"
                                    value={editBaseSalary}
                                    onChange={(e) => setEditBaseSalary(Number(e.target.value))}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Bonus / Incentive (৳)</label>
                                    <input
                                        type="number"
                                        value={editBonus}
                                        onChange={(e) => setEditBonus(Number(e.target.value))}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-emerald-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Deduction (৳)</label>
                                    <input
                                        type="number"
                                        value={editDeduction}
                                        onChange={(e) => setEditDeduction(Number(e.target.value))}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-rose-700"
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-700">
                                <span>Adjusted Net Payable:</span>
                                <span className="font-extrabold text-sm text-blue-700 font-mono">
                                    ৳{Math.max(0, editBaseSalary + editBonus - editDeduction).toLocaleString()}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Note</label>
                                <input
                                    type="text"
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    placeholder="Bonus reason or adjustment remarks..."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingEdit}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    {savingEdit ? 'Saving...' : 'Save Adjustments'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: MARK AS PAID ================= */}
            {showPayModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-extrabold text-base text-slate-900">
                                Record Salary Payment
                            </h3>
                            <button
                                onClick={() => setShowPayModal(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                                <p><span className="font-bold">Staff:</span> {showPayModal.employee?.name}</p>
                                <p><span className="font-bold">Net Salary:</span> ৳{Number(showPayModal.net_salary).toLocaleString()}</p>
                                <p><span className="font-bold">Period:</span> {monthLabel}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="Bank Transfer">Bank Transfer (EFT / NPSB)</option>
                                    <option value="bKash">bKash (Merchant / Personal)</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Cash">Cash in Hand</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref / Cheque No (Optional)</label>
                                <input
                                    type="text"
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    placeholder="Txn ID, Cheque No, Bank Trx ID..."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPayModal(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingPay}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    {savingPay ? 'Confirming...' : 'Mark as Paid'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: PRINTABLE PAYSLIP ================= */}
            {showPayslipModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
                        
                        {/* Action Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                            <h3 className="font-extrabold text-base text-slate-900">
                                Staff Payslip View
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrintPayslip}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print / Save PDF</span>
                                </button>
                                <button
                                    onClick={() => setShowPayslipModal(null)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Printable Area */}
                        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans" id="printable-payslip">
                            
                            {/* Company Branding */}
                            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-950 tracking-tight">IT SOLUTIONS BD</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Custom Software, Web & IT Services</p>
                                    <p className="text-xs text-slate-500">Dhaka, Bangladesh</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                                        PAYSLIP
                                    </span>
                                    <p className="text-sm font-bold text-slate-900 mt-2">{monthLabel}</p>
                                    <p className="text-[11px] text-slate-400">Ref: PAY-{showPayslipModal.id}-{month}{year}</p>
                                </div>
                            </div>

                            {/* Staff Info */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                                <div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px]">Employee Name</p>
                                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{showPayslipModal.employee?.name}</p>
                                    <p className="text-slate-500 mt-0.5">{showPayslipModal.employee?.designation}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 font-bold uppercase text-[10px]">Attendance Summary</p>
                                    <p className="font-bold text-slate-800 mt-0.5">
                                        {showPayslipModal.present_days} Present / {showPayslipModal.leave_days} Leave / {showPayslipModal.absent_days} Absent
                                    </p>
                                    <p className="text-slate-500 mt-0.5">Total Working Days: {showPayslipModal.working_days} Days</p>
                                </div>
                            </div>

                            {/* Earnings & Deductions Table */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                                <div className="grid grid-cols-2 bg-slate-100/80 p-3 font-bold text-slate-600 uppercase text-[10px]">
                                    <div>Earnings</div>
                                    <div className="text-right">Amount (BDT)</div>
                                </div>
                                <div className="divide-y divide-slate-100 p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Base Salary</span>
                                        <span className="font-mono font-bold">৳{Number(showPayslipModal.base_salary).toLocaleString()}</span>
                                    </div>
                                    {Number(showPayslipModal.bonus) > 0 && (
                                        <div className="flex justify-between pt-2 text-emerald-700">
                                            <span>Incentive / Bonus</span>
                                            <span className="font-mono font-bold">+৳{Number(showPayslipModal.bonus).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 bg-slate-100/80 p-3 font-bold text-slate-600 uppercase text-[10px] border-t border-slate-200">
                                    <div>Deductions</div>
                                    <div className="text-right">Amount (BDT)</div>
                                </div>
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between text-rose-700">
                                        <span>Absent Days Deduction ({showPayslipModal.absent_days} days)</span>
                                        <span className="font-mono font-bold">-৳{Number(showPayslipModal.deduction).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Total Net Pay */}
                                <div className="bg-slate-900 text-white p-4 flex items-center justify-between font-bold">
                                    <span className="text-sm uppercase tracking-wider">Net Payable Salary</span>
                                    <span className="text-xl font-mono font-black text-emerald-400">
                                        ৳{Number(showPayslipModal.net_salary).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Status & Signatures */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
                                <div>
                                    <p><span className="font-bold">Payment Status:</span> <span className="uppercase text-slate-800 font-bold">{showPayslipModal.status}</span></p>
                                    {showPayslipModal.payment_method && (
                                        <p><span className="font-bold">Method:</span> {showPayslipModal.payment_method}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="w-32 border-b border-slate-400 mb-1" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase">Authorized Signature</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
