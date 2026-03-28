'use client';

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { forgotPasswordZodSchema, type IForgotPasswordPayload } from '@/zod/auth.validation';
import { forgetPassword } from '@/services/auth.services';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgetPassword(payload.email),
    });

    const form = useForm({
        defaultValues: {
            email: '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value);
                if (!result.success) {
                    setServerError(result.message);
                } else {
                    setSuccess(true);
                    // 2 সেকেন্ড পর reset-password page এ redirect করবে
                    setTimeout(() => {
                        router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
                    }, 2000);
                }
            } catch {
                setServerError('Something went wrong');
            }
        },
    });

    return (
        <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="mb-6 flex items-center gap-2">
                    <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
                        Planora
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                    Enter your email and we&apos;ll send you an OTP to reset your password
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {success ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                            <CheckCircle className="size-7 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">OTP Sent!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Check your email for the 6-digit OTP code. Redirecting...
                        </p>
                    </div>
                ) : (
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        <form.Field
                            name="email"
                            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    icon={<Mail className="size-5 text-gray-400" />}
                                />
                            )}
                        </form.Field>

                        {serverError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                                {serverError}
                            </div>
                        )}

                        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                            {([canSubmit, isSubmitting]) => (
                                <AppSubmitButton
                                    isPending={isSubmitting || isPending}
                                    pendingLabel="Sending OTP..."
                                    disabled={!canSubmit}
                                >
                                    Send OTP
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </form>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <Link
                    href="/signin"
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                >
                    <ArrowLeft className="size-4" />
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
