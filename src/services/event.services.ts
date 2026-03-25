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
    image?: File;
}

export const updateEvent = async (id: string, data: Partial<CreateEventPayload>) => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.date) formData.append('date', data.date);
    if (data.time) formData.append('time', data.time);
    if (data.venue) formData.append('venue', data.venue);
    if (data.type) formData.append('type', data.type);
    if (data.fee !== undefined) formData.append('fee', String(data.fee));
    if (data.maxAttendees !== undefined) formData.append('maxAttendees', String(data.maxAttendees));
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    if (data.eventLink) formData.append('eventLink', data.eventLink);
    if (data.image) formData.append('image', data.image);

    return httpClient.patch<Event>(`/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const createEvent = async (data: CreateEventPayload) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('date', data.date);
    formData.append('time', data.time);
    formData.append('venue', data.venue);
    formData.append('type', data.type);
    formData.append('fee', String(data.fee));
    formData.append('maxAttendees', String(data.maxAttendees));
    formData.append('categoryId', data.categoryId);
    if (data.eventLink) formData.append('eventLink', data.eventLink);
    if (data.image) formData.append('image', data.image);

    return httpClient.post<Event>('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
