import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    CalendarDays, 
    Plus, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar, 
    User, 
    FileText, 
    AlertCircle, 
    Check, 
    X, 
    RefreshCw, 
    Filter,
    HeartPulse,
    Coffee,
    Sun,
    AlertTriangle
} from 'lucide-react';

export default function LeavesIndex({
    employee,
    myLeaves = [],
    allLeaves = [],
    leaveStats = {},
    currentYear,
    isAdmin
}) {
    const [activeTab, setActiveTab] = useState('my'); // 'my' | 'admin_requests'
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(null); // leave object or null
    const [statusDecision, setStatusDecision] = useState('approved');
    const [adminRemarks, setAdminRemarks] = useState('');
    const [submittingStatus, setSubmittingStatus] = useState(false);

    // Apply Form
    const { data, setData, post, processing, errors, reset } = useForm({
        leave_type: 'casual',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: '',
    });

    const calculateDays = () => {
        if (!data.start_date || !data.end_date) return 1;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const diffTime = end - start;
        if (diffTime < 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleApplySubmit = (e) => {
        e.preventDefault();
        post('/leaves', {
            onSuccess: () => {
                setShowApplyModal(false);
                reset();
            }
        });
    };

    const handleUpdateStatusSubmit = (e) => {
        e.preventDefault();
        if (!showStatusModal) return;
        setSubmittingStatus(true);

        router.patch(`/leaves/${showStatusModal.id}/status`, {
            status: statusDecision,
            admin_remarks: adminRemarks
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusModal(null);
                setAdminRemarks('');
                setSubmittingStatus(false);
            },
            onError: () => {
                setSubmittingStatus(false);
            }
        });
    };

    const totalDaysCount = calculateDays();

    return (
        <AdminLayout title="Leave Management">
            <Head title="Staff Leave Requests & Balances" />

            <div className="space-y-6 max-w-7xl mx-auto">
                
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <CalendarDays className="w-5 h-5" />
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Leave Management
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Annual quotas, staff leave balances & approvals ({currentYear})
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {isAdmin && (
                            <>
                                <a
                                    href="/admin/leave-settings"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                                >
                                    <span>Leave Settings</span>
                                </a>

                                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                                    <button
                                        onClick={() => setActiveTab('my')}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'my'
                                                ? 'bg-white text-blue-600 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        My Leaves
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('admin_requests')}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'admin_requests'
                                                ? 'bg-white text-blue-600 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        All Requests ({allLeaves.filter(l => l.status === 'pending').length} Pending)
                                    </button>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => setShowApplyModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Apply for Leave</span>
                        </button>
                    </div>
                </div>

                {/* Leave Quota Balance Cards (Dynamic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(leaveStats).map((stat) => {
                        const total = stat.total || 0;
                        const used = stat.used || 0;
                        const remaining = Math.max(0, total - used);

                        return (
                            <div key={stat.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        {stat.name}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900">
                                            {remaining}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            / {total} Days Left
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        Used: {used} days {stat.is_paid === false && '(Unpaid)'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ================= TAB 1: MY LEAVES ================= */}
                {activeTab === 'my' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100">
                            <h3 className="font-bold text-sm text-slate-900">My Leave Applications</h3>
                            <p className="text-xs text-slate-500">History of your applied leaves and review status</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3 px-4">Leave Type</th>
                                        <th className="py-3 px-4">Duration & Dates</th>
                                        <th className="py-3 px-4">Total Days</th>
                                        <th className="py-3 px-4">Reason</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Admin Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {myLeaves.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-slate-400">
                                                No leave applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                        myLeaves.map((leave) => (
                                            <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3.5 px-4 font-bold text-slate-900 uppercase">
                                                    {leave.leave_type}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="font-mono text-slate-700">{leave.start_date}</span>
                                                    <span className="text-slate-400 mx-1">→</span>
                                                    <span className="font-mono text-slate-700">{leave.end_date}</span>
                                                </td>
                                                <td className="py-3.5 px-4 font-extrabold text-blue-600">
                                                    {leave.total_days} {leave.total_days > 1 ? 'Days' : 'Day'}
                                                </td>
                                                <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={leave.reason}>
                                                    {leave.reason}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                        leave.status === 'approved'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : leave.status === 'rejected'
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}>
                                                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500 italic">
                                                    {leave.admin_remarks || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: ADMIN ALL REQUESTS ================= */}
                {isAdmin && activeTab === 'admin_requests' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">Team Leave Requests & Approvals</h3>
                                <p className="text-xs text-slate-500">Review, approve or reject staff leave submissions</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3 px-4">Staff Member</th>
                                        <th className="py-3 px-4">Type</th>
                                        <th className="py-3 px-4">Dates</th>
                                        <th className="py-3 px-4">Days</th>
                                        <th className="py-3 px-4">Reason</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {allLeaves.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-slate-400">
                                                No team leave requests recorded.
                                            </td>
                                        </tr>
                                    ) : (
                                        allLeaves.map((leave) => {
                                            const staffName = leave.employee?.name || leave.user?.name || 'Staff';
                                            const designation = leave.employee?.designation || 'Team Member';
                                            
                                            return (
                                                <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-slate-900">{staffName}</div>
                                                        <div className="text-[10px] text-slate-400">{designation}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-bold uppercase text-slate-800">
                                                        {leave.leave_type}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-mono text-slate-700">{leave.start_date}</span>
                                                        <span className="text-slate-400 mx-1">→</span>
                                                        <span className="font-mono text-slate-700">{leave.end_date}</span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-extrabold text-blue-600">
                                                        {leave.total_days} Days
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={leave.reason}>
                                                        {leave.reason}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                            leave.status === 'approved'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : leave.status === 'rejected'
                                                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        {leave.status === 'pending' ? (
                                                            <div className="inline-flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => {
                                                                        setShowStatusModal(leave);
                                                                        setStatusDecision('approved');
                                                                        setAdminRemarks('');
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setShowStatusModal(leave);
                                                                        setStatusDecision('rejected');
                                                                        setAdminRemarks('');
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setShowStatusModal(leave);
                                                                    setStatusDecision(leave.status);
                                                                    setAdminRemarks(leave.admin_remarks || '');
                                                                }}
                                                                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                                            >
                                                                Edit Status
                                                            </button>
                                                        )}
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

            </div>

            {/* ================= MODAL: APPLY FOR LEAVE ================= */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                                    <CalendarDays className="w-4 h-4" />
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900">
                                    Apply for Leave
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Leave Type
                                </label>
                                <select
                                    value={data.leave_type}
                                    onChange={(e) => setData('leave_type', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    {Object.values(leaveStats).length > 0 ? (
                                        Object.values(leaveStats).map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} ({t.total} days/yr {t.is_paid ? '• Paid' : '• Unpaid'})
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="casual">Casual Leave</option>
                                            <option value="sick">Sick Leave</option>
                                            <option value="annual">Annual / Earned Leave</option>
                                            <option value="emergency">Emergency Leave</option>
                                            <option value="other">Other / Special</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-900 font-semibold">
                                <span>Total Requested Duration:</span>
                                <span className="font-extrabold text-blue-700">{totalDaysCount} {totalDaysCount > 1 ? 'Days' : 'Day'}</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Reason / Description
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    rows="3"
                                    placeholder="Please explain the reason for your leave request..."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowApplyModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    {processing ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: ADMIN APPROVAL / REJECTION ================= */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-extrabold text-base text-slate-900">
                                Review Leave Request
                            </h3>
                            <button
                                onClick={() => setShowStatusModal(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStatusSubmit} className="p-6 space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                                <p><span className="font-bold">Staff:</span> {showStatusModal.employee?.name || showStatusModal.user?.name}</p>
                                <p><span className="font-bold">Dates:</span> {showStatusModal.start_date} to {showStatusModal.end_date} ({showStatusModal.total_days} days)</p>
                                <p><span className="font-bold">Reason:</span> {showStatusModal.reason}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Decision
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStatusDecision('approved')}
                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                            statusDecision === 'approved'
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusDecision('rejected')}
                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                            statusDecision === 'rejected'
                                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Admin Remarks (Optional)
                                </label>
                                <textarea
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    rows="2"
                                    placeholder="Add feedback or reason for approval/rejection..."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingStatus}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                                >
                                    {submittingStatus ? 'Saving...' : 'Save Decision'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
