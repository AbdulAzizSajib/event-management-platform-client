import { notFound } from 'next/navigation';
import { getEventById } from '@/services/event.services';
import { getAuthUser } from '@/lib/getAuthUser';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import EventDetailClient from '@/components/modules/Event/EventDetailClient';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    const [user] = await Promise.all([
        getAuthUser(),
        queryClient.prefetchQuery({
            queryKey: ['event-detail', id],
            queryFn: () => getEventById(id),
        }),
    ]);

    // Check if event exists after prefetch
    const eventData = queryClient.getQueryData(['event-detail', id]) as { data: unknown } | undefined;
    if (!eventData?.data) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EventDetailClient eventId={id} user={user} />
        </HydrationBoundary>
    );
}
