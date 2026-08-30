import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Mail, 
    Phone, 
    Edit, 
    Trash2, 
    X, 
    Users, 
    Shield, 
    Code2, 
    DollarSign, 
    LayoutGrid, 
    List, 
    Eye, 
    MessageSquare, 
    Upload, 
    Calendar, 
    Briefcase, 
    CheckCircle2, 
    AlertCircle,
    UserCheck,
    Lock,
    ExternalLink
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ employees, stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedDept, setSelectedDept] = useState(filters.department || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deletingEmployee, setDeletingEmployee] = useState(null);

    const addAvatarInputRef = useRef(null);
    const editAvatarInputRef = useRef(null);
    const [addAvatarPreview, setAddAvatarPreview] = useState('');
    const [editAvatarPreview, setEditAvatarPreview] = useState('');

    const { data: addData, setData: setAddData, post: postAdd, processing: addProcessing, reset: resetAdd, errors: addErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: 'Engineering',
        status: 'active',
        salary: '',
        joined_date: new Date().toISOString().split('T')[0],
        avatar: '',
        avatar_file: null,
        create_user_account: false,
        user_role: 'admin',
        password: '',
    });

    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors } = useForm({
        _method: 'PUT',
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: 'Engineering',
        status: 'active',
        salary: '',
        joined_date: '',
        avatar: '',
        avatar_file: null,
        grant_admin: false,
        password: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/employees', {
            search,
            department: selectedDept,
            status: selectedStatus,
        }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (dept, stat) => {
        setSelectedDept(dept);
        setSelectedStatus(stat);
        router.get('/admin/employees', {
            search,
            department: dept,
            status: stat,
        }, { preserveState: true, replace: true });
    };

    const handleAddAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAddData('avatar_file', file);
            setAddAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleEditAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditData('avatar_file', file);
            setEditAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submitAdd = (e) => {
        e.preventDefault();
        postAdd('/admin/employees', {
            forceFormData: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetAdd();
                setAddAvatarPreview('');
            }
        });
    };

    const openEdit = (emp) => {
        setEditingEmployee(emp);
        setEditAvatarPreview(emp.avatar || '');
        setEditData({
            _method: 'PUT',
            name: emp.name,
            email: emp.email,
            phone: emp.phone || '',
            designation: emp.designation,
            department: emp.department,
            status: emp.status,
            salary: emp.salary || '',
            joined_date: emp.joined_date ? emp.joined_date.substring(0, 10) : '',
            avatar: emp.avatar || '',
            avatar_file: null,
            grant_admin: false,
            password: '',
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        postEdit(`/admin/employees/${editingEmployee.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingEmployee(null);
                setEditAvatarPreview('');
            }
        });
    };

    const confirmDelete = () => {
        if (!deletingEmployee) return;
        router.delete(`/admin/employees/${deletingEmployee.id}`, {
            onSuccess: () => setDeletingEmployee(null),
        });
    };

    const departments = [
        'Engineering',
        'Cyber Security',
        'Mobile Development',
        'Cloud & DevOps',
        'UI/UX Design',
        'Sales & Growth',
        'Management'
    ];

    const getDeptBadgeClass = (dept) => {
        switch (dept) {
            case 'Engineering':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Cyber Security':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Mobile Development':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Cloud & DevOps':
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'UI/UX Design':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Sales & Growth':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <AdminLayout title="Staff & Team">
            <div className="space-y-6 max-w-7xl mx-auto pb-10">
                
                {/* Clean Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span>Staff Team</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold font-mono">
                                {stats.total || 0} Members
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage employees, departmental designations, monthly payroll, and administrative access
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        {/* View Switcher */}
                        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'grid' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'table' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                                }`}
                                title="Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Team Member</span>
                        </button>
                    </div>
                </div>

                {/* Executive Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Members</span>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.total || 0}</p>
                            <span className="text-[10px] text-emerald-600 font-semibold">{stats.active || 0} currently active</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Engineering & Dev</span>
                            <p className="text-2xl font-black text-blue-600 mt-0.5">{stats.engineering || 0}</p>
                            <span className="text-[10px] text-slate-400 font-medium">Core Tech Team</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                            <Code2 className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admin Access</span>
                            <p className="text-2xl font-black text-purple-600 mt-0.5">{stats.admin_accounts || 0}</p>
                            <span className="text-[10px] text-slate-400 font-medium">System Administrators</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Payroll</span>
                            <p className="text-lg font-black text-emerald-600 mt-0.5 font-mono">
                                {formatCurrency(stats.monthly_payroll)}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">Active Staff Salary</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, role, phone..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 font-medium"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <select
                            value={selectedDept}
                            onChange={(e) => handleFilterChange(e.target.value, selectedStatus)}
                            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-500 cursor-pointer"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => handleFilterChange(selectedDept, e.target.value)}
                            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-500 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="on_leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* 1. GRID / CARDS VIEW */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees.data && employees.data.map((emp) => (
                            <div 
                                key={emp.id} 
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                            >
                                <div className="space-y-3.5">
                                    {/* Top Card Row */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative flex-shrink-0">
                                                {emp.avatar ? (
                                                    <img 
                                                        src={emp.avatar} 
                                                        alt={emp.name} 
                                                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" 
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-2xs">
                                                        {emp.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                                    emp.status === 'active' ? 'bg-emerald-500' : emp.status === 'on_leave' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-extrabold text-sm text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                                                    {emp.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                                    {emp.designation}
                                                </p>
                                            </div>
                                        </div>

                                        <ActionDropdown label="">
                                            <div className="py-1">
                                                <ActionItem onClick={() => setViewingEmployee(emp)} icon={Eye}>
                                                    View Dossier
                                                </ActionItem>
                                                <ActionItem onClick={() => openEdit(emp)} icon={Edit}>
                                                    Edit Details
                                                </ActionItem>
                                                <ActionItem onClick={() => setDeletingEmployee(emp)} icon={Trash2} danger>
                                                    Remove Staff
                                                </ActionItem>
                                            </div>
                                        </ActionDropdown>
                                    </div>

                                    {/* Department & Access Tags */}
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getDeptBadgeClass(emp.department)}`}>
                                            {emp.department}
                                        </span>

                                        {emp.user_id && (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                <Shield className="w-2.5 h-2.5" />
                                                <span>Admin Access</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Contact & Meta Details */}
                                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-2 text-slate-700 truncate">
                                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                            <a href={`mailto:${emp.email}`} className="truncate hover:text-blue-600">{emp.email}</a>
                                        </div>

                                        {emp.phone && (
                                            <div className="flex items-center justify-between text-slate-700 font-mono text-[11px]">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                    <span>{emp.phone}</span>
                                                </div>
                                                <a 
                                                    href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                                >
                                                    <span>WA</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Bottom Financial & Joined Date */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-medium">Joined Date</span>
                                        <span className="font-mono text-slate-700 font-semibold">
                                            {emp.joined_date ? emp.joined_date.substring(0, 10) : 'N/A'}
                                        </span>
                                    </div>

                                    {emp.salary && (
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 block font-medium">Monthly Salary</span>
                                            <span className="font-bold text-slate-900 font-mono">
                                                {formatCurrency(emp.salary)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. TABLE VIEW */}
                {viewMode === 'table' && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-mono">
                                    <tr>
                                        <th className="p-3.5">Team Member</th>
                                        <th className="p-3.5">Role & Department</th>
                                        <th className="p-3.5">Contact</th>
                                        <th className="p-3.5">Salary</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5">Access</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employees.data && employees.data.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-3">
                                                    {emp.avatar ? (
                                                        <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                                                            {emp.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-slate-900">{emp.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">
                                                            Joined: {emp.joined_date ? emp.joined_date.substring(0, 10) : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-3.5">
                                                <p className="font-bold text-slate-800">{emp.designation}</p>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${getDeptBadgeClass(emp.department)}`}>
                                                    {emp.department}
                                                </span>
                                            </td>

                                            <td className="p-3.5 space-y-0.5">
                                                <div className="text-blue-600 font-medium">
                                                    <a href={`mailto:${emp.email}`} className="hover:underline">{emp.email}</a>
                                                </div>
                                                {emp.phone && (
                                                    <div className="text-slate-500 font-mono text-[11px]">
                                                        {emp.phone}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-3.5 font-mono font-bold text-slate-900">
                                                {emp.salary ? formatCurrency(emp.salary) : '—'}
                                            </td>

                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                                    emp.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : emp.status === 'on_leave'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                    {emp.status.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="p-3.5">
                                                {emp.user_id ? (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">Staff</span>
                                                )}
                                            </td>

                                            <td className="p-3.5 text-right whitespace-nowrap">
                                                <ActionDropdown label="">
                                                    <div className="py-1">
                                                        <ActionItem onClick={() => setViewingEmployee(emp)} icon={Eye}>
                                                            View Profile
                                                        </ActionItem>
                                                        <ActionItem onClick={() => openEdit(emp)} icon={Edit}>
                                                            Edit Member
                                                        </ActionItem>
                                                        <ActionItem onClick={() => setDeletingEmployee(emp)} icon={Trash2} danger>
                                                            Delete Member
                                                        </ActionItem>
                                                    </div>
                                                </ActionDropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* 1. ADD TEAM MEMBER MODAL */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="md">
                <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="font-bold text-base text-slate-900">Add Team Member</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Enter personal details, role, and optional login credentials</p>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={submitAdd} className="space-y-3.5 text-xs">
                        
                        {/* Avatar Picker Row */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <div 
                                onClick={() => addAvatarInputRef.current?.click()}
                                className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden flex-shrink-0 shadow-2xs"
                                title="Click to upload profile photo"
                            >
                                {addAvatarPreview ? (
                                    <img src={addAvatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <span className="font-bold text-slate-800 block">Profile Photo (Avatar)</span>
                                <input
                                    type="file"
                                    ref={addAvatarInputRef}
                                    accept="image/*"
                                    onChange={handleAddAvatarSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => addAvatarInputRef.current?.click()}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    Browse Photo File
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={addData.name}
                                onChange={(e) => setAddData('name', e.target.value)}
                                placeholder="e.g. Tanvir Ahmed"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={addData.email}
                                    onChange={(e) => setAddData('email', e.target.value)}
                                    placeholder="tanvir@company.com"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={addData.phone}
                                    onChange={(e) => setAddData('phone', e.target.value)}
                                    placeholder="017XXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                                <input
                                    type="text"
                                    required
                                    value={addData.designation}
                                    onChange={(e) => setAddData('designation', e.target.value)}
                                    placeholder="e.g. Lead Software Architect"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Department</label>
                                <select
                                    value={addData.department}
                                    onChange={(e) => setAddData('department', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                >
                                    {departments.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                    value={addData.status}
                                    onChange={(e) => setAddData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                >
                                    <option value="active">Active</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Salary (৳ BDT)</label>
                                <input
                                    type="number"
                                    value={addData.salary}
                                    onChange={(e) => setAddData('salary', e.target.value)}
                                    placeholder="e.g. 65000"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Joined Date</label>
                                <input
                                    type="date"
                                    value={addData.joined_date}
                                    onChange={(e) => setAddData('joined_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>
                        </div>

                        {/* User Login Account Switch */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={addData.create_user_account}
                                    onChange={(e) => setAddData('create_user_account', e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-0"
                                />
                                <span className="font-bold text-slate-800">Grant Admin Panel Access</span>
                            </label>

                            {addData.create_user_account && (
                                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Account Role</label>
                                        <select
                                            value={addData.user_role}
                                            onChange={(e) => setAddData('user_role', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-xs"
                                        >
                                            <option value="admin">Administrator</option>
                                            <option value="client">Staff / Standard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-1">Password *</label>
                                        <input
                                            type="password"
                                            value={addData.password}
                                            onChange={(e) => setAddData('password', e.target.value)}
                                            placeholder="Min 6 characters"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono"
                                            required={addData.create_user_account}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={addProcessing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                {addProcessing ? 'Adding...' : 'Add Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 2. EDIT TEAM MEMBER MODAL */}
            <Modal show={!!editingEmployee} onClose={() => setEditingEmployee(null)} maxWidth="md">
                <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="font-bold text-base text-slate-900">Edit Team Member</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Update designations, salary, or login permissions</p>
                        </div>
                        <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={submitEdit} className="space-y-3.5 text-xs">
                        
                        {/* Edit Avatar Row */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <div 
                                onClick={() => editAvatarInputRef.current?.click()}
                                className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden flex-shrink-0 shadow-2xs"
                                title="Click to upload profile photo"
                            >
                                {editAvatarPreview ? (
                                    <img src={editAvatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <span className="font-bold text-slate-800 block">Change Photo</span>
                                <input
                                    type="file"
                                    ref={editAvatarInputRef}
                                    accept="image/*"
                                    onChange={handleEditAvatarSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => editAvatarInputRef.current?.click()}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    Browse Photo File
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={editData.phone}
                                    onChange={(e) => setEditData('phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.designation}
                                    onChange={(e) => setEditData('designation', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Department</label>
                                <select
                                    value={editData.department}
                                    onChange={(e) => setEditData('department', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold"
                                >
                                    {departments.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                >
                                    <option value="active">Active</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Salary (৳ BDT)</label>
                                <input
                                    type="number"
                                    value={editData.salary}
                                    onChange={(e) => setEditData('salary', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Joined Date</label>
                                <input
                                    type="date"
                                    value={editData.joined_date}
                                    onChange={(e) => setEditData('joined_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>
                        </div>

                        {/* Password Reset */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-slate-700 font-bold mb-1">Reset Account Password (Optional)</label>
                            <input
                                type="password"
                                value={editData.password}
                                onChange={(e) => setEditData('password', e.target.value)}
                                placeholder="Leave blank to keep current password"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setEditingEmployee(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editProcessing}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                {editProcessing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 3. VIEW DOSSIER MODAL */}
            {viewingEmployee && (
                <Modal show={!!viewingEmployee} onClose={() => setViewingEmployee(null)} maxWidth="md">
                    <div className="bg-white p-6 space-y-5 rounded-2xl text-slate-800">
                        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3.5">
                                {viewingEmployee.avatar ? (
                                    <img src={viewingEmployee.avatar} alt={viewingEmployee.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs" />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                                        {viewingEmployee.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-extrabold text-base text-slate-900">{viewingEmployee.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{viewingEmployee.designation}</p>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border mt-1 ${getDeptBadgeClass(viewingEmployee.department)}`}>
                                        {viewingEmployee.department}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setViewingEmployee(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                                <span className="font-bold text-slate-900 capitalize mt-0.5 block">
                                    {viewingEmployee.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Salary</span>
                                <span className="font-bold text-emerald-600 font-mono mt-0.5 block">
                                    {viewingEmployee.salary ? formatCurrency(viewingEmployee.salary) : 'Not Disclosed'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Joined Date</span>
                                <span className="font-semibold text-slate-900 font-mono mt-0.5 block">
                                    {viewingEmployee.joined_date ? viewingEmployee.joined_date.substring(0, 10) : 'N/A'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Access Level</span>
                                <span className="font-bold text-purple-700 mt-0.5 block">
                                    {viewingEmployee.user_id ? 'Administrator' : 'Staff Member'}
                                </span>
                            </div>
                        </div>

                        {/* Contact Shortcuts */}
                        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Email:</span>
                                <a href={`mailto:${viewingEmployee.email}`} className="font-bold text-blue-600 hover:underline">
                                    {viewingEmployee.email}
                                </a>
                            </div>
                            {viewingEmployee.phone && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Phone:</span>
                                    <span className="font-bold font-mono text-slate-900">{viewingEmployee.phone}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            {viewingEmployee.phone && (
                                <a
                                    href={`https://wa.me/${viewingEmployee.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    const emp = viewingEmployee;
                                    setViewingEmployee(null);
                                    openEdit(emp);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* 4. DELETE CONFIRMATION MODAL */}
            {deletingEmployee && (
                <Modal show={!!deletingEmployee} onClose={() => setDeletingEmployee(null)} maxWidth="sm">
                    <div className="bg-white p-6 space-y-4 rounded-2xl text-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-base text-slate-900">Remove Staff Member</h3>
                            <p className="text-xs text-slate-500">
                                Are you sure you want to remove <strong className="text-slate-900">{deletingEmployee.name}</strong> from the staff team?
                            </p>
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingEmployee(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                            >
                                Confirm Remove
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}
