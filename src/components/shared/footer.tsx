import { CalendarDays, LinkedinIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const data = [
        {
            title: 'Platform',
            links: [
                { title: 'Browse Events', href: '/events' },
                { title: 'Create Event', href: '/dashboard?tab=create' },
                { title: 'Categories', href: '/events' },
                { title: 'Pricing', href: '#pricing' },
            ],
        },
        {
            title: 'Account',
            links: [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Tickets', href: '/dashboard?tab=registrations' },
                { title: 'Saved Events', href: '/dashboard?tab=saved' },
                { title: 'Settings', href: '/dashboard?tab=settings' },
            ],
        },
        {
            title: 'Company',
            links: [
                { title: 'About Us', href: '#about' },
                { title: 'Contact', href: '#contact' },
                { title: 'Privacy Policy', href: '#privacy' },
                { title: 'Terms of Service', href: '#terms' },
            ],
        },
    ];

    return (
        <footer className="px-4 md:px-16 lg:px-24 text-[13px] mt-32 text-gray-500 dark:text-gray-400">
            <div className="flex flex-wrap items-start md:justify-between gap-10 md:gap-15">
                <Link href="/" className="flex items-center gap-2">
                    <div className='flex size-9 items-center justify-center rounded-lg btn'>
                        <CalendarDays className='size-5 text-white' />
                    </div>
                    <span className='text-lg font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent'>Planora</span>
                </Link>
                {data.map((item, index) => (
                    <div key={index} className="max-w-80">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                        <ul className="mt-5 space-y-2">
                            {item.links.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="hover:text-blue-500 transition">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div className="max-w-80 md:ml-40">
                    <p className='font-semibold text-gray-800 dark:text-gray-200'>Stay Updated</p>
                    <p className='mt-5 text-sm'>
                        Get notified about the latest events and exclusive offers in your area.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="email" placeholder="your@email.com" className='bg-white w-full border border-gray-300 h-9 px-3 outline-none rounded-l-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200' />
                        <button className='flex shrink-0 items-center justify-center btn text-white h-9 px-6 rounded-r-md'>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row py-7 mt-12 border-gray-200 md:justify-between max-md:items-center border-t max-md:text-center gap-2 items-end dark:border-gray-800">
                <p className="text-center">&copy; 2026 Planora. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" aria-label="Instagram">
                        <InstagramIcon className="size-5 text-gray-400 hover:text-blue-500 transition" />
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <LinkedinIcon className="size-5 text-gray-400 hover:text-blue-500 transition" />
                    </a>
                    <a href="#" aria-label="Twitter">
                        <TwitterIcon className="size-5 text-gray-400 hover:text-blue-500 transition" />
                    </a>
                    <a href="#" aria-label="YouTube">
                        <YoutubeIcon className="size-6 text-gray-400 hover:text-blue-500 transition" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
