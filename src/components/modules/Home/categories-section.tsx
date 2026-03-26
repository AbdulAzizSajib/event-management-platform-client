'use client';

import SectionTitle from '@/components/shared/section-title';
import { getIconComponent } from '@/lib/iconMapper';
import { getAllCategories } from '@/services/category.services';
import { Loader2, Monitor } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ApiCategory {
    id: string;
    name: string;
    icon: string | null;
    _count?: { events: number };
}

const toPascalCase = (value: string) => {
    return value
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
};

const getCategoryIcon = (iconUrl: string | null) => {
    if (!iconUrl) return Monitor;

    try {
        const slug = new URL(iconUrl).pathname.split('/').filter(Boolean).pop();
        if (!slug) return Monitor;
        return getIconComponent(toPascalCase(slug));
    } catch {
        const slug = iconUrl.split('/').filter(Boolean).pop();
        if (!slug) return Monitor;
        return getIconComponent(toPascalCase(slug));
    }
};

const PRIMARY_ICON_COLOR_CLASS = 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:group-hover:bg-blue-900';

export default function CategoriesSection() {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mt-32 flex flex-col items-center justify-center">
            <SectionTitle
                title="Browse by Category"
                subtitle="Find events that match your interests. From tech meetups to food festivals, there's something for everyone."
            />

            {loading ? (
                <div className="mt-12 flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon);
                        const eventCount = cat._count?.events ?? 0;

                        return (
                            <Link
                                key={cat.id}
                                href={`/events?categoryId=${cat.id}`}
                                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
                            >
                                <div className={`flex size-14 items-center justify-center rounded-xl transition-colors ${PRIMARY_ICON_COLOR_CLASS}`}>
                                    <Icon className="size-7" />
                                </div>
                                <h3 className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-200">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {eventCount} {eventCount === 1 ? 'event' : 'events'}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
