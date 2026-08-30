import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { usePage, useForm, Link, router } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { 
    User, 
    ShieldCheck, 
    ShoppingBag, 
    CheckCircle2, 
    Mail, 
    Star, 
    Check, 
    FileText, 
    Download, 
    CreditCard, 
    LogOut,
    Settings,
    Copy,
    Smartphone,
    Globe,
    Phone,
    Printer,
    X,
    Lock
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status, orders = [], quotes = [], review = null }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const orderList = Array.isArray(orders) ? orders : (orders?.data || []);

    const pendingOrders = orderList.filter(o => o.status === 'pending');
    const paidOrders = orderList.filter(o => o.status === 'paid');

    // Initial Tab: default to 'orders'
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const tabParam = new URLSearchParams(window.location.search).get('tab');
            if (['orders', 'payment', 'rating', 'settings'].includes(tabParam)) {
                return tabParam;
            }
        }
        return 'orders';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    // Review Form
    const { data: reviewData, setData: setReviewData, post: postReview, processing: reviewProcessing, recentlySuccessful: reviewSuccess } = useForm({
        rating: review?.rating || 5,
        title: review?.title || '',
        comment: review?.comment || '',
        project_name: review?.project_name || '',
    });

    const [hoverRating, setHoverRating] = useState(0);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        postReview(route('profile.review.store'), {
            preserveScroll: true,
        });
    };

    // Pending Order Payment Form
    const [payMethod, setPayMethod] = useState('bKash');
    const [transactionIdInput, setTransactionIdInput] = useState('');
    const [isSubmittingPay, setIsSubmittingPay] = useState(false);

    const handlePayPendingOrder = (orderId) => {
        setIsSubmittingPay(true);
        router.post(route('orders.pay', orderId), {
            payment_method: payMethod,
            transaction_id: transactionIdInput,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmittingPay(false);
                setTransactionIdInput('');
            }
        });
    };

    // Copy helper
    const copyToClipboard = (text, id) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedKey(id);
            setTimeout(() => setCopiedKey(null), 2000);
        }
    };

    const totalSpent = paidOrders.reduce((acc, o) => acc + (parseFloat(o.amount) || 0), 0);
    const totalAppsCount = orderList.length;

    const getRatingLabel = (score) => {
        switch (score) {
            case 5: return '5.0 — Outstanding';
            case 4: return '4.0 — Very Good';
            case 3: return '3.0 — Average';
            case 2: return '2.0 — Needs Improvement';
            default: return '1.0 — Poor';
        }
    };

    return (
        <PublicLayout title="Profile & Invoices — IT SOLUTIONS">
            <div className="bg-neutral-50/70 min-h-screen py-6 sm:py-8 text-neutral-900">
                
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* Top Identity Command Bar */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* User Info */}
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0D3B66] via-primary to-cyan-400 text-white flex items-center justify-center font-display font-black text-xl shadow-xs">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="font-heading font-black text-lg text-neutral-900">
                                        {user.name}
                                    </h1>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
                                        {user.role === 'admin' ? 'Admin' : 'Client Account'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                    <span>{user.email}</span>
                                    <span>&bull;</span>
                                    <span>ID: #{user.id.toString().padStart(4, '0')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats & Actions */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <div className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-right">
                                <span className="text-[9px] font-bold uppercase text-neutral-400 block">Total Invested</span>
                                <span className="font-heading font-black text-xs text-neutral-900">
                                    ৳{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0 })} BDT
                                </span>
                            </div>

                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    activeTab === 'settings'
                                        ? 'bg-primary text-white shadow-xs'
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                                }`}
                            >
                                <Settings className="w-3.5 h-3.5" />
                                <span>Settings</span>
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-danger text-xs font-bold transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>

                    {/* Short Tab Navigation Bar */}
                    <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === 'orders'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                            }`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Order History</span>
                            {totalAppsCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                                    {totalAppsCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === 'payment'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                            }`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Make Payment</span>
                            {pendingOrders.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                                    {pendingOrders.length} Due
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('rating')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === 'rating'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                            }`}
                        >
                            <Star className="w-3.5 h-3.5" />
                            <span>Review</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === 'settings'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                            }`}
                        >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Settings</span>
                        </button>
                    </div>

                    {/* TAB 1: ORDER PAYMENT HISTORY */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden animate-in fade-in">
                            {orderList.length > 0 ? (
                                <div className="divide-y divide-neutral-100">
                                    <div className="px-5 py-3 bg-neutral-50/70 border-b border-neutral-100 flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                                        <span>Project & Progress</span>
                                        <span>Investment & Invoice</span>
                                    </div>
                                    {orderList.map((order, idx) => {
                                        const progress = order.progress ?? (order.status === 'completed' ? 100 : order.status === 'processing' ? 50 : order.status === 'paid' ? 25 : 0);

                                        return (
                                            <div 
                                                key={order.id} 
                                                className="p-5 space-y-3.5 hover:bg-neutral-50/40 transition-colors"
                                            >
                                                {/* Top Row: Title, Badges, Price */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 font-mono text-xs font-bold text-neutral-400 text-center flex-shrink-0">
                                                            {String(idx + 1).padStart(2, '0')}
                                                        </span>
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                            <Smartphone className="w-5 h-5" />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="font-heading font-bold text-sm text-neutral-900">
                                                                    {order.project_name || order.item?.name || 'Custom Project'}
                                                                </h3>
                                                                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${
                                                                    order.status === 'completed' || order.status === 'paid'
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                        : order.status === 'processing'
                                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-neutral-500 font-mono">
                                                                {order.transaction_id || `ORD-#${order.id}`} &bull; {order.item?.name} &bull; {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-9 sm:pl-0">
                                                        <span className="font-heading font-black text-sm text-neutral-900 font-mono">
                                                            ৳{parseFloat(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                                        </span>
                                                        <button
                                                            onClick={() => setSelectedReceiptOrder(order)}
                                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>Invoice</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Live Project Progress & Milestones */}
                                                <div className="pl-9 pr-2 space-y-2 pt-1 border-t border-neutral-100">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-neutral-500 font-medium">Project Progress:</span>
                                                            <span className="font-mono font-bold text-blue-600">{progress}%</span>
                                                        </div>
                                                        {order.delivery_date && (
                                                            <span className="text-[11px] text-neutral-500 font-mono">
                                                                Target Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-500 rounded-full ${
                                                                progress >= 100 ? 'bg-emerald-500' :
                                                                progress >= 50 ? 'bg-blue-600' :
                                                                progress >= 25 ? 'bg-indigo-500' : 'bg-amber-500'
                                                            }`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>

                                                    {/* Milestone Steps */}
                                                    <div className="grid grid-cols-4 text-[10px] font-mono text-neutral-400 pt-0.5">
                                                        <span className={progress >= 0 ? 'text-blue-600 font-bold' : ''}>1. Order Placed</span>
                                                        <span className={`text-center ${progress >= 25 ? 'text-blue-600 font-bold' : ''}`}>2. Planning</span>
                                                        <span className={`text-center ${progress >= 50 ? 'text-blue-600 font-bold' : ''}`}>3. Development</span>
                                                        <span className={`text-right ${progress >= 100 ? 'text-emerald-600 font-bold' : ''}`}>4. Delivered</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-10 text-center space-y-2">
                                    <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto" />
                                    <p className="text-sm font-bold text-neutral-700">No order history found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: MAKE PAYMENT (PENDING INVOICES) */}
                    {activeTab === 'payment' && (
                        <div className="space-y-4 animate-in fade-in">
                            {pendingOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingOrders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                                                <div>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block mb-1">
                                                        Pending Due Invoice
                                                    </span>
                                                    <h3 className="font-heading font-black text-base text-neutral-900">
                                                        {order.item?.name || 'Security Software App'}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500 font-mono">
                                                        Invoice Ref: {order.transaction_id || `INV-#${order.id}`} &bull; Generated: {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <span className="text-[10px] font-bold uppercase text-neutral-400 block">Amount Due</span>
                                                    <span className="font-heading font-black text-lg text-primary">
                                                        ৳{parseFloat(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Payment Gateway Selector */}
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                        Choose Payment Gateway
                                                    </label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                        {['bKash', 'Nagad', 'Card / Visa', 'Bank Transfer'].map((m) => (
                                                            <button
                                                                type="button"
                                                                key={m}
                                                                onClick={() => setPayMethod(m)}
                                                                className={`py-2 px-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                                                                    payMethod === m
                                                                        ? 'bg-primary text-white border-primary shadow-2xs'
                                                                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                                                                }`}
                                                            >
                                                                {m}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Merchant Wallet Information */}
                                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-3">
                                                    <div>
                                                        <span className="font-bold block text-[11px]">Official Merchant Account ({payMethod}):</span>
                                                        <span className="font-mono font-bold text-primary text-xs">+880 1800-000000</span>
                                                        <span className="text-neutral-500 block text-[10px]">Reference: #{order.transaction_id || order.id}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard('+880 1800-000000', `wallet-${order.id}`)}
                                                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-primary font-bold text-xs flex items-center gap-1 border border-blue-200"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        <span>{copiedKey === `wallet-${order.id}` ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                </div>

                                                {/* Transaction ID Submission */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                                        Transaction ID (TrxID) / Bank Reference
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={transactionIdInput}
                                                        onChange={(e) => setTransactionIdInput(e.target.value)}
                                                        placeholder="e.g. 9J83KLM28P or Deposit Slip Ref"
                                                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary font-mono"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isSubmittingPay}
                                                    onClick={() => handlePayPendingOrder(order.id)}
                                                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>{isSubmittingPay ? 'Submitting Payment...' : 'Pay Now & Verify'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200/80 shadow-xs space-y-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-heading font-bold text-base text-neutral-900">All Payments Cleared</h3>
                                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                                        You have no pending invoices or dues. When an invoice is generated from the backend admin panel, it will appear here.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: RATE & REVIEW */}
                    {activeTab === 'rating' && (
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs space-y-4 animate-in fade-in">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <h3 className="font-heading font-bold text-base text-neutral-900">
                                    Rate & Review
                                </h3>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                        Rating
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setReviewData('rating', star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-0.5 focus:outline-none"
                                            >
                                                <Star 
                                                    className={`w-6 h-6 ${
                                                        (hoverRating || reviewData.rating) >= star 
                                                            ? 'text-amber-400 fill-amber-400' 
                                                            : 'text-neutral-200'
                                                    }`} 
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-xs font-bold text-neutral-600">
                                            {getRatingLabel(hoverRating || reviewData.rating)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                        App Name
                                    </label>
                                    <input
                                        type="text"
                                        value={reviewData.project_name}
                                        onChange={(e) => setReviewData('project_name', e.target.value)}
                                        placeholder="e.g. Make Secure Pro"
                                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                        Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={reviewData.title}
                                        onChange={(e) => setReviewData('title', e.target.value)}
                                        placeholder="e.g. Great security app & fast setup"
                                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                        Feedback
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData('comment', e.target.value)}
                                        placeholder="Write your feedback..."
                                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={reviewProcessing}
                                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                                    >
                                        Submit
                                    </button>

                                    {reviewSuccess && (
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Saved!</span>
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 4: ACCOUNT SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs">
                                <UpdatePasswordForm />
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-red-200/80 shadow-xs">
                                <DeleteUserForm />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Unique Official Invoice Document Modal */}
            {selectedReceiptOrder && (
                <div className="print-modal-parent fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                    <div id="printable-invoice" className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 print:p-0 print:border-none print:shadow-none print:max-h-none print:overflow-visible">
                        
                        {/* Close button in corner */}
                        <button
                            onClick={() => setSelectedReceiptOrder(null)}
                            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors print:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Top Invoice Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-neutral-100">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0D3B66] via-primary to-cyan-500 text-white flex items-center justify-center font-display font-black text-base shadow-sm">
                                        ITS
                                    </div>
                                    <span className="font-heading font-black text-xl text-neutral-900 tracking-tight">
                                        IT SOLUTIONS
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-500">
                                    Enterprise Software, Ready Apps & Cyber Security
                                </p>
                                <div className="text-[11px] text-neutral-400 space-y-0.5 pt-1 font-mono">
                                    <p>Dhaka, Bangladesh &bull; Hotline: +880 1800-000000</p>
                                    <p>support@itsolutions.com &bull; www.itsolutions.com</p>
                                </div>
                            </div>

                            {/* Official Seal / Stamp */}
                            <div className="sm:text-right space-y-2">
                                <div className="inline-block border-2 border-emerald-600 px-3.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-black text-xs uppercase tracking-widest rotate-[-3deg] shadow-xs">
                                    {selectedReceiptOrder.status === 'paid' ? '✓ PAID & VERIFIED' : 'PENDING INVOICE'}
                                </div>
                                <h2 className="font-heading font-black text-2xl text-neutral-900 tracking-tight">
                                    TAX INVOICE
                                </h2>
                                <p className="text-xs font-mono font-bold text-primary">
                                    #{selectedReceiptOrder.transaction_id || `INV-${selectedReceiptOrder.id.toString().padStart(6, '0')}`}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Metadata Grid (2-Column) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                    Invoice Billed To
                                </span>
                                <h4 className="font-bold text-sm text-neutral-900">{user.name}</h4>
                                <p className="text-neutral-600 font-mono">{user.email}</p>
                                <p className="text-neutral-400 font-mono">Client ID: #{user.id.toString().padStart(4, '0')}</p>
                            </div>

                            <div className="space-y-1 sm:text-right">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                    Invoice Details
                                </span>
                                <p className="text-neutral-700">
                                    <span className="text-neutral-400">Issue Date:</span> <span className="font-mono font-bold">{new Date(selectedReceiptOrder.created_at).toLocaleDateString()}</span>
                                </p>
                                <p className="text-neutral-700">
                                    <span className="text-neutral-400">Payment Gateway:</span> <span className="font-bold text-neutral-900">{selectedReceiptOrder.payment_method || 'Online'}</span>
                                </p>
                                <p className="text-neutral-700">
                                    <span className="text-neutral-400">Currency:</span> <span className="font-mono font-bold">{selectedReceiptOrder.currency || 'BDT'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200/80">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="p-3.5">#</th>
                                        <th className="p-3.5">Software / App Description</th>
                                        <th className="p-3.5 text-center">Qty</th>
                                        <th className="p-3.5 text-right">Price</th>
                                        <th className="p-3.5 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    <tr>
                                        <td className="p-3.5 font-mono text-neutral-400">01</td>
                                        <td className="p-3.5">
                                            <p className="font-bold text-neutral-900 text-sm">
                                                {selectedReceiptOrder.item?.name || 'Security Software Application'}
                                            </p>
                                            <p className="text-[11px] text-neutral-500">
                                                Enterprise Software License & Security Protection
                                            </p>
                                        </td>
                                        <td className="p-3.5 text-center font-mono font-bold">1</td>
                                        <td className="p-3.5 text-right font-mono font-bold text-neutral-700">
                                            ৳{parseFloat(selectedReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-3.5 text-right font-mono font-bold text-neutral-900">
                                            ৳{parseFloat(selectedReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Calculation Summary */}
                        <div className="flex justify-end pt-2">
                            <div className="w-full sm:w-64 space-y-2 text-xs">
                                <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                                    <span>Subtotal:</span>
                                    <span className="font-mono font-bold text-neutral-900">
                                        ৳{parseFloat(selectedReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                                    <span>Tax / VAT (0%):</span>
                                    <span className="font-mono font-bold text-neutral-900">৳0.00 BDT</span>
                                </div>
                                <div className="flex justify-between py-2 pt-2.5 bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-sm">
                                    <span className="font-bold text-neutral-900">Grand Total:</span>
                                    <span className="font-heading font-black text-primary text-base">
                                        ৳{parseFloat(selectedReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Verification & Signature Footer */}
                        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>256-bit TLS Verified Digital Receipt &bull; IT SOLUTIONS</span>
                            </div>
                            <div className="text-center sm:text-right">
                                <span className="font-bold block text-neutral-800">Authorized Electronic Seal</span>
                                <span className="font-mono text-[10px] text-neutral-400">System Settlement Engine</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2 print:hidden">
                            <button
                                onClick={() => setSelectedReceiptOrder(null)}
                                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/25 inline-flex items-center justify-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print / Save PDF</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </PublicLayout>
    );
}
