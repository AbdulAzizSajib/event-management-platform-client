/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { ApiErrorResponse } from '@/types/api.types';

type ResendOtpType = 'email-verification' | 'forget-password';

interface ResendOtpSuccessResponse {
    success: true;
    message: string;
}

export const resendOtpAction = async (
    email: string,
    type: ResendOtpType = 'email-verification',
): Promise<ResendOtpSuccessResponse | ApiErrorResponse> => {
    try {
        const response = await httpClient.post<ResendOtpSuccessResponse>('/auth/resend-otp', {
            email,
            type,
        });

        return {
            success: true,
            message: response.message || 'OTP sent successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error?.message || 'Failed to resend OTP',
        };
    }
};
