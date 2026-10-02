import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatDate } from '@/Utils/dateFormat';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Image as ImageIcon,
    Mic,
    MicOff,
    Music,
    Paperclip,
    Play,
    Pause,
    Plus,
    Square,
    Trash2,
    UploadCloud,
    Video,
    ExternalLink,
    AlertCircle,
    UserCheck,
    Send,
    Eye,
    Download,
    Sparkles,
    Check
} from 'lucide-react';

export default function OrderRequirements({ order, isStaffOrAdmin }) {
    const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'images' | 'videos' | 'documents' | 'links'
    const [selectedRequirementId, setSelectedRequirementId] = useState(
        order.requirements?.[0]?.id || null
    );
    const [showNewReqModal, setShowNewReqModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    // Currently playing audio in list
    const [playingAudioId, setPlayingAudioId] = useState(null);
    const audioPlayerRef = useRef(null);

    // Requirement Form
    const { data: reqData, setData: setReqData, post: postReq, processing: reqProcessing, reset: resetReq, errors: reqErrors } = useForm({
        title: '',
        description: '',
    });

    // File Upload Form
    const { data: fileData, setData: setFileData, post: postFile, processing: fileProcessing, reset: resetFile, errors: fileErrors, progress } = useForm({
        file_type: 'image',
        file: null,
        external_url: '',
        original_name: '',
        duration_seconds: 0,
    });

    const activeRequirement = order.requirements?.find(r => r.id === selectedRequirementId) || order.requirements?.[0];

    // Filter attachments by active tab
    const allAttachments = activeRequirement?.attachments || [];
    const audioAttachments = allAttachments.filter(a => a.file_type === 'audio');
    const imageAttachments = allAttachments.filter(a => a.file_type === 'image');
    const videoAttachments = allAttachments.filter(a => a.file_type === 'video');
    const docAttachments = allAttachments.filter(a => a.file_type === 'document');
    const linkAttachments = allAttachments.filter(a => a.file_type === 'link');

    // Handle Mic Recording
    const startRecording = async () => {
        try {
            audioChunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(blob);
                setRecordedAudioBlob(blob);
                setRecordedAudioUrl(audioUrl);
                // Stop all mic tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(200);
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Microphone error:', err);
            alert('Could not access microphone. Please check browser permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const cancelRecording = () => {
        stopRecording();
        setRecordedAudioBlob(null);
        setRecordedAudioUrl(null);
        setRecordingTime(0);
    };

    const uploadVoiceNote = () => {
        if (!recordedAudioBlob || !activeRequirement) return;

        const file = new File([recordedAudioBlob], `Voice_Note_${new Date().toISOString().slice(0, 10)}.webm`, {
            type: 'audio/webm'
        });

        const formData = new FormData();
        formData.append('file_type', 'audio');
        formData.append('file', file);
        formData.append('original_name', `Client Voice Briefing (${recordingTime}s)`);
        formData.append('duration_seconds', recordingTime);

        router.post(route('orders.requirements.attachments.store', [order.id, activeRequirement.id]), formData, {
            onSuccess: () => {
                cancelRecording();
            }
        });
    };

    // Generic file upload submit
    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!activeRequirement) {
            alert('Please select or create a requirement section first.');
            return;
        }

        fileData.file_type = activeTab === 'links' ? 'link' : activeTab.slice(0, -1); // singular form
        postFile(route('orders.requirements.attachments.store', [order.id, activeRequirement.id]), {
            onSuccess: () => {
                resetFile();
                // Reset file input element
                const fileInput = document.getElementById('file-upload-input');
                if (fileInput) fileInput.value = '';
            }
        });
    };

    // Requirement form submit
    const handleReqSubmit = (e) => {
        e.preventDefault();
        postReq(route('orders.requirements.store', order.id), {
            onSuccess: () => {
                resetReq();
                setShowNewReqModal(false);
            }
        });
    };

    const handleDeleteAttachment = (attachmentId) => {
        if (confirm('Are you sure you want to remove this attachment?')) {
            router.delete(route('orders.requirements.attachments.destroy', attachmentId));
        }
    };

    const formatSeconds = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <PublicLayout>
            <Head title={`Work Order Requirements - #${order.id}`} />

            <div className="min-h-screen bg-neutral-900 text-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Top Breadcrumb & Action bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-neutral-800">
                        <div className="flex items-center gap-3">
                            <Link
                                href={isStaffOrAdmin ? route('staff.tasks.index') : route('client.dashboard')}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {isStaffOrAdmin ? 'Back to My Tasks' : 'Back to Dashboard'}
                            </Link>
                            <span className="text-neutral-600">/</span>
                            <span className="text-xs text-neutral-400 font-mono">Work Order #{order.id}</span>
                        </div>

                        {isStaffOrAdmin && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                <UserCheck className="w-3.5 h-3.5" />
                                Staff / Admin Execution View
                            </span>
                        )}
                    </div>

                    {/* Order Overview Banner */}
                    <div className="rounded-3xl bg-neutral-800/80 border border-neutral-700/60 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-black text-white font-heading tracking-tight">
                                        {order.project_name || order.item?.name || 'Custom Work Order'}
                                    </h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                        order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-400">
                                    Client: <strong className="text-white">{order.client?.name || order.user?.name}</strong>
                                    {order.client?.phone && <span className="ml-2 font-mono text-neutral-400">({order.client.phone})</span>}
                                    &bull; Invoice: <span className="font-mono text-blue-400">{order.transaction_id || `ORD-${order.id}`}</span>
                                </p>
                            </div>

                            {/* Assigned Staff & Progress */}
                            <div className="flex items-center gap-6 bg-neutral-900/60 border border-neutral-700/50 p-4 rounded-2xl">
                                {order.tasks?.[0]?.assignee ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-inner">
                                            {order.tasks[0].assignee.avatar ? (
                                                <img src={order.tasks[0].assignee.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                order.tasks[0].assignee.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-neutral-400 uppercase font-mono">Assigned Staff</p>
                                            <p className="text-sm font-bold text-white">{order.tasks[0].assignee.name}</p>
                                            <p className="text-xs text-neutral-400">{order.tasks[0].assignee.designation}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[11px] text-neutral-400 uppercase font-mono">Assigned Staff</p>
                                        <p className="text-xs font-semibold text-neutral-400">Under Review / Pending Assignment</p>
                                    </div>
                                )}

                                <div className="h-10 w-px bg-neutral-700/60"></div>

                                <div>
                                    <p className="text-[11px] text-neutral-400 uppercase font-mono">Progress</p>
                                    <p className="text-lg font-black text-blue-400 font-mono">{order.progress || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Workspace Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column: Requirements List & New Requirement Modal (4 cols) */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    Requirement Modules
                                </h2>
                                {!isStaffOrAdmin && (
                                    <button
                                        onClick={() => setShowNewReqModal(true)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Module
                                    </button>
                                )}
                            </div>

                            {/* Requirements List */}
                            <div className="space-y-3">
                                {order.requirements?.length > 0 ? (
                                    order.requirements.map((req) => (
                                        <div
                                            key={req.id}
                                            onClick={() => setSelectedRequirementId(req.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                selectedRequirementId === req.id
                                                    ? 'bg-neutral-800 border-blue-500/60 shadow-lg ring-1 ring-blue-500/30'
                                                    : 'bg-neutral-800/40 border-neutral-700/40 hover:bg-neutral-800/70 hover:border-neutral-600'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-sm text-white">{req.title}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-700/80 text-neutral-300 font-mono">
                                                    {req.attachments?.length || 0} media
                                                </span>
                                            </div>
                                            {req.description && (
                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                                    {req.description}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-neutral-400 font-mono mt-2">
                                                {formatDate(req.created_at)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-800/20 text-center space-y-3">
                                        <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
                                        <p className="text-xs text-neutral-400">No requirement modules submitted yet.</p>
                                        {!isStaffOrAdmin && (
                                            <button
                                                onClick={() => setShowNewReqModal(true)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                                            >
                                                Create First Module
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Active Requirement Description Box */}
                            {activeRequirement && (
                                <div className="p-5 rounded-2xl bg-neutral-800/60 border border-neutral-700/50 space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                        Detailed Scope / Notes
                                    </h4>
                                    <div className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-800">
                                        {activeRequirement.description || 'No detailed written description provided.'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Multimedia Hub (Voice Notes, Images, Videos, Files) (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Multimedia Navigation Tabs */}
                            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 overflow-x-auto">
                                {[
                                    { key: 'audio', label: 'Audio Briefings', icon: Mic, count: audioAttachments.length },
                                    { key: 'images', label: 'Images & Mockups', icon: ImageIcon, count: imageAttachments.length },
                                    { key: 'videos', label: 'Videos & Demos', icon: Video, count: videoAttachments.length },
                                    { key: 'documents', label: 'Documents / Files', icon: FileText, count: docAttachments.length },
                                    { key: 'links', label: 'External Links', icon: ExternalLink, count: linkAttachments.length },
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{tab.label}</span>
                                            {tab.count > 0 && (
                                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                                                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-700 text-neutral-300'
                                                }`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* TAB 1: AUDIO BRIEFING & VOICE NOTES */}
                            {activeTab === 'audio' && (
                                <div className="space-y-6">
                                    {/* Mic Live Recorder Card (Shown for client & staff) */}
                                    <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-800/90 to-neutral-900 border border-neutral-700/60 shadow-xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                                    <Mic className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-white">Direct Voice Note Recorder</h3>
                                                    <p className="text-xs text-neutral-400">Record your project instructions or feedback with your microphone</p>
                                                </div>
                                            </div>

                                            {isRecording && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-pulse font-mono text-xs font-bold">
                                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                                    Recording: {formatSeconds(recordingTime)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-3 pt-2">
                                            {!isRecording && !recordedAudioUrl ? (
                                                <button
                                                    onClick={startRecording}
                                                    disabled={!activeRequirement}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
                                                >
                                                    <Mic className="w-4 h-4" />
                                                    Start Voice Recording
                                                </button>
                                            ) : isRecording ? (
                                                <button
                                                    onClick={stopRecording}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold transition"
                                                >
                                                    <Square className="w-4 h-4 fill-white" />
                                                    Stop Recording
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-3 w-full flex-wrap">
                                                    <audio src={recordedAudioUrl} controls className="h-10 rounded-xl bg-neutral-900" />
                                                    <button
                                                        onClick={uploadVoiceNote}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                        Save & Attach Audio
                                                    </button>
                                                    <button
                                                        onClick={cancelRecording}
                                                        className="px-3 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs font-semibold transition"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Upload pre-recorded audio file */}
                                    <form onSubmit={handleFileUpload} className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/40 flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <Music className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-neutral-300 font-medium">Or upload audio file (.mp3, .m4a, .wav):</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={(e) => setFileData('file', e.target.files[0])}
                                                className="text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-neutral-200 hover:file:bg-neutral-600 cursor-pointer"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!fileData.file || fileProcessing}
                                                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>

                                    {/* Audio List */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                            Voice Briefings & Audio Instructions ({audioAttachments.length})
                                        </h3>
                                        {audioAttachments.length > 0 ? (
                                            audioAttachments.map((audio) => (
                                                <div
                                                    key={audio.id}
                                                    className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                                            <Music className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{audio.original_name}</p>
                                                            <p className="text-[11px] text-neutral-400 font-mono">
                                                                Uploaded by {audio.uploader?.name || 'Client'} &bull; {formatDate(audio.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <audio src={audio.url} controls className="h-9 w-64 rounded-lg" />
                                                        <button
                                                            onClick={() => handleDeleteAttachment(audio.id)}
                                                            className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/50 transition"
                                                            title="Delete Audio"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic py-4">No audio briefings recorded yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: IMAGES & MOCKUPS */}
                            {activeTab === 'images' && (
                                <div className="space-y-6">
                                    {/* Upload Images Form */}
                                    <form onSubmit={handleFileUpload} className="p-6 rounded-3xl bg-neutral-800/60 border border-dashed border-neutral-700 hover:border-blue-500/60 transition text-center space-y-3">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Upload Reference Images & Mockups</p>
                                            <p className="text-xs text-neutral-400">PNG, JPG, WebP, SVG (Screenshots, logos, style guides)</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 pt-2">
                                            <input
                                                id="file-upload-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFileData('file', e.target.files[0])}
                                                className="text-xs text-neutral-400 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!fileData.file || fileProcessing}
                                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition shadow-md"
                                            >
                                                Upload Image
                                            </button>
                                        </div>
                                    </form>

                                    {/* Images Gallery Grid */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                            Reference Image Gallery ({imageAttachments.length})
                                        </h3>
                                        {imageAttachments.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {imageAttachments.map((img) => (
                                                    <div
                                                        key={img.id}
                                                        className="group relative rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700/60 aspect-video flex items-center justify-center"
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={img.original_name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                                            <a
                                                                href={img.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
                                                                title="View Full Size"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteAttachment(img.id)}
                                                                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <span className="absolute bottom-1 left-2 right-2 text-[10px] text-white/90 truncate font-mono bg-neutral-900/80 px-2 py-0.5 rounded">
                                                            {img.original_name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic py-4">No reference images uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: VIDEOS & DEMOS */}
                            {activeTab === 'videos' && (
                                <div className="space-y-6">
                                    {/* Upload Video or Video URL */}
                                    <form onSubmit={handleFileUpload} className="p-6 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-white">Video Walkthrough / Screencast</h3>
                                                <p className="text-xs text-neutral-400">Upload a video file (.mp4, .webm) or provide an external video link</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-neutral-300">Option 1: Video File (MP4, WebM)</label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={(e) => setFileData('file', e.target.files[0])}
                                                    className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-neutral-200 cursor-pointer"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-neutral-300">Option 2: Video Link (Loom, YouTube, Drive)</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://www.loom.com/share/..."
                                                    value={fileData.external_url}
                                                    onChange={(e) => setFileData('external_url', e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={(!fileData.file && !fileData.external_url) || fileProcessing}
                                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition shadow-md"
                                            >
                                                Save Video Resource
                                            </button>
                                        </div>
                                    </form>

                                    {/* Video List */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                            Video Requirements & Explanations ({videoAttachments.length})
                                        </h3>
                                        {videoAttachments.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {videoAttachments.map((vid) => (
                                                    <div key={vid.id} className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/60 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-bold text-white truncate">{vid.original_name}</p>
                                                            <button
                                                                onClick={() => handleDeleteAttachment(vid.id)}
                                                                className="text-neutral-400 hover:text-rose-400 transition"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {vid.file_path ? (
                                                            <video src={vid.url} controls className="w-full rounded-xl bg-black aspect-video object-contain" />
                                                        ) : (
                                                            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700/50 flex items-center justify-between">
                                                                <span className="text-xs text-neutral-300 font-mono truncate">{vid.external_url}</span>
                                                                <a
                                                                    href={vid.external_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition flex items-center gap-1.5"
                                                                >
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                    Open Link
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic py-4">No video briefings uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: DOCUMENTS / FILES */}
                            {activeTab === 'documents' && (
                                <div className="space-y-6">
                                    <form onSubmit={handleFileUpload} className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs text-neutral-300">Upload PDF, DOCX, ZIP specifications:</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                                                onChange={(e) => setFileData('file', e.target.files[0])}
                                                className="text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-neutral-200 cursor-pointer"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!fileData.file || fileProcessing}
                                                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition"
                                            >
                                                Upload File
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                            Documents ({docAttachments.length})
                                        </h3>
                                        {docAttachments.length > 0 ? (
                                            docAttachments.map((doc) => (
                                                <div key={doc.id} className="p-3.5 rounded-2xl bg-neutral-800/70 border border-neutral-700/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-xs font-bold text-white">{doc.original_name}</p>
                                                            <p className="text-[10px] text-neutral-400 font-mono">{doc.file_size_kb} KB</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={doc.url}
                                                            download
                                                            className="p-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs transition"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteAttachment(doc.id)}
                                                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic py-4">No documents attached yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: EXTERNAL LINKS */}
                            {activeTab === 'links' && (
                                <div className="space-y-6">
                                    <form onSubmit={handleFileUpload} className="p-6 rounded-3xl bg-neutral-800/60 border border-neutral-700/60 space-y-4">
                                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 text-blue-400" />
                                            Add Reference Website / Figma / Resource Link
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Title (e.g. Competitor Website, Figma Board)"
                                                value={fileData.original_name}
                                                onChange={(e) => setFileData('original_name', e.target.value)}
                                                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                                            />
                                            <input
                                                type="url"
                                                placeholder="https://example.com"
                                                value={fileData.external_url}
                                                onChange={(e) => setFileData('external_url', e.target.value)}
                                                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={!fileData.external_url || fileProcessing}
                                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition shadow-md"
                                            >
                                                Add Link
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                                            Links ({linkAttachments.length})
                                        </h3>
                                        {linkAttachments.length > 0 ? (
                                            linkAttachments.map((link) => (
                                                <div key={link.id} className="p-3.5 rounded-2xl bg-neutral-800/70 border border-neutral-700/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <ExternalLink className="w-4 h-4 text-blue-400" />
                                                        <div>
                                                            <p className="text-xs font-bold text-white">{link.original_name}</p>
                                                            <a href={link.external_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline font-mono">
                                                                {link.external_url}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAttachment(link.id)}
                                                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic py-4">No reference links added yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Modal: Create Requirement Module */}
            {showNewReqModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <h3 className="text-base font-bold text-white font-heading">
                                Add Requirement Specification
                            </h3>
                            <button
                                onClick={() => setShowNewReqModal(false)}
                                className="text-neutral-400 hover:text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleReqSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Requirement Module Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website Layout & Color Theme, Checkout Flow"
                                    value={reqData.title}
                                    onChange={(e) => setReqData('title', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Detailed Description / Instructions</label>
                                <textarea
                                    rows="5"
                                    placeholder="Write your bullet points, design requirements, or specific expectations..."
                                    value={reqData.description}
                                    onChange={(e) => setReqData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewReqModal(false)}
                                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={reqProcessing}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
                                >
                                    Save Module
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
