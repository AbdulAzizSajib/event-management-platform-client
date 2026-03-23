'use server';

import { cookies } from 'next/headers';
import { jwtUtils } from './jwtUtils';

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

        const result = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string);

        if (!result.success || !result.data) return null;

        return {
            name: result.data.name as string,
            email: result.data.email as string,
            role: result.data.role as string,
            image: (result.data.image as string) || null,
        };
    } catch {
        return null;
    }
}
