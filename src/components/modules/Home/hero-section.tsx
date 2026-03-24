'use client';

import { ArrowRightIcon, SearchIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="flex flex-col items-center justify-center relative min-h-[90vh] overflow-hidden py-20">
            
            <h1 className="text-4xl md:text-6xl/18 text-center font-semibold max-w-3xl mt-5 bg-linear-to-r from-black to-[#748298] text-transparent bg-clip-text">
                Discover, Create & Manage{" "}
                <span className="bg-linear-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">Unforgettable Events</span>
            </h1>

            <p className="text-slate-600 md:text-base max-md:px-2 text-center max-w-lg mt-4">
                Your all-in-one platform for finding exciting events, organizing memorable experiences, and connecting with your community.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link href="/events" className="flex items-center gap-2 btn hover:opacity-90 text-white px-8 py-3 rounded-full transition">
                    <span>Explore Events</span>
                    <ArrowRightIcon className='size-5' />
                </Link>
                <Link href="/dashboard?tab=create" className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 px-8 py-3 rounded-full transition bg-white">
                    <span>Create Event</span>
                </Link>
            </div>

            <div className="w-full max-w-2xl mt-12 bg-white rounded-2xl shadow-lg shadow-blue-100 border border-gray-100 p-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-gray-50">
                        <SearchIcon className="size-5 text-gray-400" />
                        <input type="text" placeholder="Search events..." className="bg-transparent outline-none w-full text-sm" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
                        <MapPinIcon className="size-5 text-gray-400" />
                        <input type="text" placeholder="Location" className="bg-transparent outline-none w-full text-sm sm:w-28" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
                        <CalendarDaysIcon className="size-5 text-gray-400" />
                        <input type="text" placeholder="Any date" className="bg-transparent outline-none w-full text-sm sm:w-24" />
                    </div>
                    <button className="btn text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium">
                        Search
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
                <span className="font-medium text-gray-700">Popular:</span>
                {(['Technology', 'Music', 'Business', 'Sports', 'Food & Drink'] as const).map((tag: string) => (
                    <Link key={tag} href="/events" className="rounded-full border border-gray-200 px-4 py-1.5 transition hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50">
                        {tag}
                    </Link>
                ))}
            </div>
        </section>
    );
}
