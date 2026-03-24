import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Event } from '@/types';

export interface EventCardProps {
    event: Event;
    variant?: 'default' | 'horizontal';
}

function formatFee(fee: string): string {
    const num = parseFloat(fee);
    return num === 0 ? 'Free' : `৳${num}`;
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
    const spotsLeft = event.maxAttendees - event._count.participants;
    const isFull = spotsLeft <= 0;
    const fee = formatFee(event.fee);
    const isFree = parseFloat(event.fee) === 0;

    if (variant === 'horizontal') {
        return (
            <Link
                href={`/events/${event.id}`}
                className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row"
            >
                <div className="relative h-48 shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-56">
                    {event.image ? (
                        <img
                            src={event.image as string}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100">
                            <CalendarDays className="size-10 text-blue-400" />
                        </div>
                    )}
                    {isFree && (
                        <span className="absolute top-2 left-2 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
                            Free
                        </span>
                    )}
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {event.category.name}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {event.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {event.description}
                        </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <CalendarDays className="size-4" />
                            {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {event.venue.split(',')[0]}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="size-4" />
                            {event._count.participants} joined
                        </span>
                        <span className="ml-auto font-semibold text-blue-600">
                            {fee}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/events/${event.id}`}
            className="group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative h-48 overflow-hidden">
                {event.image ? (
                    <img
                        src={event.image as string}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100">
                        <CalendarDays className="size-12 text-blue-400" />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    {isFree && (
                        <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
                            Free
                        </span>
                    )}
                    {event.isFeatured && (
                        <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">
                            Featured
                        </span>
                    )}
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {event.type}
                    </span>
                </div>
                {isFull && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {event.category.name}
                    </span>
                    <span className="text-lg font-bold text-blue-600">{fee}</span>
                </div>
                <h3 className="mt-2 line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {event.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {event.description}
                </p>
                <div className="mt-auto flex flex-col gap-2 pt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="size-4 text-blue-400" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}{' '}
                        at {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="size-4 text-blue-400" />
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Users className="size-4" />
                                {event._count.participants}/{event.maxAttendees}
                            </span>
                            <span className="text-xs text-gray-400">
                                by {event.organizer.name}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 font-medium text-blue-600 transition-all group-hover:gap-2">
                            Details <ArrowRight className="size-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
