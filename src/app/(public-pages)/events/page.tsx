'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X, CalendarDays, Grid3X3, List, ChevronLeft, ChevronRight, ArrowUpDown, Loader2 } from 'lucide-react';
import EventCard from '@/components/shared/event-card';
import { getAllEvents } from '@/services/event.services';
import { getAllCategories } from '@/services/category.services';
import type { Event, Category } from '@/types';
import type { PaginationMeta } from '@/types/api.types';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [typeFilter, setTypeFilter] = useState<'' | 'PUBLIC' | 'PRIVATE'>('');
    const [featuredFilter, setFeaturedFilter] = useState<'' | 'true' | 'false'>('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch categories once
    useEffect(() => {
        getAllCategories().then((res) => setCategories(res.data)).catch(() => {});
    }, []);

    // Fetch events
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = {
                page,
                limit: 9,
                sortBy,
                sortOrder,
            };
            if (debouncedSearch) params.searchTerm = debouncedSearch;
            if (selectedCategory) params.categoryId = selectedCategory;
            if (typeFilter) params.type = typeFilter;
            if (featuredFilter) params.isFeatured = featuredFilter === 'true';

            const response = await getAllEvents(params);
            setEvents(response.data);
            setMeta(response.meta || null);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, sortOrder, debouncedSearch, selectedCategory, typeFilter, featuredFilter]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setTypeFilter('');
        setFeaturedFilter('');
        setSortBy('createdAt');
        setSortOrder('desc');
        setPage(1);
    };

    const hasActiveFilters = selectedCategory || typeFilter || featuredFilter || debouncedSearch;

    return (
        <div className="px-4 py-12 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
                    <p className="mt-2 text-gray-500">
                        Discover {meta?.total || 0} events happening around you
                    </p>
                </div>

                {/* Search Bar + Controls */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <Search className="size-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-sm outline-none"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')}>
                                <X className="size-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                            showFilters
                                ? 'border-blue-300 bg-blue-50 text-blue-600'
                                : 'border-gray-200 bg-white text-gray-600'
                        }`}
                    >
                        <SlidersHorizontal className="size-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                !
                            </span>
                        )}
                    </button>
                    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-3 transition ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                        >
                            <Grid3X3 className="size-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-3 transition ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                        >
                            <List className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5">
                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                                    className={`rounded-full px-4 py-1.5 text-sm transition ${
                                        !selectedCategory ? 'btn text-white' : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                                        className={`rounded-full px-4 py-1.5 text-sm transition ${
                                            selectedCategory === cat.id
                                                ? 'btn text-white'
                                                : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Event Type</label>
                            <div className="flex gap-2">
                                {([
                                    { value: '' as const, label: 'All' },
                                    { value: 'PUBLIC' as const, label: 'Public' },
                                    { value: 'PRIVATE' as const, label: 'Private' },
                                ]).map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setTypeFilter(opt.value); setPage(1); }}
                                        className={`rounded-full px-4 py-1.5 text-sm transition ${
                                            typeFilter === opt.value
                                                ? 'btn text-white'
                                                : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Featured */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Featured</label>
                            <div className="flex gap-2">
                                {([
                                    { value: '' as const, label: 'All' },
                                    { value: 'true' as const, label: 'Featured' },
                                    { value: 'false' as const, label: 'Non-Featured' },
                                ]).map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setFeaturedFilter(opt.value); setPage(1); }}
                                        className={`rounded-full px-4 py-1.5 text-sm transition ${
                                            featuredFilter === opt.value
                                                ? 'btn text-white'
                                                : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Sort By</label>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { value: 'createdAt', label: 'Newest' },
                                    { value: 'date', label: 'Event Date' },
                                    { value: 'fee', label: 'Price' },
                                    { value: 'title', label: 'Name' },
                                ]).map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            if (sortBy === opt.value) {
                                                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                                            } else {
                                                setSortBy(opt.value);
                                                setSortOrder('desc');
                                            }
                                            setPage(1);
                                        }}
                                        className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm transition ${
                                            sortBy === opt.value
                                                ? 'btn text-white'
                                                : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                        }`}
                                    >
                                        {opt.label}
                                        {sortBy === opt.value && (
                                            <ArrowUpDown className="size-3" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}

                {/* Results count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {meta ? `${meta.total} events found` : 'Loading...'}
                    </p>
                    {meta && meta.totalPages > 1 && (
                        <p className="text-sm text-gray-400">
                            Page {meta.page} of {meta.totalPages}
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-blue-500" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <CalendarDays className="mb-4 size-16 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-700">No events found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} variant="horizontal" />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
