'use client';

import { useState } from 'react';
import { CalendarDays, Ticket, Heart, Star, PlusCircle, Settings, BarChart3, MapPin, Clock, Users, DollarSign, TrendingUp, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { events, registrations, savedEvents, users, getCategoryById, getEventById } from '@/lib/mock-data';
import type { Event, Registration, SavedEvent } from '@/lib/mock-data';

const currentUser = users[1]; // Michael Chen

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-events', label: 'My Events', icon: CalendarDays },
    { id: 'registrations', label: 'Registrations', icon: Ticket },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'create', label: 'Create Event', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const myEvents = events.filter((e) => e.ownerId === currentUser.id);
    const myRegistrations = registrations.filter((r) => r.userId === currentUser.id);
    const mySavedEvents = savedEvents.filter((s) => s.userId === currentUser.id);
    const totalRevenue = myEvents.reduce((sum, e) => sum + e.price * e.registrationCount, 0);

    return (
        <div className="px-4 md:px-16 lg:px-24 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <img src={currentUser.image} alt={currentUser.name} className="size-16 rounded-full" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                        <p className="text-sm text-gray-500">{currentUser.bio}</p>
                    </div>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-8">
                    {tabs.map((tab) => (
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

                {activeTab === 'overview' && <OverviewTab myEvents={myEvents} myRegistrations={myRegistrations} mySavedEvents={mySavedEvents} totalRevenue={totalRevenue} />}
                {activeTab === 'my-events' && <MyEventsTab myEvents={myEvents} />}
                {activeTab === 'registrations' && <RegistrationsTab myRegistrations={myRegistrations} />}
                {activeTab === 'saved' && <SavedTab mySavedEvents={mySavedEvents} />}
                {activeTab === 'create' && <CreateEventTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </div>
        </div>
    );
}

function OverviewTab({ myEvents, myRegistrations, mySavedEvents, totalRevenue }: { myEvents: Event[]; myRegistrations: Registration[]; mySavedEvents: SavedEvent[]; totalRevenue: number }) {
    const stats = [
        { label: 'My Events', value: myEvents.length, icon: CalendarDays, color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Registrations', value: myRegistrations.length, icon: Ticket, color: 'text-green-600 bg-green-50' },
        { label: 'Saved Events', value: mySavedEvents.length, icon: Heart, color: 'text-red-500 bg-red-50' },
        { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                                <stat.icon className="size-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Registrations</h2>
                <div className="space-y-3">
                    {myRegistrations.filter((r) => r.status === 'CONFIRMED').slice(0, 3).map((reg) => {
                        const event = getEventById(reg.eventId);
                        if (!event) return null;
                        return (
                            <Link key={reg.id} href={`/events/${event.id}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm">
                                <img src={event.image} alt={event.title} className="size-14 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location.split(',')[0]}</span>
                                    </div>
                                </div>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Confirmed</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function MyEventsTab({ myEvents }: { myEvents: Event[] }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Events ({myEvents.length})</h2>
                <button className="flex items-center gap-2 btn text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition">
                    <PlusCircle className="size-4" /> New Event
                </button>
            </div>
            {myEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="size-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">You haven&apos;t created any events yet</p>
                    <button className="mt-4 btn text-white px-6 py-2 rounded-lg text-sm">Create Your First Event</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {myEvents.map((event) => {
                        const category = getCategoryById(event.categoryId);
                        return (
                            <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                                <img src={event.image} alt={event.title} className="h-20 w-32 rounded-lg object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {category && <span className={`rounded-full px-2 py-0.5 text-xs ${category.color}`}>{category.name}</span>}
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{event.status}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{event.title}</p>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Users className="size-3" /> {event.registrationCount}/{event.maxAttendees}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="size-3" /> ${(event.price * event.registrationCount).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"><Eye className="size-4" /></button>
                                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition"><Edit className="size-4" /></button>
                                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition"><Trash2 className="size-4" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function RegistrationsTab({ myRegistrations }: { myRegistrations: Registration[] }) {
    const statusColors: Record<string, string> = {
        CONFIRMED: 'bg-green-100 text-green-700',
        WAITLISTED: 'bg-amber-100 text-amber-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">My Registrations ({myRegistrations.length})</h2>
            <div className="space-y-3">
                {myRegistrations.map((reg) => {
                    const event = getEventById(reg.eventId);
                    if (!event) return null;
                    return (
                        <Link key={reg.id} href={`/events/${event.id}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm">
                            <img src={event.image} alt={event.title} className="size-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{event.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location.split(',')[0]}</span>
                                    <span className="font-medium">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                                </div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[reg.status]}`}>{reg.status}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function SavedTab({ mySavedEvents }: { mySavedEvents: SavedEvent[] }) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Saved Events ({mySavedEvents.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mySavedEvents.map((saved) => {
                    const event = getEventById(saved.eventId);
                    if (!event) return null;
                    return (
                        <Link key={saved.id} href={`/events/${event.id}`} className="group rounded-xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-md">
                            <div className="relative h-36 overflow-hidden">
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                                <button className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500">
                                    <Heart className="size-4 fill-red-500" />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <CalendarDays className="size-3" /> {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm font-bold text-indigo-600">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                                    <span className="text-xs text-indigo-600 font-medium">View Details</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function CreateEventTab() {
    return (
        <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Event</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                        <input type="text" placeholder="Enter event title" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea rows={4} placeholder="Describe your event..." className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                        <input type="date" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                        <input type="time" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                        <input type="text" placeholder="Event venue or address" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket Price ($)</label>
                        <input type="number" min="0" placeholder="0 for free" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Attendees</label>
                        <input type="number" min="1" placeholder="100" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <select className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white">
                            <option value="">Select category</option>
                            <option>Technology</option>
                            <option>Music</option>
                            <option>Business</option>
                            <option>Sports</option>
                            <option>Art & Design</option>
                            <option>Food & Drink</option>
                            <option>Health</option>
                            <option>Education</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
                        <input type="file" accept="image/*" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-indigo-600" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                        <input type="text" placeholder="Add tags separated by commas" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition">
                        Publish Event
                    </button>
                    <button type="button" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                        Save as Draft
                    </button>
                </div>
            </form>
        </div>
    );
}

function SettingsTab() {
    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
                <form className="space-y-5">
                    <div className="flex items-center gap-4">
                        <img src={currentUser.image} alt="avatar" className="size-20 rounded-full" />
                        <button type="button" className="text-sm text-indigo-600 font-medium hover:underline">Change Avatar</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input type="text" defaultValue={currentUser.name} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input type="email" defaultValue={currentUser.email} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                            <textarea rows={3} defaultValue={currentUser.bio} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
                        </div>
                    </div>
                    <button type="submit" className="btn text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition">Save Changes</button>
                </form>
            </div>

            <div className="border-t border-gray-200 pt-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Email notifications', desc: 'Receive email updates about your events', defaultChecked: true },
                        { label: 'Event reminders', desc: 'Get reminded before events you registered for', defaultChecked: true },
                        { label: 'Marketing emails', desc: 'Receive promotional offers and newsletters', defaultChecked: false },
                    ].map((item) => (
                        <label key={item.label} className="flex items-center justify-between py-2 cursor-pointer">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={item.defaultChecked} className="size-5 rounded accent-indigo-600" />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
