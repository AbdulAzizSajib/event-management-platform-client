'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { updateEvent, getEventById, type CreateEventPayload } from '@/services/event.services';
import { getAllCategories } from '@/services/category.services';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { z } from 'zod';

interface CategoryOption {
    id: string;
    name: string;
}

const updateEventSchema = z.object({
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

interface EditEventFormValues {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    type: 'PUBLIC' | 'PRIVATE';
    fee: number;
    maxAttendees: number;
    categoryId: string;
    eventLink: string;
}

interface Props {
    eventId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditEventModal({ eventId, onClose, onSuccess }: Props) {
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [defaultValues, setDefaultValues] = useState<EditEventFormValues | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        Promise.all([getEventById(eventId), getAllCategories()])
            .then(([eventRes, catRes]) => {
                const event = eventRes.data;
                setCategories(catRes.data as unknown as CategoryOption[]);
                setDefaultValues({
                    title: event.title,
                    description: event.description,
                    date: new Date(event.date).toISOString().split('T')[0],
                    time: event.time,
                    venue: event.venue,
                    type: event.type as 'PUBLIC' | 'PRIVATE',
                    fee: parseFloat(event.fee),
                    maxAttendees: event.maxAttendees,
                    categoryId: event.categoryId,
                    eventLink: event.eventLink || '',
                });
                if (event.image) setImagePreview(event.image);
            })
            .catch(() => setServerError('Failed to load event data'))
            .finally(() => setLoadingEvent(false));
    }, [eventId]);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: Partial<CreateEventPayload>) => updateEvent(eventId, payload),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Event</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    {loadingEvent ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-blue-500" />
                        </div>
                    ) : serverError && !defaultValues ? (
                        <p className="py-10 text-center text-sm text-red-500">{serverError}</p>
                    ) : defaultValues ? (
                        <EditForm
                            defaultValues={defaultValues}
                            categories={categories}
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                            fileInputRef={fileInputRef}
                            serverError={serverError}
                            setServerError={setServerError}
                            isPending={isPending}
                            mutateAsync={mutateAsync}
                            onSuccess={onSuccess}
                            onClose={onClose}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

interface EditFormProps {
    defaultValues: EditEventFormValues;
    categories: CategoryOption[];
    imageFile: File | null;
    setImageFile: (f: File | null) => void;
    imagePreview: string | null;
    setImagePreview: (p: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    serverError: string | null;
    setServerError: (e: string | null) => void;
    isPending: boolean;
    mutateAsync: (payload: Partial<CreateEventPayload>) => Promise<unknown>;
    onSuccess: () => void;
    onClose: () => void;
}

function EditForm({
    defaultValues,
    categories,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    fileInputRef,
    serverError,
    setServerError,
    isPending,
    mutateAsync,
    onSuccess,
    onClose,
}: EditFormProps) {
    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const payload: Partial<CreateEventPayload> = {
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
                if (value.eventLink) payload.eventLink = value.eventLink;
                if (imageFile) payload.image = imageFile;

                await mutateAsync(payload);
                onSuccess();
                onClose();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const message = error?.response?.data?.message || error?.message || 'Failed to update event';
                setServerError(message);
            }
        },
    });

    return (
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
                    <form.Field name="title" validators={{ onChange: updateEventSchema.shape.title }}>
                        {(field) => (
                            <AppField field={field} label="Event Title" type="text" placeholder="Enter event title" />
                        )}
                    </form.Field>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                    <form.Field name="description" validators={{ onChange: updateEventSchema.shape.description }}>
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your event..."
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                                {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {typeof field.state.meta.errors[0] === 'object'
                                            ? (field.state.meta.errors[0] as { message?: string })?.message
                                            : field.state.meta.errors[0]}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Date */}
                <form.Field name="date" validators={{ onChange: updateEventSchema.shape.date }}>
                    {(field) => <AppField field={field} label="Date" type="date" placeholder="" />}
                </form.Field>

                {/* Time */}
                <form.Field name="time" validators={{ onChange: updateEventSchema.shape.time }}>
                    {(field) => <AppField field={field} label="Time" type="text" placeholder="e.g. 10:00 AM" />}
                </form.Field>

                {/* Venue */}
                <div className="sm:col-span-2">
                    <form.Field name="venue" validators={{ onChange: updateEventSchema.shape.venue }}>
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
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Image (optional)</label>
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
                            <img src={imagePreview} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
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
                            className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-blue-400 hover:text-blue-500"
                        >
                            <ImagePlus className="size-8" />
                            <span className="text-sm">Click to upload image</span>
                        </button>
                    )}
                </div>

                {/* Type */}
                <form.Field name="type" validators={{ onChange: updateEventSchema.shape.type }}>
                    {(field) => (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Type</label>
                            <select
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value as 'PUBLIC' | 'PRIVATE')}
                                onBlur={field.handleBlur}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                    {typeof field.state.meta.errors[0] === 'object'
                                        ? (field.state.meta.errors[0] as { message?: string })?.message
                                        : field.state.meta.errors[0]}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* Category */}
                <form.Field name="categoryId" validators={{ onChange: updateEventSchema.shape.categoryId }}>
                    {(field) => (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                    {typeof field.state.meta.errors[0] === 'object'
                                        ? (field.state.meta.errors[0] as { message?: string })?.message
                                        : field.state.meta.errors[0]}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* Fee */}
                <form.Field name="fee" validators={{ onChange: updateEventSchema.shape.fee }}>
                    {(field) => (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Ticket Fee (৳)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0 for free"
                                value={field.state.value || ''}
                                onChange={(e) => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                onBlur={field.handleBlur}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                    {typeof field.state.meta.errors[0] === 'object'
                                        ? (field.state.meta.errors[0] as { message?: string })?.message
                                        : field.state.meta.errors[0]}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* Max Attendees */}
                <form.Field name="maxAttendees" validators={{ onChange: updateEventSchema.shape.maxAttendees }}>
                    {(field) => (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Max Attendees</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="100"
                                value={field.state.value || ''}
                                onChange={(e) => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                onBlur={field.handleBlur}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                    {typeof field.state.meta.errors[0] === 'object'
                                        ? (field.state.meta.errors[0] as { message?: string })?.message
                                        : field.state.meta.errors[0]}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>
            </div>

            {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {serverError}
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    Cancel
                </button>
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                    {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                            isPending={isSubmitting || isPending}
                            pendingLabel="Saving..."
                            disabled={!canSubmit}
                        >
                            Save Changes
                        </AppSubmitButton>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
