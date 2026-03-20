'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="flex max-w-md flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="size-8 text-red-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    Something went wrong!
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    An unexpected error occurred. Please try again or go back to the
                    home page.
                </p>
                <div className="mt-8 flex items-center gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 rounded-full btn px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        <RefreshCw className="size-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <Home className="size-4" />
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
