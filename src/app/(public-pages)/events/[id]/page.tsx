import { CalendarDays, Clock, MapPin, Users, Star, Share2, Heart, ArrowLeft, Tag, DollarSign, User } from 'lucide-react';
import Link from 'next/link';
import { events, getEventById, getCategoryById, getUserById, getReviewsForEvent } from '@/lib/mock-data';

export function generateStaticParams() {
    return events.map((event) => ({ id: event.id }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
                <p className="mt-2 text-gray-500">The event you're looking for doesn't exist.</p>
                <Link href="/events" className="mt-6 btn text-white px-6 py-2.5 rounded-full">Browse Events</Link>
            </div>
        );
    }

    const category = getCategoryById(event.categoryId);
    const owner = getUserById(event.ownerId);
    const eventReviews = getReviewsForEvent(event.id);
    const spotsLeft = event.maxAttendees - event.registrationCount;
    const percentFull = Math.round((event.registrationCount / event.maxAttendees) * 100);

    return (
        <div className="px-4 md:px-16 lg:px-24 py-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-6">
                    <ArrowLeft className="size-4" /> Back to Events
                </Link>

                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {category && <span className={`rounded-full px-3 py-1 text-xs font-medium ${category.color}`}>{category.icon} {category.name}</span>}
                            {event.isFeatured && <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white">Featured</span>}
                            {event.price === 0 && <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">Free</span>}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white">{event.title}</h1>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="flex size-10 items-center justify-center rounded-full bg-white/90 text-gray-700 transition hover:bg-white hover:text-red-500">
                            <Heart className="size-5" />
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-full bg-white/90 text-gray-700 transition hover:bg-white hover:text-indigo-500">
                            <Share2 className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>

                        {event.tags && event.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1"><Tag className="size-4" /> Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {owner && (
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
                                <img src={owner.image} alt={owner.name} className="size-14 rounded-full" />
                                <div>
                                    <p className="text-xs text-gray-500">Organized by</p>
                                    <p className="font-semibold text-gray-900">{owner.name}</p>
                                    <p className="text-sm text-gray-500">{owner.bio}</p>
                                </div>
                            </div>
                        )}

                        {eventReviews.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews ({eventReviews.length})</h2>
                                <div className="space-y-4">
                                    {eventReviews.map((review) => {
                                        const reviewer = getUserById(review.userId);
                                        return (
                                            <div key={review.id} className="rounded-xl border border-gray-200 p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    {reviewer && <img src={reviewer.image} alt={reviewer.name} className="size-10 rounded-full" />}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{reviewer?.name}</p>
                                                        <div className="flex items-center gap-1">
                                                            {Array(review.rating).fill('').map((_, i) => (
                                                                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{review.comment}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-indigo-600">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                                    {event.price > 0 && <span className="text-sm text-gray-400 ml-1">/ person</span>}
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CalendarDays className="size-5 text-indigo-400 shrink-0" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="size-5 text-indigo-400 shrink-0" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="size-5 text-indigo-400 shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Users className="size-5 text-indigo-400 shrink-0" />
                                        <span>{event.registrationCount} / {event.maxAttendees} registered</span>
                                    </div>
                                    {event.avgRating && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Star className="size-5 text-amber-400 fill-amber-400 shrink-0" />
                                            <span>{event.avgRating} ({event.reviewCount} reviews)</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-500">{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out'}</span>
                                        <span className="font-medium text-indigo-600">{percentFull}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${Math.min(percentFull, 100)}%` }} />
                                    </div>
                                </div>

                                <button className={`w-full rounded-full py-3 font-medium text-white transition ${spotsLeft > 0 ? 'btn hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`} disabled={spotsLeft <= 0}>
                                    {spotsLeft > 0 ? 'Register Now' : 'Sold Out'}
                                </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                                <p>Share this event with friends</p>
                                <div className="flex justify-center gap-3 mt-3">
                                    {['Twitter', 'LinkedIn', 'Facebook', 'Email'].map((platform) => (
                                        <button key={platform} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs hover:border-indigo-300 hover:text-indigo-600 transition">
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
