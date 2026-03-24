'use server';

import { cookies } from 'next/headers';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        const sessionToken = cookieStore.get('better-auth.session_token')?.value;

        if (!accessToken) return null;

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
        });

        if (!res.ok) return null;

        const json = await res.json();
        const data = json.data as Record<string, unknown>;

        return {
            name: data.name as string,
            email: data.email as string,
            role: data.role as string,
            image: (data.image as string) || null,
        };
    } catch {
        return null;
    }
}
