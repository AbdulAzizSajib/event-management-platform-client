import { XCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface PaymentCancelPageProps {
    searchParams: Promise<{ event_id?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: PaymentCancelPageProps) {
    const params = await searchParams;
    const eventId = params.event_id;

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-50">
                    <XCircle className="size-10 text-red-500" />
                </div>
                <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Cancelled</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Your payment was cancelled. No charges were made. You can try again anytime.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    {eventId && (
                        <Link
                            href={`/events/${eventId}`}
                            className="btn flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-white hover:opacity-90"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Event
                        </Link>
                    )}
                    <Link
                        href="/events"
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Browse Events
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-blue-600"
                    >
                        <Home className="size-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
