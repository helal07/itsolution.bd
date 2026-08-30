import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export default function ActionDropdown({ label = 'Actions', align = 'right', children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: '0px', bottom: 'auto', left: 'auto', right: '12px', openUp: false });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 220 && rect.top > 220;
            const menuWidth = 192; // w-48 is 12rem = 192px

            const safeRight = Math.max(12, Math.min(window.innerWidth - 20, window.innerWidth - rect.right));
            const safeLeft = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.left));

            setCoords({
                top: openUp ? 'auto' : `${rect.bottom + 6}px`,
                bottom: openUp ? `${window.innerHeight - rect.top + 6}px` : 'auto',
                right: align === 'right' ? `${safeRight}px` : 'auto',
                left: align === 'left' ? `${safeLeft}px` : 'auto',
                openUp,
            });
        }
    };

    const toggleOpen = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isOpen) {
            updatePosition();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScrollOrResize = () => {
            if (isOpen) {
                updatePosition();
            }
        };

        const handleClickOutside = (event) => {
            if (
                buttonRef.current && !buttonRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('scroll', handleScrollOrResize, true);
            window.addEventListener('resize', handleScrollOrResize);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="inline-block text-left relative">
            {/* Exact Pill Button matching screenshot */}
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleOpen}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-sky-50 text-[#0099ff] hover:text-[#0088ee] border border-[#0099ff] text-xs font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0099ff]/30 active:scale-95 cursor-pointer select-none whitespace-nowrap"
            >
                <span>{label}</span>
                <ChevronDown className={`w-3 h-3 fill-current transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Portal Dropdown Menu attached to document.body so it NEVER clips */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        bottom: coords.bottom,
                        right: coords.right,
                        left: coords.left,
                        zIndex: 99999,
                    }}
                    onClick={() => setIsOpen(false)}
                    className="w-48 max-w-[calc(100vw-24px)] rounded-xl bg-white border border-blue-100 shadow-2xl shadow-slate-900/25 py-1 text-xs divide-y divide-slate-100 text-slate-800 animate-in fade-in zoom-in-95 duration-100"
                >
                    {children}
                </div>,
                document.body
            )}
        </div>
    );
}

export function ActionItem({ onClick, icon: Icon, children, label, danger = false, variant = '', className = '' }) {
    const isDanger = danger || variant === 'danger';
    const content = children || label;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer select-none ${
                isDanger 
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
            } ${className}`}
        >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span className="truncate">{content}</span>
        </button>
    );
}
