import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ClipboardCheck, 
    PhoneCall, 
    Clock, 
    Calendar, 
    CheckCircle2, 
    MessageSquare, 
    AlertCircle, 
    Send, 
    FileText, 
    History, 
    Plus, 
    Trash2, 
    User, 
    Layers, 
    Check, 
    Sparkles, 
    Palette, 
    ChevronDown, 
    ChevronUp 
} from 'lucide-react';

export default function StaffDailyLog({ todayLog, pastLogs = [], activeTasks = [], employee = {}, todayDate }) {
    const initialCallLogs = (todayLog?.call_logs && todayLog.call_logs.length > 0)
        ? todayLog.call_logs
        : [{ client_name: '', phone: '', discussion: '', follow_up_date: '' }];

    const initialAssignedTaskLogs = (todayLog?.assigned_task_logs && todayLog.assigned_task_logs.length > 0)
        ? todayLog.assigned_task_logs
        : (activeTasks.length > 0 ? [{ task_id: activeTasks[0]?.id || '', task_title: activeTasks[0]?.title || '', status: 'completed', remarks: '' }] : []);

    const initialOtherWorkLogs = (todayLog?.other_work_logs && todayLog.other_work_logs.length > 0)
        ? todayLog.other_work_logs
        : [{ title: '', description: '', time_spent: '2 hours' }];

    const { data, setData, post, processing, errors } = useForm({
        log_date: todayLog?.log_date || todayDate || new Date().toISOString().split('T')[0],
        calls_count: todayLog?.calls_count ?? 0,
        call_logs: initialCallLogs,
        assigned_task_logs: initialAssignedTaskLogs,
        other_work_logs: initialOtherWorkLogs,
        client_feedbacks: todayLog?.client_feedbacks || '',
        tasks_summary: todayLog?.tasks_summary || '',
        hours_worked: todayLog?.hours_worked || 8.0,
        challenges_notes: todayLog?.challenges_notes || '',
    });

    // 1. Call Logs Handlers
    const handleAddCall = () => {
        setData('call_logs', [
            ...data.call_logs,
            { client_name: '', phone: '', discussion: '', follow_up_date: '' }
        ]);
    };

    const handleRemoveCall = (index) => {
        const updated = data.call_logs.filter((_, i) => i !== index);
        setData('call_logs', updated);
    };

    const handleCallChange = (index, field, value) => {
        const updated = [...data.call_logs];
        updated[index][field] = value;
        setData('call_logs', updated);
    };

    // 2. Assigned Task Logs Handlers
    const handleAddAssignedTask = () => {
        const defaultTask = activeTasks[0];
        setData('assigned_task_logs', [
            ...data.assigned_task_logs,
            { task_id: defaultTask?.id || '', task_title: defaultTask?.title || '', status: 'in_progress', remarks: '' }
        ]);
    };

    const handleRemoveAssignedTask = (index) => {
        const updated = data.assigned_task_logs.filter((_, i) => i !== index);
        setData('assigned_task_logs', updated);
    };

    const handleAssignedTaskChange = (index, field, value) => {
        const updated = [...data.assigned_task_logs];
        if (field === 'task_id') {
            const matched = activeTasks.find(t => t.id === parseInt(value));
            updated[index].task_id = value;
            updated[index].task_title = matched ? matched.title : '';
        } else {
            updated[index][field] = value;
        }
        setData('assigned_task_logs', updated);
    };

    // 3. Other Work Logs Handlers
    const handleAddOtherWork = () => {
        setData('other_work_logs', [
            ...data.other_work_logs,
            { title: '', description: '', time_spent: '1 hour' }
        ]);
    };

    const handleRemoveOtherWork = (index) => {
        const updated = data.other_work_logs.filter((_, i) => i !== index);
        setData('other_work_logs', updated);
    };

    const handleOtherWorkChange = (index, field, value) => {
        const updated = [...data.other_work_logs];
        updated[index][field] = value;
        setData('other_work_logs', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('staff.daily-log.store'), {
            preserveScroll: true,
        });
    };

    const totalValidCalls = data.call_logs.filter(c => c.client_name || c.phone || c.discussion).length;

    return (
        <AdminLayout title="Submit Daily Activity & Work Log">
            <div className="space-y-6 pb-12 max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block font-semibold">
                            RESPONSIBILITY MATRIX & ACTIVITY LOG
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                            Submit Daily Work Log & Progress Report
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Log your client calls, assigned tasks progress, and any additional work done today.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">{data.log_date}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Form (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* SECTION 1: CLIENT CALLS LOG */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                            <PhoneCall className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900 text-sm">
                                                Client Calls & Communications (ক্লাইন্ট কল ও যোগাযোগ)
                                            </h2>
                                            <p className="text-[11px] text-slate-500">
                                                Log each client called today with their name, phone & discussion outcome.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddCall}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Call</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.call_logs.map((call, index) => (
                                        <div key={index} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                                    Call #{index + 1}
                                                </span>
                                                {data.call_logs.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCall(index)}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                                        title="Remove call entry"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                        Client Name (ক্লাইন্টের নাম)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. রফিক / Mr. Rafiq"
                                                        value={call.client_name}
                                                        onChange={e => handleCallChange(index, 'client_name', e.target.value)}
                                                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                        Phone Number (ফোন নাম্বার)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 01658855***5"
                                                        value={call.phone}
                                                        onChange={e => handleCallChange(index, 'phone', e.target.value)}
                                                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                    Discussion / Outcome / Feedback (কি কথা হলো বা মন্তব্য)
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="e.g. কাল সকাল ১১টায় যোগাযোগ করতে বলেছেন, POS প্রপোজাল চেয়েছেন।"
                                                    value={call.discussion}
                                                    onChange={e => handleCallChange(index, 'discussion', e.target.value)}
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                                                    Next Follow-up Date (ফলো-আপ তারিখ):
                                                </label>
                                                <input
                                                    type="date"
                                                    value={call.follow_up_date || ''}
                                                    onChange={e => handleCallChange(index, 'follow_up_date', e.target.value)}
                                                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 2: ASSIGNED TASKS PROGRESS */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900 text-sm">
                                                Assigned Tasks Progress (অ্যাসাইন করা কাজের অগ্রগতি)
                                            </h2>
                                            <p className="text-[11px] text-slate-500">
                                                Select your assigned project tasks and note what was done today.
                                            </p>
                                        </div>
                                    </div>

                                    {activeTasks.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleAddAssignedTask}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Add Task Update</span>
                                        </button>
                                    )}
                                </div>

                                {data.assigned_task_logs.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.assigned_task_logs.map((taskLog, index) => (
                                            <div key={index} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                        Assigned Task #{index + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAssignedTask(index)}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                            Select Assigned Task (অ্যাসাইন করা কাজ)
                                                        </label>
                                                        <select
                                                            value={taskLog.task_id}
                                                            onChange={e => handleAssignedTaskChange(index, 'task_id', e.target.value)}
                                                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-800"
                                                        >
                                                            <option value="">Choose a task...</option>
                                                            {activeTasks.map(t => (
                                                                <option key={t.id} value={t.id}>
                                                                    {t.title} ({t.priority} priority)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                            Status (কাজের অবস্থা)
                                                        </label>
                                                        <select
                                                            value={taskLog.status || 'in_progress'}
                                                            onChange={e => handleAssignedTaskChange(index, 'status', e.target.value)}
                                                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold text-slate-700"
                                                        >
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="completed">Completed Today</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="blocked">Blocked / Need Help</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                        Work Remarks & Progress Details (আজকে কি কি কাজ হয়েছে)
                                                    </label>
                                                    <textarea
                                                        rows="2"
                                                        placeholder="e.g. SMS OTP integration API completed, verified test OTP delivery on Bangladeshi numbers."
                                                        value={taskLog.remarks}
                                                        onChange={e => handleAssignedTaskChange(index, 'remarks', e.target.value)}
                                                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                                        <p>No assigned tasks linked yet.</p>
                                        <button
                                            type="button"
                                            onClick={handleAddAssignedTask}
                                            className="mt-2 text-indigo-600 font-bold hover:underline"
                                        >
                                            + Add Assigned Task Progress
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: OTHER / AD-HOC WORK */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                            <Palette className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900 text-sm">
                                                Other / Ad-hoc Work (অন্যান্য কাজ)
                                            </h2>
                                            <p className="text-[11px] text-slate-500">
                                                Log extra tasks done outside official checklist (e.g. Banner design, hosting, bug fixes).
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddOtherWork}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Other Work</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.other_work_logs.map((other, index) => (
                                        <div key={index} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    Other Work #{index + 1}
                                                </span>
                                                {data.other_work_logs.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOtherWork(index)}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                        Work Title / Topic (কাজের শিরোনাম)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. ই-কমার্সের জন্য ব্যানার ডিজাইন / cPanel ওয়েবসাইট হোস্টিং"
                                                        value={other.title}
                                                        onChange={e => handleOtherWorkChange(index, 'title', e.target.value)}
                                                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                        Time Spent (সময়)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 2 hours"
                                                        value={other.time_spent}
                                                        onChange={e => handleOtherWorkChange(index, 'time_spent', e.target.value)}
                                                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                    Description & Output (কাজের বিবরণ ও ফলাফল)
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="e.g. ৩টি হিরো ব্যানার ডিজাইন করে সাইটে আপলোড করেছি এবং ক্লায়েন্টকে প্রিভিউ লিংক পাঠিয়েছি।"
                                                    value={other.description}
                                                    onChange={e => handleOtherWorkChange(index, 'description', e.target.value)}
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 4: WORKING HOURS & CHALLENGES */}
                            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-600" />
                                    <span>Working Hours & Next Day Plan (মোট সময় ও আগামীকালের প্ল্যান)</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Working Hours Logged <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="24"
                                            required
                                            value={data.hours_worked}
                                            onChange={e => setData('hours_worked', parseFloat(e.target.value) || 8.0)}
                                            className="w-full text-sm font-bold text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">Full workday: 8.0 hours</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Challenges / Tomorrow's Priorities
                                        </label>
                                        <textarea
                                            rows="2"
                                            placeholder="Any pending tasks or assistance required from team/admin tomorrow"
                                            value={data.challenges_notes}
                                            onChange={e => setData('challenges_notes', e.target.value)}
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{processing ? 'Submitting Report...' : 'Submit Today\'s Complete Report'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar: Past Log History (1 col) */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3 sticky top-20">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <History className="w-4 h-4 text-slate-500" />
                                <span>Recent Submission History</span>
                            </h3>

                            {pastLogs.length > 0 ? (
                                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                                    {pastLogs.map((log) => {
                                        const calls = log.call_logs || [];
                                        const assignedTasks = log.assigned_task_logs || [];
                                        const otherTasks = log.other_work_logs || [];

                                        return (
                                            <div key={log.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2 text-xs">
                                                <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                                                    <span className="font-bold text-slate-800">{log.log_date}</span>
                                                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                        {log.hours_worked}h &bull; {log.calls_count} calls
                                                    </span>
                                                </div>

                                                {/* Calls snippet */}
                                                {calls.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-blue-700 uppercase">Calls ({calls.length}):</span>
                                                        {calls.slice(0, 2).map((c, ci) => (
                                                            <div key={ci} className="text-[11px] text-slate-600 truncate">
                                                                &bull; <strong className="text-slate-800">{c.client_name || c.phone}</strong>: {c.discussion}
                                                            </div>
                                                        ))}
                                                        {calls.length > 2 && (
                                                            <span className="text-[10px] text-slate-400 italic">+{calls.length - 2} more calls</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Other work snippet */}
                                                {otherTasks.length > 0 && (
                                                    <div className="space-y-0.5 pt-1">
                                                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Other Work:</span>
                                                        {otherTasks.map((o, oi) => (
                                                            <div key={oi} className="text-[11px] text-slate-600 truncate">
                                                                &bull; <strong className="text-slate-800">{o.title}</strong> ({o.time_spent})
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Admin evaluation */}
                                                {log.admin_notes && (
                                                    <div className="mt-2 p-2 bg-indigo-50 rounded-lg text-[11px] text-indigo-950">
                                                        <span className="font-bold">Admin Feedback: </span>
                                                        {log.admin_notes}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic py-2">No past logs submitted yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
