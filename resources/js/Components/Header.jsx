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
    ShieldCheck, 
    Layers, 
    LogOut, 
    LayoutDashboard, 
    ShoppingBag,
    ArrowRight
} from 'lucide-react';

export default function Header() {
    const { auth, menuCategories = [], siteSettings = {} } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    const brandName = siteSettings.site_name || 'IT SOLUTIONS';
    const brandTagline = siteSettings.site_tagline || 'Software & Services';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setServicesDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCategoryIcon = (slug) => {
        switch (slug) {
            case 'apps':
                return <Smartphone className="w-5 h-5 text-primary" />;
            case 'website':
                return <Globe className="w-5 h-5 text-primary" />;
            case 'software':
                return <Cpu className="w-5 h-5 text-primary" />;
            default:
                return <Layers className="w-5 h-5 text-primary" />;
        }
    };

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
                    : 'bg-white border-b border-neutral-100 py-4'
            }`}
        >
            <div className="site-container">
                <div className="flex items-center justify-between gap-4">
                    
                    {/* Left: Brand Logo */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            {siteSettings.site_logo ? (
                                <img 
                                    src={siteSettings.site_logo} 
                                    alt={brandName} 
                                    className="w-10 h-10 object-contain rounded-xl p-0.5 border border-neutral-200 bg-white group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-dark via-primary to-primary-light flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="font-heading font-extrabold text-xl tracking-tight text-neutral-900 leading-none truncate max-w-[220px]">
                                    {brandName}
                                </span>
                                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 mt-0.5 truncate max-w-[220px]">
                                    {brandTagline}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link 
                                href="/" 
                                className="px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-50"
                            >
                                Home
                            </Link>

                            {/* Our Services Mega Menu Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                                    onMouseEnter={() => setServicesDropdownOpen(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-50"
                                >
                                    <span>Our Services</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
                                </button>

                                {/* Mega Menu Panel */}
                                {servicesDropdownOpen && (
                                    <div 
                                        onMouseLeave={() => setServicesDropdownOpen(false)}
                                        className="absolute top-full left-0 w-[680px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-neutral-100 p-6 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                                    >
                                        {menuCategories.map((category) => (
                                            <div key={category.id} className="space-y-3">
                                                <Link 
                                                    href={`/services/${category.slug}`}
                                                    onClick={() => setServicesDropdownOpen(false)}
                                                    className="flex items-center gap-2 pb-2 border-b border-neutral-100 group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                                        {getCategoryIcon(category.slug)}
                                                    </div>
                                                    <span className="font-heading font-bold text-sm text-neutral-900 group-hover:text-primary transition-colors">
                                                        {category.name}
                                                    </span>
                                                </Link>

                                                <ul className="space-y-1.5">
                                                    {(category.published_items || []).slice(0, 4).map((item) => (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={`/services/${category.slug}/${item.slug}`}
                                                                onClick={() => setServicesDropdownOpen(false)}
                                                                className="block text-xs text-neutral-600 hover:text-primary hover:translate-x-1 transition-all py-1 font-medium"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link 
                                                    href={`/services/${category.slug}`}
                                                    onClick={() => setServicesDropdownOpen(false)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark pt-1"
                                                >
                                                    View All {category.name} <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link 
                                href="/portfolio" 
                                className="px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-50"
                            >
                                Portfolio
                            </Link>

                            <Link 
                                href="/clients" 
                                className="px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-50"
                            >
                                Clients
                            </Link>
                        </nav>
                    </div>

                    {/* Middle: Live Search Bar */}
                    <div className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
                        <SearchBar />
                    </div>

                    {/* Right: User Auth & Free Quote CTA */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        
                        {/* Admin Panel Direct Shortcut Button */}
                        {auth.user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="hidden sm:inline">Admin Panel</span>
                                <span className="sm:hidden">Admin</span>
                            </Link>
                        )}

                        {/* User Account / Profile Icon Button -> Direct Link to Profile */}
                        {auth.user ? (
                            <Link
                                href="/profile"
                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary-dark via-primary to-primary-light text-white hover:ring-2 hover:ring-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm relative focus:outline-none"
                                aria-label="User Profile"
                                title={`Profile & Dashboard: ${auth.user.name}`}
                            >
                                <UserIcon className="w-5 h-5 text-white" />
                                {/* Online indicator dot */}
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </Link>
                        ) : (
                            <Link 
                                href="/login" 
                                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-primary transition-colors"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Free Quote CTA Button (Primary Action) */}
                        <Link 
                            href="/get-a-quote" 
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wide shadow-xs shadow-primary/25 hover:shadow-md hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
                        >
                            Quote
                        </Link>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden pt-4 pb-6 border-t border-neutral-100 mt-3 space-y-4 max-h-[calc(100dvh-5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4">
                        <div className="sm:hidden pb-2">
                            <SearchBar onSelect={() => setMobileMenuOpen(false)} />
                        </div>

                        <div className="space-y-1">
                            <Link 
                                href="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
                            >
                                Home
                            </Link>
                            
                            <div className="px-3.5 py-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Our Services</span>
                                <div className="mt-2 space-y-3 pl-1">
                                    {menuCategories.map((c) => (
                                        <div key={c.id} className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
                                            <Link 
                                                href={`/services/${c.slug}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-2 text-sm font-bold text-neutral-800 hover:text-primary py-1"
                                            >
                                                {getCategoryIcon(c.slug)}
                                                <span>{c.name}</span>
                                            </Link>
                                            <div className="pl-6 space-y-1 mt-1 border-l-2 border-primary/20 ml-2">
                                                {(c.published_items || []).slice(0, 3).map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={`/services/${c.slug}/${item.slug}`}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block text-xs text-neutral-600 hover:text-primary py-1 font-medium"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link 
                                href="/portfolio" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
                            >
                                Portfolio
                            </Link>
                            
                            <Link 
                                href="/clients" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
                            >
                                Clients
                            </Link>

                            <Link 
                                href="/get-a-quote" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-primary hover:bg-blue-50 transition-colors"
                            >
                                Request a Free Quote
                            </Link>
                        </div>

                        {auth.user ? (
                            <div className="pt-3 border-t border-neutral-100 space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-dark via-primary to-primary-light text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-neutral-900 truncate leading-tight">{auth.user.name}</p>
                                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">{auth.user.email}</p>
                                    </div>
                                </div>
                                {auth.user?.role === 'admin' && (
                                    <Link 
                                        href="/admin" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-xs"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>Admin Panel</span>
                                    </Link>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                    <Link 
                                        href="/profile" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        href="/logout" 
                                        method="post" 
                                        as="button" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center py-2.5 text-xs font-semibold text-danger bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-neutral-100 flex gap-2">
                                <Link 
                                    href="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2.5 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
