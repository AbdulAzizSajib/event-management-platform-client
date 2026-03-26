import SectionTitle from '@/components/shared/section-title';

export default function Newsletter() {
    return (
        <section className='flex flex-col items-center justify-center mt-32'>
            <SectionTitle title='Never Miss an Event' subtitle='Subscribe to get personalized event recommendations and exclusive early access to popular events.' />

            <div className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200 dark:bg-gray-900 dark:border-gray-800 dark:ring-gray-700'>
                <input className='flex-1 rounded-full pl-5 max-md:py-3 outline-none dark:text-gray-200' type='email' placeholder='Enter your email address' />
                <button className='font-medium hidden md:block btn text-white px-7 py-3 rounded-full hover:opacity-90 active:scale-95 transition'>
                    Subscribe
                </button>
            </div>
            <button className='font-medium md:hidden btn text-white px-7 py-3 rounded-full hover:opacity-90 active:scale-95 transition'>
                Subscribe
            </button>
        </section>
    );
}
