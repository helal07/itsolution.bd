import React, { useState, useRef } from 'react';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2, Lock, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-3 pb-3 border-b border-red-100">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-heading font-black text-base text-red-600">
                        Delete Account
                    </h2>
                    <p className="text-xs text-neutral-500">
                        Permanently remove your client account and all related credentials.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-200">
                <p className="text-xs text-neutral-600">
                    Once your account is deleted, your profile data will be permanently purged.
                </p>
                <button
                    type="button"
                    onClick={confirmUserDeletion}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8 space-y-5 bg-white text-neutral-900 border border-neutral-200 rounded-3xl">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                        <div className="flex items-center gap-2.5 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-heading font-bold text-base text-neutral-900">
                                Confirm Permanent Deletion
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-xs text-neutral-600">
                        Please confirm your account password to permanently delete this account.
                    </p>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="confirm_password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                placeholder="Enter account password"
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1 !text-red-500 text-xs" />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
