import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Layers, 
    FolderGit2, 
    MessageSquare, 
    ShoppingBag, 
    Building2, 
    LogOut, 
    ShieldCheck, 
    CheckCircle2, 
    AlertCircle,
    Menu, 
    X, 
    Sliders, 
    Star, 
    Users, 
    UserCheck, 
    ExternalLink, 
    RefreshCw, 
    Globe, 
    ChevronDown,
    Sparkles, 
    Bot, 
    User, 
    CheckSquare, 
    ListTodo, 
    ClipboardCheck, 
    FileText, 
    Camera, 
    CalendarDays, 
    Banknote,
    TrendingUp,
    Share2,
    SlidersHorizontal,
    Palette,
    UserCog,
    CreditCard,
    Smartphone
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash = {}, siteSettings = {} } = usePage().props;
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const brandName = siteSettings.site_name || 'IT SOLUTIONS';
    const isAdmin = auth?.user?.role === 'admin';

    // Sub-items specifically grouped under Sales & Commerce
    const salesSubItems = [
        { href: '/admin/clients', label: 'Clients Directory', icon: Building2 },
        { href: '/admin/orders', label: 'Orders & Sales', icon: ShoppingBag },
        { href: '/admin/quotes', label: 'Quotations', icon: MessageSquare },
        { href: '/admin/reorders', label: 'Subscriptions', icon: RefreshCw },
        { href: '/admin/users', label: 'Registered Users', icon: Users },
    ];

    // Sub-items specifically grouped under HRM Main Menu
    const hrmSubItems = [
        { href: '/attendance', label: 'Selfie Attendance', icon: Camera },
        { href: '/leaves', label: 'Leave Requests', icon: CalendarDays },
        { href: '/admin/leave-settings', label: 'Leave Settings', icon: SlidersHorizontal },
    ];

    // Sub-items specifically grouped under Frontend Settings
    const frontendSubItems = [
        { href: '/admin/items', label: 'Services & Products', icon: Layers },
        { href: '/admin/portfolios', label: 'Portfolio', icon: FolderGit2 },
        { href: '/admin/reviews', label: 'Reviews', icon: Star },
        { href: '/admin/chat-questions', label: 'Live Chat & QA', icon: Bot },
        { href: '/admin/hero-banner', label: 'Hero Banner', icon: Sparkles },
        { href: '/admin/trust-matrix', label: 'Trust Matrix', icon: TrendingUp },
        { href: '/admin/social-links', label: 'Social Links', icon: Share2 },
    ];

    // Sub-items specifically grouped under Team & Operations
    const teamSubItems = [
        { href: '/admin/employees', label: 'Staff Team', icon: UserCheck },
        { href: '/admin/tasks', label: 'Tasks & Steps', icon: CheckSquare },
        { href: '/my-tasks', label: 'My Tasks', icon: ListTodo },
        { href: '/admin/work-logs', label: 'Staff Work Logs', icon: ClipboardCheck },
        { href: '/daily-work-log', label: 'Daily Submission', icon: FileText },
    ];

    // Sub-items specifically grouped under Settings Main Menu
    const settingsSubItems = [
        { href: '/admin/settings?tab=brand', label: 'Brand & Logo', icon: Building2 },
        { href: '/admin/settings?tab=sms', label: 'SMS Gateway', icon: Smartphone },
        { href: '/admin/settings?tab=payment', label: 'Payment Gateway', icon: CreditCard },
    ];

    // Helper to evaluate active route matches
    const isItemActive = (item) => {
        if (typeof window === 'undefined') return false;
        const path = window.location.pathname;
        const search = window.location.search;

        if (item.href.includes('?')) {
            const [itemPath, itemQuery] = item.href.split('?');
            if (path === itemPath) {
                const itemParams = new URLSearchParams(itemQuery);
                const currentParams = new URLSearchParams(search);
                const itemTab = itemParams.get('tab');
                const currentTab = currentParams.get('tab') || 'brand';
                return itemTab === currentTab;
            }
            return false;
        }

        if (item.href === '/admin') {
            return path === '/admin';
        }
        return path === item.href || (item.href !== '/admin' && path.startsWith(item.href));
    };

    // Determine which accordion group is active based on current location
    const getActiveGroupKey = () => {
        if (salesSubItems.some(isItemActive)) return 'sales';
        if (teamSubItems.some(isItemActive)) return 'team';
        if (hrmSubItems.some(isItemActive)) return 'hrm';
        if (frontendSubItems.some(isItemActive)) return 'frontend';
        if (
            (typeof window !== 'undefined' && window.location.pathname === '/admin/settings') ||
            settingsSubItems.some(isItemActive)
        ) {
            return 'settings';
        }
        return null;
    };

    // Auto-fold state: only the active menu is unfolded
    const [openMenu, setOpenMenu] = useState(getActiveGroupKey());

    // Whenever URL / page changes, auto-fold and open ONLY the active menu
    useEffect(() => {
        setOpenMenu(getActiveGroupKey());
    }, [url]);

    const toggleMenu = (key) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };

    // Navigation sections & hierarchical layout
    const navSections = [
        {
            group: 'Main',
            items: [
                { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            ]
        },
        {
            group: 'Sales & Commerce',
            key: 'sales',
            label: 'Sales & Commerce',
            icon: ShoppingBag,
            items: salesSubItems,
        },
        {
            group: 'Team & Operations',
            key: 'team',
            label: 'Team & Operations',
            icon: CheckSquare,
            items: teamSubItems,
        },
        {
            group: 'HRM',
            key: 'hrm',
            label: 'HRM',
            icon: UserCog,
            items: hrmSubItems,
        },
        {
            group: 'Salary & Payroll',
            items: [
                { href: '/admin/salary', label: 'Salary & Payroll', icon: Banknote },
            ]
        },
        {
            group: 'Frontend & Showcase',
            key: 'frontend',
            label: 'Frontend Settings',
            icon: Palette,
            items: frontendSubItems,
        },
        {
            group: 'System',
            key: 'settings',
            label: 'Settings',
            icon: Sliders,
            items: settingsSubItems,
        }
    ];

    // Find active page title fallback
    const allFlatItems = [
        { href: '/admin', label: 'Dashboard' },
        ...salesSubItems,
        ...teamSubItems,
        ...hrmSubItems,
        { href: '/admin/salary', label: 'Salary & Payroll' },
        ...frontendSubItems,
        ...settingsSubItems,
        { href: '/admin/settings', label: 'Settings' },
    ];
    const activeItem = allFlatItems.find(isItemActive);
    const pageTitle = title || activeItem?.label || 'Dashboard';

    return (
        <div className="min-h-screen flex bg-[#f0f4fa] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            <Head title={title ? `${title} — ${brandName} Admin` : `Admin — ${brandName}`} />

            {/* Desktop Sidebar */}
            <aside className="w-64 lg:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between flex-shrink-0 hidden lg:flex h-screen sticky top-0 z-40 shadow-xs">
                
                {/* Scrollable Nav Area */}
                <div className="p-3.5 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                    
                    {/* Brand Header */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80">
                        {siteSettings.site_logo ? (
                            <img 
                                src={siteSettings.site_logo} 
                                alt={brandName} 
                                className="w-8 h-8 rounded-xl object-contain bg-white p-0.5 border border-slate-200 flex-shrink-0 shadow-2xs"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h1 className="font-black text-xs text-slate-900 tracking-tight leading-none truncate">
                                {brandName}
                            </h1>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                                    Admin Suite
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items Grouped with Auto-Fold Accordions */}
                    <nav className="space-y-2 pt-1">
                        {navSections.map((sec, idx) => {
                            // Expandable Accordion Menu Group
                            if (sec.key && sec.items) {
                                const isGroupActive = sec.items.some(isItemActive) || (sec.key === 'settings' && typeof window !== 'undefined' && window.location.pathname === '/admin/settings');
                                const isOpen = openMenu === sec.key;
                                const Icon = sec.icon;

                                return (
                                    <div key={sec.key} className="space-y-1">
                                        <div className="px-3 pt-0.5 pb-0.5">
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                                                {sec.group}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleMenu(sec.key)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 group cursor-pointer ${
                                                isGroupActive 
                                                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200/60 shadow-2xs' 
                                                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50 font-semibold'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                                    isGroupActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                }`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">{sec.label}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                                    isGroupActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700'
                                                }`}>
                                                    {sec.items.length}
                                                </span>
                                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                                    isOpen ? 'rotate-180 text-blue-600' : ''
                                                }`} />
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="ml-3 pl-3 border-l-2 border-slate-200/80 space-y-0.5 pt-1 animate-fadeIn">
                                                {sec.items.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isActive = isItemActive(sub);
                                                    return (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all group ${
                                                                isActive
                                                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 font-medium'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <SubIcon className={`w-3.5 h-3.5 flex-shrink-0 ${
                                                                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                                                                }`} />
                                                                <span className="truncate">{sub.label}</span>
                                                            </div>
                                                            {isActive && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Standalone Direct Link Section
                            return (
                                <div key={sec.group || idx} className="space-y-1">
                                    <div className="px-3 pt-0.5 pb-0.5">
                                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                                            {sec.group}
                                        </span>
                                    </div>

                                    {sec.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = isItemActive(item);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 group ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                        : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 font-medium'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                                                    }`} />
                                                    <span className="truncate">{item.label}</span>
                                                </div>
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom User Area */}
                <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 space-y-2 flex-shrink-0">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 transition-all shadow-2xs group"
                    >
                        <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
                            <span>View Live Website</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                    </Link>

                    <div className="flex items-center justify-between pt-1 px-1">
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-2.5 min-w-0 flex-1 p-1 -ml-1 rounded-xl hover:bg-white transition-all group"
                            title="Edit Profile"
                        >
                            {auth.user?.avatar ? (
                                <img 
                                    src={auth.user.avatar} 
                                    alt={auth.user?.name} 
                                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0" 
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                                    {(auth.user?.name || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate leading-tight">{auth.user?.name}</p>
                                <p className="text-[10px] text-slate-400 truncate capitalize">{auth.user?.role || 'Administrator'}</p>
                            </div>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Drawer Backdrop & Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 overflow-hidden">
                        
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                                {siteSettings.site_logo ? (
                                    <img src={siteSettings.site_logo} alt={brandName} className="w-7 h-7 object-contain" />
                                ) : (
                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                        IT
                                    </div>
                                )}
                                <span className="font-bold text-sm text-slate-900 truncate">{brandName}</span>
                            </div>
                            <button 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Navigation List with Auto-Fold Accordions */}
                        <div className="overflow-y-auto flex-1 py-3 space-y-3">
                            {navSections.map((sec, idx) => {
                                if (sec.key && sec.items) {
                                    const isGroupActive = sec.items.some(isItemActive) || (sec.key === 'settings' && typeof window !== 'undefined' && window.location.pathname === '/admin/settings');
                                    const isOpen = openMenu === sec.key;
                                    const Icon = sec.icon;

                                    return (
                                        <div key={`mobile-${sec.key}`} className="space-y-1">
                                            <div className="px-2 pb-0.5">
                                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                                                    {sec.group}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleMenu(sec.key)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    isGroupActive 
                                                        ? 'bg-blue-50 text-blue-800' 
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Icon className="w-4 h-4 text-blue-600" />
                                                    <span>{sec.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500">
                                                        {sec.items.length}
                                                    </span>
                                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                                        isOpen ? 'rotate-180 text-blue-600' : ''
                                                    }`} />
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-0.5 pt-1">
                                                    {sec.items.map((sub) => {
                                                        const SubIcon = sub.icon;
                                                        const isActive = isItemActive(sub);
                                                        return (
                                                            <Link
                                                                key={sub.href}
                                                                href={sub.href}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                                                                    isActive 
                                                                        ? 'bg-blue-600 text-white font-bold' 
                                                                        : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                            >
                                                                <SubIcon className="w-3.5 h-3.5" />
                                                                <span className="truncate">{sub.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={`mobile-${sec.group || idx}`} className="space-y-1">
                                        <div className="px-2 pb-0.5">
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                                                {sec.group}
                                            </span>
                                        </div>

                                        {sec.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = isItemActive(item);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                                                        isActive 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="truncate">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                            <div className="pt-2 border-t border-slate-100">
                                <Link
                                    href="/admin/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                                        isItemActive({ href: '/admin/profile' }) ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>My Profile</span>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Bottom Area */}
                        <div className="pt-3 border-t border-slate-100 flex-shrink-0">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Admin Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f0f4fa]">
                
                {/* Top Header Bar */}
                <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-2xs">
                    
                    {/* Left: Mobile Toggle & Page Title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div>
                            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                                {pageTitle}
                            </h2>
                        </div>
                    </div>

                    {/* Right: Actions & User Info */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/admin/profile"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition-colors"
                        >
                            {auth.user?.avatar ? (
                                <img 
                                    src={auth.user.avatar} 
                                    alt={auth.user?.name} 
                                    className="w-5 h-5 rounded-full object-cover border border-slate-300" 
                                />
                            ) : (
                                <User className="w-3.5 h-3.5 text-blue-600" />
                            )}
                            <span className="hidden sm:inline">{auth.user?.name || 'My Profile'}</span>
                            <span className="sm:hidden">Profile</span>
                        </Link>

                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Website</span>
                        </Link>
                    </div>
                </header>

                {/* Notification Alerts */}
                {flash.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-semibold shadow-2xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash.error && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-800 text-xs font-semibold shadow-2xs">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
