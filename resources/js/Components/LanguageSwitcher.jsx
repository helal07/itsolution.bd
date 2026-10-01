import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }) {
    const { locale, switchLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        {
            code: 'bn',
            label: 'বাংলা',
            sublabel: 'Bengali',
            flag: 'https://flagcdn.com/w20/bd.png',
        },
        {
            code: 'en',
            label: 'English',
            sublabel: 'ইংরেজি',
            flag: 'https://flagcdn.com/w20/us.png',
        },
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        switchLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-all border border-slate-200/70 shadow-2xs active:scale-95 cursor-pointer"
                aria-expanded={isOpen}
                title="Change Website Language / ভাষা পরিবর্তন করুন"
            >
                <img 
                    src={currentLang.flag} 
                    alt={currentLang.label} 
                    className="w-4 h-3 object-cover rounded-xs shadow-2xs flex-shrink-0" 
                />
                <span className="font-semibold">{currentLang.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Language / ভাষা
                    </div>
                    {languages.map((lang) => {
                        const isSelected = lang.code === locale;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                                    isSelected 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <img 
                                        src={lang.flag} 
                                        alt={lang.label} 
                                        className="w-4 h-3 object-cover rounded-xs shadow-2xs flex-shrink-0" 
                                    />
                                    <div>
                                        <div className="leading-tight">{lang.label}</div>
                                        <span className="text-[10px] text-slate-400 font-normal">{lang.sublabel}</span>
                                    </div>
                                </div>
                                {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-blue-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
