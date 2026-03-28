'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface AdminDashboardData {
    counts: {
        totalUsers: number;
        totalEvents: number;
        totalReviews: number;
        totalPayments: number;
        activeUsers: number;
        blockedUsers: number;
    };
    recentEvents: {
        id: string;
        title: string;
        date: string;
        type: string;
        fee: string;
        isFeatured: boolean;
        createdAt: string;
        _count: {
            participants: number;
        };
    }[];
    recentUsers: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        createdAt: string;
    }[];
}

export const getAdminDashboard = async () => {
    return httpClient.get<AdminDashboardData>('/admin/dashboard');
};

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string;
    phone: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    _count: {
        organizedEvents: number;
        participants: number;
        reviews: number;
    };
}

export const getAdminUsers = async (params?: Record<string, unknown>) => {
    return httpClient.get<AdminUser[]>('/admin/users', { params });
};

export interface AdminUserDetail {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string;
    phone: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    organizedEvents: {
        id: string;
        title: string;
        date: string;
        venue: string;
        type: string;
        fee: string;
        maxAttendees: number;
        isFeatured: boolean;
    }[];
    participants: {
        id: string;
        status: string;
        eventId: string;
        joinedAt: string;
        event: {
            id: string;
            title: string;
        };
    }[];
    reviews: unknown[];
}

export const getAdminUserById = async (userId: string) => {
    return httpClient.get<AdminUserDetail>(`/admin/users/${userId}`);
};

export const updateUserStatus = async (userId: string, status: string) => {
    return httpClient.patch(`/admin/users/${userId}/status`, { status });
};

export interface AdminEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    eventLink: string | null;
    type: string;
    fee: string;
    maxAttendees: number;
    isFeatured: boolean;
    categoryId: string;
    organizerId: string;
    createdAt: string;
    organizer: {
        id: string;
        name: string;
        email: string;
    };
    _count: {
        participants: number;
        reviews: number;
        payments: number;
    };
}

export const getAdminEvents = async (params?: Record<string, unknown>) => {
    return httpClient.get<AdminEvent[]>('/admin/events', { params });
};

export const deleteAdminEvent = async (eventId: string) => {
    return httpClient.delete(`/admin/events/${eventId}`);
};

export const toggleFeaturedEvent = async (eventId: string) => {
    return httpClient.patch(`/events/${eventId}/toggle-featured`, {});
};
