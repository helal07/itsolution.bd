import React, { useState, useEffect, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Camera, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCw, 
    Calendar, 
    Users, 
    UserCheck, 
    UserX, 
    Timer, 
    X, 
    Sparkles, 
    Download, 
    ArrowRight, 
    Smartphone, 
    ShieldCheck, 
    Eye, 
    ChevronRight,
    Play,
    RotateCcw
} from 'lucide-react';

export default function AttendanceIndex({
    employee,
    todayAttendance,
    myAttendances = [],
    myStats = {},
    teamAttendances = [],
    activeEmployees = [],
    selectedDate,
    todayDate,
    isAdmin
}) {
    const [activeTab, setActiveTab] = useState('me'); // 'me' | 'team'
    const [filterDate, setFilterDate] = useState(selectedDate || todayDate);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('checkin'); // 'checkin' | 'checkout'
    
    // Live Clock
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // PWA Install prompt handler
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallPWA = async () => {
        if (!deferredPrompt) {
            alert('To install this app on your phone: Tap browser menu (⋮ or Share) -> "Add to Home Screen"');
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    // Camera & GPS State
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedSelfie, setCapturedSelfie] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [gpsLocation, setGpsLocation] = useState({ latitude: null, longitude: null, accuracy: null, location_name: '' });
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [previewSelfieModal, setPreviewSelfieModal] = useState(null);

    // Open Camera & Request GPS
    const openAttendanceModal = (type) => {
        setModalType(type);
        setCapturedSelfie(null);
        setCameraError(null);
        setNote('');
        setShowModal(true);
        startCamera();
        fetchGpsLocation();
    };

    const closeModal = () => {
        stopCamera();
        setShowModal(false);
        setCapturedSelfie(null);
    };

    const startCamera = async () => {
        try {
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setCameraError('Camera access denied or unavailable. Please allow camera permission.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (showModal && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [showModal, stream]);

    const captureSelfie = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        // Mirror horizontally for natural selfie experience
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSelfie(dataUrl);
    };

    const retakeSelfie = () => {
        setCapturedSelfie(null);
        if (!stream) {
            startCamera();
        }
    };

    const fetchGpsLocation = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            return;
        }
        setGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGpsLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: Math.round(position.coords.accuracy),
                    location_name: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`
                });
                setGpsLoading(false);
            },
            (error) => {
                console.error('GPS error:', error);
                setGpsError(error.message || 'Unable to retrieve your location. Please enable GPS.');
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'checkin' && !capturedSelfie) {
            alert('Live selfie capture is required for check-in.');
            return;
        }
        if (!gpsLocation.latitude || !gpsLocation.longitude) {
            alert('Location coordinates are required. Please click "Retry Location".');
            return;
        }

        setSubmitting(true);
        const endpoint = modalType === 'checkin' ? '/attendance/check-in' : '/attendance/check-out';
        
        router.post(
            endpoint,
            {
                latitude: gpsLocation.latitude,
                longitude: gpsLocation.longitude,
                location_name: gpsLocation.location_name,
                selfie: capturedSelfie,
                note: note,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    setSubmitting(false);
                },
                onError: () => {
                    setSubmitting(false);
                }
            }
        );
    };

    // Filter date change for Team tab
    const handleDateFilter = (e) => {
        const newDate = e.target.value;
        setFilterDate(newDate);
        router.get('/attendance', { date: newDate }, { preserveState: true, preserveScroll: true });
    };

    const isCheckedIn = !!todayAttendance?.check_in_time;
    const isCheckedOut = !!todayAttendance?.check_out_time;

    return (
        <AdminLayout title="Attendance & Operations">
            <Head title="Staff Attendance & Operations" />

            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Top Header & Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Camera className="w-5 h-5" />
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Staff Attendance
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Selfie verification, GPS location logs & team presence tracking
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Me vs Team Toggle */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isInstallable && (
                            <button
                                onClick={handleInstallPWA}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                                <Smartphone className="w-4 h-4" />
                                <span>Install App</span>
                            </button>
                        )}
                        
                        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('me')}
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'me'
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                My Attendance
                            </button>
                            <button
                                onClick={() => setActiveTab('team')}
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'team'
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Team Presence ({teamAttendances.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= TAB 1: ME (Personal Attendance) ================= */}
                {activeTab === 'me' && (
                    <div className="space-y-6">
                        {/* Live Check-in / Check-out Hero Banner */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Main Clock & Action Card */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                                
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200">
                                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>

                                        {/* Presence Status Badge */}
                                        {isCheckedIn ? (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                                todayAttendance.status === 'late'
                                                    ? 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                                                    : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                                            }`}>
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                {isCheckedOut ? 'Completed Shift' : (todayAttendance.status === 'late' ? 'Late Check-in' : 'Present / On Duty')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold">
                                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                                Not Checked In
                                            </span>
                                        )}
                                    </div>

                                    {/* Digital Clock */}
                                    <div className="mt-6">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Current Time</p>
                                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono mt-1">
                                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </h2>
                                    </div>

                                    {/* Today's Logged Information */}
                                    {isCheckedIn && (
                                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Check-in Time</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{todayAttendance.check_in_time}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Check-out Time</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{todayAttendance.check_out_time || '— Still Working'}</p>
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Logged</p>
                                                <p className="text-sm font-bold text-blue-300 mt-0.5">{todayAttendance.total_hours ? `${todayAttendance.total_hours} Hours` : 'Tracking...'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    {!isCheckedIn ? (
                                        <button
                                            onClick={() => openAttendanceModal('checkin')}
                                            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform active:scale-95"
                                        >
                                            <Camera className="w-5 h-5" />
                                            <span>Capture Selfie & Check In</span>
                                        </button>
                                    ) : !isCheckedOut ? (
                                        <button
                                            onClick={() => openAttendanceModal('checkout')}
                                            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer transform active:scale-95"
                                        >
                                            <Clock className="w-5 h-5" />
                                            <span>Check Out for Today</span>
                                        </button>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>You are all done for today! See you tomorrow.</span>
                                        </div>
                                    )}

                                    {todayAttendance?.check_in_selfie && (
                                        <button
                                            onClick={() => setPreviewSelfieModal(todayAttendance.check_in_selfie)}
                                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View Today's Selfie</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Monthly Personal Performance Stats */}
                            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                                        This Month's Summary
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Your personal attendance metric</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <UserCheck className="w-4 h-4" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Present</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{myStats.present_count || 0} <span className="text-xs font-normal text-slate-500">days</span></p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <Timer className="w-4 h-4" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Late</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{myStats.late_count || 0} <span className="text-xs font-normal text-slate-500">days</span></p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Half Day</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{myStats.half_day_count || 0} <span className="text-xs font-normal text-slate-500">days</span></p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Hours</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{myStats.total_hours || 0} <span className="text-xs font-normal text-slate-500">hrs</span></p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href="/daily-work-log"
                                        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-200 transition-colors"
                                    >
                                        <span>Submit Daily Activity Log</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Attendance History Table */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900">My Attendance History</h3>
                                    <p className="text-xs text-slate-500">Recent check-in timestamps and selfie captures</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4">Check In</th>
                                            <th className="py-3 px-4">Check Out</th>
                                            <th className="py-3 px-4">Hours</th>
                                            <th className="py-3 px-4">Selfie & GPS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {myAttendances.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-slate-400">
                                                    No attendance logs recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            myAttendances.map((att) => (
                                                <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="py-3.5 px-4 font-bold text-slate-900">
                                                        {att.date}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                            att.status === 'present'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : att.status === 'late'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        }`}>
                                                            {att.status === 'present' ? 'Present' : att.status === 'late' ? 'Late' : 'Half Day'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-mono font-medium">
                                                        {att.check_in_time || '—'}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-mono font-medium">
                                                        {att.check_out_time || '—'}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-bold text-blue-600">
                                                        {att.total_hours ? `${att.total_hours} hrs` : '—'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {att.check_in_selfie ? (
                                                                <button
                                                                    onClick={() => setPreviewSelfieModal(att.check_in_selfie)}
                                                                    className="group relative cursor-pointer"
                                                                    title="Click to view full selfie"
                                                                >
                                                                    <img
                                                                        src={att.check_in_selfie}
                                                                        alt="Check-in Selfie"
                                                                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
                                                                    />
                                                                </button>
                                                            ) : (
                                                                <span className="text-slate-400">—</span>
                                                            )}
                                                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={att.check_in_location_name}>
                                                                <MapPin className="w-3 h-3 inline mr-0.5 text-slate-400" />
                                                                {att.check_in_location_name || 'Location logged'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: TEAM (Team Attendance Board) ================= */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        {/* Filter Bar & Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={handleDateFilter}
                                        className="mt-1 font-bold text-sm text-slate-900 border-none bg-transparent p-0 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600">
                                    {teamAttendances.length} Active Logged
                                </span>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">On Duty Today</span>
                                <p className="text-2xl font-black text-emerald-950 mt-1">{teamAttendances.filter(a => a.status === 'present').length} Members</p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Late Arrivals</span>
                                <p className="text-2xl font-black text-amber-950 mt-1">{teamAttendances.filter(a => a.status === 'late').length} Members</p>
                            </div>
                        </div>

                        {/* Team Grid Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamAttendances.length === 0 ? (
                                <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p className="font-semibold">No attendance entries found for this date.</p>
                                </div>
                            ) : (
                                teamAttendances.map((att) => {
                                    const emp = att.employee || {};
                                    const usr = att.user || {};
                                    const displayName = emp.name || usr.name || 'Staff Member';
                                    const designation = emp.designation || 'Team Member';
                                    
                                    return (
                                        <div key={att.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {att.check_in_selfie ? (
                                                        <img
                                                            src={att.check_in_selfie}
                                                            alt={displayName}
                                                            onClick={() => setPreviewSelfieModal(att.check_in_selfie)}
                                                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 flex-shrink-0"
                                                            title="Click to view live selfie"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-base flex-shrink-0 shadow-xs">
                                                            {displayName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h4 className="font-extrabold text-sm text-slate-900 truncate leading-tight">{displayName}</h4>
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">{designation}</p>
                                                    </div>
                                                </div>

                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                                                    att.status === 'present'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : att.status === 'late'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                                }`}>
                                                    {att.status === 'present' ? 'Present' : att.status === 'late' ? 'Late' : 'Half Day'}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Check-in Time:</span>
                                                    <span className="font-bold text-slate-800 font-mono">{att.check_in_time || '—'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Check-out Time:</span>
                                                    <span className="font-bold text-slate-800 font-mono">{att.check_out_time || 'In Progress'}</span>
                                                </div>
                                                {att.total_hours && (
                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                                        <span className="text-slate-400">Total Work Hours:</span>
                                                        <span className="font-extrabold text-blue-600">{att.total_hours} hrs</span>
                                                    </div>
                                                )}
                                            </div>

                                            {att.check_in_location_name && (
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{att.check_in_location_name}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* ================= MODAL: WEBCAM SELFIE & GPS CHECK-IN (Matches User Reference Image) ================= */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                                    <Camera className="w-4 h-4" />
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900">
                                    {modalType === 'checkin' ? 'Check-in with Live Selfie' : 'Check-out from Shift'}
                                </h3>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            
                            {/* Camera Live Feed & Selfie Section */}
                            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border-2 border-slate-800 shadow-inner">
                                {cameraError ? (
                                    <div className="p-6 text-center text-red-400 space-y-2">
                                        <AlertCircle className="w-8 h-8 mx-auto" />
                                        <p className="text-xs font-semibold">{cameraError}</p>
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : capturedSelfie ? (
                                    <div className="relative w-full h-full">
                                        <img 
                                            src={capturedSelfie} 
                                            alt="Captured Selfie" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Selfie Captured</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={retakeSelfie}
                                            className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-xs border border-white/20 shadow-md cursor-pointer"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Retake</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover transform -scale-x-100"
                                        />
                                        
                                        {/* Targeting Guide Overlay (Matching uploaded design) */}
                                        <div className="absolute inset-0 border-2 border-dashed border-white/30 pointer-events-none rounded-2xl m-4" />
                                        <div className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <Camera className="w-3 h-3" />
                                            <span>Selfie required</span>
                                        </div>

                                        {/* Capture Button Overlay */}
                                        <button
                                            type="button"
                                            onClick={captureSelfie}
                                            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                                        >
                                            <Camera className="w-4 h-4" />
                                            <span>Capture selfie</span>
                                        </button>
                                    </div>
                                )}
                                <canvas ref={canvasRef} className="hidden" />
                            </div>

                            {/* GPS Location Status Box */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                        <span>GPS Coordinates</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={fetchGpsLocation}
                                        disabled={gpsLoading}
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                                        <span>Retry location</span>
                                    </button>
                                </div>

                                {gpsLoading ? (
                                    <p className="text-xs text-slate-500 animate-pulse">Acquiring accurate satellite GPS...</p>
                                ) : gpsError ? (
                                    <p className="text-xs text-red-600 font-medium">{gpsError}</p>
                                ) : gpsLocation.latitude ? (
                                    <div className="flex items-center justify-between text-xs font-medium text-slate-800">
                                        <span className="font-mono bg-white px-2 py-1 rounded-lg border border-slate-200">
                                            {gpsLocation.latitude.toFixed(5)}, {gpsLocation.longitude.toFixed(5)}
                                        </span>
                                        {gpsLocation.accuracy && (
                                            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                Accurate (±{gpsLocation.accuracy}m)
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-600 font-medium">GPS location not acquired yet.</p>
                                )}
                            </div>

                            {/* Optional Note */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Note / Activity Summary (Optional)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows="2"
                                    placeholder="Working from office / client visit / home..."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || (modalType === 'checkin' && !capturedSelfie) || !gpsLocation.latitude}
                                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Submitting Attendance...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{modalType === 'checkin' ? 'Submit Check-in' : 'Submit Check-out'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: SELFIE PREVIEW ================= */}
            {previewSelfieModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
                    onClick={() => setPreviewSelfieModal(null)}
                >
                    <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewSelfieModal(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white z-10 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={previewSelfieModal}
                            alt="Attendance Selfie"
                            className="w-full h-auto rounded-2xl max-h-[75vh] object-contain bg-slate-950"
                        />
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
