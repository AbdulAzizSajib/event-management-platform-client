import SectionTitle from '@/components/shared/section-title';
import { StarIcon } from 'lucide-react';
import { testimonials } from '@/lib/mock-data';

export default function OurTestimonialSection() {
    return (
        <section className='flex flex-col items-center justify-center mt-32'>
            <SectionTitle title='What People Say' subtitle='Hear from event organizers and attendees who love using Planora for their events.' />

            <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {testimonials.map((item, index) => (
                    <div key={index} className='w-full max-w-88 space-y-4 rounded-md border border-gray-200 bg-white p-5 text-gray-500 transition-all duration-300 hover:-translate-y-1'>
                        <div className='flex gap-1'>
                            {...Array(item.rating)
                                .fill('')
                                .map((_, i) => <StarIcon key={i} className='size-4 fill-amber-400 text-amber-400' />)}
                        </div>
                        <p className='line-clamp-3'>"{item.review}"</p>
                        <div className='flex items-center gap-2 pt-3'>
                            <img className='size-10 rounded-full' src={item.image} alt={item.name} />
                            <div>
                                <p className='font-medium text-gray-800'>{item.name}</p>
                                <p className='text-gray-500 text-xs'>{item.about}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
