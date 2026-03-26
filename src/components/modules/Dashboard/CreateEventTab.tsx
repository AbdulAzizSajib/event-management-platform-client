'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, ImagePlus, Loader2, X } from 'lucide-react';
import { createEvent, type CreateEventPayload } from '@/services/event.services';
import { getAllCategories } from '@/services/category.services';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { z } from 'zod';

interface CategoryOption {
    id: string;
    name: string;
}

const createEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    venue: z.string().min(2, 'Venue is required'),
    type: z.enum(['PUBLIC', 'PRIVATE'], { message: 'Select event type' }),
    fee: z.number().min(0, 'Fee cannot be negative'),
    maxAttendees: z.number().min(1, 'At least 1 attendee required'),
    categoryId: z.string().min(1, 'Select a category'),
    eventLink: z.string().optional(),
});

export default function CreateEventTab() {
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data as unknown as CategoryOption[]))
            .catch(() => {});
    }, []);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    });

    const form = useForm({
        defaultValues: {
            title: '',
            description: '',
            date: '',
            time: '',
            venue: '',
            type: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
            fee: 0,
            maxAttendees: 100,
            categoryId: '',
            eventLink: '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(null);
            try {
                const payload: CreateEventPayload = {
                    title: value.title,
                    description: value.description,
                    date: new Date(value.date).toISOString(),
                    time: value.time,
                    venue: value.venue,
                    type: value.type,
                    fee: Number(value.fee),
                    maxAttendees: Number(value.maxAttendees),
                    categoryId: value.categoryId,
                };
                if (value.eventLink) {
                    payload.eventLink = value.eventLink;
                }
                if (imageFile) {
                    payload.image = imageFile;
                }

                await mutateAsync(payload);
                setSuccess('Event created successfully!');
                form.reset();
                setImageFile(null);
                setImagePreview(null);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const message = error?.response?.data?.message || error?.message || 'Failed to create event';
                setServerError(message);
            }
        },
    });

    return (
        <div className="max-w-2xl">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Create New Event</h2>

            {success && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                    <CheckCircle className="size-4" />
                    {success}
                </div>
            )}

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Title */}
                    <div className="sm:col-span-2">
                        <form.Field name="title" validators={{ onChange: createEventSchema.shape.title }}>
                            {(field) => (
                                <AppField field={field} label="Event Title" type="text" placeholder="Enter event title" />
                            )}
                        </form.Field>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                        <form.Field name="description" validators={{ onChange: createEventSchema.shape.description }}>
                            {(field) => (
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe your event..."
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                        <p className="mt-1 text-xs text-red-500">{typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as { message?: string })?.message : field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {/* Date */}
                    <form.Field name="date" validators={{ onChange: createEventSchema.shape.date }}>
                        {(field) => <AppField field={field} label="Date" type="date" placeholder="" />}
                    </form.Field>

                    {/* Time */}
                    <form.Field name="time" validators={{ onChange: createEventSchema.shape.time }}>
                        {(field) => <AppField field={field} label="Time" type="text" placeholder="e.g. 10:00 AM" />}
                    </form.Field>

                    {/* Venue */}
                    <div className="sm:col-span-2">
                        <form.Field name="venue" validators={{ onChange: createEventSchema.shape.venue }}>
                            {(field) => (
                                <AppField field={field} label="Venue" type="text" placeholder="Event venue or address" />
                            )}
                        </form.Field>
                    </div>

                    {/* Event Link */}
                    <div className="sm:col-span-2">
                        <form.Field name="eventLink">
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Event Link (optional)"
                                    type="url"
                                    placeholder="Online meeting link (if any)"
                                />
                            )}
                        </form.Field>
                    </div>

                    {/* Image Upload */}
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Event Image (optional)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-48 w-full rounded-xl object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-gray-700"
                            >
                                <ImagePlus className="size-8" />
                                <span className="text-sm">Click to upload image</span>
                            </button>
                        )}
                    </div>

                    {/* Type */}
                    <form.Field name="type" validators={{ onChange: createEventSchema.shape.type }}>
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                                <select
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value as 'PUBLIC' | 'PRIVATE')}
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                                {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">{typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as { message?: string })?.message : field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Category */}
                    <form.Field name="categoryId" validators={{ onChange: createEventSchema.shape.categoryId }}>
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">{typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as { message?: string })?.message : field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Fee */}
                    <form.Field name="fee" validators={{ onChange: createEventSchema.shape.fee }}>
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Fee (৳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0 for free"
                                    value={field.state.value || ''}
                                    onChange={(e) => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                                {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">{typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as { message?: string })?.message : field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Max Attendees */}
                    <form.Field name="maxAttendees" validators={{ onChange: createEventSchema.shape.maxAttendees }}>
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Max Attendees</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="100"
                                    value={field.state.value || ''}
                                    onChange={(e) => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                    onBlur={field.handleBlur}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                                {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">{typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as { message?: string })?.message : field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                {serverError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                        {serverError}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Creating..."
                                disabled={!canSubmit}
                            >
                                Publish Event
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </div>
    );
}
