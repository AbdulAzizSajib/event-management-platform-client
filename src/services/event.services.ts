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

export const getMyEvents = async () => {
    return httpClient.get<Event[]>('/events/my-events');
};

export const deleteEvent = async (id: string) => {
    return httpClient.delete(`/events/${id}`);
};

export interface CreateEventPayload {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    type: 'PUBLIC' | 'PRIVATE';
    fee: number;
    maxAttendees: number;
    categoryId: string;
    eventLink?: string;
}

export const createEvent = async (data: CreateEventPayload) => {
    return httpClient.post<Event>('/events', data);
};
