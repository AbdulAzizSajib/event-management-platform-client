import type { Metadata } from 'next';
import Banner from '@/components/shared/banner';
import Footer from '@/components/shared/footer';
import Navbar from '@/components/shared/navbar';

export const metadata: Metadata = {
    title: 'Planora - Discover & Manage Events',
    description: 'Planora is your all-in-one event management platform. Discover amazing events, create memorable experiences, and connect with your community.',
    appleWebApp: {
        title: 'Planora',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
