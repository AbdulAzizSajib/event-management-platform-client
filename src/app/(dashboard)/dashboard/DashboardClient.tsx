'use client';

import { useState } from 'react';
import { CalendarDays, Ticket, Heart, PlusCircle, Settings, BarChart3, Star, Banknote, MessageCircle } from 'lucide-react';
import OverviewTab from '@/components/modules/Dashboard/OverviewTab';
import MyEventsTab from '@/components/modules/Dashboard/MyEventsTab';
import RegistrationsTab from '@/components/modules/Dashboard/RegistrationsTab';
import SavedTab from '@/components/modules/Dashboard/SavedTab';
import CreateEventTab from '@/components/modules/Dashboard/CreateEventTab';
import SettingsTab from '@/components/modules/Dashboard/SettingsTab';
import MyReviewsTab from '@/components/modules/Dashboard/MyReviewsTab';
import MyPaymentsTab from '@/components/modules/Dashboard/MyPaymentsTab';
import MessagesTab from '@/components/modules/Dashboard/MessagesTab';

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-events', label: 'My Events', icon: CalendarDays },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'my-registrations', label: 'My Registrations', icon: Ticket },
    { id: 'my-payments', label: 'My Payments', icon: Banknote },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'create', label: 'Create Event', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
];

interface Props {
    userId: string;
}

export default function DashboardClient({ userId }: Props) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="px-4 py-8 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                {/* Tabs */}
                <div className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                    {tabs.map((tab) => (
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

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'my-events' && <MyEventsTab />}
                {activeTab === 'messages' && <MessagesTab userId={userId} />}
                {activeTab === 'my-reviews' && <MyReviewsTab />}
                {activeTab === 'my-registrations' && <RegistrationsTab />}
                {activeTab === 'my-payments' && <MyPaymentsTab />}
                {activeTab === 'saved' && <SavedTab />}
                {activeTab === 'create' && <CreateEventTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </div>
        </div>
    );
}
