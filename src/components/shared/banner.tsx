import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

export default function Banner() {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 py-2 text-center text-sm font-medium text-white">
            <SparklesIcon className="size-4" />
            <p>Discover amazing events happening near you</p>
            <Link href="/events" className="ml-2 flex items-center gap-1 rounded-md bg-white px-3 py-1 text-blue-600 transition hover:bg-slate-100 active:scale-95">
                Browse Events
                <ArrowRightIcon className="size-3.5" />
            </Link>
        </div>
    );
}
