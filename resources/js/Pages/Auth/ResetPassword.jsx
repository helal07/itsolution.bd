import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;

    return (
        <GuestLayout title="Set New Password">
            {/* Header / Intro */}
            <div className="space-y-1.5 mb-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Security</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    New Password
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                    Set a strong new password for your client account.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Account Email
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
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:ring-2 focus:ring-primary/20 ${
                                errors.email 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary'
                            }`}
                            autoComplete="username"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 !text-red-400 text-xs" />
                </div>

                {/* Password Field */}
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Min. 8 characters"
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:ring-2 focus:ring-primary/20 ${
                                errors.password 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary'
                            }`}
                            autoComplete="new-password"
                            autoFocus
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white focus:outline-none transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5 !text-red-400 text-xs" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label 
                        htmlFor="password_confirmation" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Re-enter new password"
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:ring-2 focus:ring-primary/20 ${
                                errors.password_confirmation 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : passwordsMatch
                                    ? 'border-emerald-500/60'
                                    : 'border-white/10 focus:border-primary'
                            }`}
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5">
                            {passwordsMatch && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-neutral-400 hover:text-white focus:outline-none transition-colors"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1.5 !text-red-400 text-xs" />
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
                                <span>Updating password...</span>
                            </>
                        ) : (
                            <>
                                <span>Update Password</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

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
