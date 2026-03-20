import SectionTitle from '@/components/shared/section-title';
import EventCard from '@/components/shared/event-card';
import { getFeaturedEvents } from '@/lib/mock-data';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedEvents() {
    const featured = getFeaturedEvents();

    return (
        <section className="flex flex-col items-center justify-center mt-32">
            <SectionTitle
                title="Featured Events"
                subtitle="Hand-picked events that you won't want to miss. From tech conferences to music festivals, find your next experience."
            />
            <div className="flex flex-wrap items-stretch justify-center gap-6 mt-12 w-full max-w-6xl">
                {featured.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            <Link href="/events" className="flex items-center gap-2 mt-10 text-indigo-600 font-medium hover:gap-3 transition-all">
                View all events <ArrowRightIcon className="size-4" />
            </Link>
        </section>
    );
}
