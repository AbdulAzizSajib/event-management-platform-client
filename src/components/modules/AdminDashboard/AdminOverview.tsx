'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    CalendarDays,
    Star,
    CreditCard,
    UserCheck,
    UserX,
    Loader2,
    User,
} from 'lucide-react';
import Link from 'next/link';
import { getAdminDashboard, type AdminDashboardData } from '@/services/admin.services';

export default function AdminOverview() {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminDashboard()
            .then((res) => setData(res.data))
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

    if (!data) {
        return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Failed to load dashboard data</div>;
    }

    const stats = [
        { label: 'Total Users', value: data.counts.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' },
        { label: 'Total Events', value: data.counts.totalEvents, icon: CalendarDays, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' },
        { label: 'Total Reviews', value: data.counts.totalReviews, icon: Star, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400' },
        { label: 'Total Payments', value: data.counts.totalPayments, icon: CreditCard, color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400' },
        { label: 'Active Users', value: data.counts.activeUsers, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400' },
        { label: 'Blocked Users', value: data.counts.blockedUsers, icon: UserX, color: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400' },
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

            {/* Recent Events */}
            <div>
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Recent Events</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Event</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Fee</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Participants</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data.recentEvents.map((event) => {
                                    const fee = parseFloat(event.fee);
                                    return (
                                        <tr key={event.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/events/${event.id}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                                                        <CalendarDays className="size-4 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 hover:text-blue-600 dark:text-white">
                                                            {event.title}
                                                        </p>
                                                        {event.isFeatured && (
                                                            <span className="text-xs text-amber-600 dark:text-amber-400">Featured</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        event.type === 'PUBLIC'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                                                    }`}
                                                >
                                                    {event.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                                {fee === 0 ? (
                                                    <span className="text-green-600 dark:text-green-400">Free</span>
                                                ) : (
                                                    `৳${fee}`
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Users className="size-3.5" />
                                                    {event._count.participants}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div>
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Recent Users</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">User</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data.recentUsers.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <User className="size-4 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
