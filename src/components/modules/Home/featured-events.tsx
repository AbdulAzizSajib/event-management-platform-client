import SectionTitle from '@/components/shared/section-title';
import EventCard from '@/components/shared/event-card';
import { getFeaturedEvents } from '@/services/event.services';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default async function FeaturedEvents() {
    const response = await getFeaturedEvents();
    const events = response.data;
    const featured = events.filter((e) => e.isFeatured);

    return (
        <section className="mt-32 flex flex-col items-center justify-center">
            <SectionTitle
                title="Featured Events"
                subtitle="Hand-picked events that you won't want to miss. From tech conferences to music festivals, find your next experience."
            />
            <div className="mt-12 flex w-full max-w-6xl flex-wrap items-stretch justify-center gap-6">
                {featured.length > 0 ? (
                    featured.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No featured events at the moment.</p>
                )}
            </div>
            <Link
                href="/events"
                className="mt-10 flex items-center gap-2 font-medium text-indigo-600 transition-all hover:gap-3"
            >
                View all events <ArrowRightIcon className="size-4" />
            </Link>
        </section>
    );
}
