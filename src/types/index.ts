// ==================== EVENT TYPES (re-exported) ====================
export { type EventStatus, type EventType, type Category, type Organizer, type Event, type EventReview, type EventDetail } from './event.types';

// ==================== ENUMS ====================

export type Role = 'ADMIN' | 'USER';
export type RegistrationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

// ==================== MODELS (matching API response) ====================

export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio?: string;
    role: Role;
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
