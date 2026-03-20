import CategoriesSection from '@/components/modules/Home/categories-section';
import FaqSection from '@/components/modules/Home/faq-section';
import FeaturedEvents from '@/components/modules/Home/featured-events';
import HeroSection from '@/components/modules/Home/hero-section';
import HowItWorks from '@/components/modules/Home/how-it-works';
import Newsletter from '@/components/modules/Home/newsletter';
import OurTestimonialSection from '@/components/modules/Home/our-testimonials-section';
import StatsSection from '@/components/modules/Home/stats-section';
import WhatWeDoSection from '@/components/modules/Home/what-we-do-section';

export default function Page() {
    return (
        <main className='px-4'>
            <HeroSection />
            <WhatWeDoSection />
            <FeaturedEvents />
            <CategoriesSection />
            <HowItWorks />
            <StatsSection />
            <OurTestimonialSection />
            <FaqSection />
            <Newsletter />
        </main>
    );
}
