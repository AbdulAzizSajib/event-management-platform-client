import { getAuthUser } from '@/lib/getAuthUser';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const user = await getAuthUser();
    if (!user) redirect('/signin');

    return <DashboardClient userId={user.id} />;
}
