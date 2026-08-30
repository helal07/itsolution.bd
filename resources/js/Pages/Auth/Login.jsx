import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    CheckCircle2
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Sign In">
            {/* Top Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.05] border border-white/10 mb-6">
                <div className="py-2 text-center text-xs font-bold text-white bg-primary rounded-xl shadow-sm">
                    Sign In
                </div>
                <Link
                    href={route('register')}
                    className="py-2 text-center text-xs font-semibold text-neutral-400 hover:text-white rounded-xl transition-colors"
                >
                    Create Account
                </Link>
            </div>

            {/* Status Feedback */}
            {status && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{status}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
                
                {/* Email Field */}
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
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.email 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary-light'
                            }`}
                            autoComplete="username"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 !text-red-400 text-xs" />
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label 
                            htmlFor="password" 
                            className="block text-xs font-semibold text-neutral-300"
                        >
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-primary-light hover:text-white transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.password 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary-light'
                            }`}
                            autoComplete="current-password"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/40"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors">
                            Remember me on this device
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary via-primary-hover to-primary-dark hover:from-primary-hover hover:to-primary text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In to Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Bottom link to Register */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-neutral-400">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-primary-light hover:text-white transition-colors ml-1"
                    >
                        Create one &rarr;
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
