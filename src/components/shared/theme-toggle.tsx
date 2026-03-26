'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="size-9" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="size-4 text-yellow-400" />
            ) : (
                <Moon className="size-4 text-gray-600" />
            )}
        </button>
    );
}
