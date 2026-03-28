import { getAuthUser } from '@/lib/getAuthUser';
import { redirect } from 'next/navigation';
import { getUserDashboard } from '@/services/dashboard.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const user = await getAuthUser();
    if (!user) redirect('/signin');

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user-dashboard'],
        queryFn: getUserDashboard,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DashboardClient userId={user.id} />
        </HydrationBoundary>
    );
}
