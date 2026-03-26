'use client';

import { useState } from 'react';
import { Users, CalendarDays, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import AdminOverview from '@/components/modules/AdminDashboard/AdminOverview';
import AdminUsers from '@/components/modules/AdminDashboard/AdminUsers';
import AdminEvents from '@/components/modules/AdminDashboard/AdminEvents';
import AdminReports from '@/components/modules/AdminDashboard/AdminReports';
import AdminCreateCategories from '@/components/modules/AdminDashboard/AdminCreateCategories';

const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
    { id: 'create-categories', label: 'Create Categories', icon: Shield },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="px-4 py-8 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                        <Shield className="size-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your platform</p>
                    </div>
                </div>

                <div className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                    {adminTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
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
                {activeTab === 'create-categories' && <AdminCreateCategories />}
            </div>
        </div>
    );
}
