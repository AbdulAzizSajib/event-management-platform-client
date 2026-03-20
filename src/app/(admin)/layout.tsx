import type { Metadata } from 'next';
import Navbar from '@/components/shared/navbar';

export const metadata: Metadata = {
    title: 'Admin - Planora',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
