import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Shield, 
    Plus, 
    Edit, 
    Trash2, 
    Check, 
    Users, 
    Lock, 
    X, 
    CheckSquare, 
    Square, 
    ShieldCheck, 
    AlertTriangle,
    KeyRound,
    Sparkles
} from 'lucide-react';

export default function RolesIndex({ roles = [], permissionGroups = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        permissions: [],
    });

    const openCreateModal = () => {
        setEditingRole(null);
        setData({
            name: '',
            permissions: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: [...role.permissions],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
        reset();
    };

    const togglePermission = (permKey) => {
        setData((prev) => {
            const exists = prev.permissions.includes(permKey);
            return {
                ...prev,
                permissions: exists 
                    ? prev.permissions.filter((p) => p !== permKey)
                    : [...prev.permissions, permKey],
            };
        });
    };

    const toggleGroupPermissions = (groupKeys) => {
        setData((prev) => {
            const allSelected = groupKeys.every((k) => prev.permissions.includes(k));
            if (allSelected) {
                return {
                    ...prev,
                    permissions: prev.permissions.filter((p) => !groupKeys.includes(p)),
                };
            } else {
                const combined = Array.from(new Set([...prev.permissions, ...groupKeys]));
                return {
                    ...prev,
                    permissions: combined,
                };
            }
        });
    };

    const selectAllPermissions = () => {
        const allKeys = Object.values(permissionGroups).flatMap((g) => Object.keys(g));
        setData('permissions', allKeys);
    };

    const deselectAllPermissions = () => {
        setData('permissions', []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRole) {
            put(`/admin/roles/${editingRole.id}`, {
                onSuccess: () => closeModal(),
                preserveScroll: true,
            });
        } else {
            post('/admin/roles', {
                onSuccess: () => closeModal(),
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (role) => {
        router.delete(`/admin/roles/${role.id}`, {
            onSuccess: () => setDeleteConfirmRole(null),
            preserveScroll: true,
        });
    };

    const allPermissionsCount = Object.values(permissionGroups).reduce(
        (sum, group) => sum + Object.keys(group).length, 
        0
    );

    return (
        <AdminLayout title="Roles & Permissions">
            <div className="space-y-6 max-w-7xl mx-auto pb-10">
                
                {/* Header Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                                <span>Roles & Permissions</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                                    Spatie RBAC
                                </span>
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Manage staff roles, granular module permissions, and user access authorization
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Role</span>
                    </button>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roles.map((role) => {
                        const isSuperAdmin = role.name === 'Super Admin';
                        const isClient = role.name === 'Client';
                        const permCount = isSuperAdmin ? allPermissionsCount : role.permissions.length;
                        const permPct = Math.round((permCount / allPermissionsCount) * 100);

                        return (
                            <div 
                                key={role.id}
                                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                                    isSuperAdmin ? 'border-amber-200/80 ring-1 ring-amber-100' : 'border-slate-200/80'
                                }`}
                            >
                                <div className="p-5 space-y-4">
                                    {/* Role Title Bar */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-base text-slate-900">
                                                    {role.name}
                                                </h3>
                                                {role.is_system && (
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                                                        System
                                                    </span>
                                                )}
                                                {isSuperAdmin && (
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        Full Access
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                {isClient 
                                                    ? 'Customer portal isolated account' 
                                                    : isSuperAdmin 
                                                    ? 'Universal access across all system modules' 
                                                    : `${role.permissions.length} active permissions granted`}
                                            </p>
                                        </div>

                                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                            {isSuperAdmin ? (
                                                <ShieldCheck className="w-4 h-4 text-amber-600" />
                                            ) : isClient ? (
                                                <Users className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <KeyRound className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Permission Coverage Bar */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-600">Permissions</span>
                                            <span className="font-bold font-mono text-slate-900">
                                                {permCount} / {allPermissionsCount} ({permPct}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    isSuperAdmin ? 'bg-amber-500' : isClient ? 'bg-slate-300' : 'bg-blue-600'
                                                }`}
                                                style={{ width: `${permPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Active Assigned Users */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                            <span>Assigned Members:</span>
                                        </div>
                                        <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                                            {role.users_count} {role.users_count === 1 ? 'user' : 'users'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(role)}
                                        disabled={isSuperAdmin}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                        <span>{isSuperAdmin ? 'Locked' : 'Configure Permissions'}</span>
                                    </button>

                                    {!role.is_system && (
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmRole(role)}
                                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-all shadow-2xs cursor-pointer"
                                            title="Delete Role"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create / Edit Role Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">
                            
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                                        <KeyRound className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-slate-900">
                                            {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Set role identity and check allowed module permissions
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
                                    
                                    {/* Role Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Role Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Senior Backend Developer, Content Specialist"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Permission Selector Header */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                                Module Permissions Matrix
                                            </h4>
                                            <p className="text-[11px] text-slate-400">
                                                {data.permissions.length} of {allPermissionsCount} permissions active
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={selectAllPermissions}
                                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={deselectAllPermissions}
                                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>

                                    {/* Permission Groups Checkboxes */}
                                    <div className="space-y-4">
                                        {Object.entries(permissionGroups).map(([groupName, perms]) => {
                                            const groupKeys = Object.keys(perms);
                                            const allInGroupSelected = groupKeys.every((k) => data.permissions.includes(k));
                                            const someInGroupSelected = groupKeys.some((k) => data.permissions.includes(k));

                                            return (
                                                <div 
                                                    key={groupName}
                                                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                                                >
                                                    {/* Group Header */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-extrabold text-xs text-slate-800 tracking-tight">
                                                            {groupName}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleGroupPermissions(groupKeys)}
                                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                                        >
                                                            {allInGroupSelected ? 'Deselect Group' : 'Select All'}
                                                        </button>
                                                    </div>

                                                    {/* Checkboxes Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {Object.entries(perms).map(([permKey, permLabel]) => {
                                                            const isChecked = data.permissions.includes(permKey);
                                                            return (
                                                                <label 
                                                                    key={permKey}
                                                                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                                                        isChecked 
                                                                            ? 'bg-white border-blue-300 text-slate-900 font-bold shadow-2xs' 
                                                                            : 'bg-white/60 border-slate-200/70 text-slate-600 hover:bg-white font-medium'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => togglePermission(permKey)}
                                                                        className="rounded text-blue-600 mt-0.5 focus:ring-blue-500"
                                                                    />
                                                                    <div className="min-w-0">
                                                                        <span className="block leading-tight text-xs">
                                                                            {permLabel}
                                                                        </span>
                                                                        <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                                                                            {permKey}
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>{processing ? 'Saving...' : editingRole ? 'Save Changes' : 'Create Role'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirmRole && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-base text-slate-900">Delete Role?</h3>
                                <p className="text-xs text-slate-500">
                                    Are you sure you want to delete role <strong className="text-slate-900">"{deleteConfirmRole.name}"</strong>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirmRole(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deleteConfirmRole)}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Delete Role
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
