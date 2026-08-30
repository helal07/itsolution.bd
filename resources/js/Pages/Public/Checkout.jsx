import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { 
    CreditCard, 
    ShieldCheck, 
    CheckCircle2, 
    Lock, 
    ShoppingBag, 
    Loader2
} from 'lucide-react';

export default function Checkout({ item }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        item_id: item.id,
        payment_method: 'bKash/Nagad',
    });

    const paymentMethods = [
        { id: 'bKash/Nagad', name: 'bKash / Nagad / Rocket (Mobile Banking)', desc: 'Instant activation via Bangladeshi mobile financial services' },
        { id: 'Card', name: 'Credit / Debit Card (Visa, MasterCard, Amex)', desc: 'Instant secure payment via local or international cards' },
        { id: 'BankTransfer', name: 'Direct Corporate Bank Wire / BEFTN', desc: 'Official invoice and corporate bank details provided' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/orders');
    };

    return (
        <PublicLayout title={`Checkout — ${item.name}`}>
            <div className="py-8 sm:py-12 bg-neutral-50/70 min-h-screen">
                <div className="site-container space-y-8">
                    
                    {/* Clean Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="font-heading font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                                Complete Your Order
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm">
                                Secure 256-bit encrypted checkout with instant license provisioning and repository access.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start md:self-auto">
                            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secure
                        </div>
                    </div>

                    {/* Checkout Form & Order Summary Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        
                        {/* Left: Payment & Client Details (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                    <h2 className="font-heading font-bold text-lg text-neutral-900">
                                        Client Account Information
                                    </h2>
                                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                        <Lock className="w-3.5 h-3.5" /> Authenticated Session
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <span className="text-neutral-400 block font-medium">Account Name</span>
                                        <p className="font-bold text-neutral-900 text-sm mt-0.5">{auth.user.name}</p>
                                    </div>
                                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <span className="text-neutral-400 block font-medium">Delivery Email</span>
                                        <p className="font-bold text-neutral-900 text-sm mt-0.5 truncate">{auth.user.email}</p>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-4 pt-4 border-t border-neutral-100">
                                    <h3 className="font-heading font-bold text-xs text-neutral-900 uppercase tracking-wider">
                                        Select Payment Gateway
                                    </h3>

                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                    data.payment_method === method.id
                                                        ? 'border-primary bg-blue-50/50'
                                                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.id}
                                                    checked={data.payment_method === method.id}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="mt-1 text-primary focus:ring-primary"
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="font-heading font-bold text-sm text-neutral-900">{method.name}</p>
                                                    <p className="text-xs text-neutral-500">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.payment_method && <p className="text-xs text-danger">{errors.payment_method}</p>}
                                </div>

                                {/* Submit Order */}
                                <form onSubmit={handleSubmit} className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Processing Secure Order...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-4 h-4" />
                                                <span>Authorize & Complete Purchase (৳{parseFloat(item.price).toLocaleString()})</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right: Order Summary Card (5 cols) */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                                <h2 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                                    Order Summary
                                </h2>

                                <div className="flex items-start gap-4">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.name}
                                        className="w-20 h-16 rounded-2xl object-cover bg-neutral-100 flex-shrink-0"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                    <div className="space-y-1 min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-0.5 rounded">
                                            {item.category?.name}
                                        </span>
                                        <h3 className="font-heading font-bold text-sm text-neutral-900 truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-neutral-500 line-clamp-1">
                                            {item.short_description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-600">
                                    <div className="flex justify-between">
                                        <span>Item Price</span>
                                        <span className="font-bold text-neutral-900">৳{parseFloat(item.price).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>License & Deployment Guide</span>
                                        <span className="font-bold text-emerald-600">Included (FREE)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>6-Month Code Support</span>
                                        <span className="font-bold text-emerald-600">Included (FREE)</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-neutral-100 text-base font-extrabold text-neutral-900">
                                        <span>Total Amount</span>
                                        <span className="text-primary font-black text-xl">
                                            ৳{parseFloat(item.price).toLocaleString()} BDT
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-500 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-neutral-700 font-bold">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        <span>Buyer Protection Included</span>
                                    </div>
                                    <p>Your license key and repository access link will be dispatched immediately to your email address upon confirmation.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
