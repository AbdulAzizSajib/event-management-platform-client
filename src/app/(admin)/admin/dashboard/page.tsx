import { getAdminDashboard } from '@/services/admin.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import AdminDashboardClient from '@/components/modules/AdminDashboard/AdminDashboardClient';

const AdminDashboardPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['admin-dashboard'],
        queryFn: getAdminDashboard,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminDashboardClient />
        </HydrationBoundary>
    );
};

export default AdminDashboardPage;
