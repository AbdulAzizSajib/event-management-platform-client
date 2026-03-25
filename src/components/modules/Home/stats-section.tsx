import { getPlatformStats } from '@/services/event.services';

export default async function StatsSection() {
    const stats = await getPlatformStats().catch(() => null);
    const data = stats?.data;

    const items = [
        { value: data ? `${data.totalUsers.toLocaleString()}+` : '—', label: 'Active Users' },
        { value: data ? `${data.totalEvents.toLocaleString()}+` : '—', label: 'Events Hosted' },
        { value: data ? `${data.totalTicketsSold.toLocaleString()}+` : '—', label: 'Tickets Sold' },
        {
            value: data ? (data.avgRating > 0 ? data.avgRating.toFixed(1) : '—') : '—',
            label: 'Average Rating',
        },
    ];

    return (
        <section className="mt-32 mx-auto w-full max-w-5xl rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 px-8 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {items.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center text-center text-white">
                        <span className="text-4xl font-bold">{stat.value}</span>
                        <span className="mt-1 text-sm text-blue-100">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
