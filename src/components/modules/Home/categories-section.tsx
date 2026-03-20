import SectionTitle from '@/components/shared/section-title';
import { categories } from '@/lib/mock-data';
import Link from 'next/link';

export default function CategoriesSection() {
    return (
        <section className="flex flex-col items-center justify-center mt-32">
            <SectionTitle
                title="Browse by Category"
                subtitle="Find events that match your interests. From tech meetups to food festivals, there's something for everyone."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href="/events"
                        className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-200"
                    >
                        <span className="text-4xl">{cat.icon}</span>
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                        <p className="text-xs text-gray-400">{cat.eventCount} events</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
