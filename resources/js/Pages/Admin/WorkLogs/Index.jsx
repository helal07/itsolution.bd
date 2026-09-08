import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ClipboardCheck, 
    PhoneCall, 
    Clock, 
    Users, 
    Search, 
    Calendar, 
    CheckCircle2, 
    MessageSquare, 
    AlertCircle, 
    Check, 
    ChevronRight,
    Edit3,
    Layers,
    Palette,
    ArrowUpRight,
    User
} from 'lucide-react';

export default function AdminWorkLogsIndex({ logs, employees = [], stats = {}, filters = {} }) {
    const [selectedEmployee, setSelectedEmployee] = useState(filters.employee_id || 'all');
    const [selectedDate, setSelectedDate] = useState(filters.date || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // State for editing admin notes
    const [editingLogId, setEditingLogId] = useState(null);
    const { data, setData, patch, processing, reset } = useForm({
        admin_notes: '',
    });

    const handleFilterChange = (updates) => {
        const query = {
            employee_id: selectedEmployee,
            date: selectedDate,
            search: searchTerm,
            ...updates,
        };
        router.get(route('admin.work-logs.index'), query, { preserveState: true, replace: true });
    };

    const handleStartEditNotes = (log) => {
        setEditingLogId(log.id);
        setData('admin_notes', log.admin_notes || '');
    };

    const handleSaveAdminNotes = (logId) => {
        patch(route('admin.work-logs.notes', logId), {
            preserveScroll: true,
            onSuccess: () => setEditingLogId(null),
        });
    };

    return (
        <AdminLayout title="Staff Daily Activity & Responsibility Reports">
            <div className="space-y-6 pb-12 max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block font-semibold">
                            RESPONSIBILITY MATRIX & EVALUATION
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                            Staff Daily Activity Reports
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Detailed overview of customer phone calls, assigned tasks progress, and extra work submitted by team members.
                        </p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Today's Reports</p>
                            <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.today_submissions || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <ClipboardCheck className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Total Calls Today</p>
                            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats.today_calls || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Hours Logged Today</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.today_hours || 0} hrs</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Active Staff</p>
                            <p className="text-xl font-bold text-slate-700 mt-0.5">{stats.total_active_staff || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search client names, phone numbers, feedback, staff..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleFilterChange({ search: e.target.value });
                            }}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                handleFilterChange({ date: e.target.value });
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                        />

                        <select
                            value={selectedEmployee}
                            onChange={(e) => {
                                setSelectedEmployee(e.target.value);
                                handleFilterChange({ employee_id: e.target.value });
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                        >
                            <option value="all">All Team Members</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>

                        {(selectedDate || selectedEmployee !== 'all' || searchTerm) && (
                            <button
                                onClick={() => {
                                    setSelectedDate('');
                                    setSelectedEmployee('all');
                                    setSearchTerm('');
                                    router.get(route('admin.work-logs.index'));
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Work Logs Timeline */}
                <div className="space-y-5">
                    {logs.data && logs.data.length > 0 ? (
                        logs.data.map((log) => {
                            const employeeName = log.employee ? log.employee.name : (log.user ? log.user.name : 'Staff');
                            const designation = log.employee ? log.employee.designation : 'Team Member';
                            const callLogs = log.call_logs || [];
                            const assignedTasks = log.assigned_task_logs || [];
                            const otherTasks = log.other_work_logs || [];

                            return (
                                <div 
                                    key={log.id} 
                                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5 hover:border-slate-300 transition-all"
                                >
                                    {/* Header Row: Staff info + Date + Badges */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                {employeeName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base">{employeeName}</h3>
                                                <p className="text-xs text-slate-500">{designation}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{log.log_date}</span>
                                            </span>

                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                <PhoneCall className="w-3.5 h-3.5" />
                                                <span>{log.calls_count} Calls Made</span>
                                            </span>

                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{log.hours_worked} hrs</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Categorized Work Breakdown */}
                                    <div className="space-y-4">
                                        
                                        {/* 1. Client Calls List (Table/Grid) */}
                                        {callLogs.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                                                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>Client Calls ({callLogs.length})</span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {callLogs.map((call, ci) => (
                                                        <div key={ci} className="p-3 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-1.5 text-xs">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-slate-900 text-sm">
                                                                    {call.client_name || 'Client'}
                                                                </span>
                                                                {call.phone && (
                                                                    <span className="font-mono text-[11px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                                                                        {call.phone}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {call.discussion && (
                                                                <p className="text-slate-700 leading-relaxed">
                                                                    {call.discussion}
                                                                </p>
                                                            )}
                                                            {call.follow_up_date && (
                                                                <div className="pt-1 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>Follow-up: {call.follow_up_date}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. Assigned Tasks Progress */}
                                        {assignedTasks.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                                                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                                    <span>Assigned Tasks Progress ({assignedTasks.length})</span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {assignedTasks.map((t, ti) => (
                                                        <div key={ti} className="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-1.5 text-xs">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-slate-900">
                                                                    {t.task_title || 'Project Task'}
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
                                                                    {t.status || 'In Progress'}
                                                                </span>
                                                            </div>
                                                            {t.remarks && (
                                                                <p className="text-slate-700 leading-relaxed">
                                                                    {t.remarks}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Other / Ad-hoc Work */}
                                        {otherTasks.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                                                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Other / Ad-hoc Work ({otherTasks.length})</span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {otherTasks.map((o, oi) => (
                                                        <div key={oi} className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-1.5 text-xs">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-slate-900">
                                                                    {o.title}
                                                                </span>
                                                                {o.time_spent && (
                                                                    <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                                                                        {o.time_spent}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {o.description && (
                                                                <p className="text-slate-700 leading-relaxed">
                                                                    {o.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Legacy summary if present */}
                                        {callLogs.length === 0 && assignedTasks.length === 0 && otherTasks.length === 0 && (
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                                                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                                                    Activities Summary
                                                </p>
                                                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                                                    {log.tasks_summary}
                                                </p>
                                            </div>
                                        )}

                                        {/* Challenges & Tomorrow's Plan */}
                                        {log.challenges_notes && (
                                            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs">
                                                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                                                    Challenges / Next Day Priorities:
                                                </span>
                                                <p className="text-slate-800">{log.challenges_notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Evaluation / Feedback Box */}
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                        <div className="flex-1 min-w-0">
                                            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                                                Admin Feedback & Evaluation Note
                                            </span>
                                            {editingLogId === log.id ? (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Add evaluation, guidance, or rating..."
                                                        value={data.admin_notes}
                                                        onChange={e => setData('admin_notes', e.target.value)}
                                                        className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveAdminNotes(log.id)}
                                                        disabled={processing}
                                                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingLogId(null)}
                                                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-slate-700 mt-1">
                                                    {log.admin_notes || <span className="text-slate-400 italic">No admin notes added yet.</span>}
                                                </p>
                                            )}
                                        </div>

                                        {editingLogId !== log.id && (
                                            <button
                                                onClick={() => handleStartEditNotes(log)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex-shrink-0 shadow-2xs"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>{log.admin_notes ? 'Edit Evaluation' : 'Add Evaluation'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                            <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-800 text-base">No work logs found</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                No staff daily activity reports match your filter criteria.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {logs.links && logs.links.length > 3 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {logs.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url || link.active}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                                    link.active 
                                        ? 'bg-indigo-600 text-white' 
                                        : link.url 
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' 
                                            : 'text-slate-400 opacity-50 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
