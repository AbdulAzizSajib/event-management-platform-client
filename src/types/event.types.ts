export type EventStatus = 'PUBLISHED' | 'DRAFT' | 'CANCELLED' | 'COMPLETED';
export type EventType = 'PUBLIC' | 'PRIVATE';

export interface Category {
    id: string;
    name: string;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Organizer {
    id: string;
    name: string;
    email: string;
    image: string | null;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    eventLink: string | null;
    type: EventType;
    fee: string;
    maxAttendees: number;
    image: string | null;
    isFeatured: boolean;
    categoryId: string;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
    category: Category;
    organizer: Organizer;
    _count: {
        participants: number;
        reviews: number;
    };
}

export interface EventReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
        name: string;
        image: string | null;
    };
}

export interface EventDetail extends Event {
    participants: unknown[];
    reviews: EventReview[];
}
