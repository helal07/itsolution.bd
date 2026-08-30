import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck, CheckCircle2, ArrowRight, LogOut, RefreshCw } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout title="Verify Email">
            {/* Header / Intro */}
            <div className="space-y-1.5 mb-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-1">
                    <MailCheck className="w-3.5 h-3.5" />
                    <span>Verification</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Check Inbox
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                    We've sent an activation link to your registered email address.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>A new verification link has been sent to your email.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {processing ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Resending email...</span>
                        </>
                    ) : (
                        <>
                            <span>Resend Verification Link</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-7 pt-5 border-t border-white/10 text-center">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-xs font-semibold text-neutral-400 hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                </Link>
            </div>
        </GuestLayout>
    );
}
