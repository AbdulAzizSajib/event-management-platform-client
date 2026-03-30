'use client';

import { createReview } from '@/services/review.services';
import { Star, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ReviewFormProps {
    eventId: string;
}

export default function ReviewForm({ eventId }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            setError('Please write a comment');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await createReview({ eventId, rating, comment: comment.trim() });

            if (!result.success) {
                const msg = result.message || 'Failed to submit review';
                if (msg.includes('already')) {
                    setError('You have already reviewed this event');
                } else if (msg.includes('participant') || msg.includes('approved') || msg.includes('join')) {
                    setError('Only approved participants can leave a review');
                } else if (msg.includes('own event') || msg.includes('organizer')) {
                    setError("You can't review your own event");
                } else if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('session token')) {
                    setError('Please login to access this feature');
                } else {
                    setError(msg);
                }
                return;
            }

            setSuccess(true);
            setRating(0);
            setComment('');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <Star className="mx-auto mb-2 size-8 fill-green-500 text-green-500" />
                <p className="font-medium text-green-700">Thank you for your review!</p>
                <p className="mt-1 text-sm text-green-600">Your feedback helps others find great events.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`size-7 ${
                                        star <= (hoveredRating || rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-gray-300'
                                    } transition-colors`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 self-center text-sm text-gray-500">
                                {rating === 1
                                    ? 'Poor'
                                    : rating === 2
                                      ? 'Fair'
                                      : rating === 3
                                        ? 'Good'
                                        : rating === 4
                                          ? 'Very Good'
                                          : 'Excellent'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Your Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience about this event..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || rating === 0 || !comment.trim()}
                    className="btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="size-4" />
                            Submit Review
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
