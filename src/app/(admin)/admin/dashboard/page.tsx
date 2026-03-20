'use client';

import { useState } from 'react';
import { Users, CalendarDays, Ticket, DollarSign, TrendingUp, BarChart3, Shield, Search, MoreVertical, ArrowUpRight, Activity, Eye, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import { events, users, adminStats, getCategoryById } from '@/lib/mock-data';

const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="px-4 md:px-16 lg:px-24 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                        <Shield className="size-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage your platform</p>
                    </div>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-8">
                    {adminTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon className="size-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'users' && <AdminUsers />}
                {activeTab === 'events' && <AdminEvents />}
                {activeTab === 'reports' && <AdminReports />}
            </div>
        </div>
    );
}

function AdminOverview() {
    const stats = [
        { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), growth: adminStats.monthlyGrowth.users, icon: Users, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Events', value: adminStats.totalEvents, growth: adminStats.monthlyGrowth.events, icon: CalendarDays, color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Registrations', value: adminStats.totalRegistrations.toLocaleString(), growth: adminStats.monthlyGrowth.registrations, icon: Ticket, color: 'text-green-600 bg-green-50' },
        { label: 'Revenue', value: `$${adminStats.totalRevenue.toLocaleString()}`, growth: adminStats.monthlyGrowth.revenue, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                                <stat.icon className="size-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                            <ArrowUpRight className="size-3 text-green-500" />
                            <span className="text-green-600 font-medium">{stat.growth}%</span>
                            <span className="text-gray-400">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                    {adminStats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 px-4 py-3">
                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                                activity.type === 'registration' ? 'bg-green-50 text-green-600' :
                                activity.type === 'event' ? 'bg-indigo-50 text-indigo-600' :
                                activity.type === 'review' ? 'bg-amber-50 text-amber-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                                <Activity className="size-4" />
                            </div>
                            <p className="flex-1 text-sm text-gray-600">{activity.message}</p>
                            <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AdminUsers() {
    const allUsers = [
        ...users,
        { id: 'u5', name: 'Alex Turner', email: 'alex@example.com', role: 'USER' as const, image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200', bio: 'Event attendee' },
        { id: 'u6', name: 'Priya Sharma', email: 'priya@example.com', role: 'USER' as const, image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', bio: 'Workshop organizer' },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">All Users ({allUsers.length})</h2>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 w-full sm:w-auto">
                    <Search className="size-4 text-gray-400" />
                    <input type="text" placeholder="Search users..." className="outline-none text-sm w-full sm:w-48" />
                </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.image} alt={user.name} className="size-9 rounded-full" />
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.bio}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"><Eye className="size-4" /></button>
                                            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition"><Ban className="size-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AdminEvents() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">All Events ({events.length})</h2>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 w-full sm:w-auto">
                    <Search className="size-4 text-gray-400" />
                    <input type="text" placeholder="Search events..." className="outline-none text-sm w-full sm:w-48" />
                </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Event</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Registrations</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => {
                                const category = getCategoryById(event.categoryId);
                                return (
                                    <tr key={event.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={event.image} alt={event.title} className="size-10 rounded-lg object-cover" />
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1 max-w-48">{event.title}</p>
                                                    <p className="text-xs text-gray-400">${event.price}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {category && <span className={`rounded-full px-2 py-0.5 text-xs ${category.color}`}>{category.name}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-gray-600">{event.registrationCount}/{event.maxAttendees}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"><Eye className="size-4" /></button>
                                                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-green-100 hover:text-green-600 transition"><CheckCircle className="size-4" /></button>
                                                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition"><Ban className="size-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AdminReports() {
    const reports = [
        { id: 1, type: 'Spam', target: 'Summer Music Festival', reporter: 'Alex Turner', date: '2026-03-18', status: 'PENDING' },
        { id: 2, type: 'Inappropriate Content', target: 'Review by user123', reporter: 'Priya Sharma', date: '2026-03-17', status: 'PENDING' },
        { id: 3, type: 'Fake Event', target: 'Free Concert Tickets', reporter: 'Emily Davis', date: '2026-03-15', status: 'RESOLVED' },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Reports ({reports.length})</h2>
            <div className="space-y-3">
                {reports.map((report) => (
                    <div key={report.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${report.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                            <AlertTriangle className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{report.type}</p>
                            <p className="text-sm text-gray-500">Target: {report.target} &middot; Reported by: {report.reporter}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(report.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${report.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {report.status}
                        </span>
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition"><MoreVertical className="size-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}
