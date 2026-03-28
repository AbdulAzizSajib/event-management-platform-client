'use client';

import { verifyPayment, type PaymentData } from '@/services/payment.services';
import { CheckCircle, CreditCard, CalendarDays, ArrowRight, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [payment, setPayment] = useState<PaymentData | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const verify = useCallback(async () => {
        if (!sessionId) {
            setError(true);
            setLoading(false);
            return;
        }

        // Retry up to 5 times with 2s delay — webhook may not have processed yet
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const response = await verifyPayment(sessionId);
                setPayment(response.data);
                setLoading(false);
                return;
            } catch {
                if (attempt < 4) {
                    await new Promise((r) => setTimeout(r, 2000));
                }
            }
        }

        setError(true);
        setLoading(false);
    }, [sessionId]);

    useEffect(() => {
        verify();
    }, [verify]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="size-10 animate-spin text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Verifying your payment...</h2>
                    <p className="text-sm text-gray-500">Please wait while we confirm your transaction.</p>
                </div>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
                        <CreditCard className="size-8 text-red-500" />
                    </div>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Verification Failed</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        We couldn&apos;t verify your payment. Please contact support if the issue persists.
                    </p>
                    <Link
                        href="/events"
                        className="btn mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                        Browse Events
                    </Link>
                </div>
            </div>
        );
    }

    const amount = parseFloat(payment.amount);

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Success Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle className="size-10 text-green-500" />
                    </div>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Successful!</h1>
                    <p className="mt-2 text-sm text-gray-500">Your registration has been confirmed.</p>
                </div>

                {/* Payment Details Card */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 border-b border-gray-100 pb-4 text-center">
                        <p className="text-sm text-gray-500">Amount Paid</p>
                        <p className="mt-1 text-3xl font-bold text-blue-600">৳{amount}</p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Event</span>
                            <span className="font-medium text-gray-900">{payment.event.title}</span>
                        </div>
                        {payment.event.date && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="text-gray-700">
                                    {new Date(payment.event.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        )}
                        {payment.event.venue && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Venue</span>
                                <span className="text-gray-700">{payment.event.venue}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="text-gray-700">{payment.method}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                <CheckCircle className="size-3" />
                                {payment.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="max-w-[200px] truncate text-xs text-gray-400">
                                {payment.transactionId}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                    <Link
                        href={`/events/${payment.event.id || payment.eventId}`}
                        className="btn flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-white hover:opacity-90"
                    >
                        <CalendarDays className="size-4" />
                        View Event Details
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <Home className="size-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
