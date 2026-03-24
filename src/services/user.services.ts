'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    role: string;
    emailVerified: boolean;
    status: string;
    createdAt: string;
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    image?: File | null;
}

export const getMyProfile = async () => {
    return httpClient.get<UserProfile>('/auth/me');
};

export const updateProfile = async (data: UpdateProfilePayload) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.image) formData.append('image', data.image);

    return httpClient.patch<UserProfile>('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
