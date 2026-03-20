import { CalendarDays, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getCategoryById, type Event } from '@/lib/mock-data';

export interface EventCardProps {
    event: Event;
    variant?: 'default' | 'horizontal';
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
    const category = getCategoryById(event.categoryId);
    const spotsLeft = event.maxAttendees - event.registrationCount;
    const isFull = spotsLeft <= 0;

    if (variant === 'horizontal') {
        return (
            <Link href={`/events/${event.id}`} className='group flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
                <div className='relative h-48 sm:h-auto sm:w-56 shrink-0 overflow-hidden rounded-lg'>
                    <img src={event.image} alt={event.title} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
                    {event.price === 0 && (
                        <span className='absolute top-2 left-2 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white'>Free</span>
                    )}
                </div>
                <div className='flex flex-1 flex-col justify-between py-1'>
                    <div>
                        {category && <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color}`}>{category.icon} {category.name}</span>}
                        <h3 className='mt-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors'>{event.title}</h3>
                        <p className='mt-1 text-sm text-gray-500 line-clamp-2'>{event.description}</p>
                    </div>
                    <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                        <span className='flex items-center gap-1'><CalendarDays className='size-4' /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className='flex items-center gap-1'><MapPin className='size-4' /> {event.location.split(',')[0]}</span>
                        <span className='flex items-center gap-1'><Users className='size-4' /> {event.registrationCount} registered</span>
                        {event.avgRating && <span className='flex items-center gap-1'><Star className='size-4 fill-amber-400 text-amber-400' /> {event.avgRating}</span>}
                        <span className='ml-auto font-semibold text-indigo-600'>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/events/${event.id}`} className='group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
            <div className='relative h-48 overflow-hidden'>
                <img src={event.image} alt={event.title} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
                <div className='absolute top-3 left-3 flex gap-2'>
                    {event.price === 0 && (
                        <span className='rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white'>Free</span>
                    )}
                    {event.isFeatured && (
                        <span className='rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-medium text-white'>Featured</span>
                    )}
                </div>
                {isFull && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                        <span className='rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white'>Sold Out</span>
                    </div>
                )}
            </div>
            <div className='flex flex-1 flex-col p-4'>
                <div className='flex items-center justify-between'>
                    {category && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color}`}>{category.icon} {category.name}</span>}
                    <span className='text-lg font-bold text-indigo-600'>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                </div>
                <h3 className='mt-2 text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors'>{event.title}</h3>
                <p className='mt-1 text-sm text-gray-500 line-clamp-2'>{event.description}</p>
                <div className='mt-auto pt-4 flex flex-col gap-2 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                        <CalendarDays className='size-4 text-indigo-400' />
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {event.time}
                    </div>
                    <div className='flex items-center gap-1'>
                        <MapPin className='size-4 text-indigo-400' />
                        <span className='line-clamp-1'>{event.location}</span>
                    </div>
                    <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                        <div className='flex items-center gap-3'>
                            <span className='flex items-center gap-1'><Users className='size-4' /> {event.registrationCount}</span>
                            {event.avgRating && <span className='flex items-center gap-1'><Star className='size-4 fill-amber-400 text-amber-400' /> {event.avgRating}</span>}
                        </div>
                        <span className='flex items-center gap-1 text-indigo-600 font-medium group-hover:gap-2 transition-all'>
                            Details <ArrowRight className='size-4' />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
