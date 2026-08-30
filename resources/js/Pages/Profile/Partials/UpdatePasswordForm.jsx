import React, { useState, useRef } from 'react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Lock, Eye, EyeOff, Check, KeyRound, ShieldCheck } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <KeyRound className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-heading font-black text-base text-neutral-900">
                        Security & Password
                    </h2>
                    <p className="text-xs text-neutral-500">
                        Update your password to protect your app licenses and credentials.
                    </p>
                </div>
            </div>

            <form onSubmit={updatePassword} className="mt-5 space-y-4">
                {/* Current Password */}
                <div>
                    <label htmlFor="current_password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showCurrentPassword ? 'text' : 'password'}
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-neutral-900 bg-neutral-50/60 focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-purple-500/20 ${
                                errors.current_password 
                                    ? 'border-red-400 focus:border-red-500' 
                                    : 'border-neutral-200 focus:border-purple-600'
                            }`}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors"
                        >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.current_password} className="mt-1 !text-red-500 text-xs" />
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-neutral-900 bg-neutral-50/60 focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-purple-500/20 ${
                                errors.password 
                                    ? 'border-red-400 focus:border-red-500' 
                                    : 'border-neutral-200 focus:border-purple-600'
                            }`}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1 !text-red-500 text-xs" />
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-neutral-900 bg-neutral-50/60 focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-purple-500/20 ${
                                errors.password_confirmation 
                                    ? 'border-red-400 focus:border-red-500' 
                                    : 'border-neutral-200 focus:border-purple-600'
                            }`}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1 !text-red-500 text-xs" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            <span>Password updated</span>
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
