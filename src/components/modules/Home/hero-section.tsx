'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, SearchIcon, CalendarDaysIcon, TagIcon } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.trim()) params.set('searchTerm', search.trim());
        if (date) params.set('startDate', date);
        if (type) params.set('type', type);
        router.push(`/events${params.toString() ? `?${params}` : ''}`);
    };

    return (
        <section className="flex flex-col items-center justify-center relative min-h-[90vh] overflow-hidden py-20">

            <h1 className="text-4xl md:text-6xl/18 text-center font-semibold max-w-3xl mt-5 bg-linear-to-r from-black to-[#748298] text-transparent bg-clip-text dark:from-white dark:to-gray-400">
                Discover, Create & Manage{" "}
                <span className="bg-linear-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">Unforgettable Events</span>
            </h1>

            <p className="text-slate-600 md:text-base max-md:px-2 text-center max-w-lg mt-4 dark:text-gray-400">
                Your all-in-one platform for finding exciting events, organizing memorable experiences, and connecting with your community.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link href="/events" className="flex items-center gap-2 btn hover:opacity-90 text-white px-8 py-3 rounded-full transition">
                    <span>Explore Events</span>
                    <ArrowRightIcon className='size-5' />
                </Link>
                <Link href="/dashboard?tab=create" className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 px-8 py-3 rounded-full transition bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500">
                    <span>Create Event</span>
                </Link>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-2xl mt-12 bg-white rounded-2xl shadow-lg shadow-blue-100 border border-gray-100 p-2 dark:bg-gray-900 dark:border-gray-800 dark:shadow-blue-950/30">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <SearchIcon className="size-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search events..."
                            className="bg-transparent outline-none w-full text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <TagIcon className="size-5 text-gray-400" />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-transparent outline-none text-sm text-gray-600 cursor-pointer dark:text-gray-300"
                        >
                            <option value="">Any type</option>
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <CalendarDaysIcon className="size-5 text-gray-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent outline-none text-sm text-gray-600"
                        />
                    </div>
                    <button type="submit" className="btn text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium">
                        Search
                    </button>
                </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Popular:</span>
                {(['Technology', 'Music', 'Business', 'Sports', 'Food & Drink'] as const).map((tag: string) => (
                    <Link key={tag} href={`/events?searchTerm=${tag}`} className="rounded-full border border-gray-200 px-4 py-1.5 transition hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950">
                        {tag}
                    </Link>
                ))}
            </div>
        </section>
    );
}
