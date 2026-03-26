'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Camera, CheckCircle, Loader2, User, X } from 'lucide-react';
import { getMyProfile, updateProfile, type UpdateProfilePayload, type UserProfile } from '@/services/user.services';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';

export default function SettingsTab() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        getMyProfile()
            .then((res) => setProfile(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    });

    const form = useForm({
        defaultValues: {
            name: profile?.name || '',
            phone: profile?.phone || '',
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(null);
            try {
                const payload: UpdateProfilePayload = {};
                if (value.name) payload.name = value.name;
                if (value.phone) payload.phone = value.phone;
                if (imageFile) payload.image = imageFile;

                const result = await mutateAsync(payload);
                setProfile(result.data);
                setImageFile(null);
                setImagePreview(null);
                setSuccess('Profile updated successfully!');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const message = error?.response?.data?.message || error?.message || 'Failed to update profile';
                setServerError(message);
            }
        },
    });

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            form.setFieldValue('name', profile.name || '');
            form.setFieldValue('phone', profile.phone || '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>

                {success && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                        <CheckCircle className="size-4" />
                        {success}
                    </div>
                )}

                {serverError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                        {serverError}
                    </div>
                )}

                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        {profile?.image ? (
                            <img src={profile.image} alt={profile.name} className="size-20 rounded-full object-cover" />
                        ) : (
                            <div className="flex size-20 items-center justify-center rounded-full bg-blue-100">
                                <User className="size-10 text-blue-600" />
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{profile?.name}</p>
                            <p className="text-xs text-gray-500">{profile?.email}</p>
                            <p className="mt-0.5 text-xs text-gray-400">Role: {profile?.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <form.Field name="name">
                            {(field) => (
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            )}
                        </form.Field>

                        {/* Phone */}
                        <form.Field name="phone">
                            {(field) => (
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="01712345678"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            )}
                        </form.Field>

                        {/* Image Upload */}
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
                            <div className="flex items-center gap-4">
                                {(imagePreview || profile?.image) && (
                                    <div className="relative">
                                        <img
                                            src={imagePreview || (profile?.image as string)}
                                            alt="Preview"
                                            className="size-16 rounded-full object-cover border border-gray-200"
                                        />
                                        {imageFile && (
                                            <button
                                                type="button"
                                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-blue-950">
                                    <Camera className="size-4" />
                                    {imageFile ? 'Change Image' : 'Upload Image'}
                                    <input
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
                                </label>
                                {imageFile && (
                                    <span className="text-xs text-gray-400">{imageFile.name}</span>
                                )}
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                        </div>
                    </div>

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
                </form>
            </div>
        </div>
    );
}
