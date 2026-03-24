'use client';

import { logoutAction } from '@/app/(auth)/signin/_logout-action';
import {
    MenuIcon,
    XIcon,
    ChevronDown,
    CalendarDays,
    Compass,
    PlusCircle,
    Ticket,
    Heart,
    Star,
    LogOut,
    Loader2,
    type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

interface SubLink {
    name: string;
    href: string;
    icon: LucideIcon;
    description: string;
}

interface NavLink {
    name: string;
    href?: string;
    subLinks?: SubLink[];
}

interface NavbarProps {
    isLoggedIn?: boolean;
    userName?: string;
    userImage?: string | null;
}

export default function Navbar({ isLoggedIn = false, userName, userImage }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    const links: NavLink[] = [
        { name: 'Home', href: '/' },
        { name: 'Events', href: '/events' },
        {
            name: 'Explore',
            subLinks: [
                { name: 'All Events', href: '/events', icon: Compass, description: 'Browse all upcoming events' },
                { name: 'Create Event', href: '/dashboard?tab=create', icon: PlusCircle, description: 'Host your own event' },
                { name: 'My Tickets', href: '/dashboard?tab=registrations', icon: Ticket, description: 'View your registrations' },
                { name: 'Saved Events', href: '/dashboard?tab=saved', icon: Heart, description: 'Your bookmarked events' },
                { name: 'My Reviews', href: '/dashboard?tab=reviews', icon: Star, description: "Events you've reviewed" },
            ],
        },
        { name: 'Dashboard', href: '/dashboard' },
    ];

    const initials = userName
        ? userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '';

    return (
        <>
            <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-white/80 px-4 py-3.5 backdrop-blur-md md:px-16 lg:px-24">
                <Link href="/" className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
                        Planora
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden items-center space-x-7 text-gray-700 md:flex">
                    {links.map((link) =>
                        link.subLinks ? (
                            <div
                                key={link.name}
                                className="group relative"
                                onMouseEnter={() => setOpenDropdown(link.name)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <div className="flex cursor-pointer items-center gap-1 hover:text-black">
                                    {link.name}
                                    <ChevronDown
                                        className={`mt-px size-4 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <div
                                    className={`absolute top-6 left-0 z-40 w-lg rounded-md border border-gray-100 bg-white p-3 shadow-lg transition-all duration-200 ease-in-out ${openDropdown === link.name ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
                                >
                                    <p className="text-sm text-gray-500">Explore Planora</p>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {link.subLinks.map((sub) => (
                                            <Link
                                                href={sub.href}
                                                key={sub.name}
                                                className="group/link flex items-center gap-2 rounded-md p-2 transition hover:bg-gray-100"
                                            >
                                                <div className="btn w-max gap-1 rounded-md p-2">
                                                    <sub.icon className="size-4.5 text-white transition duration-300 group-hover/link:scale-110" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{sub.name}</p>
                                                    <p className="font-light text-gray-400">{sub.description}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link key={link.name} href={link.href!} className="transition hover:text-black">
                                {link.name}
                            </Link>
                        ),
                    )}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="flex items-center gap-2.5 rounded-full border border-gray-200 py-1.5 pr-4 pl-1.5 transition hover:border-blue-200 hover:bg-blue-50/50">
                                {userImage ? (
                                    <img src={userImage} alt={userName || ''} className="size-8 rounded-full object-cover" />
                                ) : (
                                    <div className="btn flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white">
                                        {initials}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700">{userName}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                disabled={isPending}
                                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <LogOut className="size-4" />
                                )}
                                {isPending ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="rounded-full px-6 py-2.5 font-medium text-gray-700 transition hover:text-black"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="btn rounded-full px-6 py-2.5 font-medium text-white transition hover:opacity-90"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button onClick={() => setIsOpen(true)} className="transition active:scale-90 md:hidden">
                    <MenuIcon className="size-6.5" />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/20 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {links.map((link) => (
                    <div key={link.name} className="text-center">
                        {link.subLinks ? (
                            <>
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                    className="flex items-center justify-center gap-1 text-gray-800"
                                >
                                    {link.name}
                                    <ChevronDown
                                        className={`size-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openDropdown === link.name && (
                                    <div className="mt-2 flex flex-col gap-2 text-left text-sm">
                                        {link.subLinks.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className="block text-gray-600 transition hover:text-black"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={link.href!}
                                className="block text-gray-800 transition hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        )}
                    </div>
                ))}

                <div className="flex flex-col items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-gray-700" onClick={() => setIsOpen(false)}>
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-8 py-2.5 font-medium text-red-600 transition hover:bg-red-100"
                            >
                                {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                                {isPending ? 'Logging out...' : 'Logout'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="text-gray-700" onClick={() => setIsOpen(false)}>
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="btn rounded-full px-8 py-2.5 font-medium text-white transition hover:opacity-90"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                <button onClick={() => setIsOpen(false)} className="btn rounded-md p-2 text-white ring-white active:ring-2">
                    <XIcon />
                </button>
            </div>
        </>
    );
}
