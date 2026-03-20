'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface AppSubmitButtonProps {
    children: ReactNode;
    isPending?: boolean;
    pendingLabel?: string;
    disabled?: boolean;
}

export default function AppSubmitButton({
    children,
    isPending = false,
    pendingLabel = 'Please wait...',
    disabled = false,
}: AppSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || isPending}
            className="btn flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isPending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    {pendingLabel}
                </>
            ) : (
                children
            )}
        </button>
    );
}
