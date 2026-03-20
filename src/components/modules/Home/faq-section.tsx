'use client';

import SectionTitle from '@/components/shared/section-title';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { faqData } from '@/lib/mock-data';

export default function FaqSection() {
    const [isOpen, setIsOpen] = useState<number | false>(false);

    return (
        <section className='flex flex-col items-center justify-center mt-32'>
            <SectionTitle title="FAQ's" subtitle="Got questions about Planora? Find answers to the most commonly asked questions below." />
            <div className='mx-auto mt-12 w-full max-w-xl'>
                {faqData.map((item, index) => (
                    <div key={index} className='flex flex-col border-b border-gray-200 bg-white'>
                        <h3 className='flex cursor-pointer items-start justify-between gap-4 py-4 font-medium' onClick={() => setIsOpen(isOpen === index ? false : index)}>
                            {item.question}
                            {isOpen === index ? <MinusIcon className='size-5 text-gray-500' /> : <PlusIcon className='size-5 text-gray-500' />}
                        </h3>
                        <p className={`pb-4 text-sm/6 text-gray-500 ${isOpen === index ? 'block' : 'hidden'}`}>{item.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
