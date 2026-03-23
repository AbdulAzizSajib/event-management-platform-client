'use client';

import { useEffect, useState, useCallback } from 'react';
import { CalendarDays, Heart, MapPin, Clock, Loader2, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getMySavedEvents, unsaveEvent } from '@/services/savedEvent.services';

interface SavedEventItem {
    id: string;
    eventId: string;
    savedAt: string;
    event: {
        id: string;
        title: string;
        description: string;
        date: string;
        time: string;
        venue: string;
        type: string;
        fee: string;
        maxAttendees: number;
        isFeatured: boolean;
        organizer: {
            id: string;
            name: string;
            image: string | null;
        };
        image?: string | null;
        category?: {
            id: string;
            name: string;
        };
    };
}

export default function SavedTab() {
    const [savedEvents, setSavedEvents] = useState<SavedEventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchSaved = useCallback(() => {
        setLoading(true);
        getMySavedEvents()
            .then((res) => setSavedEvents(res.data as unknown as SavedEventItem[]))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    const handleUnsave = async (eventId: string) => {
        setRemovingId(eventId);
        try {
            await unsaveEvent(eventId);
            setSavedEvents((prev) => prev.filter((s) => s.eventId !== eventId));
        } catch {
            // silent fail
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Saved Events ({savedEvents.length})
            </h2>

            {savedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Heart className="mb-3 size-12 text-gray-300" />
                    <p className="text-gray-500">You haven&apos;t saved any events yet</p>
                    <Link
                        href="/events"
                        className="btn mt-4 rounded-lg px-6 py-2 text-sm text-white hover:opacity-90"
                    >
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedEvents.map((saved) => {
                        const fee = parseFloat(saved.event.fee);
                        const isFree = fee === 0;

                        return (
                            <div
                                key={saved.id}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
                            >
                                <Link href={`/events/${saved.event.id}`}>
                                    <div className="relative h-36 overflow-hidden">
                                        {saved.event.image ? (
                                            <img src={saved.event.image} alt={saved.event.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 transition group-hover:scale-105">
                                                <CalendarDays className="size-10 text-indigo-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 flex gap-1.5">
                                            {saved.event.category && (
                                                <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                    {saved.event.category.name}
                                                </span>
                                            )}
                                            {saved.event.isFeatured && (
                                                <span className="rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-medium text-white">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <Link href={`/events/${saved.event.id}`}>
                                        <p className="line-clamp-1 font-semibold text-gray-900 transition group-hover:text-indigo-600">
                                            {saved.event.title}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                            {saved.event.description}
                                        </p>
                                    </Link>

                                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="size-3 text-indigo-400" />
                                            {new Date(saved.event.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                            <span className="mx-1">|</span>
                                            <Clock className="size-3 text-indigo-400" />
                                            {saved.event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="size-3 text-indigo-400" />
                                            <span className="line-clamp-1">{saved.event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="size-3 text-indigo-400" />
                                            by {saved.event.organizer.name}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <span className="text-sm font-bold text-indigo-600">
                                            {isFree ? 'Free' : `৳${fee}`}
                                        </span>
                                        <button
                                            onClick={() => handleUnsave(saved.eventId)}
                                            disabled={removingId === saved.eventId}
                                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            {removingId === saved.eventId ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                            Unsave
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
