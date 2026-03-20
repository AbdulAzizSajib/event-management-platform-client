'use client';

import { ArrowRightIcon, SearchIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="flex flex-col items-center justify-center relative min-h-[90vh] overflow-hidden py-20">
            <svg className="absolute inset-0 -z-10" width="1440" height="1018" viewBox="0 0 1440 1018" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#a)">
                    <ellipse cx="271.282" cy="200.379" rx="271.282" ry="200.379" fill="#EEF0FF" />
                </g>
                <g filter="url(#b)">
                    <ellipse cx="993.487" cy="451.53" rx="359.487" ry="265.53" fill="url(#c)" fillOpacity=".08" />
                </g>
                <defs>
                    <filter id="a" x="-300" y="-300" width="1142.56" height="1000.76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur" />
                    </filter>
                    <filter id="b" x="333.9" y="-114.1" width="1319.18" height="1131.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="150.05" result="effect1_foregroundBlur" />
                    </filter>
                    <linearGradient id="c" x1="550.41" y1="500.394" x2="1343.15" y2="82.986" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#C7D2FE" />
                        <stop offset=".5" stopColor="#A78BFA" />
                        <stop offset="1" stopColor="#6366F1" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-indigo-100 bg-white/60">
                <div className="flex items-center -space-x-3">
                    <img className="size-7 rounded-full border-3 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&auto=format&fit=crop" alt="user" />
                    <img className="size-7 rounded-full border-3 border-white" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50&h=50&auto=format&fit=crop" alt="user" />
                    <img className="size-7 rounded-full border-3 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&auto=format&fit=crop" alt="user" />
                </div>
                <p className="pl-2 pr-3 text-gray-600">Join 12,000+ event enthusiasts</p>
            </div>

            <h1 className="text-4xl md:text-6xl/18 text-center font-semibold max-w-3xl mt-5 bg-linear-to-r from-black to-[#748298] text-transparent bg-clip-text">
                Discover, Create & Manage{" "}
                <span className="bg-linear-to-b from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Unforgettable Events</span>
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

            <div className="w-full max-w-2xl mt-12 bg-white rounded-2xl shadow-lg shadow-indigo-100 border border-gray-100 p-2">
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
                    <Link key={tag} href="/events" className="rounded-full border border-gray-200 px-4 py-1.5 transition hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50">
                        {tag}
                    </Link>
                ))}
            </div>
        </section>
    );
}
