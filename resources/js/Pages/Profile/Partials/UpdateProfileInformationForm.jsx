import React from 'react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Check, Save } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-heading font-black text-base text-neutral-900">
                        Profile Information
                    </h2>
                    <p className="text-xs text-neutral-500">
                        Update your account name and registered work email.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-neutral-900 bg-neutral-50/60 focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-primary/20 ${
                                errors.name 
                                    ? 'border-red-400 focus:border-red-500' 
                                    : 'border-neutral-200 focus:border-primary'
                            }`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>
                    <InputError className="mt-1 !text-red-500 text-xs" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Work Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-neutral-900 bg-neutral-50/60 focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-primary/20 ${
                                errors.email 
                                    ? 'border-red-400 focus:border-red-500' 
                                    : 'border-neutral-200 focus:border-primary'
                            }`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <InputError className="mt-1 !text-red-500 text-xs" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                        <span>Email address is unverified.</span>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-bold underline hover:text-amber-950"
                        >
                            Resend Verification
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
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
                            <span>Saved successfully</span>
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
