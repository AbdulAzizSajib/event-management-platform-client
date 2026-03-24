import SectionTitle from '@/components/shared/section-title';
import { Search, MousePointerClick, CalendarCheck, PartyPopper, type LucideIcon } from 'lucide-react';

interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function HowItWorks() {
    const steps: Step[] = [
        {
            icon: Search,
            title: 'Discover',
            description: 'Browse through hundreds of events by category, location, or date to find what excites you.',
        },
        {
            icon: MousePointerClick,
            title: 'Register',
            description: 'Sign up for events in seconds with our streamlined registration and secure payment process.',
        },
        {
            icon: CalendarCheck,
            title: 'Attend',
            description: 'Get reminders, directions, and all the details you need to make the most of your event.',
        },
        {
            icon: PartyPopper,
            title: 'Share & Review',
            description: 'Rate your experience, share with friends, and help others discover great events.',
        },
    ];

    return (
        <section className="flex flex-col items-center justify-center mt-32">
            <SectionTitle
                title="How It Works"
                subtitle="Getting started with Planora is simple. Follow these steps to discover and enjoy amazing events."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 w-full max-w-5xl">
                {steps.map((step, index) => (
                    <div key={index} className="relative flex flex-col items-center text-center group">
                        <div className="flex size-16 items-center justify-center rounded-2xl btn text-white mb-4 transition-transform duration-300 group-hover:scale-110">
                            <step.icon className="size-7" />
                        </div>
                        <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">{index + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                        <p className="mt-2 text-sm text-gray-500">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
