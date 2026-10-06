import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatDate } from '@/Utils/dateFormat';
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
    Lock,
    Paperclip,
    Landmark,
    ChevronDown,
    ChevronUp,
    Receipt,
    History,
    AlertCircle,
    ArrowRight,
    Clock,
    XCircle
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status, orders = [], quotes = [], review = null }) {
    const { auth, siteSettings = {} } = usePage().props;
    const user = auth.user;
    const brandName = siteSettings?.site_name || 'IT Solution';
    const brandTagline = siteSettings?.site_tagline || 'Enterprise Software, Ready Apps & Cyber Security';
    const brandAddress = siteSettings?.company_address || 'Dhaka, Bangladesh';
    const brandPhone = siteSettings?.contact_phone || '+880 1800-000000';
    const brandEmail = siteSettings?.contact_email || 'contact@itsolutions.com';
    const orderList = Array.isArray(orders) ? orders : (orders?.data || []);

    // Financial breakdown helper for an order
    const getOrderFinancials = (order) => {
        const gross = parseFloat(order?.amount) || 0;
        const discount = parseFloat(order?.discount) || 0;
        const net = parseFloat(order?.net_amount ?? Math.max(0, gross - discount));
        // Calculate strictly from approved payments when present, fallback to order.paid_amount
        let paid = parseFloat(order?.paid_amount) || 0;
        if (Array.isArray(order?.payments) && order.payments.length > 0) {
            paid = order.payments
                .filter(p => p.status === 'approved')
                .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        }
        const due = Math.max(0, net - paid);
        return { gross, discount, net, paid, due };
    };

    // Filter orders with outstanding dues or pending status
    const pendingOrders = orderList.filter(o => {
        const { due } = getOrderFinancials(o);
        return due > 0 || (o.payment_status !== 'paid' && o.status !== 'completed');
    });

    const paidOrders = orderList.filter(o => {
        const { due } = getOrderFinancials(o);
        return due <= 0 && (o.status === 'completed' || o.payment_status === 'paid' || o.status === 'paid');
    });

    // Dynamic Active Payment Methods configured in Admin Panel Settings
    const availablePaymentMethods = React.useMemo(() => {
        const methods = [];
        const bkashNum = (siteSettings?.manual_bkash_number || '').trim();
        const nagadNum = (siteSettings?.manual_nagad_number || '').trim();
        const rocketNum = (siteSettings?.manual_rocket_number || '').trim();
        const bankDetails = (siteSettings?.manual_bank_details || '').trim();
        const bkashOnline = siteSettings?.bkash_enabled === '1';
        const epsOnline = siteSettings?.eps_enabled === '1';
        const sslOnline = siteSettings?.sslcommerz_enabled === '1';

        // 1. Automated bKash Merchant Gateway (PGW)
        if (bkashOnline) {
            methods.push({
                id: 'bkash_gateway',
                type: 'gateway',
                name: 'bKash Merchant Gateway',
                category: 'Instant Automated PGW',
                accountNumber: `Official bKash Checkout (${(siteSettings?.bkash_mode || 'sandbox').toUpperCase()})`,
                instruction: 'বিকাশ মার্চেন্ট গেটওয়েতে সরাসরি পেমেন্ট করুন। ওটিপি ও পিন দিয়ে সফল হলে আপনার ইনভয়েস সাথে সাথে স্বয়ংক্রিয়ভাবে পরিশোধিত হবে।',
                badge: 'Instant Auto-Pay',
                isMultiline: false,
            });
        }

        // 2. Manual bKash (Send Money / Agent / Personal)
        if (bkashNum || !bkashOnline) {
            methods.push({
                id: 'bKash_manual',
                type: 'manual',
                name: 'bKash (Manual MFS)',
                category: 'Mobile Banking (Manual)',
                accountNumber: bkashNum || (siteSettings?.contact_phone || '+880 1800-000000'),
                instruction: 'আমাদের বিকাশ অ্যাকাউন্টে টাকা পাঠিয়ে নিচে Transaction ID (TrxID) ও আপনার বিকাশ নম্বর দিন। অ্যাডমিন যাচাই করে অনুমোদন করবেন।',
                badge: 'Admin Approval',
                isMultiline: false,
            });
        }

        // 3. Nagad (Manual)
        if (nagadNum) {
            methods.push({
                id: 'Nagad',
                type: 'manual',
                name: 'Nagad (Manual MFS)',
                category: 'Mobile Banking (Manual)',
                accountNumber: nagadNum,
                instruction: 'আমাদের নগদ অ্যাকাউন্টে টাকা পাঠিয়ে নিচে TrxID ও প্রেরক নম্বর লিখুন। অ্যাডমিন যাচাই করে অনুমোদন করবেন।',
                badge: 'Admin Approval',
                isMultiline: false,
            });
        }

        // 4. Rocket (Manual)
        if (rocketNum) {
            methods.push({
                id: 'Rocket',
                type: 'manual',
                name: 'DBBL Rocket',
                category: 'Mobile Banking (Manual)',
                accountNumber: rocketNum,
                instruction: 'আমাদের রকেট অ্যাকাউন্টে টাকা পাঠিয়ে নিচে TrxID লিখুন। অ্যাডমিন যাচাই করে অনুমোদন করবেন।',
                badge: 'Admin Approval',
                isMultiline: false,
            });
        }

        // 5. Corporate Bank Wire (Manual)
        if (bankDetails) {
            methods.push({
                id: 'Bank Transfer',
                type: 'manual',
                name: 'Corporate Bank Transfer',
                category: 'Direct Bank Wire',
                accountNumber: bankDetails,
                instruction: 'আমাদের ব্যাংক অ্যাকাউন্টে ডিপোজিট/ট্রান্সফার করে স্লিপ নম্বর বা রেফারেন্স নিচে TrxID হিসেবে দিন। অ্যাডমিন যাচাই করে অনুমোদন করবেন।',
                badge: 'Admin Approval',
                isMultiline: true,
            });
        }

        // 6. SSLCommerz (Card / Visa / MFS)
        if (sslOnline) {
            methods.push({
                id: 'Card / Visa',
                type: 'gateway',
                name: 'Card / Visa / MFS (SSLCommerz)',
                category: 'Online Gateway',
                accountNumber: `SSLCommerz Multi-Channel Payment (${(siteSettings?.sslcommerz_mode || 'LIVE').toUpperCase()})`,
                instruction: 'Pay securely using local or international Visa, MasterCard, Amex cards, or direct internet banking.',
                badge: 'Cards / MFS',
                isMultiline: false,
            });
        }

        // 7. EPS (Easy Payment System)
        if (epsOnline) {
            methods.push({
                id: 'EPS',
                type: 'gateway',
                name: 'EPS (Easy Payment System)',
                category: 'Online Gateway',
                accountNumber: `Easy Payment System Bangladesh (${(siteSettings?.eps_mode || 'LIVE').toUpperCase()})`,
                instruction: 'Bangladesh Bank licensed payment service provider for multi-channel checkout.',
                badge: 'Licensed PSP',
                isMultiline: false,
            });
        }

        // Fallback default methods if none configured in Admin panel yet
        if (methods.length === 0) {
            const fallbackPhone = siteSettings?.contact_phone || '+880 1800-000000';
            methods.push(
                {
                    id: 'bKash_manual',
                    type: 'manual',
                    name: 'bKash (Manual MFS)',
                    category: 'Mobile Banking',
                    accountNumber: fallbackPhone,
                    instruction: 'Send Money to the official bKash account below, then submit your TrxID for admin review.',
                    badge: 'Admin Approval',
                    isMultiline: false,
                },
                {
                    id: 'Nagad',
                    type: 'manual',
                    name: 'Nagad (Manual MFS)',
                    category: 'Mobile Banking',
                    accountNumber: fallbackPhone,
                    instruction: 'Send Money to the official Nagad account below, then submit your TrxID for admin review.',
                    badge: 'Admin Approval',
                    isMultiline: false,
                },
                {
                    id: 'Bank Transfer',
                    type: 'manual',
                    name: 'Bank Transfer',
                    category: 'Direct Bank Wire',
                    accountNumber: `Bank Name: City Bank / Trust Bank\nAccount Name: ${brandName}\nAccount No: 1102938475001\nHotline: ${brandPhone}`,
                    instruction: 'Deposit or wire transfer to the corporate bank details below and submit receipt slip number as TrxID.',
                    badge: 'Admin Approval',
                    isMultiline: true,
                }
            );
        }

        return methods;
    }, [siteSettings, brandName, brandPhone]);

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

    // Dynamic Payment Form States per Order
    const [payAmounts, setPayAmounts] = useState({});
    const [selectedMethods, setSelectedMethods] = useState({});
    const [transactionIds, setTransactionIds] = useState({});
    const [senderNumbers, setSenderNumbers] = useState({});
    const [payNotes, setPayNotes] = useState({});
    const [expandedLedgers, setExpandedLedgers] = useState({});
    const [submittingOrderId, setSubmittingOrderId] = useState(null);

    const getEnteredAmount = (order) => {
        if (payAmounts[order.id] !== undefined) {
            return payAmounts[order.id];
        }
        const { due } = getOrderFinancials(order);
        return due > 0 ? String(due) : String(order.amount);
    };

    const setOrderAmount = (orderId, val) => {
        setPayAmounts(prev => ({ ...prev, [orderId]: val }));
    };

    const getOrderMethod = (orderId) => {
        if (selectedMethods[orderId]) {
            return selectedMethods[orderId];
        }
        const defaultKey = siteSettings?.payment_default_gateway;
        const matched = availablePaymentMethods.find(m => m.id.toLowerCase() === defaultKey?.toLowerCase());
        return matched ? matched.id : availablePaymentMethods[0]?.id || 'bKash_manual';
    };

    const handlePayPendingOrder = (order) => {
        const amountStr = getEnteredAmount(order);
        const amountNum = parseFloat(amountStr);

        if (isNaN(amountNum) || amountNum <= 0) {
            alert('Please enter a valid payment amount (minimum ৳1.00 BDT).');
            return;
        }

        const methodId = getOrderMethod(order.id);
        const methodObj = availablePaymentMethods.find(m => m.id === methodId) || availablePaymentMethods[0];

        // Case 1: Automated bKash Merchant Gateway (PGW)
        if (methodObj?.type === 'gateway' || methodObj?.id === 'bkash_gateway') {
            setSubmittingOrderId(order.id);
            router.post(route('orders.bkash.initiate', order.id), {
                amount: amountNum,
            }, {
                preserveScroll: true,
                onFinish: () => setSubmittingOrderId(null),
            });
            return;
        }

        // Case 2: Manual Payment (MFS / Bank Transfer) - requires TrxID and Admin Approval
        const trxId = (transactionIds[order.id] || '').trim();
        const senderNum = (senderNumbers[order.id] || '').trim();
        const notes = (payNotes[order.id] || '').trim();

        if (!trxId) {
            alert('অনুগ্রহ করে পেমেন্ট করার পর প্রাপ্ত Transaction ID (TrxID) লিখুন।');
            return;
        }

        setSubmittingOrderId(order.id);
        router.post(route('orders.pay', order.id), {
            amount: amountNum,
            payment_method: methodObj?.name || 'Manual Payment',
            transaction_id: trxId,
            sender_number: senderNum,
            notes: notes,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmittingOrderId(null);
                setTransactionIds(prev => ({ ...prev, [order.id]: '' }));
                setSenderNumbers(prev => ({ ...prev, [order.id]: '' }));
                setPayNotes(prev => ({ ...prev, [order.id]: '' }));
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

    const totalSpent = orderList.reduce((acc, o) => acc + (parseFloat(o.paid_amount) || (o.status === 'paid' ? parseFloat(o.amount) || 0 : 0)), 0);
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
        <PublicLayout title="Profile & Invoices">
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
                                                                {order.transaction_id || `ORD-#${order.id}`} &bull; {order.item?.name} &bull; {formatDate(order.created_at)}
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
                                                        <Link
                                                            href={route('orders.requirements.show', order.id)}
                                                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 shadow-2xs"
                                                        >
                                                            <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>Requirements & Media</span>
                                                            {order.requirements?.length > 0 && (
                                                                <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] rounded-full font-mono">
                                                                    {order.requirements.length}
                                                                </span>
                                                            )}
                                                        </Link>
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
                                                                Target Delivery: {formatDate(order.delivery_date)}
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
                                                    {order.tasks?.[0]?.steps?.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1.5">
                                                            {order.tasks[0].steps.map((st, sIdx) => (
                                                                <div 
                                                                    key={st.id} 
                                                                    className={`p-2 rounded-xl border text-[11px] font-mono transition-all flex items-center justify-between gap-1.5 ${
                                                                        st.is_completed 
                                                                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-bold' 
                                                                            : 'bg-neutral-50/80 border-neutral-200 text-neutral-500'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-1.5 truncate">
                                                                        {st.is_completed ? (
                                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                                        ) : (
                                                                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 flex items-center justify-center text-[9px] text-neutral-400 flex-shrink-0">
                                                                                {sIdx + 1}
                                                                            </span>
                                                                        )}
                                                                        <span className="truncate">{st.title}</span>
                                                                    </div>
                                                                    {st.is_completed && (
                                                                        <span className="text-[9px] text-emerald-600 uppercase font-mono font-bold flex-shrink-0">Done</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-4 text-[10px] font-mono text-neutral-400 pt-0.5">
                                                            <span className={progress >= 0 ? 'text-blue-600 font-bold' : ''}>1. Order Placed</span>
                                                            <span className={`text-center ${progress >= 25 ? 'text-blue-600 font-bold' : ''}`}>2. Planning</span>
                                                            <span className={`text-center ${progress >= 50 ? 'text-blue-600 font-bold' : ''}`}>3. Development</span>
                                                            <span className={`text-right ${progress >= 100 ? 'text-emerald-600 font-bold' : ''}`}>4. Delivered</span>
                                                        </div>
                                                    )}
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

                    {/* TAB 2: MAKE PAYMENT (PENDING INVOICES & DUES) */}
                    {activeTab === 'payment' && (
                        <div className="space-y-4 animate-in fade-in">
                            {pendingOrders.length > 0 ? (
                                <div className="space-y-5">
                                    {pendingOrders.map((order) => {
                                        const { gross, discount, net, paid, due } = getOrderFinancials(order);
                                        const currentMethodId = getOrderMethod(order.id);
                                        const selectedMethod = availablePaymentMethods.find(m => m.id === currentMethodId) || availablePaymentMethods[0];
                                        const enteredAmount = getEnteredAmount(order);
                                        const enteredNum = parseFloat(enteredAmount) || 0;
                                        const isSubmitting = submittingOrderId === order.id;
                                        const paymentsList = order.payments || [];
                                        const isLedgerOpen = !!expandedLedgers[order.id];

                                        // Calculations for remaining balance preview
                                        const remainingAfterPay = Math.max(0, due - enteredNum);
                                        const isFullPay = Math.abs(enteredNum - due) < 0.01;
                                        const isOverPay = enteredNum > due;
                                        const isPartialPay = enteredNum > 0 && enteredNum < due;

                                        return (
                                            <div key={order.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs space-y-5">
                                                
                                                {/* Invoice Header & Financial Metrics */}
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                                                                due <= 0 
                                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                    : paid > 0 
                                                                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                                                    : 'bg-red-50 text-red-800 border-red-200'
                                                            }`}>
                                                                {due <= 0 ? '✓ Paid & Settled' : paid > 0 ? 'Partial Due Invoice' : 'Pending Due Invoice'}
                                                            </span>
                                                            <span className="text-xs text-neutral-400 font-mono">
                                                                Ref: {order.transaction_id || `INV-#${order.id}`}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-heading font-black text-lg text-neutral-900">
                                                            {order.project_name || order.item?.name || 'Custom Solution Development'}
                                                        </h3>
                                                        <p className="text-xs text-neutral-500 font-mono">
                                                            {order.item?.name} &bull; Generated: {formatDate(order.created_at)}
                                                        </p>
                                                    </div>

                                                    {/* Financial 3-Pillar Breakdown */}
                                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-right">
                                                        <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-left sm:text-right">
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">Total Net Bill</span>
                                                            <span className="font-mono font-bold text-xs sm:text-sm text-neutral-800">
                                                                ৳{net.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                                            </span>
                                                        </div>
                                                        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-left sm:text-right">
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block">Paid So Far</span>
                                                            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-700">
                                                                ৳{paid.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                                            </span>
                                                        </div>
                                                        <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-left sm:text-right">
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 block">Outstanding Due</span>
                                                            <span className="font-heading font-black text-sm sm:text-base text-red-600">
                                                                ৳{due.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pending Payment Submissions Alert Banner */}
                                                {paymentsList.some(p => p.status === 'pending') && (
                                                    <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-900 space-y-2">
                                                        {paymentsList.filter(p => p.status === 'pending').map(pendingP => (
                                                            <div key={pendingP.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                <div className="flex items-start sm:items-center gap-2.5">
                                                                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
                                                                    <div>
                                                                        <p className="text-xs font-bold text-amber-950">
                                                                            পেমেন্ট যাচাই প্রক্রিয়াধীন (Pending Admin Verification): <span className="font-mono text-emerald-800 font-black">৳{parseFloat(pendingP.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</span>
                                                                        </p>
                                                                        <p className="text-[11px] text-amber-800">
                                                                            মেথড: <strong>{pendingP.payment_method}</strong> &bull; TrxID: <strong className="font-mono">{pendingP.transaction_id}</strong>
                                                                            {pendingP.sender_number ? ` • প্রেরক: ${pendingP.sender_number}` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-900 border border-amber-300 self-start sm:self-auto">
                                                                    ⏳ অ্যাডমিন ভেরিফিকেশন চলছে
                                                                </span>
                                                            </div>
                                                        ))}
                                                        <p className="text-[10px] text-amber-700 pt-1 border-t border-amber-200">
                                                            অ্যাডমিন আপনার ট্রানজেকশন যাচাই করে অ্যাপ্রুভ করার সাথে সাথে ইনভয়েসের বাকি ব্যালেন্স (Outstanding Due) স্বয়ংক্রিয়ভাবে সমন্বয় করা হবে।
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Rejected Payment Submissions Alert Banner */}
                                                {paymentsList.some(p => p.status === 'rejected') && (
                                                    <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-300 text-rose-900 space-y-2">
                                                        {paymentsList.filter(p => p.status === 'rejected').map(rejectedP => (
                                                            <div key={rejectedP.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                <div className="flex items-start sm:items-center gap-2.5">
                                                                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
                                                                    <div>
                                                                        <p className="text-xs font-bold text-rose-950">
                                                                            পেমেন্ট যাচাই প্রত্যাখ্যাত (Payment Rejected): <span className="font-mono text-rose-800 font-black">৳{parseFloat(rejectedP.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</span>
                                                                        </p>
                                                                        <p className="text-[11px] text-rose-800">
                                                                            মেথড: <strong>{rejectedP.payment_method}</strong> &bull; TrxID: <strong className="font-mono">{rejectedP.transaction_id || '—'}</strong>
                                                                            {rejectedP.rejection_reason ? ` • কারণ: ${rejectedP.rejection_reason}` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-200/70 text-rose-900 border border-rose-300 self-start sm:self-auto">
                                                                    ✕ ভেরিফিকেশন বাতিল
                                                                </span>
                                                            </div>
                                                        ))}
                                                        <p className="text-[10px] text-rose-700 pt-1 border-t border-rose-200">
                                                            দয়া করে সঠিক ট্রানজেকশন আইডি ও তথ্যাবলী দিয়ে পুনরায় পেমেন্ট সাবমিট করুন অথবা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Section 1: Customer Desired Amount Input with Presets */}
                                                <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/70 space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div>
                                                            <label className="block text-xs font-bold text-neutral-900">
                                                                Select or Enter Desired Payment Amount (৳ BDT)
                                                            </label>
                                                            <p className="text-[11px] text-neutral-500">
                                                                You can pay the full due or enter any custom installment according to your plan.
                                                            </p>
                                                        </div>

                                                        {/* Quick Preset Buttons */}
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {due > 0 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setOrderAmount(order.id, String(due))}
                                                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                                                                            isFullPay
                                                                                ? 'bg-primary text-white border-primary shadow-2xs'
                                                                                : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                                                                        }`}
                                                                    >
                                                                        Full Due (৳{due.toLocaleString()})
                                                                    </button>
                                                                    {due >= 1000 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setOrderAmount(order.id, String(Math.round(due / 2)))}
                                                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                                                                                Math.abs(enteredNum - Math.round(due / 2)) < 0.01 && !isFullPay
                                                                                    ? 'bg-primary text-white border-primary shadow-2xs'
                                                                                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                                                                            }`}
                                                                        >
                                                                            50% (৳{Math.round(due / 2).toLocaleString()})
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                                        <div className="sm:col-span-6 relative">
                                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-sm">৳</span>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="1"
                                                                value={enteredAmount}
                                                                onChange={(e) => setOrderAmount(order.id, e.target.value)}
                                                                placeholder="Enter desired amount (e.g. 10000)"
                                                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold font-mono text-neutral-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                            />
                                                        </div>

                                                        {/* Real-time Calculation Preview */}
                                                        <div className="sm:col-span-6 text-xs font-medium">
                                                            {isFullPay ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                                    <span>Full settlement &bull; <strong>৳0.00</strong> due remaining upon verification.</span>
                                                                </div>
                                                            ) : isPartialPay ? (
                                                                <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                                    <span>Partial Payment &bull; Remaining due will be: <strong>৳{remainingAfterPay.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</strong>.</span>
                                                                </div>
                                                            ) : isOverPay ? (
                                                                <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                                    <span>Advance balance &bull; <strong>৳{(enteredNum - due).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> excess credit recorded.</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-neutral-400">Please enter a valid amount to see settlement projection.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 2: Dynamic System Payment Gateway Selector */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                                                            Choose Payment Gateway / Method (পেমেন্ট পদ্ধতি নির্বাচন করুন)
                                                        </label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                                            {availablePaymentMethods.map((m) => {
                                                                const isSelected = selectedMethod.id === m.id;
                                                                const isGateway = m.type === 'gateway';

                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={m.id}
                                                                        onClick={() => setSelectedMethods(prev => ({ ...prev, [order.id]: m.id }))}
                                                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                                                                            isSelected
                                                                                ? isGateway
                                                                                    ? 'bg-pink-700 text-white border-pink-700 shadow-xs ring-2 ring-pink-500/30'
                                                                                    : 'bg-primary text-white border-primary shadow-xs ring-2 ring-primary/20'
                                                                                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-1">
                                                                            <span className="text-xs font-black block truncate">{m.name}</span>
                                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                                                                                isSelected 
                                                                                    ? 'bg-white/20 text-white' 
                                                                                    : isGateway
                                                                                    ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                                                                    : 'bg-neutral-100 text-neutral-600'
                                                                            }`}>
                                                                                {m.badge}
                                                                            </span>
                                                                        </div>
                                                                        <span className={`text-[10px] block mt-1 truncate ${
                                                                            isSelected ? 'text-white/80' : 'text-neutral-500'
                                                                        }`}>
                                                                            {isGateway ? '⚡ Instant Gateway Auto-Credit' : '📝 Manual TrxID Verification'}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Gateway / Account Details Card */}
                                                    {selectedMethod.type === 'gateway' ? (
                                                        <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950 space-y-2">
                                                            <div className="flex items-center gap-2 font-bold text-xs text-pink-900">
                                                                <CreditCard className="w-4 h-4 text-pink-600 shrink-0" />
                                                                <span>অফিসিয়াল বিকাশ মার্চেন্ট গেটওয়ে (Official bKash PGW Checkout)</span>
                                                            </div>
                                                            <p className="text-[11px] text-pink-800 leading-relaxed">
                                                                নিচের <strong>"Proceed to bKash Gateway"</strong> বাটনে ক্লিক করলে আপনাকে নিরাপদ বিকাশ চেকআউট স্ক্রিনে নিয়ে যাওয়া হবে। সেখানে আপনার বিকাশ নম্বর, ওটিপি এবং পিন দিয়ে পেমেন্ট সম্পন্ন হলে আপনার ইনভয়েস <strong>কোন প্রকার ম্যানুয়াল ভেরিফিকেশন ছাড়াই সাথে সাথে অটো পেমেন্ট</strong> হিসেবে সফলভাবে আপডেট হয়ে যাবে।
                                                            </p>
                                                            <div className="flex items-center justify-between text-[11px] font-mono text-pink-700 pt-1 border-t border-pink-200">
                                                                <span>Payable Amount: <strong className="text-pink-900">৳{enteredNum.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT</strong></span>
                                                                <span>Invoice: <strong className="text-pink-900">#{order.transaction_id || `INV-${order.id}`}</strong></span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-100">
                                                                <div>
                                                                    <span className="font-bold text-xs block text-blue-950">
                                                                        Official Settlement Account ({selectedMethod.name}):
                                                                    </span>
                                                                    <p className="text-[11px] text-blue-700 mt-0.5">
                                                                        {selectedMethod.instruction}
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyToClipboard(selectedMethod.accountNumber, `wallet-${order.id}`)}
                                                                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-100 text-primary font-bold text-xs flex items-center gap-1.5 border border-blue-200 shadow-2xs self-start sm:self-auto transition-colors cursor-pointer"
                                                                >
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>{copiedKey === `wallet-${order.id}` ? 'Copied Details!' : 'Copy Account'}</span>
                                                                </button>
                                                            </div>

                                                            {/* Account Number / Bank Wire Details */}
                                                            <div className="p-3 bg-white rounded-lg border border-blue-200/80">
                                                                {selectedMethod.isMultiline ? (
                                                                    <pre className="font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed select-all">
                                                                        {selectedMethod.accountNumber}
                                                                    </pre>
                                                                ) : (
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[11px] text-neutral-500 font-medium">Account / Phone:</span>
                                                                        <span className="font-mono font-black text-sm text-primary select-all">
                                                                            {selectedMethod.accountNumber}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between text-[11px] text-blue-800 font-mono">
                                                                <span>Invoice Reference:</span>
                                                                <span className="font-bold">#{order.transaction_id || `INV-${order.id}`}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Transaction ID & Sender inputs (Only for Manual Payment) */}
                                                    {selectedMethod.type !== 'gateway' && (
                                                        <div className="space-y-3">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                                                        Transaction ID (TrxID) / Deposit Slip Ref <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        value={transactionIds[order.id] || ''}
                                                                        onChange={(e) => setTransactionIds(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                                        placeholder="e.g. BK789X1234 or Deposit Slip #"
                                                                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary font-mono font-bold"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                                                        Sender Phone / Account Number (ঐচ্ছিক)
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={senderNumbers[order.id] || ''}
                                                                        onChange={(e) => setSenderNumbers(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                                        placeholder="e.g. 017XXXXXXXX"
                                                                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary font-mono"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                                                    Payment Note / Remarks (ঐচ্ছিক)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={payNotes[order.id] || ''}
                                                                    onChange={(e) => setPayNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                                    placeholder="e.g. Paid installment for project milestone"
                                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50/60 focus:bg-white focus:border-primary"
                                                                />
                                                            </div>

                                                            <p className="text-[11px] text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200/80">
                                                                ⚠️ ম্যানুয়াল পেমেন্টে TrxID সাবমিট করার পর অ্যাডমিন অ্যাকাউন্ট চেক করে ভেরিফাই করবেন। অ্যাডমিন অনুমোদন করার পর আপনার বকেয়া সমন্বয় হবে।
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Submit Action Button */}
                                                    {selectedMethod.type === 'gateway' ? (
                                                        <button
                                                            type="button"
                                                            disabled={isSubmitting || enteredNum <= 0}
                                                            onClick={() => handlePayPendingOrder(order)}
                                                            className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-600/20 hover:shadow-lg hover:shadow-pink-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            <span>
                                                                {isSubmitting 
                                                                    ? 'Connecting to bKash Gateway...' 
                                                                    : `Proceed to bKash Gateway (৳${enteredNum.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
                                                                }
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={isSubmitting || enteredNum <= 0}
                                                            onClick={() => handlePayPendingOrder(order)}
                                                            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span>
                                                                {isSubmitting 
                                                                    ? 'Submitting for Admin Verification...' 
                                                                    : `Submit TrxID for Admin Verification (৳${enteredNum.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
                                                                }
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Section 3: Payment History Ledger (Collapsible) */}
                                                {paymentsList.length > 0 && (
                                                    <div className="pt-3 border-t border-neutral-100 space-y-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedLedgers(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                                                            className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 hover:text-neutral-900 py-1 transition-colors cursor-pointer"
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <History className="w-3.5 h-3.5 text-primary" />
                                                                <span>Payment History ({paymentsList.length} transaction{paymentsList.length > 1 ? 's' : ''})</span>
                                                            </span>
                                                            {isLedgerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>

                                                        {isLedgerOpen && (
                                                            <div className="overflow-hidden rounded-xl border border-neutral-200 text-xs animate-in fade-in">
                                                                <table className="w-full text-left">
                                                                    <thead className="bg-neutral-50 text-[10px] text-neutral-400 font-bold uppercase border-b border-neutral-200">
                                                                        <tr>
                                                                            <th className="p-2.5 pl-3">Date</th>
                                                                            <th className="p-2.5">Method</th>
                                                                            <th className="p-2.5">TrxID / Sender</th>
                                                                            <th className="p-2.5 text-right">Amount</th>
                                                                            <th className="p-2.5 text-center">Status</th>
                                                                            <th className="p-2.5 pr-3">Notes</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-neutral-100">
                                                                        {paymentsList.map(pm => {
                                                                            const isPending = pm.status === 'pending';
                                                                            const isRejected = pm.status === 'rejected';

                                                                            return (
                                                                                <tr key={pm.id} className="hover:bg-neutral-50/50">
                                                                                    <td className="p-2.5 pl-3 font-mono text-neutral-600">{formatDate(pm.payment_date || pm.created_at)}</td>
                                                                                    <td className="p-2.5 font-bold text-neutral-800">{pm.payment_method}</td>
                                                                                    <td className="p-2.5 font-mono text-neutral-500">
                                                                                        <div>{pm.transaction_id || '—'}</div>
                                                                                        {pm.sender_number && <div className="text-[10px] text-neutral-400 font-sans">Sender: {pm.sender_number}</div>}
                                                                                    </td>
                                                                                    <td className="p-2.5 text-right font-mono font-bold text-emerald-600">
                                                                                        ৳{parseFloat(pm.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                                    </td>
                                                                                    <td className="p-2.5 text-center">
                                                                                        {isPending ? (
                                                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                                                                ⏳ Pending Verification
                                                                                            </span>
                                                                                        ) : isRejected ? (
                                                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title={pm.rejection_reason || ''}>
                                                                                                ✕ Rejected
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                                                ✓ Approved & Credited
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="p-2.5 pr-3 text-neutral-500 text-[11px] truncate max-w-[150px]">
                                                                                        {pm.notes || pm.rejection_reason || '—'}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
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
            {selectedReceiptOrder && (() => {
                const liveReceiptOrder = orderList.find(o => o.id === selectedReceiptOrder.id) || selectedReceiptOrder;
                const receiptFin = getOrderFinancials(liveReceiptOrder);

                return (
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
                                            {brandName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-heading font-black text-xl text-neutral-900 tracking-tight">
                                            {brandName}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        {brandTagline}
                                    </p>
                                    <div className="text-[11px] text-neutral-400 space-y-0.5 pt-1 font-mono">
                                        <p>{brandAddress} &bull; Hotline: {brandPhone}</p>
                                        <p>{brandEmail}</p>
                                    </div>
                                </div>

                                {/* Official Seal / Stamp */}
                                <div className="sm:text-right space-y-2">
                                    <div className={`inline-block border-2 px-3.5 py-1 rounded-lg font-mono font-black text-xs uppercase tracking-widest rotate-[-3deg] shadow-xs ${
                                        receiptFin.due <= 0 && liveReceiptOrder.status !== 'pending'
                                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                            : receiptFin.paid > 0
                                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                                            : 'border-red-500 bg-red-50 text-red-700'
                                    }`}>
                                        {receiptFin.due <= 0 && liveReceiptOrder.status !== 'pending'
                                            ? '✓ PAID & SETTLED' 
                                            : receiptFin.paid > 0
                                            ? '⏳ PARTIAL PAYMENT'
                                            : 'PENDING INVOICE'
                                        }
                                    </div>
                                    <h2 className="font-heading font-black text-2xl text-neutral-900 tracking-tight">
                                        TAX INVOICE
                                    </h2>
                                    <p className="text-xs font-mono font-bold text-primary">
                                        #{liveReceiptOrder.transaction_id || `INV-${liveReceiptOrder.id.toString().padStart(6, '0')}`}
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
                                        <span className="text-neutral-400">Issue Date:</span> <span className="font-mono font-bold">{formatDate(liveReceiptOrder.created_at)}</span>
                                    </p>
                                    <p className="text-neutral-700">
                                        <span className="text-neutral-400">Payment Gateway:</span> <span className="font-bold text-neutral-900">{liveReceiptOrder.payment_method || 'Online'}</span>
                                    </p>
                                    <p className="text-neutral-700">
                                        <span className="text-neutral-400">Currency:</span> <span className="font-mono font-bold">{liveReceiptOrder.currency || 'BDT'}</span>
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
                                                    {liveReceiptOrder.item?.name || 'Security Software Application'}
                                                </p>
                                                <p className="text-[11px] text-neutral-500">
                                                    Enterprise Software License & Security Protection
                                                </p>
                                            </td>
                                            <td className="p-3.5 text-center font-mono font-bold">1</td>
                                            <td className="p-3.5 text-right font-mono font-bold text-neutral-700">
                                                ৳{parseFloat(liveReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3.5 text-right font-mono font-bold text-neutral-900">
                                                ৳{parseFloat(liveReceiptOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Calculation Summary */}
                            <div className="flex justify-end pt-2">
                                <div className="w-full sm:w-72 space-y-2 text-xs">
                                    <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                                        <span>Gross Subtotal:</span>
                                        <span className="font-mono font-bold text-neutral-900">
                                            ৳{receiptFin.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                        </span>
                                    </div>
                                    {receiptFin.discount > 0 && (
                                        <div className="flex justify-between py-1 border-b border-neutral-100 text-emerald-600">
                                            <span>Special Discount (ছাড়):</span>
                                            <span className="font-mono font-bold">
                                                -৳{receiptFin.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-700">
                                        <span>Net Invoiced Amount:</span>
                                        <span className="font-mono font-bold text-neutral-900">
                                            ৳{receiptFin.net.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-neutral-100 text-emerald-700">
                                        <span>Amount Paid / Settled:</span>
                                        <span className="font-mono font-bold">
                                            ৳{receiptFin.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT
                                        </span>
                                    </div>
                                    <div className={`flex justify-between py-2.5 p-3 rounded-xl border text-sm ${
                                        receiptFin.due > 0
                                            ? 'bg-red-50/70 border-red-200 text-red-900'
                                            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                    }`}>
                                        <span className="font-bold">
                                            {receiptFin.due > 0 ? 'Remaining Due:' : 'Settlement Status:'}
                                        </span>
                                        <span className="font-heading font-black text-base">
                                            {receiptFin.due > 0
                                                ? `৳${receiptFin.due.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT`
                                                : '✓ FULLY SETTLED'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Settlement Receipts Ledger */}
                            {(liveReceiptOrder.payments || []).length > 0 && (
                                <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                                    <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">
                                        Payment Transaction Receipts ({(liveReceiptOrder.payments || []).length})
                                    </span>
                                    <div className="overflow-hidden rounded-xl border border-neutral-200">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-neutral-50 text-[10px] text-neutral-400 font-bold uppercase border-b border-neutral-200">
                                                <tr>
                                                    <th className="p-2 pl-3">Date</th>
                                                    <th className="p-2">Method</th>
                                                    <th className="p-2">TrxID</th>
                                                    <th className="p-2 text-center">Status</th>
                                                    <th className="p-2 text-right pr-3">Paid Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100">
                                                {(liveReceiptOrder.payments || []).map((p) => (
                                                    <tr key={p.id}>
                                                        <td className="p-2 pl-3 font-mono text-neutral-600">{formatDate(p.payment_date || p.created_at)}</td>
                                                        <td className="p-2 font-semibold text-neutral-800">{p.payment_method}</td>
                                                        <td className="p-2 font-mono text-neutral-500">{p.transaction_id || '—'}</td>
                                                        <td className="p-2 text-center">
                                                            {p.status === 'approved' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                    অনুমোদিত (Approved)
                                                                </span>
                                                            )}
                                                            {p.status === 'pending' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                                    যাচাইাধীন (Pending)
                                                                </span>
                                                            )}
                                                            {p.status === 'rejected' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                                                    প্রত্যাখ্যাত (Rejected)
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className={`p-2 text-right pr-3 font-mono font-bold ${
                                                            p.status === 'approved' 
                                                                ? 'text-emerald-600' 
                                                                : p.status === 'rejected' 
                                                                ? 'text-rose-500 line-through' 
                                                                : 'text-amber-600'
                                                        }`}>
                                                            ৳{parseFloat(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Security Verification & Signature Footer */}
                            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    <span>256-bit TLS Verified Digital Receipt &bull; {brandName}</span>
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
                );
            })()}

        </PublicLayout>
    );
}
