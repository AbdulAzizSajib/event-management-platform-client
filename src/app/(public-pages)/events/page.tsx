import { getAllEvents } from '@/services/event.services';
import { getAllCategories } from '@/services/category.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import EventsPageClient from '@/components/modules/Event/EventsPageClient';

interface EventsPageProps {
    searchParams: Promise<{
        categoryId?: string;
        searchTerm?: string;
        type?: 'PUBLIC' | 'PRIVATE';
        startDate?: string;
    }>;
}

const EventsPage = async ({ searchParams }: EventsPageProps) => {
    const params = await searchParams;
    const queryClient = new QueryClient();

    // Build initial params from URL search params
    const initialParams: Record<string, unknown> = {
        page: 1,
        limit: 9,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    };
    if (params.searchTerm) initialParams.searchTerm = params.searchTerm;
    if (params.categoryId) initialParams.categoryId = params.categoryId;
    if (params.type) initialParams.type = params.type;
    if (params.startDate) initialParams.startDate = params.startDate;

    // Prefetch both events and categories in parallel
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['events', initialParams],
            queryFn: () => getAllEvents(initialParams),
        }),
        queryClient.prefetchQuery({
            queryKey: ['categories'],
            queryFn: () => getAllCategories(),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EventsPageClient />
        </HydrationBoundary>
    );
};

export default EventsPage;
