'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface DashboardData {
    counts: {
        organizedEvents: number;
        participations: number;
        pendingInvitations: number;
        reviews: number;
        savedEvents: number;
        totalSpent: number;
    };
    upcoming: {
        organizedEvents: number;
        participatingEvents: number;
    };
    participationBreakdown: {
        pending: number;
        approved: number;
        rejected: number;
    };
    recentOrganizedEvents: {
        id: string;
        title: string;
        date: string;
        type: string;
        fee: string;
        isFeatured: boolean;
        _count: {
            participants: number;
            reviews: number;
        };
    }[];
    recentParticipations: {
        id: string;
        status: string;
        eventId: string;
        joinedAt: string;
        event: {
            id: string;
            title: string;
            date: string;
            type: string;
            venue: string;
        };
    }[];
    pendingInvitations: unknown[];
    recentReviews: unknown[];
    recentSavedEvents: {
        id: string;
        eventId: string;
        savedAt: string;
        event: {
            id: string;
            title: string;
            date: string;
            type: string;
            fee: string;
            venue: string;
        };
    }[];
}

export const getUserDashboard = async () => {
    return httpClient.get<DashboardData>('/users/dashboard');
};
