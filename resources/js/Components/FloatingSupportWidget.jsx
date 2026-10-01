import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

export default function FloatingSupportWidget() {
    const { siteSettings = {} } = usePage().props;
    const { t } = useLanguage();
    const whatsapp = siteSettings.whatsapp_number || siteSettings.contact_phone || '+880 1800-000000';
    const cleanPhone = whatsapp.replace(/[^0-9]/g, '');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 font-sans">
            
            {/* Popover Bubble */}
            {isOpen && (
                <div className="w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-slate-900 leading-tight">{t('floatingTitle')}</h4>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {t('floatingOnline')}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="py-3 text-xs text-slate-600 space-y-1.5">
                        <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                            {t('floatingGreeting')}
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I would like to inquire about your website & software packages.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>{t('floatingBtn')}</span>
                    </a>
                </div>
            )}

            {/* Floating Action Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative group p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ring-4 ring-emerald-500/20"
                aria-label="Contact on WhatsApp"
            >
                {/* Pulsing ring */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-ping" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                
                <MessageCircle className="w-6 h-6" />
                
                {/* Hover Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
                    {t('floatingTooltip')}
                </span>
            </button>
        </div>
    );
}
