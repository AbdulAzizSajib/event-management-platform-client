/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getDefaultDashboardRoute, isValidRedirectForRole, type UserRole } from '@/lib/authUtils';
import { httpClient } from '@/lib/axios/httpClient';
import { setTokenInCookies } from '@/lib/tokenUtils';
import type { ApiErrorResponse } from '@/types/api.types';
import type { ILoginResponse } from '@/types/auth.types';
import { type ILoginPayload, loginZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const loginAction = async (
    payload: ILoginPayload,
    redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || 'Invalid input';
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response = await httpClient.post<ILoginResponse>('/auth/login', parsedPayload.data);

        // Case A: Email not verified — no tokens, redirect to verify page
        if (response.data.requiresEmailVerification) {
            redirect(`/verify-email?email=${encodeURIComponent(response.data.user.email)}`);
        }

        // Case B: Email verified — set tokens and redirect
        const { accessToken, refreshToken, token, user } = response.data;
        const { role } = user;

        await setTokenInCookies('accessToken', accessToken);
        await setTokenInCookies('refreshToken', refreshToken);
        await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60);

        const targetPath =
            redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
                ? redirectPath
                : getDefaultDashboardRoute(role as UserRole);

        redirect(targetPath);
    } catch (error: any) {
        if (
            error &&
            typeof error === 'object' &&
            'digest' in error &&
            typeof error.digest === 'string' &&
            error.digest.startsWith('NEXT_REDIRECT')
        ) {
            throw error;
        }

        const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';

        // Backend rejects login for unverified email — redirect to verify page
        if (errorMessage.toLowerCase().includes('verify')) {
            redirect(`/verify-email?email=${encodeURIComponent(payload.email)}`);
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};
