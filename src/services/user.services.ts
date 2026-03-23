'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    role: string;
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    image?: string;
}

export const getMyProfile = async () => {
    return httpClient.get<UserProfile>('/users/profile');
};

export const updateProfile = async (data: UpdateProfilePayload) => {
    return httpClient.patch<UserProfile>('/users/profile', data);
};
