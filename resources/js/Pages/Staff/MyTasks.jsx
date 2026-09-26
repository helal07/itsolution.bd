import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    CheckSquare, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Layers, 
    ChevronDown, 
    ChevronUp, 
    Check, 
    Plus,
    ClipboardCheck,
    Flame,
    Paperclip,
    Mic,
    Music,
    Image as ImageIcon,
    Video,
    ExternalLink,
    Eye
} from 'lucide-react';

export default function StaffMyTasks({ tasks = [], stats = {}, employee = {}, filters = {} }) {
    const [expandedTasks, setExpandedTasks] = useState({});

    const toggleExpand = (taskId) => {
        setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleToggleStep = (stepId) => {
        router.patch(route('staff.tasks.step.toggle', stepId), {}, {
            preserveScroll: true,
        });
    };

    const handleUpdateStatus = (taskId, newStatus) => {
        router.patch(route('staff.tasks.status', taskId), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'urgent':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200"><Flame className="w-3 h-3" /> urgent</span>;
            case 'high':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">high</span>;
            case 'low':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">low</span>;
            case 'medium':
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-200">medium</span>;
        }
    };

    return (
        <AdminLayout title="My Assigned Tasks">
            <div className="space-y-6 pb-12 max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block font-semibold">
                            STAFF PORTAL
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                            My Assigned Tasks & Checklist
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Welcome back, {employee?.name || 'Team Member'}. Track your assigned project steps and mark them as done.
                        </p>
                    </div>

                    <Link
                        href={route('staff.daily-log.index')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>Submit Today's Work Log</span>
                    </Link>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">My Tasks</p>
                            <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">In Progress</p>
                            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats.in_progress || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Pending</p>
                            <p className="text-xl font-bold text-amber-600 mt-0.5">{stats.pending || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Completed</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.completed || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => {
                            const isExpanded = expandedTasks[task.id] ?? true; // default expanded for staff
                            const completedSteps = task.steps ? task.steps.filter(s => s.is_completed).length : 0;
                            const totalSteps = task.steps ? task.steps.length : 0;
                            const progressPercent = totalSteps > 0 
                                ? Math.round((completedSteps / totalSteps) * 100) 
                                : (task.progress || 0);

                            return (
                                <div 
                                    key={task.id}
                                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300"
                                >
                                    <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-5">
                                        
                                        {/* Circular Gauge */}
                                        <div className="relative w-14 h-14 rounded-full border-4 border-slate-100 flex-shrink-0 flex items-center justify-center bg-white">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className={`${progressPercent === 100 ? 'text-emerald-500' : 'text-indigo-600'} transition-all duration-500`}
                                                    strokeDasharray={`${progressPercent}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3.2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="text-xs font-bold text-slate-800">
                                                {progressPercent}%
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-1.5">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="font-bold text-slate-900 text-base leading-tight">
                                                    {task.title}
                                                </h3>
                                                {getPriorityBadge(task.priority)}
                                            </div>

                                            {task.description && (
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 flex-wrap">
                                                {task.due_date && (
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Due: {task.due_date}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 font-medium text-slate-600">
                                                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{completedSteps}/{totalSteps} steps completed</span>
                                                </div>

                                                {task.order_id && (
                                                    <Link
                                                        href={route('orders.requirements.show', task.order_id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs"
                                                    >
                                                        <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                                                        <span>Client Briefing & Media Hub</span>
                                                        {task.order?.requirements?.length > 0 && (
                                                            <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-mono">
                                                                {task.order.requirements.length}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Switcher & Steps Toggle */}
                                        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-slate-700"
                                            >
                                                <option value="pending">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Mark Completed</option>
                                            </select>

                                            <button
                                                onClick={() => toggleExpand(task.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <span>{isExpanded ? 'Hide' : 'Details & Steps'}</span>
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-100 h-1">
                                        <div 
                                            className={`h-1 transition-all duration-500 ${
                                                progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                            }`}
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>

                                    {/* Client Briefing & Voice Notes Panel */}
                                    {isExpanded && task.order?.requirements && task.order.requirements.length > 0 && (
                                        <div className="p-5 bg-gradient-to-br from-indigo-50/50 via-slate-50/50 to-white border-t border-indigo-100/80 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Paperclip className="w-4 h-4 text-indigo-600" />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                                                        Client Requirement Briefing ({task.client?.name || task.order?.client?.name || 'Client'})
                                                    </span>
                                                </div>
                                                <Link
                                                    href={route('orders.requirements.show', task.order_id)}
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
                                                >
                                                    <span>Open Full Media Workspace</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>

                                            {task.order.requirements.map((req) => {
                                                const audioFiles = req.attachments?.filter(a => a.file_type === 'audio') || [];
                                                const imageFiles = req.attachments?.filter(a => a.file_type === 'image') || [];
                                                const videoFiles = req.attachments?.filter(a => a.file_type === 'video') || [];

                                                return (
                                                    <div key={req.id} className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-3">
                                                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                                            {req.title}
                                                        </h4>

                                                        {req.description && (
                                                            <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                                {req.description}
                                                            </p>
                                                        )}

                                                        {/* Audio Briefings */}
                                                        {audioFiles.length > 0 && (
                                                            <div className="space-y-1.5 pt-1">
                                                                <p className="text-[11px] font-bold text-slate-500 uppercase font-mono flex items-center gap-1.5">
                                                                    <Music className="w-3.5 h-3.5 text-indigo-600" />
                                                                    Client Voice Notes ({audioFiles.length})
                                                                </p>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {audioFiles.map((audio) => (
                                                                        <div key={audio.id} className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100/70 flex items-center justify-between gap-2">
                                                                            <span className="text-xs font-semibold text-slate-800 truncate">{audio.original_name}</span>
                                                                            <audio src={audio.url} controls className="h-7 max-w-[200px]" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Reference Images */}
                                                        {imageFiles.length > 0 && (
                                                            <div className="space-y-1.5 pt-1">
                                                                <p className="text-[11px] font-bold text-slate-500 uppercase font-mono flex items-center gap-1.5">
                                                                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                                                                    Reference Images ({imageFiles.length})
                                                                </p>
                                                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                                                    {imageFiles.map((img) => (
                                                                        <a
                                                                            key={img.id}
                                                                            href={img.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 hover:opacity-90 transition shadow-2xs group relative"
                                                                        >
                                                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Video Briefings */}
                                                        {videoFiles.length > 0 && (
                                                            <div className="space-y-1.5 pt-1">
                                                                <p className="text-[11px] font-bold text-slate-500 uppercase font-mono flex items-center gap-1.5">
                                                                    <Video className="w-3.5 h-3.5 text-purple-600" />
                                                                    Video Walkthroughs ({videoFiles.length})
                                                                </p>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {videoFiles.map((vid) => (
                                                                        <a
                                                                            key={vid.id}
                                                                            href={vid.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition flex items-center gap-1.5"
                                                                        >
                                                                            <Video className="w-3.5 h-3.5" />
                                                                            <span>{vid.original_name}</span>
                                                                            <ExternalLink className="w-3 h-3 text-purple-500" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Checklist */}
                                    {isExpanded && task.steps && task.steps.length > 0 && (
                                        <div className="p-4 bg-slate-50/60 border-t border-slate-100 space-y-2">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                                                My Checklist Steps:
                                            </p>
                                            <div className="space-y-2">
                                                {task.steps.map((step) => (
                                                    <div 
                                                        key={step.id}
                                                        onClick={() => handleToggleStep(step.id)}
                                                        className={`flex items-center justify-between p-3 rounded-xl bg-white border cursor-pointer select-none transition-all ${
                                                            step.is_completed 
                                                                ? 'border-emerald-200 bg-emerald-50/20' 
                                                                : 'border-slate-200/80 hover:border-indigo-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                                                                step.is_completed 
                                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs' 
                                                                    : 'border-slate-300 hover:border-indigo-500 bg-white'
                                                            }`}>
                                                                {step.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                            </div>

                                                            <span className={`text-xs font-medium ${
                                                                step.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
                                                            }`}>
                                                                {step.title}
                                                            </span>
                                                        </div>

                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                                            step.is_completed 
                                                                ? 'bg-emerald-100 text-emerald-700' 
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {step.is_completed ? 'Done' : 'Pending'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-800 text-base">You have no pending tasks!</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                All tasks assigned to you are completed or no new tasks have been assigned yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
