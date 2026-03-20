import type { Metadata } from 'next';
import Navbar from '@/components/shared/navbar';

export const metadata: Metadata = {
    title: 'Dashboard - Planora',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
