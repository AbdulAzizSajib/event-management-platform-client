'use client';

import {
    CalendarDays,
    Ticket,
    Heart,
    DollarSign,
    MapPin,
    Star,
    Mail,
    Loader2,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getUserDashboard, type DashboardData } from '@/services/dashboard.services';
import type { ApiResponse } from '@/types/api.types';

export default function OverviewTab() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['user-dashboard'],
        queryFn: getUserDashboard,
        refetchOnWindowFocus: "always",
    });

    const data = (response as ApiResponse<DashboardData>)?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="py-20 text-center text-gray-500">Failed to load dashboard data</div>
        );
    }

    const stats = [
        { label: 'Organized Events', value: data.counts.organizedEvents, icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
        { label: 'Participations', value: data.counts.participations, icon: Ticket, color: 'text-green-600 bg-green-50' },
        { label: 'Saved Events', value: data.counts.savedEvents, icon: Heart, color: 'text-red-500 bg-red-50' },
        { label: 'Total Spent', value: `৳${data.counts.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
        { label: 'Reviews', value: data.counts.reviews, icon: Star, color: 'text-purple-600 bg-purple-50' },
        { label: 'Pending Invitations', value: data.counts.pendingInvitations, icon: Mail, color: 'text-blue-600 bg-blue-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                                <stat.icon className="size-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Upcoming + Participation Breakdown */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Upcoming */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Clock className="size-4 text-blue-500" />
                        Upcoming
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Events you organized</span>
                            <span className="text-lg font-bold text-blue-600">{data.upcoming.organizedEvents}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Events you&apos;re attending</span>
                            <span className="text-lg font-bold text-green-600">{data.upcoming.participatingEvents}</span>
                        </div>
                    </div>
                </div>

                {/* Participation Breakdown */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Users className="size-4 text-blue-500" />
                        Participation Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="size-4 text-green-500" /> Approved
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.participationBreakdown.approved}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <AlertCircle className="size-4 text-amber-500" /> Pending
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.participationBreakdown.pending}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <XCircle className="size-4 text-red-500" /> Rejected
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.participationBreakdown.rejected}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Participations */}
            {data.recentParticipations.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Participations</h3>
                        <Link href="/dashboard?tab=registrations" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data.recentParticipations.slice(0, 4).map((p) => (
                            <Link
                                key={p.id}
                                href={`/events/${p.event.id}`}
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                {p.event.image ? (
                                    <img src={p.event.image} alt={p.event.title} className="size-12 shrink-0 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-100">
                                        <CalendarDays className="size-5 text-blue-400" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-900 dark:text-white">{p.event.title}</p>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3" />
                                            {new Date(p.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            {p.event.venue}
                                        </span>
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                            {p.event.type}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                        p.status === 'APPROVED'
                                            ? 'bg-green-100 text-green-700'
                                            : p.status === 'PENDING'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {p.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Organized Events */}
            {data.recentOrganizedEvents.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">My Organized Events</h3>
                        <Link href="/dashboard?tab=my-events" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data.recentOrganizedEvents.map((e) => {
                            const fee = parseFloat(e.fee);
                            return (
                                <Link
                                    key={e.id}
                                    href={`/events/${e.id}`}
                                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
                                >
                                    {e.image ? (
                                        <img src={e.image} alt={e.title} className="size-12 shrink-0 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-blue-100">
                                            <CalendarDays className="size-5 text-amber-500" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-gray-900 dark:text-white">{e.title}</p>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="size-3" />
                                                {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="size-3" />
                                                {e._count.participants} participants
                                            </span>
                                            <span className="font-medium text-blue-600">
                                                {fee === 0 ? 'Free' : `৳${fee}`}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                        {e.type}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Saved Events */}
            {data.recentSavedEvents.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recently Saved</h3>
                        <Link href="/dashboard?tab=saved" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {data.recentSavedEvents.map((s) => {
                            const fee = parseFloat(s.event.fee);
                            return (
                                <Link
                                    key={s.id}
                                    href={`/events/${s.event.id}`}
                                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <Heart className="size-5 shrink-0 fill-red-400 text-red-400" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{s.event.title}</p>
                                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                                            <span>{new Date(s.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <span>{s.event.venue}</span>
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-blue-600">
                                        {fee === 0 ? 'Free' : `৳${fee}`}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
