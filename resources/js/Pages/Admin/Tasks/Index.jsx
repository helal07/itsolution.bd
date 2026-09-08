import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    CheckSquare, 
    Plus, 
    Calendar, 
    User, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Trash2, 
    ChevronDown, 
    ChevronUp, 
    Search, 
    Filter, 
    Layers, 
    X,
    Flame,
    ArrowUpRight,
    ListPlus,
    UserCheck,
    Check
} from 'lucide-react';

export default function AdminTasksIndex({ tasks, employees = [], items = [], stats = {}, filters = {} }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedTasks, setExpandedTasks] = useState({});
    const [newStepInputs, setNewStepInputs] = useState({});

    // Filter states
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || 'all');
    const [assigneeFilter, setAssigneeFilter] = useState(filters.assigned_to || 'all');

    // Create Task Form
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        item_id: '',
        steps: [{ title: '', assigned_to: '' }],
    });

    const handleFilterChange = (updates) => {
        const query = {
            search: searchTerm,
            status: statusFilter,
            priority: priorityFilter,
            assigned_to: assigneeFilter,
            ...updates,
        };
        router.get(route('admin.tasks.index'), query, { preserveState: true, replace: true });
    };

    const toggleExpand = (taskId) => {
        setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        post(route('admin.tasks.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleAddStepField = () => {
        setData('steps', [...data.steps, { title: '', assigned_to: data.assigned_to || '' }]);
    };

    const handleRemoveStepField = (index) => {
        const updated = data.steps.filter((_, i) => i !== index);
        setData('steps', updated);
    };

    const handleStepFieldChange = (index, field, value) => {
        const updated = [...data.steps];
        updated[index][field] = value;
        setData('steps', updated);
    };

    // Quick inline add step to existing task
    const handleQuickAddStep = (task) => {
        const title = newStepInputs[task.id];
        if (!title || !title.trim()) return;

        router.post(route('admin.tasks.steps.store', task.id), {
            title: title.trim(),
            assigned_to: task.assigned_to,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewStepInputs(prev => ({ ...prev, [task.id]: '' }));
                setExpandedTasks(prev => ({ ...prev, [task.id]: true }));
            },
        });
    };

    const handleToggleStep = (stepId) => {
        router.patch(route('admin.tasks.steps.toggle', stepId), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteStep = (stepId) => {
        if (confirm('Delete this checklist step?')) {
            router.delete(route('admin.tasks.steps.destroy', stepId), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteTask = (task) => {
        if (confirm(`Delete main task "${task.title}" and all its subtasks?`)) {
            router.delete(route('admin.tasks.destroy', task.id), {
                preserveScroll: true,
            });
        }
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
            case 'in_progress':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
            case 'cancelled':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Cancelled</span>;
            case 'pending':
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">Open</span>;
        }
    };

    return (
        <AdminLayout title="Tasks">
            <div className="space-y-6 pb-12 max-w-6xl mx-auto">
                
                {/* Page Breadcrumb & Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block font-semibold">
                            OFFICECONTROLLER
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                            Tasks
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Assign a main task with smaller steps inside.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all duration-150 active:scale-98"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Assign task</span>
                    </button>
                </div>

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Total Tasks</p>
                            <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Active / Open</p>
                            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats.open || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Urgent Pending</p>
                            <p className="text-xl font-bold text-rose-600 mt-0.5">{stats.urgent || 0}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Flame className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search tasks, descriptions, steps..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleFilterChange({ search: e.target.value });
                            }}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                handleFilterChange({ status: e.target.value });
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value);
                                handleFilterChange({ priority: e.target.value });
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <select
                            value={assigneeFilter}
                            onChange={(e) => {
                                setAssigneeFilter(e.target.value);
                                handleFilterChange({ assigned_to: e.target.value });
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                        >
                            <option value="all">All Assignees</option>
                            <option value="unassigned">Unassigned</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tasks List (Matching UI from Screenshot) */}
                <div className="space-y-4">
                    {tasks.data && tasks.data.length > 0 ? (
                        tasks.data.map((task) => {
                            const isExpanded = expandedTasks[task.id];
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
                                        
                                        {/* Circular Progress Indicator */}
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

                                        {/* Main Content Info */}
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

                                            {/* Meta tags: Assignee, Due Date, Steps Counter */}
                                            <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 flex-wrap">
                                                {/* Assignee Badge */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                        {task.assignee ? task.assignee.name.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                    <span className="font-medium text-slate-700">
                                                        {task.assignee ? task.assignee.name : 'Unassigned'}
                                                    </span>
                                                </div>

                                                {/* Due Date */}
                                                {task.due_date && (
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{task.due_date}</span>
                                                    </div>
                                                )}

                                                {/* Steps Toggle Counter */}
                                                <div className="flex items-center gap-1 font-medium text-slate-600">
                                                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{completedSteps}/{totalSteps} steps</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Actions: Status & Steps dropdown toggle */}
                                        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                                            {getStatusBadge(task.status)}

                                            <button
                                                onClick={() => toggleExpand(task.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <span>{isExpanded ? 'Hide' : 'Steps'}</span>
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteTask(task)}
                                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                title="Delete task"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar Line */}
                                    <div className="w-full bg-slate-100 h-1">
                                        <div 
                                            className={`h-1 transition-all duration-500 ${
                                                progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                            }`}
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>

                                    {/* Expandable Subtasks / Checklist Steps */}
                                    {isExpanded && (
                                        <div className="p-4 bg-slate-50/60 border-t border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                                                <span>Checklist & Sub-steps</span>
                                                <span>{completedSteps} of {totalSteps} done</span>
                                            </div>

                                            {/* Subtask list */}
                                            {task.steps && task.steps.length > 0 ? (
                                                <div className="space-y-2">
                                                    {task.steps.map((step) => (
                                                        <div 
                                                            key={step.id}
                                                            className={`flex items-center justify-between p-2.5 rounded-xl bg-white border transition-all ${
                                                                step.is_completed 
                                                                    ? 'border-emerald-200 bg-emerald-50/20' 
                                                                    : 'border-slate-200/80 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                <button
                                                                    onClick={() => handleToggleStep(step.id)}
                                                                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                                                                        step.is_completed 
                                                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs' 
                                                                            : 'border-slate-300 hover:border-indigo-500 bg-white'
                                                                    }`}
                                                                >
                                                                    {step.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                                </button>

                                                                <span className={`text-xs font-medium truncate ${
                                                                    step.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
                                                                }`}>
                                                                    {step.title}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                                                                    {step.assignee ? step.assignee.name : (task.assignee ? task.assignee.name : 'Team')}
                                                                </span>

                                                                <button
                                                                    onClick={() => handleDeleteStep(step.id)}
                                                                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic py-1 px-1">No steps added yet. Add checklist steps below.</p>
                                            )}

                                            {/* Quick Add Subtask Input */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="text"
                                                    placeholder="Add a new step / subtask..."
                                                    value={newStepInputs[task.id] || ''}
                                                    onChange={(e) => setNewStepInputs({ ...newStepInputs, [task.id]: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAddStep(task)}
                                                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                                />
                                                <button
                                                    onClick={() => handleQuickAddStep(task)}
                                                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center gap-1"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Add step</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-800 text-base">No tasks found</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                No tasks match your current filter. Click "+ Assign task" to create a new project task for your team.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {tasks.links && tasks.links.length > 3 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {tasks.links.map((link, i) => (
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

            {/* Create / Assign Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Assign New Task</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Create a main task and assign subtasks to your team members.</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Task Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Security Brokerage, Website & Applicant Portal"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Description & Specifications
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="Applicant portal, SMS otp/ID & password, Notice, and Publication"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Assignee Staff
                                    </label>
                                    <select
                                        value={data.assigned_to}
                                        onChange={e => setData('assigned_to', e.target.value)}
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="">Unassigned</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={data.priority}
                                        onChange={e => setData('priority', e.target.value)}
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Link to Service / Item
                                    </label>
                                    <select
                                        value={data.item_id}
                                        onChange={e => setData('item_id', e.target.value)}
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="">None (General Project)</option>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Subtask Steps Repeater */}
                            <div className="pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Checklist / Subtask Steps
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddStepField}
                                        className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Step</span>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {data.steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Step ${index + 1} (e.g. e commerce website)`}
                                                value={step.title}
                                                onChange={e => handleStepFieldChange(index, 'title', e.target.value)}
                                                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <select
                                                value={step.assigned_to}
                                                onChange={e => handleStepFieldChange(index, 'assigned_to', e.target.value)}
                                                className="w-36 text-xs px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-600"
                                            >
                                                <option value="">Default Assignee</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                                ))}
                                            </select>
                                            {data.steps.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStepField(index)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Assigning...' : 'Assign Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
