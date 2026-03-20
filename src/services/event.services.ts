'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { Event, EventDetail } from '@/types';

export const getAllEvents = async (params?: Record<string, unknown>) => {
    return httpClient.get<Event[]>('/events', { params });
};

export const getFeaturedEvents = async () => {
    return httpClient.get<Event[]>('/events', {
        params: { isFeatured: true },
    });
};

export const getEventById = async (id: string) => {
    return httpClient.get<EventDetail>(`/events/${id}`);
};
