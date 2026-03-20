import { CalendarDays, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="flex max-w-md flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl btn">
                    <CalendarDays className="size-8 text-white" />
                </div>
                <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
                <h2 className="mt-2 text-xl font-semibold text-gray-700">
                    Page Not Found
                </h2>
                <p className="mt-3 text-sm text-gray-500">
                    The page you&apos;re looking for doesn&apos;t exist or has been
                    moved. Let&apos;s get you back on track.
                </p>
                <div className="mt-8 flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full btn px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        <Home className="size-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/events"
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <Search className="size-4" />
                        Browse Events
                    </Link>
                </div>
            </div>
        </div>
    );
}
