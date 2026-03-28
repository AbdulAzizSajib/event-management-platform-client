'use client';

import { useState } from 'react';
import { Star, Loader2, CalendarDays, MapPin, Pencil, Trash2, X, Send } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyReviews, updateReview, deleteReview, type MyReview } from '@/services/review.services';
import type { ApiResponse } from '@/types/api.types';

export default function MyReviewsTab() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');
    const [editHover, setEditHover] = useState(0);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: response, isLoading } = useQuery({
        queryKey: ['my-reviews'],
        queryFn: () => getMyReviews(),

    });

    const reviews = ((response as ApiResponse<MyReview[]>)?.data || []);

    const startEdit = (review: MyReview) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRating(0);
        setEditComment('');
        setError(null);
    };

    const handleUpdate = async (reviewId: string) => {
        if (editRating === 0 || !editComment.trim()) return;
        setSaving(true);
        setError(null);
        const result = await updateReview(reviewId, { rating: editRating, comment: editComment.trim() });
        if (!result.success) {
            setError(result.message || 'Failed to update');
        } else {
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
        }
        setSaving(false);
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        setDeletingId(reviewId);
        const result = await deleteReview(reviewId);
        if (!result.success) {
            alert(result.message || 'Failed to delete');
        } else {
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
        }
        setDeletingId(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Star className="mb-4 size-16 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    You haven&apos;t reviewed any events yet.
                </p>
                <Link
                    href="/events"
                    className="btn mt-4 rounded-full px-6 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                    Browse Events
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Reviews ({reviews.length})</h2>
            </div>

            {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    {/* Event Info */}
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <Link
                                href={`/events/${review.event.id}`}
                                className="text-base font-semibold text-gray-900 hover:text-blue-600 dark:text-white"
                            >
                                {review.event.title}
                            </Link>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="size-3.5" />
                                    {new Date(review.event.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="size-3.5" />
                                    {review.event.venue}
                                </span>
                            </div>
                        </div>
                        {editingId !== review.id && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => startEdit(review)}
                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                    title="Edit review"
                                >
                                    <Pencil className="size-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    disabled={deletingId === review.id}
                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                    title="Delete review"
                                >
                                    {deletingId === review.id ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-4" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Edit Mode */}
                    {editingId === review.id ? (
                        <div className="space-y-3">
                            {/* Edit Stars */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setEditRating(star)}
                                        onMouseEnter={() => setEditHover(star)}
                                        onMouseLeave={() => setEditHover(0)}
                                    >
                                        <Star
                                            className={`size-6 ${
                                                star <= (editHover || editRating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Edit Comment */}
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            />

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            {/* Edit Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleUpdate(review.id)}
                                    disabled={saving || editRating === 0 || !editComment.trim()}
                                    className="btn flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Send className="size-3.5" />
                                    )}
                                    {saving ? 'Saving...' : 'Update'}
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                >
                                    <X className="size-3.5" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* View Mode */
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`size-4 ${
                                                i < review.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                    {review.updatedAt !== review.createdAt && ' (edited)'}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
