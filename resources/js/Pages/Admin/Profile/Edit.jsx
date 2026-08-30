import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Shield, 
    Briefcase, 
    Building2, 
    Calendar, 
    Camera, 
    CheckCircle2, 
    Save, 
    KeyRound,
    UserCheck,
    Clock
} from 'lucide-react';

export default function Edit({ user, employee }) {
    const { flash = {} } = usePage().props;

    // Profile Details Form
    const { 
        data: profileData, 
        setData: setProfileData, 
        post: postProfile, 
        processing: profileProcessing, 
        errors: profileErrors 
    } = useForm({
        _method: 'PUT',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        designation: employee?.designation || (user.role === 'admin' ? 'System Administrator' : 'Staff Engineer'),
        department: employee?.department || 'Engineering',
        avatar: employee?.avatar || '',
        avatar_file: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(employee?.avatar || '');
    const avatarInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData('avatar_file', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        postProfile(route('admin.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Password Update Form
    const { 
        data: passwordData, 
        setData: setPasswordData, 
        put: putPassword, 
        processing: passwordProcessing, 
        errors: passwordErrors, 
        reset: resetPassword 
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword(route('admin.profile.password'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AdminLayout title="My Profile">
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
                
                {/* Clean Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Admin & Staff Profile
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Profile Details Form & Password */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Profile Information */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        Personal & Staff Information
                                    </h2>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                                
                                {/* Avatar Upload Section */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt={profileData.name}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 bg-slate-100 shadow-2xs"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-2xs">
                                                {(profileData.name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => avatarInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-xs cursor-pointer"
                                            title="Change Profile Photo"
                                        >
                                            <Camera className="w-3 h-3" />
                                        </button>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-bold text-slate-800 block text-xs">Profile Picture</span>
                                        <p className="text-[11px] text-slate-400">JPG, PNG, or WebP. Max 4MB.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Full Name *</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                required
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        {profileErrors.name && <p className="text-red-600 text-[11px]">{profileErrors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="email"
                                                required
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        {profileErrors.email && <p className="text-red-600 text-[11px]">{profileErrors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData('phone', e.target.value)}
                                                placeholder="+880 1..."
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        {profileErrors.phone && <p className="text-red-600 text-[11px]">{profileErrors.phone}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Designation / Title</label>
                                        <div className="relative">
                                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={profileData.designation}
                                                onChange={(e) => setProfileData('designation', e.target.value)}
                                                placeholder="e.g. Lead Engineer"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Department</label>
                                        <div className="relative">
                                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={profileData.department}
                                                onChange={(e) => setProfileData('department', e.target.value)}
                                                placeholder="e.g. Engineering"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        <span>{profileProcessing ? 'Saving Details...' : 'Save Profile Changes'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 2. Password & Security */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <KeyRound className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        Password & Security
                                    </h2>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 block">Current Password *</label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            placeholder="Enter your current password"
                                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    {passwordErrors.current_password && <p className="text-red-600 text-[11px]">{passwordErrors.current_password}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">New Password *</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                placeholder="Minimum 8 characters"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        {passwordErrors.password && <p className="text-red-600 text-[11px]">{passwordErrors.password}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Confirm New Password *</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                placeholder="Repeat new password"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        {passwordErrors.password_confirmation && <p className="text-red-600 text-[11px]">{passwordErrors.password_confirmation}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>{passwordProcessing ? 'Updating...' : 'Update Password'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Account Info Card */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
                            <div className="flex items-center gap-3">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={profileData.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-2xs">
                                        {(profileData.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-slate-900 truncate">{profileData.name}</h3>
                                    <p className="text-[11px] text-slate-400 truncate">{profileData.email}</p>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 pt-1">
                                <div className="py-2 flex items-center justify-between">
                                    <span className="text-slate-500">System Role:</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 capitalize">
                                        {user.role}
                                    </span>
                                </div>

                                <div className="py-2 flex items-center justify-between">
                                    <span className="text-slate-500">Designation:</span>
                                    <span className="font-semibold text-slate-800 text-right">
                                        {profileData.designation || 'Administrator'}
                                    </span>
                                </div>

                                <div className="py-2 flex items-center justify-between">
                                    <span className="text-slate-500">Department:</span>
                                    <span className="font-semibold text-slate-800 text-right">
                                        {profileData.department || 'Management'}
                                    </span>
                                </div>

                                <div className="py-2 flex items-center justify-between">
                                    <span className="text-slate-500">Account ID:</span>
                                    <span className="font-mono text-slate-600">#{user.id}</span>
                                </div>

                                <div className="py-2 flex items-center justify-between">
                                    <span className="text-slate-500">Registered:</span>
                                    <span className="text-slate-600 font-mono text-[11px]">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
