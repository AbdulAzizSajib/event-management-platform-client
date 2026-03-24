'use client';

import SectionTitle from '@/components/shared/section-title';
import { getAllCategories } from '@/services/category.services';
import { Loader2, Briefcase, Utensils, Music, Dumbbell, Monitor, Palette, GraduationCap, Heart, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ApiCategory {
    id: string;
    name: string;
    icon: string | null;
    _count?: { events: number };
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    business: Briefcase,
    'food & drinks': Utensils,
    music: Music,
    sports: Dumbbell,
    technology: Monitor,
    'art & design': Palette,
    education: GraduationCap,
    health: Heart,
};

const CATEGORY_COLORS: Record<string, string> = {
    business: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    'food & drinks': 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
    music: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    sports: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    technology: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    'art & design': 'bg-pink-50 text-pink-600 group-hover:bg-pink-100',
    education: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
    health: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
};

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
                        const key = cat.name.toLowerCase();
                        const Icon = CATEGORY_ICONS[key] || Monitor;
                        const colorClass = CATEGORY_COLORS[key] || 'bg-gray-50 text-gray-600 group-hover:bg-gray-100';
                        const eventCount = cat._count?.events ?? 0;

                        return (
                            <Link
                                key={cat.id}
                                href={`/events?categoryId=${cat.id}`}
                                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className={`flex size-14 items-center justify-center rounded-xl transition-colors ${colorClass}`}>
                                    <Icon className="size-7" />
                                </div>
                                <h3 className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
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
