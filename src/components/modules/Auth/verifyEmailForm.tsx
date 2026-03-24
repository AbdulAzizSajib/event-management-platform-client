'use client';

import { resendOtpAction } from '@/app/(auth)/verify-email/_resend-action';
import { verifyEmailAction } from '@/app/(auth)/verify-email/_action';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { type IVerifyEmailPayload } from '@/zod/auth.validation';
import { useMutation } from '@tanstack/react-query';
import { CalendarDays, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface VerifyEmailFormProps {
    email: string;
}

export default function VerifyEmailForm({ email }: VerifyEmailFormProps) {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [serverError, setServerError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
    });

    const { mutateAsync: resendMutate, isPending: isResending } = useMutation({
        mutationFn: () => resendOtpAction(email, 'email-verification'),
    });

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = useCallback(async () => {
        if (cooldown > 0 || isResending) return;
        setServerError(null);
        setResendMessage(null);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (await resendMutate()) as any;
            if (result.success) {
                setResendMessage('OTP sent! Check your inbox.');
                setCooldown(60);
                setOtp(Array(6).fill(''));
                inputRefs.current[0]?.focus();
            } else {
                setServerError(result.message || 'Failed to resend OTP');
            }
        } catch {
            setServerError('Failed to resend OTP');
        }
    }, [cooldown, isResending, resendMutate]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtp(newOtp);
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setServerError('Please enter the complete 6-digit code');
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (await mutateAsync({ email, otp: otpString })) as any;
            if (!result.success) {
                setServerError(result.message || 'Verification failed');
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Something went wrong';
            setServerError(`Verification failed: ${message}`);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="mb-6 flex items-center gap-2">
                    <div className="btn flex size-10 items-center justify-center rounded-lg">
                        <CalendarDays className="size-6 text-white" />
                    </div>
                    <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
                        Planora
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                <p className="mt-1 text-sm text-gray-500">
                    We sent a 6-digit code to your email
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <Mail className="size-5 text-blue-600" />
                    <span className="text-sm text-blue-700">{email}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-3 block text-center text-sm font-medium text-gray-700">
                            Enter verification code
                        </label>
                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="size-12 rounded-xl border border-gray-300 text-center text-lg font-semibold outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            ))}
                        </div>
                    </div>

                    {serverError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    <AppSubmitButton
                        isPending={isPending}
                        pendingLabel="Verifying..."
                        disabled={otp.join('').length !== 6}
                    >
                        Verify Email
                    </AppSubmitButton>
                </form>

                {resendMessage && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {resendMessage}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Didn&apos;t receive the code?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={cooldown > 0 || isResending}
                        className="font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                    >
                        {isResending ? (
                            <span className="inline-flex items-center gap-1">
                                <Loader2 className="inline size-3 animate-spin" />
                                Sending...
                            </span>
                        ) : cooldown > 0 ? (
                            `Resend in ${cooldown}s`
                        ) : (
                            'Resend'
                        )}
                    </button>
                </p>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                Wrong email?{' '}
                <Link
                    href="/signup"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign up again
                </Link>
            </p>
        </div>
    );
}
