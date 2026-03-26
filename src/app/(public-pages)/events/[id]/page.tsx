import { CalendarDays, Clock, MapPin, Users, Star, ArrowLeft, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/services/event.services';
import RegisterButton from '@/components/modules/Event/RegisterButton';
import SaveButton from '@/components/modules/Event/SaveButton';
import ShareButtons from '@/components/modules/Event/ShareButtons';
import ReviewForm from '@/components/modules/Event/ReviewForm';
import EventChat from '@/components/modules/Event/EventChat';
import { getAuthUser } from '@/lib/getAuthUser';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await getAuthUser();

    let event;
    try {
        const response = await getEventById(id);
        event = response.data;
    } catch {
        notFound();
    }

    if (!event) {
        notFound();
    }

    const fee = parseFloat(event.fee);
    const isFree = fee === 0;
    const spotsLeft = event.maxAttendees - event._count.participants;
    const percentFull = Math.round((event._count.participants / event.maxAttendees) * 100);

    return (
        <div className="px-4 py-8 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/events"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-blue-600 dark:text-gray-400"
                >
                    <ArrowLeft className="size-4" /> Back to Events
                </Link>

                {/* Hero Banner */}
                <div className="relative h-64 overflow-hidden rounded-2xl md:h-96">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-950 dark:to-indigo-950">
                            <CalendarDays className="size-20 text-blue-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                                {event.category.name}
                            </span>
                            {event.isFeatured && (
                                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                                    Featured
                                </span>
                            )}
                            {isFree && (
                                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                                    Free
                                </span>
                            )}
                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800/90 dark:text-gray-300">
                                {event.type}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white md:text-4xl">{event.title}</h1>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <SaveButton eventId={event.id} />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* About */}
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">About This Event</h2>
                            <p className="leading-relaxed text-gray-600 dark:text-gray-400">{event.description}</p>
                        </div>

                        {/* Event Link */}
                        {event.eventLink && (
                            <div>
                                <h3 className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <ExternalLink className="size-4" /> Event Link
                                </h3>
                                <a
                                    href={event.eventLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {event.eventLink}
                                </a>
                            </div>
                        )}

                        {/* Organizer */}
                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                            {event.organizer.image ? (
                                <img
                                    src={event.organizer.image}
                                    alt={event.organizer.name}
                                    className="size-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                    <User className="size-7 text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Organized by</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{event.organizer.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{event.organizer.email}</p>
                            </div>
                        </div>

                        {/* Reviews */}
                        {event.reviews && event.reviews.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                    Reviews ({event._count.reviews})
                                </h2>
                                <div className="space-y-4">
                                    {event.reviews.map((review) => (
                                        <div key={review.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                            <div className="mb-3 flex items-center gap-3">
                                                {review.user?.image ? (
                                                    <img src={review.user.image} alt={review.user.name} className="size-10 rounded-full" />
                                                ) : (
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                        <User className="size-5 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">{review.user?.name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: review.rating }).map((_, i) => (
                                                            <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Review Form */}
                        <ReviewForm eventId={event.id} />

                        {event._count.reviews === 0 && (
                            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
                                <Star className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4">
                            <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                                {/* Price */}
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {isFree ? 'Free' : `৳${fee}`}
                                    </span>
                                    {!isFree && <span className="ml-1 text-sm text-gray-400">/ person</span>}
                                </div>

                                {/* Event Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <CalendarDays className="size-5 shrink-0 text-blue-400" />
                                        <span>
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Clock className="size-5 shrink-0 text-blue-400" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <MapPin className="size-5 shrink-0 text-blue-400" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Users className="size-5 shrink-0 text-blue-400" />
                                        <span>
                                            {event._count.participants} / {event.maxAttendees} registered
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out'}
                                        </span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{percentFull}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full rounded-full bg-linear-to-r from-blue-600 to-blue-500 transition-all"
                                            style={{ width: `${Math.min(percentFull, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Register Button */}
                                <RegisterButton
                                    eventId={event.id}
                                    fee={event.fee}
                                    spotsLeft={spotsLeft}
                                />
                            </div>

                            {/* Share */}
                            <ShareButtons
                                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/events/${event.id}`}
                                title={event.title}
                                description={event.description}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat with Organizer */}
            {user && user.id !== event.organizer.id && (
                <EventChat
                    eventId={event.id}
                    userId={user.id}
                    organizerName={event.organizer.name}
                    organizerImage={event.organizer.image}
                />
            )}
        </div>
    );
}
