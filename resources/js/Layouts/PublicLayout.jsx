import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import SupportChatBot from '../Components/SupportChatBot';
import CookieConsent from '../Components/CookieConsent';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function PublicLayout({ children, title }) {
    const { flash = {} } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-primary selection:text-white relative">
            <Head title={title ? `${title} — IT SOLUTIONS` : 'IT SOLUTIONS — Next-Gen Software, Apps & Web Solutions'} />

            {/* Sticky Header */}
            <Header />

            {/* Global Flash Alerts */}
            {flash.success && (
                <div className="site-container mt-4 w-full animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className="site-container mt-4 w-full animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium shadow-sm">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Page Body */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Global Floating AI Support Chatbot (bottom-right) */}
            <SupportChatBot />

            {/* Global Cookie Consent Banner (bottom-left) */}
            <CookieConsent />

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
