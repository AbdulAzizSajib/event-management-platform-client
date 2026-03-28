/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { ApiErrorResponse } from '@/types/api.types';
import { type IVerifyEmailPayload, verifyEmailZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const verifyEmailAction = async (
    payload: IVerifyEmailPayload,
): Promise<{ success: true } | ApiErrorResponse> => {
    const parsedPayload = verifyEmailZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || 'Invalid input';
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        await httpClient.post('/auth/verify-email', parsedPayload.data);

        // No tokens — redirect to signin with success message
        redirect('/signin?verified=true');
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

        return {
            success: false,
            message: error?.response?.data?.message || error?.message || 'Verification failed',
        };
    }
};
