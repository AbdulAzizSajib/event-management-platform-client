'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { setGoogleAuthCookies } from './_action';

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState(false);

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const sessionToken = searchParams.get('sessionToken');
        const redirect = searchParams.get('redirect') || '/';

        if (!accessToken || !refreshToken) {
            setError(true);
            return;
        }

        setGoogleAuthCookies({ accessToken, refreshToken, sessionToken })
            .then((result) => {
                if (result.success) {
                    router.replace(redirect);
                } else {
                    setError(true);
                }
            })
            .catch(() => setError(true));
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Login Failed</h2>
                    <p className="mt-2 text-sm text-gray-500">Something went wrong with Google login.</p>
                    <a href="/signin" className="mt-4 inline-block text-blue-600 hover:underline">
                        Try again
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-10 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Completing sign in...</p>
            </div>
        </div>
    );
}
