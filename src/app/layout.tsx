import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
import LenisScroll from '@/components/shared/lenis-scroll';
import QueryProvider from '@/providers/QueryProvider';

const urbanist = Urbanist({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={urbanist.variable}>
            <LenisScroll />
            <body className="font-sans">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
