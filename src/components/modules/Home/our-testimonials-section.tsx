import SectionTitle from '@/components/shared/section-title';
import { StarIcon } from 'lucide-react';
import { getFeaturedReviews } from '@/services/review.services';

export default async function OurTestimonialSection() {
    const res = await getFeaturedReviews().catch(() => null);
    const reviews = res?.data ?? [];

    if (reviews.length === 0) return null;

    return (
        <section className='flex flex-col items-center justify-center mt-32'>
            <SectionTitle title='What People Say' subtitle='Hear from event organizers and attendees who love using Planora for their events.' />

            <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {reviews.map((item) => (
                    <div key={item.id} className='w-full max-w-88 space-y-4 rounded-md border border-gray-200 bg-white p-5 text-gray-500 transition-all duration-300 hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400'>
                        <div className='flex gap-1'>
                            {Array(item.rating)
                                .fill('')
                                .map((_, i) => <StarIcon key={i} className='size-4 fill-amber-400 text-amber-400' />)}
                        </div>
                        <p className='line-clamp-3'>"{item.comment}"</p>
                        <div className='flex items-center gap-2 pt-3'>
                            {item.user.image ? (
                                <img className='size-10 rounded-full object-cover' src={item.user.image} alt={item.user.name} />
                            ) : (
                                <div className='flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600'>
                                    {item.user.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className='font-medium text-gray-800 dark:text-gray-200'>{item.user.name}</p>
                                <p className='text-gray-500 text-xs'>{item.event.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
