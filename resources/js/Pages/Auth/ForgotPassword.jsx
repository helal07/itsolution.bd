import React from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, KeyRound, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout title="Reset Password">
            {/* Header / Intro */}
            <div className="space-y-1.5 mb-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Recovery</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                    Enter your email address to receive a secure recovery link.
                </p>
            </div>

            {/* Status Alert */}
            {status && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Work Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="name@company.com"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:ring-2 focus:ring-primary/20 ${
                                errors.email 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary'
                            }`}
                            autoComplete="email"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 !text-red-400 text-xs" />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Sending link...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Reset Link</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Back to Login Link */}
            <div className="mt-7 pt-5 border-t border-white/10 text-center">
                <Link
                    href={route('login')}
                    className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to sign in</span>
                </Link>
            </div>
        </GuestLayout>
    );
}
