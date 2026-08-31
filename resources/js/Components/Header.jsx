import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SearchBar from './SearchBar';
import { 
    Menu, 
    X, 
    ChevronDown, 
    User as UserIcon, 
    Smartphone, 
    Globe, 
    Cpu, 
    Sparkles, 
    Layers, 
    LogOut, 
    LayoutDashboard, 
    Home as HomeIcon,
    Briefcase,
    Users,
    ArrowRight,
    Phone,
    MessageCircle,
    Search
} from 'lucide-react';

export default function Header() {
    const { auth, menuCategories = [], siteSettings = {} } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
    const dropdownRef = useRef(null);

    const brandName = siteSettings.site_name || 'IT SOLUTIONS';
    const brandTagline = siteSettings.site_tagline || 'Software & Services';
    const hotline = siteSettings.contact_phone || '+880 1800-000000';
    const whatsapp = siteSettings.whatsapp_number || '+880 1800-000000';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body background scrolling when mobile menu is active
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // Close desktop dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setServicesDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCategoryIcon = (slug) => {
        switch (slug) {
            case 'apps':
                return <Smartphone className="w-4 h-4 text-blue-600" />;
            case 'website':
                return <Globe className="w-4 h-4 text-indigo-600" />;
            case 'software':
                return <Cpu className="w-4 h-4 text-emerald-600" />;
            default:
                return <Layers className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 sm:py-3 border-b border-slate-200/80' 
                    : 'bg-white border-b border-slate-100 py-3 sm:py-4'
            }`}
        >
            <div className="site-container">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    
                    {/* Left: Brand Identity */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link 
                            href="/" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0"
                        >
                            {siteSettings.site_logo ? (
                                <img 
                                    src={siteSettings.site_logo} 
                                    alt={brandName} 
                                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl p-0.5 border border-slate-200 bg-white group-hover:scale-105 transition-transform flex-shrink-0 shadow-2xs"
                                />
                            ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-slate-900 leading-none truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[240px]">
                                    {brandName}
                                </span>
                                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-400 mt-0.5 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[240px] hidden xs:block">
                                    {brandTagline}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link 
                                href="/" 
                                className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors rounded-xl"
                            >
                                Home
                            </Link>

                            {/* Our Services Mega Menu Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                                    onMouseEnter={() => setServicesDropdownOpen(true)}
                                    className="flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer"
                                >
                                    <span>Services & Solutions</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                </button>

                                {/* Mega Menu Panel */}
                                {servicesDropdownOpen && (
                                    <div 
                                        onMouseLeave={() => setServicesDropdownOpen(false)}
                                        className="absolute top-full left-0 w-[650px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 mt-2 grid grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                                    >
                                        {menuCategories.map((category) => (
                                            <div key={category.id} className="space-y-2.5">
                                                <Link 
                                                    href={`/services/${category.slug}`}
                                                    onClick={() => setServicesDropdownOpen(false)}
                                                    className="flex items-center gap-2 pb-2 border-b border-slate-100 group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                                        {getCategoryIcon(category.slug)}
                                                    </div>
                                                    <span className="font-heading font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {category.name}
                                                    </span>
                                                </Link>

                                                <ul className="space-y-1">
                                                    {(category.published_items || []).slice(0, 4).map((item) => (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={`/services/${category.slug}/${item.slug}`}
                                                                onClick={() => setServicesDropdownOpen(false)}
                                                                className="block text-[11px] text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all py-0.5 font-medium line-clamp-1"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link 
                                                    href={`/services/${category.slug}`}
                                                    onClick={() => setServicesDropdownOpen(false)}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 pt-1"
                                                >
                                                    All {category.name} <ArrowRight className="w-2.5 h-2.5" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link 
                                href="/portfolio" 
                                className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors rounded-xl"
                            >
                                Portfolio
                            </Link>

                            <Link 
                                href="/clients" 
                                className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors rounded-xl"
                            >
                                Clients
                            </Link>
                        </nav>
                    </div>

                    {/* Middle: Desktop Search Bar */}
                    <div className="flex-1 max-w-xs hidden lg:block">
                        <SearchBar />
                    </div>

                    {/* Right: Actions & Mobile Hamburger */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                        
                        {/* Admin Shortcut Button */}
                        {auth?.user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}

                        {/* User Account / Profile */}
                        {auth?.user ? (
                            <Link
                                href="/profile"
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 transition-all shadow-2xs relative flex-shrink-0"
                                aria-label="User Profile"
                                title={`Profile: ${auth.user.name}`}
                            >
                                <UserIcon className="w-4 h-4 text-white" />
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </Link>
                        ) : (
                            <Link 
                                href="/login" 
                                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <UserIcon className="w-3.5 h-3.5" />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Free Quote Button */}
                        <Link 
                            href="/get-a-quote" 
                            className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all whitespace-nowrap"
                        >
                            <Sparkles className="w-3 h-3 hidden xs:block" />
                            <span>Quote</span>
                        </Link>

                        {/* Prominent Mobile Hamburger Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                                mobileMenuOpen
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80 active:scale-95'
                            }`}
                            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Full Navigation Overlay / Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[57px] sm:top-[65px] bottom-0 z-50 bg-white flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200 border-t border-slate-200 shadow-2xl">
                    <div className="p-4 sm:p-6 space-y-4 flex-1">
                        
                        {/* Mobile Search */}
                        <div className="pb-1">
                            <SearchBar onSelect={() => setMobileMenuOpen(false)} />
                        </div>

                        {/* Main Nav Links */}
                        <div className="space-y-1">
                            <Link 
                                href="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                                <HomeIcon className="w-4 h-4 text-blue-600" />
                                <span>Home</span>
                            </Link>

                            {/* Collapsible Services Section */}
                            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-4 h-4 text-blue-600" />
                                        <span>Our Services & Solutions</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileServicesOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                </button>

                                {mobileServicesOpen && (
                                    <div className="p-3 pt-0 space-y-2 border-t border-slate-200/50">
                                        {menuCategories.map((c) => (
                                            <div key={c.id} className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-2xs space-y-1.5">
                                                <Link 
                                                    href={`/services/${c.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center justify-between text-xs font-bold text-slate-900 hover:text-blue-600 py-0.5"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {getCategoryIcon(c.slug)}
                                                        <span>{c.name}</span>
                                                    </div>
                                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                                </Link>
                                                
                                                <div className="pl-6 space-y-1 border-l-2 border-blue-500/20 ml-2">
                                                    {(c.published_items || []).slice(0, 3).map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={`/services/${c.slug}/${item.slug}`}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="block text-[11px] text-slate-600 hover:text-blue-600 py-0.5 font-medium truncate"
                                                        >
                                                            • {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <Link 
                                            href="/services" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-center py-2 text-xs font-bold text-blue-600 hover:underline"
                                        >
                                            View All Services & Packages →
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link 
                                href="/portfolio" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                                <Briefcase className="w-4 h-4 text-blue-600" />
                                <span>Portfolio Showcase</span>
                            </Link>
                            
                            <Link 
                                href="/clients" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>Clients & Testimonials</span>
                            </Link>

                            <Link 
                                href="/get-a-quote" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                    <span>Interactive Quote Builder</span>
                                </div>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* User Account / Auth Section */}
                        {auth?.user ? (
                            <div className="pt-2 space-y-2 border-t border-slate-100">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{auth.user.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono truncate">{auth.user.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Link 
                                        href="/profile" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Dashboard / Orders
                                    </Link>
                                    <Link 
                                        href="/logout" 
                                        method="post" 
                                        as="button" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Log Out
                                    </Link>
                                </div>

                                {auth.user?.role === 'admin' && (
                                    <Link 
                                        href="/admin" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                                        <span>Go to Admin Dashboard</span>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="pt-2 space-y-2 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2">
                                    <Link 
                                        href="/login" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-2xs transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Contact Hotline in Drawer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <a href={`tel:${hotline}`} className="flex items-center gap-1.5 font-bold hover:text-blue-600">
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-mono text-[11px]">{hotline}</span>
                        </a>
                        <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px]">WhatsApp</span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
