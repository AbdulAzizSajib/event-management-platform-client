/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { ApiErrorResponse } from '@/types/api.types';
import { type ISignupPayload, signupZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

interface SignupSuccessResponse {
    success: true;
    message: string;
}

export const signupAction = async (
    payload: ISignupPayload,
): Promise<SignupSuccessResponse | ApiErrorResponse> => {
    const parsedPayload = signupZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || 'Invalid input';
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        await httpClient.post('/auth/register', parsedPayload.data);

        redirect('/signin');
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
            message: error?.response?.data?.message || error?.message || 'Registration failed',
        };
    }
};
