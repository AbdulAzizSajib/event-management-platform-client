'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, Loader2, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import { getMyParticipations, type MyParticipation } from '@/services/participant.services';

const statusColors: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function RegistrationsTab() {
    const [participations, setParticipations] = useState<MyParticipation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyParticipations()
            .then((res) => setParticipations(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                My Registrations ({participations.length})
            </h2>

            {participations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Ticket className="mb-3 size-12 text-gray-300" />
                    <p className="text-gray-500">You haven&apos;t joined any events yet</p>
                    <Link
                        href="/events"
                        className="btn mt-4 rounded-lg px-6 py-2 text-sm text-white hover:opacity-90"
                    >
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {participations.map((p) => {
                        const fee = parseFloat(p.event.fee);
                        const isFree = fee === 0;

                        return (
                            <Link
                                key={p.id}
                                href={`/events/${p.event.id}`}
                                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-center"
                            >
                                {/* Event image */}
                                {p.event.image ? (
                                    <img src={p.event.image} alt={p.event.title} className="size-14 shrink-0 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-100">
                                        <CalendarDays className="size-6 text-blue-400" />
                                    </div>
                                )}

                                {/* Event info */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-900">{p.event.title}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3" />
                                            {new Date(p.event.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {p.event.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            {p.event.venue}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="size-3" />
                                            by {p.event.organizer.name}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex items-center gap-2 text-xs">
                                        <span className="text-gray-400">
                                            Joined {new Date(p.joinedAt).toLocaleDateString()}
                                        </span>
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                                            {p.event.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Fee + Status */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-blue-600">
                                        {isFree ? 'Free' : `৳${fee}`}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}
                                    >
                                        {p.status}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
