import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { Star, Trash2, Edit2, X, User } from 'lucide-react';
import Modal from '@/Components/Modal';
import ActionDropdown, { ActionItem } from '@/Components/ActionDropdown';

export default function Index({ reviews }) {
    const reviewList = reviews?.data || reviews || [];

    const [editingReview, setEditingReview] = useState(null);
    const [deletingReview, setDeletingReview] = useState(null);

    const { data: editData, setData: setEditData, put: putReview, processing: editProcessing, reset: resetEdit } = useForm({
        rating: 5,
        title: '',
        comment: '',
        project_name: '',
        is_approved: true,
    });

    const openEditModal = (review) => {
        setEditingReview(review);
        setEditData({
            rating: review.rating,
            title: review.title || '',
            comment: review.comment || '',
            project_name: review.project_name || '',
            is_approved: Boolean(review.is_approved),
        });
    };

    const handleUpdateReview = (e) => {
        e.preventDefault();
        putReview(route('admin.reviews.update', editingReview.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingReview(null);
                resetEdit();
            },
        });
    };

    const { delete: destroyReview, processing: deleteProcessing } = useForm();

    const handleDeleteReview = (e) => {
        e.preventDefault();
        destroyReview(route('admin.reviews.destroy', deletingReview.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingReview(null),
        });
    };

    return (
        <AdminLayout title="Reviews">
            <div className="space-y-6 max-w-7xl mx-auto pb-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Reviews
                        </h1>
                    </div>
                </div>

                {/* Reviews List */}
                {reviewList.length > 0 ? (
                    <div className="bg-white border border-blue-100 rounded-2xl divide-y divide-blue-50 shadow-xs">
                        {reviewList.map((review) => (
                            <div key={review.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-3.5 h-3.5 ${
                                                        review.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-1 text-xs font-bold text-amber-600 font-mono">
                                                {review.rating}.0
                                            </span>
                                        </div>

                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            review.is_approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {review.is_approved ? 'Approved' : 'Pending'}
                                        </span>

                                        {review.project_name && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                                {review.project_name}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">
                                            "{review.title || 'Client Review'}"
                                        </h3>
                                        <p className="text-xs text-slate-600 italic">
                                            "{review.comment || 'No feedback text.'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                        <User className="w-3 h-3 text-slate-400" />
                                        <span className="text-slate-700 font-semibold">{review.user?.name || 'Client'}</span>
                                        <span>&bull;</span>
                                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <ActionDropdown label="Actions">
                                        <div className="py-1">
                                            <ActionItem onClick={() => openEditModal(review)} icon={Edit2}>
                                                Edit Review
                                            </ActionItem>
                                            <ActionItem onClick={() => setDeletingReview(review)} icon={Trash2} danger>
                                                Delete Review
                                            </ActionItem>
                                        </div>
                                    </ActionDropdown>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-blue-100 rounded-2xl p-8 text-center space-y-2 shadow-xs">
                        <Star className="w-6 h-6 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-sm text-slate-900">No Reviews Yet</h3>
                        <p className="text-xs text-slate-400">
                            Client reviews will appear here for moderation.
                        </p>
                    </div>
                )}

                {/* Edit Modal */}
                {editingReview && (
                    <Modal show={Boolean(editingReview)} onClose={() => setEditingReview(null)}>
                        <form onSubmit={handleUpdateReview} className="p-6 space-y-3 bg-white text-slate-800 rounded-2xl">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="font-bold text-base text-slate-900">
                                    Edit Review
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setEditData('rating', s)}
                                            className="p-0.5"
                                        >
                                            <Star 
                                                className={`w-5 h-5 ${
                                                    editData.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                                }`} 
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 font-mono font-bold text-xs text-amber-600">{editData.rating} Stars</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Product</label>
                                <input
                                    type="text"
                                    value={editData.project_name}
                                    onChange={(e) => setEditData('project_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Comment</label>
                                <textarea
                                    rows="3"
                                    value={editData.comment}
                                    onChange={(e) => setEditData('comment', e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditData('is_approved', true)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                            editData.is_approved ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditData('is_approved', false)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                            !editData.is_approved ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        Pending
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Delete Modal */}
                {deletingReview && (
                    <Modal show={Boolean(deletingReview)} onClose={() => setDeletingReview(null)}>
                        <form onSubmit={handleDeleteReview} className="p-6 space-y-3 bg-white text-slate-800 rounded-2xl">
                            <h3 className="font-bold text-base text-red-600">Delete Review</h3>
                            <p className="text-xs text-slate-600">
                                Delete review by <strong>{deletingReview.user?.name}</strong>?
                            </p>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setDeletingReview(null)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

            </div>
        </AdminLayout>
    );
}
