'use client';

import { saveEvent, unsaveEvent } from '@/services/savedEvent.services';
import { Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SaveButtonProps {
    eventId: string;
}

export default function SaveButton({ eventId }: SaveButtonProps) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (saved) {
                await unsaveEvent(eventId);
                setSaved(false);
            } else {
                const result = await saveEvent(eventId);
                if (result.success || result.alreadySaved) {
                    setSaved(true);
                }
            }
        } catch {
            // silent fail
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex size-10 items-center justify-center rounded-full transition ${
                saved
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            } disabled:opacity-50`}
            title={saved ? 'Unsave event' : 'Save event'}
        >
            {loading ? (
                <Loader2 className="size-5 animate-spin" />
            ) : (
                <Heart className={`size-5 ${saved ? 'fill-red-500' : ''}`} />
            )}
        </button>
    );
}
