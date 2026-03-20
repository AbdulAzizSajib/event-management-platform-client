'use client';

import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, X, CalendarDays, Grid3X3, List } from 'lucide-react';
import EventCard from '@/components/shared/event-card';
import { events, categories } from '@/lib/mock-data';

export default function EventsPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.categoryId === selectedCategory;
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'free' && event.price === 0) ||
            (priceFilter === 'paid' && event.price > 0);
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="px-4 md:px-16 lg:px-24 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
                    <p className="mt-2 text-gray-500">Discover {events.length}+ events happening around you</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <Search className="size-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events by name or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch('')}><X className="size-4 text-gray-400" /></button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-200 bg-white text-gray-600'}`}
                    >
                        <SlidersHorizontal className="size-4" />
                        Filters
                    </button>
                    <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-3 transition ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
                        >
                            <Grid3X3 className="size-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-3 transition ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
                        >
                            <List className="size-5" />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`rounded-full px-4 py-1.5 text-sm transition ${selectedCategory === 'all' ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`rounded-full px-4 py-1.5 text-sm transition ${selectedCategory === cat.id ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Price</label>
                            <div className="flex gap-2">
                                {([
                                    { value: 'all' as const, label: 'All Prices' },
                                    { value: 'free' as const, label: 'Free' },
                                    { value: 'paid' as const, label: 'Paid' },
                                ]).map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setPriceFilter(opt.value)}
                                        className={`rounded-full px-4 py-1.5 text-sm transition ${priceFilter === opt.value ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">{filteredEvents.length} events found</p>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <CalendarDays className="size-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No events found</h3>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                        <button onClick={() => { setSearch(''); setSelectedCategory('all'); setPriceFilter('all'); }} className="mt-4 text-sm text-indigo-600 font-medium hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} variant="horizontal" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
