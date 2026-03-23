'use client';

import { useState } from 'react';
import { CalendarDays, Ticket, Heart, PlusCircle, Settings, BarChart3, User, Star } from 'lucide-react';
import OverviewTab from '@/components/modules/Dashboard/OverviewTab';
import MyEventsTab from '@/components/modules/Dashboard/MyEventsTab';
import RegistrationsTab from '@/components/modules/Dashboard/RegistrationsTab';
import SavedTab from '@/components/modules/Dashboard/SavedTab';
import CreateEventTab from '@/components/modules/Dashboard/CreateEventTab';
import SettingsTab from '@/components/modules/Dashboard/SettingsTab';
import MyReviewsTab from '@/components/modules/Dashboard/MyReviewsTab';

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-events', label: 'My Events', icon: CalendarDays },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'registrations', label: 'Registrations', icon: Ticket },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'create', label: 'Create Event', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="px-4 py-8 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                {/* Tabs */}
                <div className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                                activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <tab.icon className="size-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'my-events' && <MyEventsTab />}
                {activeTab === 'my-reviews' && <MyReviewsTab />}
                {activeTab === 'registrations' && <RegistrationsTab />}
                {activeTab === 'saved' && <SavedTab />}
                {activeTab === 'create' && <CreateEventTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </div>
        </div>
    );
}
