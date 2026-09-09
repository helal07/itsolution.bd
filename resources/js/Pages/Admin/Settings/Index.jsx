import React, { useState, useRef, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Save, 
    Check, 
    Building2, 
    Smartphone, 
    CreditCard,
    Send, 
    Eye, 
    EyeOff, 
    Upload, 
    Shield,
    Sliders,
    Landmark
} from 'lucide-react';

export default function SettingsIndex({ settings = {}, flash = {} }) {
    const { url } = usePage();
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        // Brand & Identity
        site_name: settings.site_name || 'IT SOLUTIONS',
        site_tagline: settings.site_tagline || 'Enterprise Software & Digital Engineering',
        site_logo: settings.site_logo || '',
        site_logo_file: null,
        site_favicon: settings.site_favicon || '',
        site_favicon_file: null,
        contact_email: settings.contact_email || 'contact@itsolutions.com',
        contact_phone: settings.contact_phone || '+880 1800-000000',
        whatsapp_number: settings.whatsapp_number || '+880 1800-000000',
        company_address: settings.company_address || 'Dhaka, Bangladesh',
        currency_symbol: settings.currency_symbol || '৳',
        currency_code: settings.currency_code || 'BDT',

        // SMS Gateway
        sms_enabled: settings.sms_enabled ?? '0',
        sms_provider: settings.sms_provider || 'bulksmsbd',
        sms_api_key: settings.sms_api_key || '',
        sms_api_secret: settings.sms_api_secret || '',
        sms_sender_id: settings.sms_sender_id || 'IT SOLUTIONS',
        sms_api_url: settings.sms_api_url || '',
        sms_notify_order: settings.sms_notify_order ?? '1',
        sms_notify_payment: settings.sms_notify_payment ?? '1',
        sms_notify_progress: settings.sms_notify_progress ?? '1',

        // Payment Gateway Settings
        payment_default_gateway: settings.payment_default_gateway || 'bkash',

        // bKash PGW
        bkash_enabled: settings.bkash_enabled ?? '1',
        bkash_mode: settings.bkash_mode || 'sandbox',
        bkash_app_key: settings.bkash_app_key || '',
        bkash_app_secret: settings.bkash_app_secret || '',
        bkash_username: settings.bkash_username || '',
        bkash_password: settings.bkash_password || '',
        bkash_base_url: settings.bkash_base_url || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',

        // EPS (Easy Payment System)
        eps_enabled: settings.eps_enabled ?? '0',
        eps_mode: settings.eps_mode || 'sandbox',
        eps_merchant_id: settings.eps_merchant_id || '',
        eps_store_id: settings.eps_store_id || '',
        eps_hash_key: settings.eps_hash_key || '',
        eps_secret_key: settings.eps_secret_key || '',
        eps_api_url: settings.eps_api_url || 'https://sandbox.eps.com.bd',

        // SSLCommerz
        sslcommerz_enabled: settings.sslcommerz_enabled ?? '0',
        sslcommerz_mode: settings.sslcommerz_mode || 'sandbox',
        sslcommerz_store_id: settings.sslcommerz_store_id || '',
        sslcommerz_store_passwd: settings.sslcommerz_store_passwd || '',
        sslcommerz_api_url: settings.sslcommerz_api_url || 'https://sandbox.sslcommerz.com',

        // Offline / Manual Accounts
        manual_bkash_number: settings.manual_bkash_number || '',
        manual_nagad_number: settings.manual_nagad_number || '',
        manual_rocket_number: settings.manual_rocket_number || '',
        manual_bank_details: settings.manual_bank_details || '',
    });

    const validTabs = ['brand', 'sms', 'payment'];
    const getTabFromUrl = () => {
        if (typeof window === 'undefined') return 'brand';
        const tabParam = new URLSearchParams(window.location.search).get('tab');
        return validTabs.includes(tabParam) ? tabParam : 'brand';
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl());

    // Password & Secret key visibility states
    const [showSmsApiKey, setShowSmsApiKey] = useState(false);
    const [showBkashSecret, setShowBkashSecret] = useState(false);
    const [showBkashPass, setShowBkashPass] = useState(false);
    const [showEpsSecret, setShowEpsSecret] = useState(false);
    const [showEpsHash, setShowEpsHash] = useState(false);
    const [showSslPass, setShowSslPass] = useState(false);

    // Synchronize tab state with URL / Inertia navigations
    useEffect(() => {
        const currentTab = getTabFromUrl();
        setActiveTab(currentTab);
    }, [url]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (typeof window !== 'undefined') {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('tab', tabId);
            window.history.replaceState({}, '', currentUrl.toString());
        }
    };
    
    const [logoPreview, setLogoPreview] = useState(settings.site_logo || '');
    const [faviconPreview, setFaviconPreview] = useState(settings.site_favicon || '');

    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);

    const testSmsForm = useForm({
        test_phone: '',
        test_message: 'IT SOLUTIONS: Test SMS gateway configuration verified successfully.',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings', { 
            forceFormData: true, 
            preserveScroll: true 
        });
    };

    const handleSendTestSms = (e) => {
        e.preventDefault();
        testSmsForm.post('/admin/settings/test-sms', {
            preserveScroll: true,
        });
    };

    const handleLogoFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('site_logo_file', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('site_favicon_file', file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const tabs = [
        { id: 'brand', label: 'Brand & Logo', icon: Building2 },
        { id: 'sms', label: 'SMS Gateway', icon: Smartphone },
        { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    ];

    return (
        <AdminLayout title="Settings">
            <div className="space-y-5 max-w-5xl mx-auto pb-10">
                
                {/* Clean Top Header Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Settings
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure brand identity, SMS gateway & payment gateway integrations
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {recentlySuccessful ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Saved</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Minimalist Tabs Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => handleTabChange(t.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: BRAND & LOGO */}
                {activeTab === 'brand' && (
                    <div className="space-y-5">
                        
                        {/* Logo & Favicon Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Logo & Icon
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Logo Box */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                                    <div 
                                        onClick={() => logoInputRef.current?.click()}
                                        className="w-20 h-16 rounded-xl bg-white border border-dashed border-slate-300 hover:border-blue-500 p-1.5 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 shadow-2xs group"
                                        title="Click to select logo"
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800">Website Logo</span>
                                            <button
                                                type="button"
                                                onClick={() => logoInputRef.current?.click()}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                Select File
                                            </button>
                                        </div>
                                        <input
                                            type="file"
                                            ref={logoInputRef}
                                            accept="image/*"
                                            onChange={handleLogoFileSelect}
                                            className="hidden"
                                        />
                                        <input
                                            type="text"
                                            value={data.site_logo}
                                            onChange={(e) => {
                                                setData('site_logo', e.target.value);
                                                setLogoPreview(e.target.value);
                                            }}
                                            placeholder="Or enter logo image URL"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Favicon Box */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                                    <div 
                                        onClick={() => faviconInputRef.current?.click()}
                                        className="w-16 h-16 rounded-xl bg-white border border-dashed border-slate-300 hover:border-blue-500 p-1.5 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 shadow-2xs group"
                                        title="Click to select favicon"
                                    >
                                        {faviconPreview ? (
                                            <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
                                        ) : (
                                            <Upload className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800">Favicon (.ico, .png)</span>
                                            <button
                                                type="button"
                                                onClick={() => faviconInputRef.current?.click()}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                Select File
                                            </button>
                                        </div>
                                        <input
                                            type="file"
                                            ref={faviconInputRef}
                                            accept="image/*"
                                            onChange={handleFaviconFileSelect}
                                            className="hidden"
                                        />
                                        <input
                                            type="text"
                                            value={data.site_favicon}
                                            onChange={(e) => {
                                                setData('site_favicon', e.target.value);
                                                setFaviconPreview(e.target.value);
                                            }}
                                            placeholder="Or enter favicon URL"
                                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* General Brand Info Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Brand Identity & Contact Info
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Company / Brand Name</label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                                    <input
                                        type="text"
                                        value={data.site_tagline}
                                        onChange={(e) => setData('site_tagline', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Currency Code & Symbol</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={data.currency_code}
                                            onChange={(e) => setData('currency_code', e.target.value)}
                                            placeholder="BDT"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold uppercase"
                                        />
                                        <input
                                            type="text"
                                            value={data.currency_symbol}
                                            onChange={(e) => setData('currency_symbol', e.target.value)}
                                            placeholder="৳"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Official Office Address</label>
                                    <input
                                        type="text"
                                        value={data.company_address}
                                        onChange={(e) => setData('company_address', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: SMS GATEWAY */}
                {activeTab === 'sms' && (
                    <div className="space-y-5">
                        
                        {/* Gateway Configuration Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    SMS Gateway Provider & API
                                </h2>

                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.sms_enabled === '1'}
                                        onChange={(e) => setData('sms_enabled', e.target.checked ? '1' : '0')}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-bold text-slate-900">Enable Live SMS Alerts</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Provider</label>
                                    <select
                                        value={data.sms_provider}
                                        onChange={(e) => setData('sms_provider', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                    >
                                        <option value="greenweb">Greenweb BD</option>
                                        <option value="bulksmsbd">BulkSMSBD</option>
                                        <option value="custom">Custom API URL</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Sender ID (Masking/Non-Masking)</label>
                                    <input
                                        type="text"
                                        value={data.sms_sender_id}
                                        onChange={(e) => setData('sms_sender_id', e.target.value)}
                                        placeholder="e.g. ITSOLUTIONS"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">API Key / Token</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowSmsApiKey(!showSmsApiKey)}
                                            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                                        >
                                            {showSmsApiKey ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showSmsApiKey ? 'text' : 'password'}
                                        value={data.sms_api_key}
                                        onChange={(e) => setData('sms_api_key', e.target.value)}
                                        placeholder="Enter Gateway API Key"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">API Secret / Client ID (If required)</label>
                                    <input
                                        type="password"
                                        value={data.sms_api_secret}
                                        onChange={(e) => setData('sms_api_secret', e.target.value)}
                                        placeholder="Enter Secret Key"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>

                                {data.sms_provider === 'custom' && (
                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">Custom API URL Template</label>
                                        <input
                                            type="text"
                                            value={data.sms_api_url}
                                            onChange={(e) => setData('sms_api_url', e.target.value)}
                                            placeholder="https://api.sms.com/send?apiKey={API_KEY}&to={TO}&msg={MSG}"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* SMS Notifications Toggle */}
                            <div className="pt-3 border-t border-slate-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Automatic Trigger Alerts
                                </span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.sms_notify_order === '1'}
                                            onChange={(e) => setData('sms_notify_order', e.target.checked ? '1' : '0')}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="font-semibold">New Order</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.sms_notify_payment === '1'}
                                            onChange={(e) => setData('sms_notify_payment', e.target.checked ? '1' : '0')}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="font-semibold">Payment Settled</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.sms_notify_progress === '1'}
                                            onChange={(e) => setData('sms_notify_progress', e.target.checked ? '1' : '0')}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="font-semibold">Progress Update</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Test SMS Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Send Test SMS
                            </h3>

                            <form onSubmit={handleSendTestSms} className="flex flex-col sm:flex-row gap-3 text-xs">
                                <input
                                    type="text"
                                    value={testSmsForm.data.test_phone}
                                    onChange={(e) => testSmsForm.setData('test_phone', e.target.value)}
                                    placeholder="Mobile Number (e.g. 017XXXXXXXX)"
                                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 flex-1"
                                    required
                                />

                                <input
                                    type="text"
                                    value={testSmsForm.data.test_message}
                                    onChange={(e) => testSmsForm.setData('test_message', e.target.value)}
                                    placeholder="Test message..."
                                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 flex-2"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={testSmsForm.processing}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-2xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{testSmsForm.processing ? 'Sending...' : 'Test Send'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* TAB 3: PAYMENT GATEWAY */}
                {activeTab === 'payment' && (
                    <div className="space-y-6">
                        
                        {/* Primary Gateway Selection */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    Default Primary Gateway
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Select the default payment processor presented to clients during checkout & invoice payments.
                                </p>
                            </div>
                            <select
                                value={data.payment_default_gateway}
                                onChange={(e) => setData('payment_default_gateway', e.target.value)}
                                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer min-w-[180px]"
                            >
                                <option value="bkash">bKash (Direct Tokenized)</option>
                                <option value="eps">EPS (Easy Payment System)</option>
                                <option value="sslcommerz">SSLCommerz Hosted</option>
                                <option value="manual">Manual / Offline Accounts</option>
                            </select>
                        </div>

                        {/* GATEWAY 1: bKash */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-pink-50/50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center font-black text-sm tracking-wider">
                                        bK
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">bKash PGW (Tokenized API)</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                data.bkash_mode === 'live' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {data.bkash_mode.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Official tokenized checkout gateway for seamless instant payments</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={data.bkash_mode}
                                        onChange={(e) => {
                                            const mode = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                bkash_mode: mode,
                                                bkash_base_url: mode === 'live'
                                                    ? 'https://tokenized.pay.bka.sh/v1.2.0-beta'
                                                    : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
                                            }));
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                                    >
                                        <option value="sandbox">Sandbox / Testing</option>
                                        <option value="live">Live / Production</option>
                                    </select>

                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.bkash_enabled === '1'}
                                            onChange={(e) => setData('bkash_enabled', e.target.checked ? '1' : '0')}
                                            className="rounded text-pink-600 focus:ring-pink-500"
                                        />
                                        <span className="text-xs font-bold text-slate-900">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">bKash App Key</label>
                                    <input
                                        type="text"
                                        value={data.bkash_app_key}
                                        onChange={(e) => setData('bkash_app_key', e.target.value)}
                                        placeholder="e.g. 4fxxxxxxxxxxxxxxxx"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">bKash App Secret</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowBkashSecret(!showBkashSecret)}
                                            className="text-[10px] text-pink-600 hover:text-pink-700 font-bold cursor-pointer"
                                        >
                                            {showBkashSecret ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showBkashSecret ? 'text' : 'password'}
                                        value={data.bkash_app_secret}
                                        onChange={(e) => setData('bkash_app_secret', e.target.value)}
                                        placeholder="Enter bKash App Secret Key"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">bKash Username</label>
                                    <input
                                        type="text"
                                        value={data.bkash_username}
                                        onChange={(e) => setData('bkash_username', e.target.value)}
                                        placeholder="Merchant bKash Username"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">bKash Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowBkashPass(!showBkashPass)}
                                            className="text-[10px] text-pink-600 hover:text-pink-700 font-bold cursor-pointer"
                                        >
                                            {showBkashPass ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showBkashPass ? 'text' : 'password'}
                                        value={data.bkash_password}
                                        onChange={(e) => setData('bkash_password', e.target.value)}
                                        placeholder="Merchant bKash Password"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Base API URL</label>
                                    <input
                                        type="text"
                                        value={data.bkash_base_url}
                                        onChange={(e) => setData('bkash_base_url', e.target.value)}
                                        placeholder="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:border-pink-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* GATEWAY 2: EPS (Easy Payment System) */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-black text-sm tracking-wider">
                                        EPS
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">EPS (Easy Payment System)</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                data.eps_mode === 'live' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {data.eps_mode.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Bangladesh Bank licensed multi-channel payment gateway</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={data.eps_mode}
                                        onChange={(e) => {
                                            const mode = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                eps_mode: mode,
                                                eps_api_url: mode === 'live'
                                                    ? 'https://api.eps.com.bd'
                                                    : 'https://sandbox.eps.com.bd'
                                            }));
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                                    >
                                        <option value="sandbox">Sandbox / Testing</option>
                                        <option value="live">Live / Production</option>
                                    </select>

                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.eps_enabled === '1'}
                                            onChange={(e) => setData('eps_enabled', e.target.checked ? '1' : '0')}
                                            className="rounded text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-xs font-bold text-slate-900">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">EPS Merchant ID</label>
                                    <input
                                        type="text"
                                        value={data.eps_merchant_id}
                                        onChange={(e) => setData('eps_merchant_id', e.target.value)}
                                        placeholder="Enter EPS Merchant ID"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">EPS Store ID</label>
                                    <input
                                        type="text"
                                        value={data.eps_store_id}
                                        onChange={(e) => setData('eps_store_id', e.target.value)}
                                        placeholder="Enter EPS Store ID"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">EPS Hash Key</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowEpsHash(!showEpsHash)}
                                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
                                        >
                                            {showEpsHash ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showEpsHash ? 'text' : 'password'}
                                        value={data.eps_hash_key}
                                        onChange={(e) => setData('eps_hash_key', e.target.value)}
                                        placeholder="Enter EPS Hash Key"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">EPS Secret Key</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowEpsSecret(!showEpsSecret)}
                                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
                                        >
                                            {showEpsSecret ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showEpsSecret ? 'text' : 'password'}
                                        value={data.eps_secret_key}
                                        onChange={(e) => setData('eps_secret_key', e.target.value)}
                                        placeholder="Enter EPS Secret Key"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">EPS API Base URL</label>
                                    <input
                                        type="text"
                                        value={data.eps_api_url}
                                        onChange={(e) => setData('eps_api_url', e.target.value)}
                                        placeholder="https://sandbox.eps.com.bd"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* GATEWAY 3: SSLCommerz */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-sm tracking-wider">
                                        SSL
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">SSLCommerz Hosted Gateway</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                data.sslcommerz_mode === 'live' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {data.sslcommerz_mode.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Universal card, MFS & internet banking payment gateway</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={data.sslcommerz_mode}
                                        onChange={(e) => {
                                            const mode = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                sslcommerz_mode: mode,
                                                sslcommerz_api_url: mode === 'live'
                                                    ? 'https://securepay.sslcommerz.com'
                                                    : 'https://sandbox.sslcommerz.com'
                                            }));
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                                    >
                                        <option value="sandbox">Sandbox / Testing</option>
                                        <option value="live">Live / Production</option>
                                    </select>

                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.sslcommerz_enabled === '1'}
                                            onChange={(e) => setData('sslcommerz_enabled', e.target.checked ? '1' : '0')}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-bold text-slate-900">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Store ID</label>
                                    <input
                                        type="text"
                                        value={data.sslcommerz_store_id}
                                        onChange={(e) => setData('sslcommerz_store_id', e.target.value)}
                                        placeholder="Enter SSLCommerz Store ID"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-bold text-slate-700">Store Password / Secret Key</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowSslPass(!showSslPass)}
                                            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                                        >
                                            {showSslPass ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showSslPass ? 'text' : 'password'}
                                        value={data.sslcommerz_store_passwd}
                                        onChange={(e) => setData('sslcommerz_store_passwd', e.target.value)}
                                        placeholder="Enter SSLCommerz Store Password"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">SSLCommerz API URL</label>
                                    <input
                                        type="text"
                                        value={data.sslcommerz_api_url}
                                        onChange={(e) => setData('sslcommerz_api_url', e.target.value)}
                                        placeholder="https://sandbox.sslcommerz.com"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: Manual / Offline Accounts */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Offline & Manual Payment Accounts</h3>
                                        <p className="text-xs text-slate-500">Provide direct MFS & Bank transfer details for manual invoice settlements</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Manual bKash Number (Merchant/Personal)</label>
                                    <input
                                        type="text"
                                        value={data.manual_bkash_number}
                                        onChange={(e) => setData('manual_bkash_number', e.target.value)}
                                        placeholder="e.g. 01700-000000 (Personal)"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Manual Nagad Number</label>
                                    <input
                                        type="text"
                                        value={data.manual_nagad_number}
                                        onChange={(e) => setData('manual_nagad_number', e.target.value)}
                                        placeholder="e.g. 01800-000000 (Merchant)"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Manual Rocket Number</label>
                                    <input
                                        type="text"
                                        value={data.manual_rocket_number}
                                        onChange={(e) => setData('manual_rocket_number', e.target.value)}
                                        placeholder="e.g. 01900-0000008"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <label className="block font-bold text-slate-700 mb-1">Bank Account Transfer Details</label>
                                    <textarea
                                        rows={3}
                                        value={data.manual_bank_details}
                                        onChange={(e) => setData('manual_bank_details', e.target.value)}
                                        placeholder="Bank Name: City Bank&#10;Account Name: IT SOLUTIONS BD&#10;Account Number: 1102938475001&#10;Branch: Gulshan Branch, Dhaka&#10;Routing: 225272345"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
