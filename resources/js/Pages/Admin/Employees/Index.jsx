import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
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
    Calendar, 
    Briefcase, 
    CheckCircle2, 
    AlertCircle,
    UserCheck,
    CreditCard,
    MapPin,
    Share2,
    FileText,
    Percent,
    ExternalLink
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ employees, availableRoles = [], availableDepartments = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedDept, setSelectedDept] = useState(filters.department || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [deletingEmployee, setDeletingEmployee] = useState(null);

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

    const confirmDelete = () => {
        if (!deletingEmployee) return;
        router.delete(`/admin/employees/${deletingEmployee.id}`, {
            onSuccess: () => setDeletingEmployee(null),
        });
    };

    const departments = availableDepartments.length > 0 ? availableDepartments : [
        'Engineering',
        'Cyber Security',
        'Mobile Development',
        'Cloud & DevOps',
        'UI/UX Design',
        'Sales & Growth',
        'Management',
        'HR & Accounts'
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
            case 'HR & Accounts':
                return 'bg-amber-50 text-amber-700 border-amber-200';
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

                        {/* Link to Full-Page Add Team Member */}
                        <Link
                            href="/admin/employees/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Team Member</span>
                        </Link>
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
                                                    {emp.prefix ? `${emp.prefix}. ` : ''}{emp.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                                    {emp.designation}
                                                </p>
                                            </div>
                                        </div>

                                        <ActionDropdown label="">
                                            <div className="py-1">
                                                <ActionItem onClick={() => setViewingEmployee(emp)} icon={Eye}>
                                                    View Profile
                                                </ActionItem>
                                                <ActionItem onClick={() => router.visit(`/admin/employees/${emp.id}/edit`)} icon={Edit}>
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

                                        {emp.system_role ? (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                <Shield className="w-2.5 h-2.5" />
                                                <span>{emp.system_role}</span>
                                            </span>
                                        ) : emp.user_id ? (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                <Shield className="w-2.5 h-2.5" />
                                                <span>Admin Access</span>
                                            </span>
                                        ) : null}

                                        {emp.sales_commission_percentage > 0 && (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                                                <span>{emp.sales_commission_percentage}% Comm.</span>
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
                                        <th className="p-3.5">Access Role</th>
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
                                                        <p className="font-bold text-slate-900">{emp.prefix ? `${emp.prefix}. ` : ''}{emp.name}</p>
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
                                                {emp.system_role ? (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                        {emp.system_role}
                                                    </span>
                                                ) : emp.user_id ? (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">Staff Member</span>
                                                )}
                                            </td>

                                            <td className="p-3.5 text-right whitespace-nowrap">
                                                <ActionDropdown label="">
                                                    <div className="py-1">
                                                        <ActionItem onClick={() => setViewingEmployee(emp)} icon={Eye}>
                                                            View Profile
                                                        </ActionItem>
                                                        <ActionItem onClick={() => router.visit(`/admin/employees/${emp.id}/edit`)} icon={Edit}>
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

            {/* COMPREHENSIVE DOSSIER / PROFILE MODAL */}
            {viewingEmployee && (
                <Modal show={!!viewingEmployee} onClose={() => setViewingEmployee(null)} maxWidth="2xl">
                    <div className="bg-white p-6 space-y-5 rounded-2xl text-slate-800">
                        {/* Header Profile Summary */}
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                {viewingEmployee.avatar ? (
                                    <img src={viewingEmployee.avatar} alt={viewingEmployee.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs" />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-xs">
                                        {viewingEmployee.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-extrabold text-lg text-slate-900">
                                        {viewingEmployee.prefix ? `${viewingEmployee.prefix}. ` : ''}{viewingEmployee.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">{viewingEmployee.designation}</p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getDeptBadgeClass(viewingEmployee.department)}`}>
                                            {viewingEmployee.department}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                            {viewingEmployee.system_role || (viewingEmployee.user_id ? 'Administrator' : 'Staff Member')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewingEmployee(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Multi-section Details */}
                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs">
                            
                            {/* 1. Job & Operational Data */}
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Job & Financials</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] text-slate-400 font-medium block">Monthly Salary</span>
                                        <span className="font-bold text-emerald-600 font-mono mt-0.5 block">
                                            {viewingEmployee.salary ? formatCurrency(viewingEmployee.salary) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] text-slate-400 font-medium block">Commission Rate</span>
                                        <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                                            {viewingEmployee.sales_commission_percentage ? `${viewingEmployee.sales_commission_percentage}%` : '0%'}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] text-slate-400 font-medium block">Joined Date</span>
                                        <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                                            {viewingEmployee.joined_date ? viewingEmployee.joined_date.substring(0, 10) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] text-slate-400 font-medium block">Status</span>
                                        <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                                            {viewingEmployee.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Personal Demographics & Contact */}
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Personal & Identity</span>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div>
                                        <span className="text-slate-400 font-medium block">Email:</span>
                                        <a href={`mailto:${viewingEmployee.email}`} className="font-bold text-blue-600 hover:underline break-all">{viewingEmployee.email}</a>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Mobile Number:</span>
                                        <span className="font-bold font-mono text-slate-900">{viewingEmployee.phone || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Alternate Phone:</span>
                                        <span className="font-mono text-slate-700">{viewingEmployee.alternate_phone || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Date of Birth:</span>
                                        <span className="font-mono text-slate-700">{viewingEmployee.dob ? viewingEmployee.dob.substring(0, 10) : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Gender / Marital:</span>
                                        <span className="font-semibold text-slate-700">{viewingEmployee.gender || 'N/A'} / {viewingEmployee.marital_status || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Blood Group:</span>
                                        <span className="font-bold text-rose-600">{viewingEmployee.blood_group || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium block">Guardian Name:</span>
                                        <span className="font-semibold text-slate-800">{viewingEmployee.guardian_name || 'N/A'}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 font-medium block">{viewingEmployee.id_proof_name || 'ID Document'}:</span>
                                        <span className="font-mono font-bold text-slate-900">{viewingEmployee.id_proof_number || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Addresses */}
                            {(viewingEmployee.current_address || viewingEmployee.permanent_address) && (
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Addresses</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <span className="text-[10px] text-slate-400 font-medium block">Current Address</span>
                                            <p className="text-slate-800 font-medium mt-0.5">{viewingEmployee.current_address || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <span className="text-[10px] text-slate-400 font-medium block">Permanent Address</span>
                                            <p className="text-slate-800 font-medium mt-0.5">{viewingEmployee.permanent_address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4. Bank & Tax Details */}
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Bank & Tax Accounts</span>
                                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div>
                                        <span className="text-slate-500 font-medium block">Account Holder:</span>
                                        <span className="font-bold text-slate-900">{viewingEmployee.bank_account_holder_name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block">Account Number:</span>
                                        <span className="font-mono font-bold text-slate-900">{viewingEmployee.bank_account_number || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block">Bank Name:</span>
                                        <span className="font-semibold text-slate-800">{viewingEmployee.bank_name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block">Routing / Swift:</span>
                                        <span className="font-mono text-slate-700">{viewingEmployee.bank_identifier_code || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block">Branch:</span>
                                        <span className="text-slate-700">{viewingEmployee.bank_branch || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block">Tax Payer ID (TIN):</span>
                                        <span className="font-mono text-slate-700">{viewingEmployee.tax_payer_id || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div>
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
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setViewingEmployee(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/admin/employees/${viewingEmployee.id}/edit`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit Full Profile</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* DELETE CONFIRMATION MODAL */}
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
