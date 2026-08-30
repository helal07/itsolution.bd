import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Search, 
    Users, 
    UserCheck, 
    ShoppingBag, 
    Phone, 
    Mail, 
    Eye, 
    Calendar, 
    CheckCircle2, 
    DollarSign, 
    CreditCard, 
    ArrowRight,
    Lock,
    ExternalLink,
    Receipt
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ users, services = [], stats = {}, filters = {} }) {
    const userList = users.data || users;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    const [viewingUser, setViewingUser] = useState(null);
    const [orderingUser, setOrderingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // Add User Form
    const addForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        make_client: false,
    });

    // Order Creation Form
    const orderForm = useForm({
        item_id: services[0]?.id || '',
        project_name: '',
        amount: services[0]?.price || '',
        status: 'pending',
        progress: 0,
        payment_method: 'bKash/Nagad',
        transaction_id: '',
        delivery_date: '',
        notes: '',
    });

    // Edit User Form
    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'client',
        password: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, status: selectedStatus }, { preserveState: true });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get('/admin/users', { search, status }, { preserveState: true });
    };

    const openAddUserModal = () => {
        addForm.reset();
        setIsAddUserOpen(true);
    };

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddUserOpen(false);
                addForm.reset();
            },
        });
    };

    const openViewModal = (user) => {
        setViewingUser(user);
    };

    const openOrderModal = (user) => {
        setOrderingUser(user);
        const defaultItem = services[0];
        orderForm.setData({
            item_id: defaultItem?.id || '',
            project_name: `${user.name} - ${defaultItem?.name || 'Custom Project'}`,
            amount: defaultItem?.price || '',
            status: 'pending',
            progress: 0,
            payment_method: 'bKash/Nagad',
            transaction_id: 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            delivery_date: '',
            notes: `Invoice for ${user.name} (${user.email})`,
        });
    };

    const handleItemChange = (itemId) => {
        const selected = services.find(s => String(s.id) === String(itemId));
        orderForm.setData(prev => ({
            ...prev,
            item_id: itemId,
            project_name: selected ? `${orderingUser?.name || 'Client'} - ${selected.name}` : prev.project_name,
            amount: selected ? selected.price : prev.amount
        }));
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        if (!orderingUser) return;
        orderForm.post(`/admin/users/${orderingUser.id}/order`, {
            preserveScroll: true,
            onSuccess: () => {
                setOrderingUser(null);
                orderForm.reset();
            },
        });
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role || 'client',
            password: '',
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(`/admin/users/${editingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleMakeClient = (user) => {
        if (confirm(`Promote "${user.name}" directly to CRM Clients?`)) {
            router.post(`/admin/users/${user.id}/make-client`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    if (viewingUser && viewingUser.id === user.id) {
                        setViewingUser(prev => ({ ...prev, is_client: true }));
                    }
                }
            });
        }
    };

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => setViewingUser(null),
            });
        }
    };

    const filteredUsers = userList.filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (u.name || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q) ||
            (u.phone || '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Users">
            <div className="space-y-5 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Users
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openAddUserModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="p-3 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                        />
                    </form>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 flex-shrink-0">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'with_orders', label: 'With Orders' },
                                { key: 'crm_client', label: 'CRM Clients' },
                                { key: 'new_user', label: 'New' },
                            ].map((r) => (
                                <button
                                    key={r.key}
                                    type="button"
                                    onClick={() => handleStatusFilter(r.key)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        selectedStatus === r.key
                                            ? 'bg-white text-blue-600 shadow-2xs font-bold'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-slate-400 font-medium px-1 whitespace-nowrap hidden sm:block">
                            {filteredUsers.length} users
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono whitespace-nowrap">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">User</th>
                                    <th className="py-3.5 px-3">Contact</th>
                                    <th className="py-3.5 px-3">CRM Status</th>
                                    <th className="py-3.5 px-3">Orders & Spend</th>
                                    <th className="py-3.5 px-3">Registered</th>
                                    <th className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 text-slate-700">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

                                        return (
                                            <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                                                
                                                {/* User & Avatar */}
                                                <td className="py-3.5 pl-5 pr-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0">
                                                            {initials}
                                                        </div>
                                                        <div className="min-w-0 pr-2">
                                                            <button
                                                                onClick={() => openViewModal(user)}
                                                                className="font-bold text-slate-900 text-sm hover:text-blue-600 text-left truncate block cursor-pointer"
                                                            >
                                                                {user.name}
                                                            </button>
                                                            <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="py-3.5 px-3">
                                                    {user.phone ? (
                                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                            <a href={`tel:${user.phone}`} className="hover:text-blue-600 font-medium">
                                                                {user.phone}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-300 italic">No phone</span>
                                                    )}
                                                </td>

                                                {/* CRM Status */}
                                                <td className="py-3.5 px-3">
                                                    {user.is_client ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>CRM Client</span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                                                                Web User
                                                            </span>
                                                            <button
                                                                onClick={() => handleMakeClient(user)}
                                                                className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                                                                title="Promote to CRM Client"
                                                            >
                                                                + Promote
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Orders & Spend */}
                                                <td className="py-3.5 px-3">
                                                    <div>
                                                        <button 
                                                            onClick={() => openViewModal(user)}
                                                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                                                        >
                                                            {user.orders_count || (user.orders ? user.orders.length : 0)} Orders
                                                        </button>
                                                        <p className="text-[11px] font-bold text-emerald-600">
                                                            ৳{Number(user.total_spent || 0).toLocaleString()} BDT
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Registered Date */}
                                                <td className="py-3.5 px-3 text-slate-500 font-medium whitespace-nowrap">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                    <ActionDropdown label="Actions">
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openViewModal(user)} icon={Eye} className="text-blue-700 hover:text-blue-800">
                                                                View Details
                                                            </ActionItem>
                                                            <ActionItem onClick={() => openOrderModal(user)} icon={ShoppingBag} className="text-emerald-700 hover:text-emerald-800">
                                                                Create Order
                                                            </ActionItem>
                                                            {!user.is_client && (
                                                                <ActionItem onClick={() => handleMakeClient(user)} icon={UserCheck} className="text-indigo-700 hover:text-indigo-800">
                                                                    Promote to Client
                                                                </ActionItem>
                                                            )}
                                                        </div>
                                                        <div className="py-1">
                                                            <ActionItem onClick={() => openEditModal(user)} icon={Edit2}>
                                                                Edit User
                                                            </ActionItem>
                                                            <ActionItem onClick={() => handleDelete(user)} icon={Trash2} danger>
                                                                Delete User
                                                            </ActionItem>
                                                        </div>
                                                    </ActionDropdown>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-blue-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-slate-500">
                                Showing {users.from || 0} to {users.to || 0} of {users.total} users
                            </span>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url || link.active}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white font-bold'
                                                : link.url
                                                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 1. Modal: View User Details & Orders History */}
            <Modal show={Boolean(viewingUser)} onClose={() => setViewingUser(null)} maxWidth="2xl">
                {viewingUser && (
                    <div className="p-6 space-y-5">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                    {viewingUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-extrabold text-base text-slate-900">{viewingUser.name}</h3>
                                        {viewingUser.is_client && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                CRM Client
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Registered on {new Date(viewingUser.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setViewingUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                <p className="font-bold text-slate-400 uppercase text-[10px]">Contact Info</p>
                                <div className="space-y-1 text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                        <a href={`mailto:${viewingUser.email}`} className="font-medium text-blue-600 hover:underline">
                                            {viewingUser.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        <span>{viewingUser.phone || 'No phone provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                <p className="font-bold text-slate-400 uppercase text-[10px]">Orders & Financials</p>
                                <div className="space-y-1">
                                    <p className="text-slate-700 font-medium">
                                        Total Invoices: <strong className="text-slate-900">{viewingUser.orders ? viewingUser.orders.length : 0}</strong>
                                    </p>
                                    <p className="text-slate-700 font-medium">
                                        Settled Amount: <strong className="text-emerald-600">৳{Number(viewingUser.total_spent || 0).toLocaleString()} BDT</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Placed Orders List */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                                    <span>Placed Orders ({viewingUser.orders ? viewingUser.orders.length : 0})</span>
                                </h4>
                                <button
                                    onClick={() => {
                                        const u = viewingUser;
                                        setViewingUser(null);
                                        openOrderModal(u);
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Create Order</span>
                                </button>
                            </div>

                            {viewingUser.orders && viewingUser.orders.length > 0 ? (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono border-b border-slate-200">
                                            <tr>
                                                <th className="px-3.5 py-2">Project / ID</th>
                                                <th className="px-3.5 py-2">Service</th>
                                                <th className="px-3.5 py-2">Amount</th>
                                                <th className="px-3.5 py-2">Status</th>
                                                <th className="px-3.5 py-2">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700">
                                            {viewingUser.orders.map((ord) => (
                                                <tr key={ord.id} className="hover:bg-slate-50">
                                                    <td className="px-3.5 py-2 font-bold text-slate-900">
                                                        <div>{ord.project_name || `Order #${ord.id}`}</div>
                                                        <span className="text-[10px] text-slate-400 font-mono">{ord.transaction_id || `INV-${ord.id}`}</span>
                                                    </td>
                                                    <td className="px-3.5 py-2">{ord.item?.name || 'Service'}</td>
                                                    <td className="px-3.5 py-2 font-bold text-emerald-600">৳{Number(ord.amount).toLocaleString()}</td>
                                                    <td className="px-3.5 py-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                            ord.status === 'paid' || ord.status === 'completed'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {ord.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2 text-slate-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                                    No orders created yet for this user.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const u = viewingUser;
                                        setViewingUser(null);
                                        openEditModal(u);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                                >
                                    Edit Account
                                </button>
                                {!viewingUser.is_client && (
                                    <button
                                        onClick={() => handleMakeClient(viewingUser)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-emerald-200"
                                    >
                                        + Make CRM Client
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setViewingUser(null)}
                                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 2. Modal: Add New User */}
            <Modal show={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} maxWidth="md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-black text-base text-slate-900">Add New User</h3>
                        <button onClick={() => setIsAddUserOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                                placeholder="Customer Name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                            <input
                                type="email"
                                value={addForm.data.email}
                                onChange={(e) => addForm.setData('email', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={addForm.data.phone}
                                onChange={(e) => addForm.setData('phone', e.target.value)}
                                placeholder="+880 1700-000000"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Password *</label>
                            <input
                                type="password"
                                value={addForm.data.password}
                                onChange={(e) => addForm.setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="make_client_check"
                                checked={addForm.data.make_client}
                                onChange={(e) => addForm.setData('make_client', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="make_client_check" className="text-xs text-slate-700 font-medium cursor-pointer">
                                Also register as active CRM Client
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsAddUserOpen(false)}
                                className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={addForm.processing}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                {addForm.processing ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 3. Modal: Create Order & Make Client */}
            <Modal show={Boolean(orderingUser)} onClose={() => setOrderingUser(null)} maxWidth="lg">
                {orderingUser && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-black text-base text-slate-900">
                                Create Order for {orderingUser.name}
                            </h3>
                            <button onClick={() => setOrderingUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleOrderSubmit} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Service / Product *</label>
                                <select
                                    value={orderForm.data.item_id}
                                    onChange={(e) => handleItemChange(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} — (৳{Number(s.price).toLocaleString()} BDT)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        value={orderForm.data.project_name}
                                        onChange={(e) => orderForm.setData('project_name', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Amount (৳ BDT) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={orderForm.data.amount}
                                        onChange={(e) => orderForm.setData('amount', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        value={orderForm.data.status}
                                        onChange={(e) => orderForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold"
                                    >
                                        <option value="pending">Pending (Unpaid)</option>
                                        <option value="paid">Paid (Settled)</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                                    <select
                                        value={orderForm.data.payment_method}
                                        onChange={(e) => orderForm.setData('payment_method', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                                    >
                                        <option value="bKash/Nagad">bKash / Nagad</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Card">Visa / Mastercard</option>
                                        <option value="Cash">Cash / Cheque</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Delivery Date</label>
                                    <input
                                        type="date"
                                        value={orderForm.data.delivery_date}
                                        onChange={(e) => orderForm.setData('delivery_date', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Invoice ID</label>
                                    <input
                                        type="text"
                                        value={orderForm.data.transaction_id}
                                        onChange={(e) => orderForm.setData('transaction_id', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Notes / Scope</label>
                                <textarea
                                    rows="2"
                                    value={orderForm.data.notes}
                                    onChange={(e) => orderForm.setData('notes', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setOrderingUser(null)}
                                    className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={orderForm.processing}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {orderForm.processing ? 'Creating...' : 'Create Order & Register Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* 4. Modal: Edit User Details */}
            <Modal show={Boolean(editingUser)} onClose={() => setEditingUser(null)} maxWidth="md">
                {editingUser && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-black text-base text-slate-900">Edit User Account</h3>
                            <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={editForm.data.phone}
                                    onChange={(e) => editForm.setData('phone', e.target.value)}
                                    placeholder="+880 1700-000000"
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">New Password (Leave blank to keep unchanged)</label>
                                <input
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(e) => editForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
