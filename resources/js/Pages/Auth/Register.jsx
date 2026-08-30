import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    CheckCircle2,
    Check
} from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const hasMinLength = data.password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(data.password);
    const hasNumber = /[0-9]/.test(data.password);

    const calculateStrength = () => {
        let score = 0;
        if (hasMinLength) score++;
        if (hasUpperCase) score++;
        if (hasNumber) score++;
        if (/[^A-Za-z0-9]/.test(data.password)) score++;
        return score;
    };

    const strengthScore = calculateStrength();
    const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-neutral-600', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

    const passwordsMatch = Boolean(data.password && data.password_confirmation && data.password === data.password_confirmation);

    return (
        <GuestLayout title="Create Account">
            {/* Top Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.05] border border-white/10 mb-6">
                <Link
                    href={route('login')}
                    className="py-2 text-center text-xs font-semibold text-neutral-400 hover:text-white rounded-xl transition-colors"
                >
                    Sign In
                </Link>
                <div className="py-2 text-center text-xs font-bold text-white bg-primary rounded-xl shadow-sm">
                    Create Account
                </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                    <label 
                        htmlFor="name" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            placeholder="Alex Morgan"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.name 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary-light'
                            }`}
                            autoComplete="name"
                            autoFocus
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1 !text-red-400 text-xs" />
                </div>

                {/* Email */}
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
                            placeholder="alex@company.com"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.email 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary-light'
                            }`}
                            autoComplete="username"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1 !text-red-400 text-xs" />
                </div>

                {/* Password */}
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Password
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
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.password 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : 'border-white/10 focus:border-primary-light'
                            }`}
                            autoComplete="new-password"
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

                    {/* Password Strength & Criteria Pills */}
                    {data.password && (
                        <div className="mt-2 space-y-1.5 animate-in fade-in">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-neutral-400">Security strength:</span>
                                <span className="font-bold text-neutral-200">{strengthLabels[strengthScore]}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            strengthScore >= level ? strengthColors[strengthScore] : 'bg-white/10'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 pt-0.5 text-[10px] text-neutral-400">
                                <span className={`flex items-center gap-0.5 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}`}>
                                    {hasMinLength ? <Check className="w-3 h-3" /> : '•'} 8+ chars
                                </span>
                                <span className={`flex items-center gap-0.5 ${hasUpperCase ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}`}>
                                    {hasUpperCase ? <Check className="w-3 h-3" /> : '•'} Uppercase
                                </span>
                                <span className={`flex items-center gap-0.5 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}`}>
                                    {hasNumber ? <Check className="w-3 h-3" /> : '•'} Number
                                </span>
                            </div>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-1 !text-red-400 text-xs" />
                </div>

                {/* Confirm Password */}
                <div>
                    <label 
                        htmlFor="password_confirmation" 
                        className="block text-xs font-semibold text-neutral-300 mb-1.5"
                    >
                        Confirm Password
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
                            placeholder="Re-enter password"
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-white bg-white/[0.04] placeholder:text-neutral-500 transition-all shadow-inner focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 ${
                                errors.password_confirmation 
                                    ? 'border-red-500/60 focus:border-red-500' 
                                    : passwordsMatch
                                    ? 'border-emerald-500/60'
                                    : 'border-white/10 focus:border-primary-light'
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
                    <InputError message={errors.password_confirmation} className="mt-1 !text-red-400 text-xs" />
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
                                <span>Creating workspace...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-neutral-400">
                    Already registered?{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-primary-light hover:text-white transition-colors ml-1"
                    >
                        Sign in &rarr;
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
