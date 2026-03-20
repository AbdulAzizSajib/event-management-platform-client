// ==================== ENUMS ====================

export type Role = 'ADMIN' | 'USER';
export type EventStatus = 'PUBLISHED' | 'DRAFT' | 'CANCELLED' | 'COMPLETED';
export type RegistrationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

// ==================== MODELS ====================

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    eventCount: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    role: Role;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: number;
    maxAttendees: number;
    status: EventStatus;
    isFeatured: boolean;
    ownerId: string;
    categoryId: string;
    tags: string[];
    registrationCount: number;
    reviewCount: number;
    avgRating: number;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    eventId: string;
    createdAt: string;
}

export interface Registration {
    id: string;
    userId: string;
    eventId: string;
    status: RegistrationStatus;
    createdAt: string;
}

export interface SavedEvent {
    id: string;
    userId: string;
    eventId: string;
}

export interface Payment {
    id: string;
    amount: number;
    status: PaymentStatus;
    method: string;
    userId: string;
    eventId: string;
    createdAt: string;
}

export interface Invitation {
    id: string;
    status: InvitationStatus;
    message?: string;
    senderId: string;
    receiverId: string;
    eventId: string;
    createdAt: string;
}

export interface Testimonial {
    review: string;
    name: string;
    about: string;
    rating: number;
    image: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface ActivityItem {
    type: string;
    message: string;
    time: string;
}

export interface AdminStats {
    totalUsers: number;
    totalEvents: number;
    totalRegistrations: number;
    totalRevenue: number;
    monthlyGrowth: {
        users: number;
        events: number;
        registrations: number;
        revenue: number;
    };
    recentActivity: ActivityItem[];
}
