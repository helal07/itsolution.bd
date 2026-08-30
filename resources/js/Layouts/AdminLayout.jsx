import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Layers, 
    FolderGit2, 
    MessageSquare, 
    ShoppingBag, 
    Building2, 
    ArrowLeft, 
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
    ChevronRight,
    Sparkles,
    Bot,
    User
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash = {}, siteSettings = {} } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const brandName = siteSettings.site_name || 'IT SOLUTIONS';

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders & Sales', icon: ShoppingBag },
        { href: '/admin/quotes', label: 'Quotations', icon: MessageSquare },
        { href: '/admin/chat-questions', label: 'Live Chat & Q&A', icon: Bot },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/clients', label: 'Clients & CRM', icon: Building2 },
        { href: '/admin/items', label: 'Services & Products', icon: Layers },
        { href: '/admin/reorders', label: 'Subscriptions', icon: RefreshCw },
        { href: '/admin/portfolios', label: 'Portfolio', icon: FolderGit2 },
        { href: '/admin/reviews', label: 'Reviews', icon: Star },
        { href: '/admin/employees', label: 'Staff Team', icon: Users },
        { href: '/admin/settings', label: 'Site Settings', icon: Sliders },
    ];

    const activeItem = navItems.find(i => currentPath === i.href || (i.href !== '/admin' && currentPath.startsWith(i.href)));
    const pageTitle = title || activeItem?.label || 'Dashboard';

    return (
        <div className="min-h-screen flex bg-[#f0f4fa] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            <Head title={title ? `${title} — ${brandName} Admin` : `Admin — ${brandName}`} />

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between flex-shrink-0 hidden lg:flex min-h-screen sticky top-0 z-40 shadow-xs">
                <div className="p-4 space-y-4">
                    
                    {/* Brand Header */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100">
                        {siteSettings.site_logo ? (
                            <img 
                                src={siteSettings.site_logo} 
                                alt={brandName} 
                                className="w-9 h-9 rounded-xl object-contain bg-white p-0.5 border border-slate-200 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs flex-shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="font-black text-sm text-slate-900 tracking-tight leading-none truncate">
                                {brandName}
                            </h1>
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mt-0.5">
                                Executive Admin
                            </span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 pt-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
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
                    </nav>
                </div>

                {/* Bottom User Area */}
                <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 transition-all shadow-2xs"
                    >
                        <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Live Website</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
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
                                <p className="text-[10px] text-slate-400 truncate">Edit Profile</p>
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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2 min-w-0">
                                    {siteSettings.site_logo ? (
                                        <img src={siteSettings.site_logo} alt={brandName} className="w-7 h-7 object-contain" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                                            IT
                                        </div>
                                    )}
                                    <span className="font-bold text-sm text-slate-900 truncate">{brandName}</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                                                isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <Link
                                href="/admin/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                                    currentPath === '/admin/profile' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                <span>My Profile</span>
                            </Link>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
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
                            <span>My Profile</span>
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
