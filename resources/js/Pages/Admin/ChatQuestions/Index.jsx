import React, { useState, useMemo, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import { 
    Bot, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Settings, 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    Layers, 
    Play, 
    Send, 
    RotateCcw, 
    Headphones, 
    ArrowRight, 
    X,
    Zap,
    Tag,
    CornerDownRight
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ questions = [], categories = [], stats = {}, chatSettings = {}, filters = {} }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [activeTab, setActiveTab] = useState(filters.tab || 'all');
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deletingQuestion, setDeletingQuestion] = useState(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showSimulator, setShowSimulator] = useState(false);

    // Form for Create / Edit
    const { 
        data: formData, 
        setData: setFormData, 
        post: postQuestion, 
        put: putQuestion, 
        processing: formProcessing, 
        errors: formErrors, 
        reset: resetForm,
        clearErrors 
    } = useForm({
        question: '',
        answer: '',
        keywords: '',
        category: 'General',
        action_label: '',
        action_url: '',
        suggested_options: [],
        is_quick_option: false,
        is_active: true,
        sort_order: 0,
    });

    const [newOptionInput, setNewOptionInput] = useState('');

    // Settings Form
    const {
        data: settingsData,
        setData: setSettingsData,
        post: postSettings,
        processing: settingsProcessing,
    } = useForm({
        chat_is_enabled: chatSettings.chat_is_enabled || '1',
        chat_bot_name: chatSettings.chat_bot_name || 'ITS AI Assistant',
        chat_welcome_message: chatSettings.chat_welcome_message || "Hello! 👋 I'm your AI Solutions Assistant. Ask me any question about ready apps, licenses, or connect directly to our Support Team.",
        chat_agent_name: chatSettings.chat_agent_name || 'Engr. Tanvir (Support Lead)',
        chat_support_phone: chatSettings.chat_support_phone || '+880 1800-000000',
        chat_support_email: chatSettings.chat_support_email || 'support@itsolutions.com',
    });

    // Delete form
    const { delete: destroyQuestion, processing: deleteProcessing } = useForm();

    // Simulator State
    const [simMessages, setSimMessages] = useState([]);
    const [simInput, setSimInput] = useState('');
    const [simTyping, setSimTyping] = useState(false);
    const [simLiveMode, setSimLiveMode] = useState(false);
    const simEndRef = useRef(null);

    // Initialize Simulator Messages
    useEffect(() => {
        const quickOptions = questions
            .filter(q => q.is_quick_option && q.is_active)
            .map(q => q.question);

        const initialList = quickOptions.length > 0 ? quickOptions : [
            "👨‍💻 Connect to Live Support Team",
            "🛡️ Ready Security Apps & Software",
            "💳 License & Payment Support",
            "⚡ Custom Software & Quotes"
        ];

        setSimMessages([
            {
                id: 'sim-init',
                sender: 'bot',
                text: settingsData.chat_welcome_message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                options: initialList
            }
        ]);
    }, [questions, settingsData.chat_welcome_message]);

    const scrollToSimBottom = () => {
        simEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (showSimulator) {
            scrollToSimBottom();
        }
    }, [simMessages, simTyping, showSimulator]);

    const openCreateModal = () => {
        setEditingQuestion(null);
        clearErrors();
        setFormData({
            question: '',
            answer: '',
            keywords: '',
            category: categories[0] || 'General',
            action_label: '',
            action_url: '',
            suggested_options: [],
            is_quick_option: true,
            is_active: true,
            sort_order: questions.length + 1,
        });
        setNewOptionInput('');
        setShowCreateModal(true);
    };

    const openEditModal = (q) => {
        setEditingQuestion(q);
        clearErrors();
        setFormData({
            question: q.question,
            answer: q.answer,
            keywords: q.keywords || '',
            category: q.category || 'General',
            action_label: q.action_label || '',
            action_url: q.action_url || '',
            suggested_options: Array.isArray(q.suggested_options) ? q.suggested_options : [],
            is_quick_option: Boolean(q.is_quick_option),
            is_active: Boolean(q.is_active),
            sort_order: q.sort_order || 0,
        });
        setNewOptionInput('');
        setShowCreateModal(true);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (editingQuestion) {
            putQuestion(route('admin.chat-questions.update', editingQuestion.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    resetForm();
                    setEditingQuestion(null);
                }
            });
        } else {
            postQuestion(route('admin.chat-questions.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleToggleActive = (q) => {
        router.post(route('admin.chat-questions.toggle-active', q.id), {}, {
            preserveScroll: true,
        });
    };

    const handleToggleQuick = (q) => {
        router.post(route('admin.chat-questions.toggle-quick', q.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteQuestion = (e) => {
        e.preventDefault();
        if (!deletingQuestion) return;
        destroyQuestion(route('admin.chat-questions.destroy', deletingQuestion.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingQuestion(null),
        });
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.chat-questions.settings'), {
            preserveScroll: true,
            onSuccess: () => setShowSettingsModal(false),
        });
    };

    const handleAddOption = () => {
        const val = newOptionInput.trim();
        if (!val) return;
        if (!formData.suggested_options.includes(val)) {
            setFormData('suggested_options', [...formData.suggested_options, val]);
        }
        setNewOptionInput('');
    };

    const handleRemoveOption = (optToRemove) => {
        setFormData('suggested_options', formData.suggested_options.filter(o => o !== optToRemove));
    };

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = !searchQuery.trim() || (
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (q.keywords && q.keywords.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;

            const matchesTab = 
                activeTab === 'all' ? true :
                activeTab === 'quick' ? q.is_quick_option :
                activeTab === 'active' ? q.is_active :
                activeTab === 'inactive' ? !q.is_active : true;

            return matchesSearch && matchesCategory && matchesTab;
        });
    }, [questions, searchQuery, selectedCategory, activeTab]);

    const handleSimSend = (textToSend) => {
        const text = textToSend || simInput.trim();
        if (!text) return;

        const userMsg = {
            id: `sim-user-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setSimMessages(prev => [...prev, userMsg]);
        setSimInput('');
        setSimTyping(true);

        const query = text.toLowerCase().trim();

        if (query.includes('support') || query.includes('human') || query.includes('agent') || query.includes('connect to live support team')) {
            setTimeout(() => {
                setSimLiveMode(true);
                setSimTyping(false);
                const agentWelcome = {
                    id: `sim-agent-${Date.now()}`,
                    sender: 'agent',
                    agentName: settingsData.chat_agent_name,
                    text: `Hi there! 👋 I am Tanvir from Support & Security. How can we assist you today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    supportHotlines: true
                };
                setSimMessages(prev => [...prev, agentWelcome]);
            }, 500);
            return;
        }

        setTimeout(() => {
            let matched = questions.find(q => q.is_active && q.question.toLowerCase().trim() === query);
            
            if (!matched) {
                matched = questions.find(q => {
                    if (!q.is_active || !q.keywords) return false;
                    const kwList = q.keywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
                    return kwList.some(k => query.includes(k) || k.includes(query));
                });
            }

            if (!matched) {
                matched = questions.find(q => q.is_active && (q.question.toLowerCase().includes(query) || query.includes(q.question.toLowerCase())));
            }

            let botReply;
            if (matched) {
                botReply = {
                    id: `sim-bot-${Date.now()}`,
                    sender: 'bot',
                    text: matched.answer,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    action_label: matched.action_label,
                    action_url: matched.action_url,
                    options: matched.suggested_options && matched.suggested_options.length > 0 ? matched.suggested_options : []
                };
            } else {
                botReply = {
                    id: `sim-bot-${Date.now()}`,
                    sender: 'bot',
                    text: "Thank you for reaching out! You can explore our ready security apps or transfer directly to our Support team.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    action_label: "Browse Software",
                    action_url: "/services",
                    options: [
                        "👨‍💻 Connect to Live Support Team",
                        "🛡️ Ready Security Apps & Software",
                        "💳 License & Payment Support"
                    ]
                };
            }

            setSimMessages(prev => [...prev, botReply]);
            setSimTyping(false);
        }, 400);
    };

    const handleSimReset = () => {
        setSimLiveMode(false);
        const quickOptions = questions
            .filter(q => q.is_quick_option && q.is_active)
            .map(q => q.question);

        setSimMessages([
            {
                id: 'sim-init-reset',
                sender: 'bot',
                text: settingsData.chat_welcome_message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                options: quickOptions.length > 0 ? quickOptions : [
                    "👨‍💻 Connect to Live Support Team",
                    "🛡️ Ready Security Apps & Software",
                    "💳 License & Payment Support"
                ]
            }
        ]);
    };

    return (
        <AdminLayout title="Live Chat & Q&A">
            <div className="space-y-5 max-w-7xl mx-auto pb-8">
                
                {/* Clean Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Live Chat & Q&A
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSimulator(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                        >
                            <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                            <span>Simulator</span>
                        </button>

                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                        >
                            <Settings className="w-3.5 h-3.5 text-slate-600" />
                            <span>Settings</span>
                        </button>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Question</span>
                        </button>
                    </div>
                </div>

                {/* Stat Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Questions</span>
                        <p className="font-black text-xl text-slate-900 font-mono mt-0.5">{stats.total || questions.length}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Starter Chips</span>
                        <p className="font-black text-xl text-emerald-600 font-mono mt-0.5">{stats.quick_options || 0}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active</span>
                        <p className="font-black text-xl text-blue-600 font-mono mt-0.5">{stats.active || 0}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Categories</span>
                        <p className="font-black text-xl text-purple-600 font-mono mt-0.5">{stats.categories_count || categories.length}</p>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-2xs">
                    
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 w-full lg:w-auto overflow-x-auto">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'quick', label: 'Starter Chips' },
                            { id: 'active', label: 'Active' },
                            { id: 'inactive', label: 'Inactive' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search & Category Filter */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                        {categories.length > 0 && (
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 outline-none"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
                        )}

                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions & keywords..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white rounded-xl text-xs border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                {filteredQuestions.length > 0 ? (
                    <div className="bg-white border border-blue-100 rounded-2xl divide-y divide-blue-50 shadow-2xs">
                        {filteredQuestions.map((q) => (
                            <div 
                                key={q.id}
                                className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4 transition-colors ${
                                    q.is_active ? 'hover:bg-blue-50/30' : 'bg-slate-50/60 opacity-75'
                                }`}
                            >
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                            {q.category || 'General'}
                                        </span>

                                        {q.is_quick_option && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                                <Zap className="w-3 h-3 text-emerald-600" />
                                                <span>Starter Chip</span>
                                            </span>
                                        )}

                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            q.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {q.is_active ? 'Active' : 'Disabled'}
                                        </span>

                                        <span className="text-[10px] text-slate-400 font-mono">
                                            #{q.sort_order || 0}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">
                                            {q.question}
                                        </h3>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                                            {q.answer}
                                        </p>
                                    </div>

                                    {/* Actions & Keywords */}
                                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                        {q.action_label && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                                <span>Link: {q.action_label}</span>
                                                <ArrowRight className="w-3 h-3 text-blue-500" />
                                                <span className="text-slate-400 font-mono text-[10px]">{q.action_url}</span>
                                            </span>
                                        )}

                                        {q.keywords && (
                                            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                                                <Tag className="w-3 h-3 text-slate-400" />
                                                <span className="font-medium">Keywords:</span>
                                                <span className="text-slate-600 font-mono text-[10px]">{q.keywords}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Follow-up Chips */}
                                    {q.suggested_options && Array.isArray(q.suggested_options) && q.suggested_options.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                            <CornerDownRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                            <span className="text-[10px] font-bold text-slate-400">Options:</span>
                                            {q.suggested_options.map((opt, optIdx) => (
                                                <span key={optIdx} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                                                    {opt}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleQuick(q)}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                            q.is_quick_option ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                        title="Toggle Starter Chip"
                                    >
                                        <Zap className="w-3 h-3 inline mr-1" />
                                        {q.is_quick_option ? 'Chip: ON' : 'Chip: OFF'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(q)}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                            q.is_active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
                                        }`}
                                        title="Toggle Active"
                                    >
                                        {q.is_active ? 'Active' : 'Disabled'}
                                    </button>

                                    <ActionDropdown label="Actions">
                                        <div className="py-1">
                                            <ActionItem onClick={() => openEditModal(q)} icon={Edit2}>
                                                Edit
                                            </ActionItem>
                                            <ActionItem 
                                                onClick={() => {
                                                    setShowSimulator(true);
                                                    handleSimSend(q.question);
                                                }} 
                                                icon={Play}
                                            >
                                                Test in Simulator
                                            </ActionItem>
                                            <ActionItem onClick={() => setDeletingQuestion(q)} icon={Trash2} danger>
                                                Delete
                                            </ActionItem>
                                        </div>
                                    </ActionDropdown>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-blue-100 rounded-2xl p-8 text-center space-y-2 shadow-2xs">
                        <Bot className="w-6 h-6 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-sm text-slate-900">No Chat Questions Found</h3>
                        <p className="text-xs text-slate-400">
                            Create your first chat question flow to get started.
                        </p>
                    </div>
                )}

                {/* Create / Edit Modal */}
                {showCreateModal && (
                    <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="lg">
                        <form onSubmit={handleSubmitForm} className="p-6 space-y-3 bg-white text-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="font-bold text-base text-slate-900">
                                    {editingQuestion ? 'Edit Question' : 'Add Question'}
                                </h3>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Question / Prompt *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.question}
                                        onChange={(e) => setFormData('question', e.target.value)}
                                        placeholder="e.g. How does license activation work?"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                    />
                                    {formErrors.question && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.question}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData('category', e.target.value)}
                                            placeholder="General"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Keywords (Comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.keywords}
                                        onChange={(e) => setFormData('keywords', e.target.value)}
                                        placeholder="license, key, activate, token"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Bot Answer *</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.answer}
                                        onChange={(e) => setFormData('answer', e.target.value)}
                                        placeholder="Enter the automated answer..."
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 leading-relaxed"
                                    />
                                    {formErrors.answer && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.answer}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Button Label (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.action_label}
                                            onChange={(e) => setFormData('action_label', e.target.value)}
                                            placeholder="Browse Apps"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Button URL</label>
                                        <input
                                            type="text"
                                            value={formData.action_url}
                                            onChange={(e) => setFormData('action_url', e.target.value)}
                                            placeholder="/services"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Follow-up Option Chips</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newOptionInput}
                                            onChange={(e) => setNewOptionInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddOption();
                                                }
                                            }}
                                            placeholder="Type chip text & press Add..."
                                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            className="px-3 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {formData.suggested_options.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {formData.suggested_options.map((opt, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                                                    <span>{opt}</span>
                                                    <button type="button" onClick={() => handleRemoveOption(opt)} className="text-slate-400 hover:text-red-600">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_quick_option}
                                            onChange={(e) => setFormData('is_quick_option', e.target.checked)}
                                            className="w-4 h-4 rounded text-blue-600"
                                        />
                                        <span className="font-semibold text-slate-800">Show as Starter Chip</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded text-blue-600"
                                        />
                                        <span className="font-semibold text-slate-800">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formProcessing}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs"
                                >
                                    {formProcessing ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Settings Modal */}
                {showSettingsModal && (
                    <Modal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} maxWidth="md">
                        <form onSubmit={handleSaveSettings} className="p-6 space-y-3 bg-white text-slate-800 rounded-2xl">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="font-bold text-base text-slate-900">
                                    Chat Settings
                                </h3>
                                <button type="button" onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Chat Status</label>
                                    <select
                                        value={settingsData.chat_is_enabled}
                                        onChange={(e) => setSettingsData('chat_is_enabled', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                                    >
                                        <option value="1">Enabled</option>
                                        <option value="0">Disabled</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Bot Name</label>
                                        <input
                                            type="text"
                                            value={settingsData.chat_bot_name}
                                            onChange={(e) => setSettingsData('chat_bot_name', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Support Lead</label>
                                        <input
                                            type="text"
                                            value={settingsData.chat_agent_name}
                                            onChange={(e) => setSettingsData('chat_agent_name', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Welcome Message</label>
                                    <textarea
                                        rows={2}
                                        value={settingsData.chat_welcome_message}
                                        onChange={(e) => setSettingsData('chat_welcome_message', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none leading-relaxed"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Hotline Phone</label>
                                        <input
                                            type="text"
                                            value={settingsData.chat_support_phone}
                                            onChange={(e) => setSettingsData('chat_support_phone', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Support Email</label>
                                        <input
                                            type="email"
                                            value={settingsData.chat_support_email}
                                            onChange={(e) => setSettingsData('chat_support_email', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowSettingsModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={settingsProcessing}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs"
                                >
                                    {settingsProcessing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Delete Modal */}
                {deletingQuestion && (
                    <Modal show={Boolean(deletingQuestion)} onClose={() => setDeletingQuestion(null)} maxWidth="sm">
                        <form onSubmit={handleDeleteQuestion} className="p-6 space-y-3 bg-white text-slate-800 rounded-2xl text-center">
                            <Trash2 className="w-6 h-6 text-red-600 mx-auto" />
                            <h3 className="font-bold text-base text-slate-900">Delete Question?</h3>
                            <p className="text-xs text-slate-500">
                                Remove "{deletingQuestion.question}" from the chatbot?
                            </p>

                            <div className="flex items-center justify-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeletingQuestion(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs"
                                >
                                    {deleteProcessing ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Live Simulator Modal */}
                {showSimulator && (
                    <Modal show={showSimulator} onClose={() => setShowSimulator(false)} maxWidth="sm">
                        <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-[520px]">
                            
                            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                        {simLiveMode ? <Headphones className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xs text-white leading-tight">
                                            {simLiveMode ? settingsData.chat_agent_name : settingsData.chat_bot_name}
                                        </h3>
                                        <p className="text-[10px] text-slate-300">Live Simulator</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button onClick={handleSimReset} className="p-1 text-slate-300 hover:text-white" title="Restart">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setShowSimulator(false)} className="p-1 text-slate-300 hover:text-white">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                                {simMessages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className="space-y-1 max-w-[85%]">
                                            <div className={`p-2.5 rounded-xl ${
                                                msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                                            }`}>
                                                {msg.agentName && <span className="text-[10px] font-bold text-emerald-700 block mb-0.5">👨‍💻 {msg.agentName}</span>}
                                                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                                            </div>

                                            {msg.action_label && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                                                    <span>{msg.action_label}</span>
                                                    <ArrowRight className="w-2.5 h-2.5" />
                                                </span>
                                            )}

                                            {msg.options && msg.options.length > 0 && (
                                                <div className="flex flex-col gap-1 pt-0.5">
                                                    {msg.options.map((opt, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleSimSend(opt)}
                                                            className="text-left px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-medium transition-colors shadow-2xs flex items-center justify-between"
                                                        >
                                                            <span>{opt}</span>
                                                            <ArrowRight className="w-3 h-3 text-slate-400" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {simTyping && (
                                    <div className="flex gap-1 items-center p-2 bg-white rounded-lg border border-slate-200 w-16">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                )}

                                <div ref={simEndRef} />
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleSimSend(); }} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
                                <input
                                    type="text"
                                    value={simInput}
                                    onChange={(e) => setSimInput(e.target.value)}
                                    placeholder="Type message..."
                                    className="flex-1 px-3 py-1.5 bg-slate-100 text-xs rounded-xl border border-transparent focus:border-blue-500 outline-none"
                                />
                                <button type="submit" disabled={!simInput.trim()} className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </Modal>
                )}

            </div>
        </AdminLayout>
    );
}
