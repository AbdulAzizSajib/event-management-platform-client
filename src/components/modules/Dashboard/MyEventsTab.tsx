'use client';

import { CalendarDays, PlusCircle, Users, MapPin, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteEvent, getMyEvents } from '@/services/event.services';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface MyEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    type: string;
    fee: string;
    maxAttendees: number;
    image: string | null;
    isFeatured: boolean;
    _count: {
        participants: number;
        reviews: number;
    };
}

export default function MyEventsTab() {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchEvents = useCallback(() => {
        setLoading(true);
        getMyEvents()
            .then((res) => setEvents(res.data as unknown as MyEvent[]))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setDeletingId(id);
        try {
            await deleteEvent(id);
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch {
            alert('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Events ({events.length})</h2>
                <button className="btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition hover:opacity-90">
                    <PlusCircle className="size-4" /> New Event
                </button>
            </div>

            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="mb-3 size-12 text-gray-300" />
                    <p className="text-gray-500">You haven&apos;t created any events yet</p>
                    <button className="btn mt-4 rounded-lg px-6 py-2 text-sm text-white">Create Your First Event</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => {
                        const fee = parseFloat(event.fee);
                        const isFree = fee === 0;
                        const revenue = fee * event._count.participants;

                        return (
                            <div
                                key={event.id}
                                className="flex flex-col items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                            >
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="size-20 w-32 shrink-0 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex size-20 w-32 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-100">
                                        <CalendarDays className="size-8 text-blue-400" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                            {event.type}
                                        </span>
                                        {event.isFeatured && (
                                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900">{event.title}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3" />
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            {event.venue}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="size-3" />
                                            {event._count.participants}/{event.maxAttendees}
                                        </span>
                                        <span>
                                            Event Fee: {isFree ? 'Free' : `৳ ${fee.toLocaleString()}`}
                                        </span>
                                        {!isFree && (
                                            <span className="font-medium text-blue-600">
                                                Revenue: ৳ {revenue.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        <Eye className="size-4" />
                                    </Link>
                                    <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600">
                                        <Edit className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id, event.title)}
                                        disabled={deletingId === event.id}
                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-500 disabled:opacity-50"
                                    >
                                        {deletingId === event.id ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
