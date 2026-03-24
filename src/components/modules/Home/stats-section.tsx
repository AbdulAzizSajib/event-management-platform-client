export default function StatsSection() {
    const stats: { value: string; label: string }[] = [
        { value: '12K+', label: 'Active Users' },
        { value: '340+', label: 'Events Hosted' },
        { value: '28K+', label: 'Tickets Sold' },
        { value: '4.8', label: 'Average Rating' },
    ];

    return (
        <section className="mt-32 mx-auto w-full max-w-5xl rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 px-8 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center text-center text-white">
                        <span className="text-4xl font-bold">{stat.value}</span>
                        <span className="mt-1 text-sm text-blue-100">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
