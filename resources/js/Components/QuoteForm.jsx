import React from 'react';
import { useForm } from '@inertiajs/react';
import { 
    Send, 
    CheckCircle2, 
    Loader2, 
    User, 
    Mail, 
    Phone, 
    Layers, 
    MessageSquare,
    Sparkles
} from 'lucide-react';

export default function QuoteForm({ categories = [], defaultItemId = null, className = '' }) {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        item_id: defaultItemId || '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/quotes', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className={`bg-white rounded-[2.5rem] p-6 sm:p-10 border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 ${className}`}>
            
            {recentlySuccessful && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Thank you! Your quote request has been received.</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Our software architect will review your scope and provide an estimate within 24 hours.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>Your Name <span className="text-danger">*</span></span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Alex Morgan"
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm text-neutral-900 transition-all outline-none"
                            required
                        />
                        {errors.name && <p className="text-xs text-danger mt-1 font-medium">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                            <span>Work Email <span className="text-danger">*</span></span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="alex@company.com"
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm text-neutral-900 transition-all outline-none"
                            required
                        />
                        {errors.email && <p className="text-xs text-danger mt-1 font-medium">{errors.email}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>Phone / WhatsApp</span>
                        </label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="+1 (555) 019-2834"
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm text-neutral-900 transition-all outline-none"
                        />
                        {errors.phone && <p className="text-xs text-danger mt-1 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Target Service Item */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <span>Interested Solution</span>
                        </label>
                        <select
                            value={data.item_id}
                            onChange={(e) => setData('item_id', e.target.value)}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm text-neutral-900 transition-all outline-none cursor-pointer"
                        >
                            <option value="">-- Custom Software / General Scope --</option>
                            {categories.map((c) => (
                                <optgroup key={c.id} label={c.name}>
                                    {(c.published_items || []).map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        {errors.item_id && <p className="text-xs text-danger mt-1 font-medium">{errors.item_id}</p>}
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span>Project Scope & Requirements <span className="text-danger">*</span></span>
                    </label>
                    <textarea
                        rows={4}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Please outline your project goals, desired technical features, timeline, and any custom architecture requirements..."
                        className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm text-neutral-900 transition-all outline-none resize-none"
                        required
                    />
                    {errors.message && <p className="text-xs text-danger mt-1 font-medium">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Quote Request...</span>
                        </>
                    ) : (
                        <>
                            <span>Send Quote Request</span>
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
