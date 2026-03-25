'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { ApiErrorResponse } from '@/types/api.types';

interface CreateReviewPayload {
    eventId: string;
    rating: number;
    comment: string;
}

export interface MyReview {
    id: string;
    rating: number;
    comment: string;
    eventId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    event: {
        id: string;
        title: string;
        date: string;
        venue: string;
    };
}

export const createReview = async (
    payload: CreateReviewPayload,
): Promise<{ success: true } | ApiErrorResponse> => {
    try {
        await httpClient.post('/reviews', payload);
        return { success: true };
    } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosErr = err as any;
        const message =
            axiosErr?.response?.data?.message ||
            axiosErr?.message ||
            'Failed to submit review';
        return { success: false, message };
    }
};

export interface FeaturedReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    event: {
        id: string;
        title: string;
        image: string | null;
    };
}

export const getFeaturedReviews = async () => {
    return httpClient.get<FeaturedReview[]>('/reviews/featured');
};

export const getMyReviews = async (params?: Record<string, unknown>) => {
    return httpClient.get<MyReview[]>('/reviews/my-reviews', { params });
};

export const updateReview = async (
    reviewId: string,
    payload: { rating: number; comment: string },
): Promise<{ success: true } | ApiErrorResponse> => {
    try {
        await httpClient.patch(`/reviews/${reviewId}`, payload);
        return { success: true };
    } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosErr = err as any;
        const message =
            axiosErr?.response?.data?.message ||
            axiosErr?.message ||
            'Failed to update review';
        return { success: false, message };
    }
};

export const deleteReview = async (
    reviewId: string,
): Promise<{ success: true } | ApiErrorResponse> => {
    try {
        await httpClient.delete(`/reviews/${reviewId}`);
        return { success: true };
    } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosErr = err as any;
        const message =
            axiosErr?.response?.data?.message ||
            axiosErr?.message ||
            'Failed to delete review';
        return { success: false, message };
    }
};
