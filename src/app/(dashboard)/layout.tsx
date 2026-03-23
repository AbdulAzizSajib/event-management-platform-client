import type { Metadata } from 'next';
import Navbar from '@/components/shared/navbar';
import { getAuthUser } from '@/lib/getAuthUser';

export const metadata: Metadata = {
    title: 'Dashboard - Planora',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getAuthUser();

    return (
        <>
            <Navbar isLoggedIn={!!user} userName={user?.name} userImage={user?.image} />
            {children}
        </>
    );
}
