import React from 'react';
import { Link, router, Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Layers, 
    FolderGit2, 
    MessageSquare, 
    ShoppingBag, 
    DollarSign, 
    ArrowRight, 
    Plus,
    Users,
    TrendingUp,
    Clock,
    CreditCard,
    RefreshCw,
    Send,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Phone,
    Building2,
    Sparkles
} from 'lucide-react';

export default function Dashboard({ 
    stats = {}, 
    recentQuotes = [], 
    recentOrders = [], 
    expiringSubscriptions = [] 
}) {
    const handleQuoteStatusChange = (quoteId, status) => {
        router.patch(`/admin/quotes/${quoteId}`, { status }, { preserveScroll: true });
    };

    const handleSendWhatsApp = (item) => {
        let phone = (item.client_phone || '').replace(/[^0-9+]/g, '');
        if (phone.startsWith('01')) phone = '880' + phone.substring(1);
        if (phone.startsWith('+')) phone = phone.replace('+', '');

        const days = item.days_remaining;
        let urgencyText = days < 0 
            ? `expired on ${item.finish_date}` 
            : (days === 0 ? `finishes TODAY (${item.finish_date})` : `finishes on ${item.finish_date} (in ${days} days)`);

        const message = `Dear ${item.client_name},\n\nThis is a renewal reminder from IT SOLUTIONS regarding your *${item.package_name}* (${item.billing_cycle} package).\n\nYour subscription ${urgencyText}.\nRenewal Amount: ৳${Number(item.price).toLocaleString()} BDT\n\nPlease let us know if you would like to renew.\n\nThank you,\n*IT SOLUTIONS*`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        router.post(route('admin.reorders.reminder', item.id), { channel: 'whatsapp' }, {
            preserveScroll: true,
            onSuccess: () => window.open(url, '_blank')
        });
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard — Admin" />

            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                        <h1 className="font-black text-xl sm:text-2xl tracking-tight">
                            Dashboard
                        </h1>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all shadow-xs active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-blue-600" />
                            <span>New Order</span>
                        </Link>
                        <Link
                            href="/admin/reorders"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all border border-blue-500 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4 text-cyan-200" />
                            <span>Reorder Panel</span>
                        </Link>
                        <Link
                            href="/admin/items"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all border border-blue-500 active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-cyan-200" />
                            <span>Add Service</span>
                        </Link>
                        <Link
                            href="/admin/employees"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all border border-blue-500 active:scale-95"
                        >
                            <Users className="w-4 h-4 text-cyan-200" />
                            <span>Staff</span>
                        </Link>
                    </div>
                </div>

                {/* Primary Metrics Grid (4 Top Cards) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Revenue Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2 shadow-xs hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">Settled Revenue</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-black text-xl sm:text-2xl text-slate-900 font-mono">
                                ৳{parseFloat(stats.total_revenue || 0).toLocaleString()}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                {stats.pending_revenue > 0 ? `৳${parseFloat(stats.pending_revenue).toLocaleString()} pending` : `${stats.total_orders} total orders`}
                            </p>
                        </div>
                    </div>

                    {/* Subscriptions / Reorder Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2 shadow-xs hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">Active Subscriptions</span>
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <RefreshCw className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-black text-xl sm:text-2xl text-slate-900">
                                {stats.active_reorders || 0}
                            </p>
                            <p className="text-[11px] font-bold mt-0.5 text-amber-600">
                                {stats.expiring_reorders > 0 ? `${stats.expiring_reorders} expiring in ≤7d` : 'All healthy'}
                            </p>
                        </div>
                    </div>

                    {/* Orders / Invoices Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2 shadow-xs hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">Orders & Invoices</span>
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-black text-xl sm:text-2xl text-slate-900">
                                {stats.total_orders || 0}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                Processed settlements
                            </p>
                        </div>
                    </div>

                    {/* Quotes Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2 shadow-xs hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">Quotation & Leads</span>
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-black text-xl sm:text-2xl text-slate-900">
                                {stats.total_quotes || 0}
                            </p>
                            <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                                {stats.new_quotes > 0 ? `${stats.new_quotes} new inquiries` : 'All contacted'}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Secondary Fast Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/admin/items" className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between shadow-2xs hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-700">Services</span>
                        </div>
                        <span className="font-black text-sm text-slate-900 font-mono">{stats.total_items || 0}</span>
                    </Link>

                    <Link href="/admin/portfolios" className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between shadow-2xs hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-slate-700">Portfolio</span>
                        </div>
                        <span className="font-black text-sm text-slate-900 font-mono">{stats.total_portfolios || 0}</span>
                    </Link>

                    <Link href="/admin/clients" className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between shadow-2xs hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-700">Clients</span>
                        </div>
                        <span className="font-black text-sm text-slate-900 font-mono">{stats.total_clients || 0}</span>
                    </Link>

                    <Link href="/admin/employees" className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between shadow-2xs hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-slate-700">Staff</span>
                        </div>
                        <span className="font-black text-sm text-slate-900 font-mono">{stats.total_staff || 0}</span>
                    </Link>
                </div>

                {/* Subscriptions / Reorders Expiry Monitor Panel */}
                <div className="bg-white rounded-2xl border border-blue-100 p-5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <h2 className="font-bold text-sm text-slate-900">Subscription Renewal Alerts</h2>
                        </div>
                        <Link href="/admin/reorders" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                            View All Reorders <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {expiringSubscriptions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {expiringSubscriptions.map((item) => {
                                const isExpired = item.days_remaining < 0;
                                const isUrgent = item.days_remaining >= 0 && item.days_remaining <= 3;

                                return (
                                    <div 
                                        key={item.id}
                                        className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                                            isExpired 
                                                ? 'bg-red-50/40 border-red-200' 
                                                : isUrgent 
                                                ? 'bg-amber-50/40 border-amber-200' 
                                                : 'bg-slate-50/60 border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-1">
                                            <div>
                                                <p className="font-bold text-xs text-slate-900 truncate">{item.client_name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono truncate">{item.client_phone}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                isExpired ? 'bg-red-600 text-white' : isUrgent ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                                            }`}>
                                                {isExpired ? 'Expired' : `${item.days_remaining}d Left`}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5 text-xs">
                                            <p className="font-semibold text-slate-800 text-[11px] truncate">{item.package_name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">
                                                Finish: <span className="font-bold text-slate-700">{item.finish_date}</span> ({item.billing_cycle})
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                            <span className="font-mono font-bold text-xs text-slate-900">৳{Number(item.price).toLocaleString()}</span>
                                            <button
                                                onClick={() => handleSendWhatsApp(item)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shadow-2xs"
                                                title="Send WhatsApp Reminder"
                                            >
                                                <Send className="w-2.5 h-2.5" />
                                                <span>WhatsApp</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-xs py-2 text-center">No subscriptions currently expiring soon.</p>
                    )}
                </div>

                {/* Two-Column Management (Orders & Quotes) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Recent Orders (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-blue-100 p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-slate-900">Recent Orders & Invoices</h2>
                            <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-slate-500 uppercase text-[10px] font-mono bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-2.5">Invoice</th>
                                            <th className="p-2.5">Client</th>
                                            <th className="p-2.5">Amount</th>
                                            <th className="p-2.5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {recentOrders.map((o) => (
                                            <tr key={o.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="p-2.5 font-mono font-bold text-blue-600 text-[11px]">
                                                    {o.transaction_id || `ORD-#${o.id}`}
                                                </td>
                                                <td className="p-2.5">
                                                    <p className="font-bold text-slate-900 text-xs">{o.user?.name}</p>
                                                    <p className="text-[10px] text-slate-400">{o.item?.name}</p>
                                                </td>
                                                <td className="p-2.5 font-mono font-bold text-emerald-600 text-xs">
                                                    ৳{parseFloat(o.amount).toLocaleString()}
                                                </td>
                                                <td className="p-2.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                        o.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-xs py-4 text-center">No recent orders found.</p>
                        )}
                    </div>

                    {/* Right: Recent Quotes (5 cols) */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-blue-100 p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-slate-900">Recent Quotation Leads</h2>
                            <Link href="/admin/quotes" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {recentQuotes.length > 0 ? (
                            <div className="space-y-2.5">
                                {recentQuotes.map((q) => (
                                    <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs">{q.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{q.email}</p>
                                            </div>
                                            <select
                                                value={q.status}
                                                onChange={(e) => handleQuoteStatusChange(q.id, e.target.value)}
                                                className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700 focus:border-blue-500"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="won">Won</option>
                                                <option value="lost">Lost</option>
                                            </select>
                                        </div>
                                        <p className="text-slate-600 text-xs line-clamp-1">"{q.message}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-xs py-4 text-center">No quotes pending.</p>
                        )}
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
