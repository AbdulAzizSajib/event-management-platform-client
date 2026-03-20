'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface JoinEventResponse {
    id: string;
    status: string;
    eventId: string;
    userId: string;
    joinedAt: string;
    event: {
        id: string;
        title: string;
        type: string;
        fee: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

export interface JoinEventResult {
    success: boolean;
    message: string;
    alreadyJoined?: boolean;
    data?: JoinEventResponse;
}

export const joinEvent = async (eventId: string): Promise<JoinEventResult> => {
    try {
        const response = await httpClient.post<JoinEventResponse>('/participants/join', { eventId });
        return {
            success: true,
            message: 'Successfully joined the event',
            data: response.data,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const status = error?.response?.status || error?.status;
        const message = error?.response?.data?.message || error?.message || 'Failed to join event';

        if (status === 409) {
            return {
                success: false,
                message,
                alreadyJoined: true,
            };
        }

        return {
            success: false,
            message,
        };
    }
};
