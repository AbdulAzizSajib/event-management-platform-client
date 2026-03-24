'use server';

import { cookies } from 'next/headers';
import { httpClient } from './axios/httpClient';

export interface AuthUser {
    name: string;
    email: string;
    role: string;
    image?: string | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) return null;

        const res = await httpClient.get('/auth/me');
        const user = res.data;

        return {
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || null,
        };
    } catch {
        return null;
    }
}
