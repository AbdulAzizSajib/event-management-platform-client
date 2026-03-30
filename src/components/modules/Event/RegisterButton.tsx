'use client';

import { joinEvent } from '@/services/participant.services';
import { createCheckoutSession } from '@/services/payment.services';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface RegisterButtonProps {
    eventId: string;
    fee: string;
    spotsLeft: number;
}

export default function RegisterButton({ eventId, fee, spotsLeft }: RegisterButtonProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [alreadyJoined, setAlreadyJoined] = useState(false);
    const isFree = parseFloat(fee) === 0;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async () => {
            setError(null);
            setSuccess(null);

            // Step 1: Join the event
            const joinResult = await joinEvent(eventId);

            if (!joinResult.success) {
                if (joinResult.alreadyJoined) {
                    setAlreadyJoined(true);

                    // Paid event — try payment (might also be already paid)
                    if (!isFree) {
                        const paymentResult = await createCheckoutSession(eventId);
                        if (paymentResult.alreadyPaid) {
                            // Both joined AND paid — fully registered
                            return;
                        }
                        if (!paymentResult.success) {
                            throw new Error(paymentResult.message);
                        }
                        window.location.href = paymentResult.data!.url;
                        return;
                    }

                    // Free event — already registered
                    return;
                }

                throw new Error(joinResult.message);
            }

            // Step 2: If paid event, redirect to Stripe checkout
            if (!isFree) {
                const paymentResult = await createCheckoutSession(eventId);
                if (!paymentResult.success) {
                    throw new Error(paymentResult.message);
                }
                window.location.href = paymentResult.data!.url;
                return;
            }

            // Free event — joined successfully
            setSuccess('You have successfully joined this event!');
        },
    });

    const handleRegister = async () => {
        try {
            await mutateAsync();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to register';
            if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('session token')) {
                setError('Please login to access this feature');
            } else {
                setError(message);
            }
        }
    };

    if (spotsLeft <= 0) {
        return (
            <button
                className="w-full cursor-not-allowed rounded-full bg-gray-300 py-3 font-medium text-white"
                disabled
            >
                Sold Out
            </button>
        );
    }

    if (alreadyJoined) {
        return (
            <div className="space-y-3">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                    <CheckCircle className="mx-auto size-8 text-green-500" />
                    <p className="mt-2 text-sm font-semibold text-green-800">You&apos;re registered!</p>
                    <p className="mt-0.5 text-xs text-green-600">You have already joined this event</p>
                </div>
                <a
                    href="/dashboard?tab=registrations"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                    View My Registrations
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleRegister}
                disabled={isPending || !!success}
                className={`w-full rounded-full py-3 font-medium text-white transition ${
                    isPending || success
                        ? 'cursor-not-allowed bg-gray-300'
                        : 'btn hover:opacity-90'
                }`}
            >
                {isPending ? (
                    <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        {isFree ? 'Joining...' : 'Processing...'}
                    </span>
                ) : success ? (
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle className="size-4" />
                        Registered!
                    </span>
                ) : isFree ? (
                    'Join for Free'
                ) : (
                    'Register Now'
                )}
            </button>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-600">
                    {success}
                </div>
            )}
        </div>
    );
}
