import React, { useState, useEffect, useRef } from 'react';
import { router, Link } from '@inertiajs/react';
import { Search, X, Smartphone, Globe, Cpu, FolderGit2, ArrowRight, Loader2, Command } from 'lucide-react';

export default function SearchBar({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ items: [], portfolios: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Global shortcut: Ctrl+K or Cmd+K to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({ items: [], portfolios: [] });
            setIsOpen(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setIsOpen(true);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            if (onSelect) onSelect();
            router.get(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleItemClick = () => {
        setIsOpen(false);
        setQuery('');
        if (onSelect) onSelect();
    };

    const hasResults = results.items.length > 0 || results.portfolios.length > 0;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    placeholder="Search apps, software..."
                    className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-neutral-900 placeholder-neutral-400 rounded-full border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                
                {/* Clear Button or Ctrl+K shortcut badge */}
                {query ? (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        className="absolute right-3 text-neutral-400 hover:text-neutral-600 p-0.5"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <div className="absolute right-2.5 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-neutral-200/70 text-[10px] font-mono font-bold text-neutral-500 pointer-events-none">
                        <span>Ctrl</span>
                        <span>K</span>
                    </div>
                )}
            </form>

            {/* Typeahead Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    {hasResults ? (
                        <div className="p-3 space-y-3 max-h-[380px] overflow-y-auto">
                            {/* Items Section */}
                            {results.items.length > 0 && (
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 block mb-1">
                                        Services & Products
                                    </span>
                                    <div className="space-y-1">
                                        {results.items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/services/${item.category?.slug || 'services'}/${item.slug}`}
                                                onClick={handleItemClick}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/60 transition-colors group"
                                            >
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.name}
                                                    className="w-8 h-8 rounded-lg object-cover bg-neutral-100"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-neutral-900 truncate group-hover:text-primary transition-colors">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 truncate">
                                                        {item.short_description}
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                                                    View &rarr;
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Portfolios Section */}
                            {results.portfolios.length > 0 && (
                                <div className="border-t border-neutral-100 pt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 block mb-1">
                                        Portfolio Case Studies
                                    </span>
                                    <div className="space-y-1">
                                        {results.portfolios.map((portfolio) => (
                                            <Link
                                                key={portfolio.id}
                                                href={`/portfolio/${portfolio.slug}`}
                                                onClick={handleItemClick}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/60 transition-colors group"
                                            >
                                                <img
                                                    src={portfolio.cover_image}
                                                    alt={portfolio.title}
                                                    className="w-8 h-8 rounded-lg object-cover bg-neutral-100"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-neutral-900 truncate group-hover:text-primary transition-colors">
                                                        {portfolio.title}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-neutral-400 capitalize">
                                                        {portfolio.type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* View all button */}
                            <div className="pt-2 border-t border-neutral-100 text-center">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 py-1"
                                >
                                    See all results for "{query}" <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-neutral-500">
                            <p className="text-xs font-medium">No results found for "{query}"</p>
                            <p className="text-[11px] text-neutral-400 mt-1">Try searching for Apps, POS, Ecommerce, or Security</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
