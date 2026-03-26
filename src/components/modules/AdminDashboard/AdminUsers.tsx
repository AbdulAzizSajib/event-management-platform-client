'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, User, Loader2, CalendarDays, Users, Star, ChevronLeft, ChevronRight, X, ShieldBan, ShieldCheck, Trash2 } from 'lucide-react';
import { getAdminUsers, updateUserStatus, type AdminUser } from '@/services/admin.services';
import type { PaginationMeta } from '@/types/api.types';

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const handleStatusChange = async (userId: string, newStatus: string, label: string) => {
        if (!confirm(`Are you sure you want to ${label} this user?`)) return;
        setActionLoadingId(userId);
        try {
            await updateUserStatus(userId, newStatus);
            fetchUsers();
        } catch {
            alert(`Failed to ${label} user`);
        } finally {
            setActionLoadingId(null);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { page, limit: 10 };
            if (debouncedSearch) params.searchTerm = debouncedSearch;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;

            const response = await getAdminUsers(params);
            setUsers(response.data);
            setMeta(response.meta || null);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div>
            {/* Header + Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        All Users {meta ? `(${meta.total})` : ''}
                    </h2>
                    <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:w-auto dark:border-gray-700 dark:bg-gray-900">
                        <Search className="size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-sm outline-none sm:w-48 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')}>
                                <X className="size-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex gap-1.5">
                        <span className="self-center text-xs font-medium text-gray-500 dark:text-gray-400">Role:</span>
                        {['', 'USER', 'ADMIN'].map((r) => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={`rounded-full px-3 py-1 text-xs transition ${
                                    roleFilter === r ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400'
                                }`}
                            >
                                {r || 'All'}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1.5">
                        <span className="self-center text-xs font-medium text-gray-500 dark:text-gray-400">Status:</span>
                        {['', 'ACTIVE', 'BLOCKED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`rounded-full px-3 py-1 text-xs transition ${
                                    statusFilter === s ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400'
                                }`}
                            >
                                {s || 'All'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 animate-spin text-blue-500" />
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Users className="mb-3 size-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">User</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Events</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Participations</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Reviews</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} className="size-9 rounded-full object-cover" />
                                                ) : (
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                        <User className="size-4 text-gray-500" />
                                                    </div>
                                                )}
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
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <CalendarDays className="size-3.5" />
                                                {user._count.organizedEvents}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Users className="size-3.5" />
                                                {user._count.participants}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Star className="size-3.5" />
                                                {user._count.reviews}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {user.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'BLOCKED', 'block')}
                                                        disabled={actionLoadingId === user.id}
                                                        title="Block user"
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-950"
                                                    >
                                                        {actionLoadingId === user.id ? <Loader2 className="size-4 animate-spin" /> : <ShieldBan className="size-4" />}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'ACTIVE', 'activate')}
                                                        disabled={actionLoadingId === user.id}
                                                        title="Activate user"
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-500 disabled:opacity-50 dark:hover:bg-green-950"
                                                    >
                                                        {actionLoadingId === user.id ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'DELETED', 'delete')}
                                                    disabled={actionLoadingId === user.id}
                                                    title="Delete user"
                                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
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
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        Next
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
