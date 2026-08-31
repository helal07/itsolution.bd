import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Save, 
    Check, 
    Building2, 
    Smartphone, 
    Sparkles, 
    TrendingUp, 
    Share2, 
    Send, 
    Eye, 
    EyeOff, 
    Upload, 
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

export default function SettingsIndex({ settings, flash = {} }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        // Brand
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

        // SMS
        sms_enabled: settings.sms_enabled ?? '0',
        sms_provider: settings.sms_provider || 'bulksmsbd',
        sms_api_key: settings.sms_api_key || '',
        sms_api_secret: settings.sms_api_secret || '',
        sms_sender_id: settings.sms_sender_id || 'IT SOLUTIONS',
        sms_api_url: settings.sms_api_url || '',
        sms_notify_order: settings.sms_notify_order ?? '1',
        sms_notify_payment: settings.sms_notify_payment ?? '1',
        sms_notify_progress: settings.sms_notify_progress ?? '1',

        // Hero
        hero_headline: settings.hero_headline || '',
        hero_subheadline: settings.hero_subheadline || '',
        hero_badge: settings.hero_badge || '',
        hero_image_1: settings.hero_image_1 || '',
        hero_image_1_file: null,
        hero_image_2: settings.hero_image_2 || '',
        hero_image_2_file: null,
        hero_image_1_tag: settings.hero_image_1_tag || '',
        hero_image_2_tag: settings.hero_image_2_tag || '',

        // Metrics
        hero_stat1_value: settings.hero_stat1_value || '100+',
        hero_stat1_label: settings.hero_stat1_label || 'Projects Delivered',
        hero_stat2_value: settings.hero_stat2_value || '99.9%',
        hero_stat2_label: settings.hero_stat2_label || 'Uptime Guarantee',
        hero_stat3_value: settings.hero_stat3_value || '5.0 ★',
        hero_stat3_label: settings.hero_stat3_label || 'Client Rating',

        // Social
        facebook_url: settings.facebook_url || '',
        linkedin_url: settings.linkedin_url || '',
        github_url: settings.github_url || '',
        youtube_url: settings.youtube_url || '',
    });

    const [activeTab, setActiveTab] = useState('brand');
    const [showApiKey, setShowApiKey] = useState(false);
    
    const [logoPreview, setLogoPreview] = useState(settings.site_logo || '');
    const [faviconPreview, setFaviconPreview] = useState(settings.site_favicon || '');
    const [hero1Preview, setHero1Preview] = useState(settings.hero_image_1 || '');
    const [hero2Preview, setHero2Preview] = useState(settings.hero_image_2 || '');

    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);
    const hero1InputRef = useRef(null);
    const hero2InputRef = useRef(null);

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

    const handleHero1FileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image_1_file', file);
            setHero1Preview(URL.createObjectURL(file));
        }
    };

    const handleHero2FileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image_2_file', file);
            setHero2Preview(URL.createObjectURL(file));
        }
    };

    const tabs = [
        { id: 'brand', label: 'Brand & Logo', icon: Building2 },
        { id: 'sms', label: 'SMS Gateway', icon: Smartphone },
        { id: 'hero', label: 'Hero Banner', icon: Sparkles },
        { id: 'metrics', label: 'Trust Metrics', icon: TrendingUp },
        { id: 'social', label: 'Social Links', icon: Share2 },
    ];

    return (
        <AdminLayout title="Site Settings">
            <div className="space-y-5 max-w-5xl mx-auto pb-10">
                
                {/* Clean Top Header Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                                Site Settings
                            </h1>
                            <span className="text-xs text-slate-400 font-medium">
                                Configure website identity, logo, SMS gateway & hero content
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
                                onClick={() => setActiveTab(t.id)}
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
                                            placeholder="Or enter logo URL"
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
                                            <img src={faviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800">Favicon Icon</span>
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

                        {/* General Info Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                Identity & Contact
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Website Name</label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                                    <input
                                        type="text"
                                        value={data.site_tagline}
                                        onChange={(e) => setData('site_tagline', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Hotline Phone</label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        placeholder="017XXXXXXXX"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Currency (Symbol & Code)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={data.currency_symbol}
                                            onChange={(e) => setData('currency_symbol', e.target.value)}
                                            placeholder="৳"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-center text-slate-900"
                                        />
                                        <input
                                            type="text"
                                            value={data.currency_code}
                                            onChange={(e) => setData('currency_code', e.target.value)}
                                            placeholder="BDT"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-center text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Office Address</label>
                                    <input
                                        type="text"
                                        value={data.company_address}
                                        onChange={(e) => setData('company_address', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: SMS GATEWAY */}
                {activeTab === 'sms' && (
                    <div className="space-y-5">
                        
                        {/* Gateway Setup Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Gateway Setup
                                </h2>
                                
                                <button
                                    type="button"
                                    onClick={() => setData('sms_enabled', data.sms_enabled === '1' ? '0' : '1')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        data.sms_enabled === '1'
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {data.sms_enabled === '1' ? '✓ Gateway Active' : 'Gateway Disabled'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Provider</label>
                                    <select
                                        value={data.sms_provider}
                                        onChange={(e) => setData('sms_provider', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-blue-500"
                                    >
                                        <option value="bulksmsbd">BulkSMS BD (bulksmsbd.net)</option>
                                        <option value="greenweb">Greenweb BD (greenweb.com.bd)</option>
                                        <option value="alphasms">Alpha SMS (sms.net.bd)</option>
                                        <option value="mimsms">MIM SMS (mimsms.com)</option>
                                        <option value="sslwireless">SSL Wireless (SMSPlus)</option>
                                        <option value="twilio">Twilio Global</option>
                                        <option value="custom">Custom API Endpoint</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Sender ID / Masking</label>
                                    <input
                                        type="text"
                                        value={data.sms_sender_id}
                                        onChange={(e) => setData('sms_sender_id', e.target.value)}
                                        placeholder="e.g. ITSOLUTIONS"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">API Key / Token</label>
                                    <div className="relative">
                                        <input
                                            type={showApiKey ? "text" : "password"}
                                            value={data.sms_api_key}
                                            onChange={(e) => setData('sms_api_key', e.target.value)}
                                            placeholder="Enter Gateway API Key"
                                            className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:bg-white focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                        >
                                            {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        {data.sms_provider === 'mimsms' 
                                            ? 'MiMSMS Login Email (userName)' 
                                            : data.sms_provider === 'twilio' 
                                            ? 'Twilio Auth Token' 
                                            : 'API Secret / Username (Optional)'}
                                    </label>
                                    <input
                                        type={data.sms_provider === 'mimsms' ? 'email' : 'password'}
                                        value={data.sms_api_secret}
                                        onChange={(e) => setData('sms_api_secret', e.target.value)}
                                        placeholder={
                                            data.sms_provider === 'mimsms'
                                                ? 'Account Email registered with MiMSMS'
                                                : data.sms_provider === 'twilio'
                                                ? 'Twilio Auth Token'
                                                : 'Optional Secret / Username'
                                        }
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                {data.sms_provider === 'mimsms' && (
                                    <div className="md:col-span-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 space-y-1">
                                        <p className="font-bold text-amber-800">MiMSMS Integration Notice:</p>
                                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-900/80">
                                            <li><strong>API Key:</strong> Found under <span className="font-mono">sms.mimsms.com → Utility → Developer</span> (must be <em>Activated</em>).</li>
                                            <li><strong>Login Email:</strong> Enter your registered MiMSMS account email in the field above.</li>
                                            <li><strong>Sender ID:</strong> Use your registered Masking name or Non-masking number from <span className="font-mono">Utility → Sender ID</span>.</li>
                                            <li><strong>IP Whitelist:</strong> Ensure your server/hosting IP is whitelisted under <span className="font-mono">Utility → Developer</span>.</li>
                                        </ul>
                                    </div>
                                )}

                                {data.sms_provider === 'custom' && (
                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">Custom API Endpoint URL</label>
                                        <input
                                            type="text"
                                            value={data.sms_api_url}
                                            onChange={(e) => setData('sms_api_url', e.target.value)}
                                            placeholder="https://api.gateway.com/send?apiKey={apikey}&to={to}&msg={message}&senderid={senderid}"
                                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-900"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* SMS Automation Events */}
                            <div className="pt-3 border-t border-slate-100">
                                <span className="block text-xs font-bold text-slate-700 mb-2">Automated Notifications</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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

                {/* TAB 3: HERO BANNER */}
                {activeTab === 'hero' && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Home Hero Banner
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                            <div className="space-y-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Badge Text</label>
                                    <input
                                        type="text"
                                        value={data.hero_badge}
                                        onChange={(e) => setData('hero_badge', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={data.hero_headline}
                                        onChange={(e) => setData('hero_headline', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Subheadline</label>
                                    <textarea
                                        rows={4}
                                        value={data.hero_subheadline}
                                        onChange={(e) => setData('hero_subheadline', e.target.value)}
                                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                
                                {/* Hero Image 1 (Main) Selection Box */}
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800">Hero Image 1 (Main)</span>
                                        <button
                                            type="button"
                                            onClick={() => hero1InputRef.current?.click()}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                        >
                                            Select File
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={() => hero1InputRef.current?.click()}
                                            className="w-20 h-14 rounded-lg bg-white border border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xs group flex-shrink-0"
                                            title="Click to select main hero image"
                                        >
                                            {hero1Preview ? (
                                                <img src={hero1Preview} alt="Hero 1" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <input
                                                type="file"
                                                ref={hero1InputRef}
                                                accept="image/*"
                                                onChange={handleHero1FileSelect}
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                value={data.hero_image_1}
                                                onChange={(e) => {
                                                    setData('hero_image_1', e.target.value);
                                                    setHero1Preview(e.target.value);
                                                }}
                                                placeholder="Or enter image URL"
                                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                            />
                                            <input
                                                type="text"
                                                value={data.hero_image_1_tag}
                                                onChange={(e) => setData('hero_image_1_tag', e.target.value)}
                                                placeholder="Caption tag (e.g. Enterprise Cloud)"
                                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Image 2 (Accent) Selection Box */}
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800">Hero Image 2 (Accent)</span>
                                        <button
                                            type="button"
                                            onClick={() => hero2InputRef.current?.click()}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                        >
                                            Select File
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={() => hero2InputRef.current?.click()}
                                            className="w-20 h-14 rounded-lg bg-white border border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xs group flex-shrink-0"
                                            title="Click to select accent hero image"
                                        >
                                            {hero2Preview ? (
                                                <img src={hero2Preview} alt="Hero 2" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <input
                                                type="file"
                                                ref={hero2InputRef}
                                                accept="image/*"
                                                onChange={handleHero2FileSelect}
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                value={data.hero_image_2}
                                                onChange={(e) => {
                                                    setData('hero_image_2', e.target.value);
                                                    setHero2Preview(e.target.value);
                                                }}
                                                placeholder="Or enter image URL"
                                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono"
                                            />
                                            <input
                                                type="text"
                                                value={data.hero_image_2_tag}
                                                onChange={(e) => setData('hero_image_2_tag', e.target.value)}
                                                placeholder="Caption tag (e.g. Mobile Apps)"
                                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: METRICS */}
                {activeTab === 'metrics' && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Trust Metrics Counters
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Metric 1</span>
                                <input
                                    type="text"
                                    value={data.hero_stat1_value}
                                    onChange={(e) => setData('hero_stat1_value', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-900"
                                />
                                <input
                                    type="text"
                                    value={data.hero_stat1_label}
                                    onChange={(e) => setData('hero_stat1_label', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                                />
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Metric 2</span>
                                <input
                                    type="text"
                                    value={data.hero_stat2_value}
                                    onChange={(e) => setData('hero_stat2_value', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-900"
                                />
                                <input
                                    type="text"
                                    value={data.hero_stat2_label}
                                    onChange={(e) => setData('hero_stat2_label', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                                />
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Metric 3</span>
                                <input
                                    type="text"
                                    value={data.hero_stat3_value}
                                    onChange={(e) => setData('hero_stat3_value', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-900"
                                />
                                <input
                                    type="text"
                                    value={data.hero_stat3_label}
                                    onChange={(e) => setData('hero_stat3_label', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: SOCIAL */}
                {activeTab === 'social' && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Social Media Accounts
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Facebook</label>
                                <input
                                    type="url"
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    value={data.linkedin_url}
                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/company/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">GitHub</label>
                                <input
                                    type="url"
                                    value={data.github_url}
                                    onChange={(e) => setData('github_url', e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">YouTube</label>
                                <input
                                    type="url"
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/@..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
