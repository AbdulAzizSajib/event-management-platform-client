'use client';

import { loginAction } from '@/app/(auth)/signin/_action';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { type ILoginPayload, loginZodSchema } from '@/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { CalendarDays, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SignInFormProps {
    redirectPath?: string;
    verified?: boolean;
}

export default function SignInForm({ redirectPath, verified }: SignInFormProps) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
    });

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = (await mutateAsync(value)) as any;
                if (!result.success) {
                    setServerError(result.message || 'Login failed');
                }
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : 'Something went wrong';
                setServerError(`Login failed: ${message}`);
            }
        },
    });

    const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const redirect = redirectPath || '/dashboard';
    window.location.href = `${baseUrl}/auth/login/google?redirect=${redirect}`;
};

    return (
        <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="mb-6 flex items-center gap-2">
                    <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
                        Planora
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Sign in to your account to continue
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {verified && (
                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                        Email verified! Please login.
                    </div>
                )}

                <form
                    method="POST"
                    action="#"
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
                        validators={{ onChange: loginZodSchema.shape.email }}
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

                    <form.Field
                        name="password"
                        validators={{ onChange: loginZodSchema.shape.password }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                icon={<Lock className="size-5 text-gray-400" />}
                                append={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="cursor-pointer"
                                        aria-label={
                                            showPassword ? 'Hide password' : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-5 text-gray-400" />
                                        ) : (
                                            <Eye className="size-5 text-gray-400" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    </form.Field>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 accent-blue-600"
                            />
                            <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {serverError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Signing In..."
                                disabled={!canSubmit}
                            >
                                Sign In
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-gray-400 dark:bg-gray-900">
                            or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        type="button"
                        // onClick={() => {
                        //     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                        //     const redirect = redirectPath || '/dashboard';
                        //     window.location.href = `${baseUrl}/auth/login/google?redirect=${redirect}`;
                        // }}
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <svg className="size-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link
                    href="/signup"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
