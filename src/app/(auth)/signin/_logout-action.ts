'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { deleteCookie } from '@/lib/cookieUtils';
import { redirect } from 'next/navigation';

export const logoutAction = async (): Promise<{ success: boolean; message: string }> => {
    try {
        // Call backend logout API
        await httpClient.post('/auth/logout', {});
    } catch {
        // Even if API fails, clear cookies locally
    }

    // Clear all auth cookies
    await deleteCookie('accessToken');
    await deleteCookie('refreshToken');
    await deleteCookie('better-auth.session_token');

    redirect('/signin');
};
