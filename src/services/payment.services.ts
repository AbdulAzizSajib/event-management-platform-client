'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
}

export interface PaymentData {
    id: string;
    amount: string;
    method: string;
    status: string;
    transactionId: string;
    userId: string;
    eventId: string;
    createdAt: string;
    updatedAt: string;
    event: {
        id: string;
        title: string;
        date?: string;
        venue?: string;
        fee?: string;
    };
}

export interface CheckoutResult {
    success: boolean;
    message: string;
    alreadyPaid?: boolean;
    data?: CheckoutSessionResponse;
}

export const createCheckoutSession = async (eventId: string): Promise<CheckoutResult> => {
    try {
        const response = await httpClient.post<CheckoutSessionResponse>('/payments/create-checkout-session', { eventId });
        return { success: true, message: 'Checkout session created', data: response.data };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const status = error?.response?.status || error?.status;
        const message = error?.response?.data?.message || error?.message || 'Payment failed';

        if (status === 409) {
            return { success: false, message, alreadyPaid: true };
        }

        return { success: false, message };
    }
};

export const verifyPayment = async (sessionId: string) => {
    return httpClient.get<PaymentData>(`/payments/verify/${sessionId}`);
};

export const getMyPayments = async () => {
    return httpClient.get<PaymentData[]>('/payments/my-payments');
};

export const getPaymentsByEvent = async (eventId: string) => {
    return httpClient.get<PaymentData[]>(`/payments/event/${eventId}`);
};
