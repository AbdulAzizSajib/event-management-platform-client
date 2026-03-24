import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function WhatWeDoSection() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-20 mt-20">
            <div className="relative shadow-2xl shadow-blue-600/40 rounded-2xl overflow-hidden shrink-0">
                <img className="max-w-sm w-full object-cover rounded-2xl"
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=451&h=451&auto=format&fit=crop"
                    alt="event" />
                <div className="flex items-center gap-1 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl">
                    <div className="flex -space-x-4 shrink-0">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop" alt="attendee"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-1" />
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&auto=format&fit=crop" alt="attendee"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[2]" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&auto=format&fit=crop"
                            alt="attendee"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[3]" />
                        <div
                            className="flex items-center justify-center text-xs text-white size-9 rounded-full border-[3px] border-white bg-blue-600 hover:-translate-y-1 transition z-[4]">
                            50+
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-800">Join our growing community</p>
                </div>
            </div>
            <div className="text-sm text-slate-600 max-w-md">
                <h2 className="text-xl uppercase font-semibold text-slate-700">Why Planora?</h2>
                <div className="w-24 h-[3px] rounded-full bg-linear-to-r from-blue-500 to-indigo-300"></div>
                <p className="mt-8">Planora empowers you to create, discover, and manage events effortlessly. Whether you&apos;re hosting a small workshop or a large conference, our tools make it simple.</p>
                <p className="mt-4">With powerful registration management, real-time analytics, and seamless payment processing, focus on what matters most - creating amazing experiences.</p>
                <p className="mt-4">From event discovery to post-event reviews, Planora is the complete platform for building thriving communities through memorable events.</p>
                <Link href="/events" className="flex items-center gap-2 mt-8 hover:opacity-90 transition btn py-3 px-8 rounded-full text-white w-max">
                    <span>Explore Events</span>
                    <ArrowRightIcon className='size-5' />
                </Link>
            </div>
        </section>
    );
}
