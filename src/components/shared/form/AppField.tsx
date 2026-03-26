'use client';

import type { AnyFieldApi } from '@tanstack/react-form';
import type { ReactNode } from 'react';

interface AppFieldProps {
    field: AnyFieldApi;
    label: string;
    type?: string;
    placeholder?: string;
    icon?: ReactNode;
    append?: ReactNode;
    className?: string;
}

export default function AppField({
    field,
    label,
    type = 'text',
    placeholder,
    icon,
    append,
    className,
}: AppFieldProps) {
    const errors = field.state.meta.isTouched ? field.state.meta.errors : [];
    const hasError = errors.length > 0;

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition ${
                    hasError
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-700 dark:bg-gray-800'
                } ${className ?? ''}`}
            >
                {icon}
                <input
                    id={field.name}
                    name={field.name}
                    type={type}
                    placeholder={placeholder}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none dark:text-gray-200 dark:placeholder-gray-500"
                />
                {append}
            </div>
            {hasError && (
                <p className="mt-1 text-xs text-red-500">
                    {errors.map((e) => (typeof e === 'string' ? e : e?.message)).join(', ')}
                </p>
            )}
        </div>
    );
}
