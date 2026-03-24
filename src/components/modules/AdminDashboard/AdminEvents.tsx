'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, CalendarDays, Users, CreditCard, Loader2, X, ChevronLeft, ChevronRight, Eye, Star, Trash2 } from 'lucide-react';
import { getAdminEvents, deleteAdminEvent, type AdminEvent } from '@/services/admin.services';
import type { PaginationMeta } from '@/types/api.types';
import Link from 'next/link';

export default function AdminEvents() {
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { page, limit: 10 };
            if (debouncedSearch) params.searchTerm = debouncedSearch;

            const response = await getAdminEvents(params);
            setEvents(response.data);
            setMeta(response.meta || null);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        setDeletingId(id);
        try {
            await deleteAdminEvent(id);
            fetchEvents();
        } catch {
            alert('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                    All Events {meta ? `(${meta.total})` : ''}
                </h2>
                <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:w-auto">
                    <Search className="size-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm outline-none sm:w-48"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')}>
                            <X className="size-4 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 animate-spin text-blue-500" />
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="mb-3 size-12 text-gray-300" />
                    <p className="text-gray-500">No events found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Event</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Organizer</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Fee</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Stats</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => {
                                    const fee = parseFloat(event.fee);
                                    return (
                                        <tr key={event.id} className="transition hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="max-w-56">
                                                    <p className="truncate font-medium text-gray-900">{event.title}</p>
                                                    <p className="truncate text-xs text-gray-400">{event.venue}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-gray-700">{event.organizer.name}</p>
                                                    <p className="text-xs text-gray-400">{event.organizer.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            event.type === 'PUBLIC'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    >
                                                        {event.type}
                                                    </span>
                                                    {event.isFeatured && (
                                                        <span className="w-fit rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700">
                                                {fee === 0 ? (
                                                    <span className="text-green-600">Free</span>
                                                ) : (
                                                    `৳${fee}`
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="size-3" />
                                                        {event._count.participants}/{event.maxAttendees}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="size-3" />
                                                        {event._count.reviews} reviews
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CreditCard className="size-3" />
                                                        {event._count.payments} payments
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(event.id, event.title)}
                                                        disabled={deletingId === event.id}
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                                    >
                                                        {deletingId === event.id ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="size-4" />
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`flex size-10 items-center justify-center rounded-lg text-sm transition ${
                                    page === p
                                        ? 'btn text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
