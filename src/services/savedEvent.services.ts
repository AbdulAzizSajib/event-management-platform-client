'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface SavedEventData {
    id: string;
    userId: string;
    eventId: string;
    savedAt: string;
    event: {
        id: string;
        title: string;
        date: string;
        venue: string;
        fee: string;
        type: string;
    };
}

export interface SaveEventResult {
    success: boolean;
    message: string;
    alreadySaved?: boolean;
    data?: SavedEventData;
}

export const saveEvent = async (eventId: string): Promise<SaveEventResult> => {
    try {
        const response = await httpClient.post<SavedEventData>('/saved-events', { eventId });
        return { success: true, message: 'Event saved successfully', data: response.data };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const status = error?.response?.status || error?.status;
        const message = error?.response?.data?.message || error?.message || 'Failed to save event';

        if (status === 409) {
            return { success: false, message, alreadySaved: true };
        }
        return { success: false, message };
    }
};

export const unsaveEvent = async (eventId: string) => {
    return httpClient.delete(`/saved-events/${eventId}`);
};

export const getMySavedEvents = async () => {
    return httpClient.get<SavedEventData[]>('/saved-events');
};
