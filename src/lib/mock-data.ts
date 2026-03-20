import type {
    Category,
    User,
    Event,
    Review,
    Registration,
    SavedEvent,
    Payment,
    Testimonial,
    FaqItem,
    AdminStats,
} from '@/types';

// Re-export types for backward compatibility
export type { Category, User, Event, Review, Registration, SavedEvent, Payment, Testimonial, FaqItem, AdminStats };

// ==================== CATEGORIES ====================
export const categories: Category[] = [
    { id: '1', name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-700', eventCount: 42 },
    { id: '2', name: 'Music', icon: '🎵', color: 'bg-purple-100 text-purple-700', eventCount: 38 },
    { id: '3', name: 'Business', icon: '💼', color: 'bg-amber-100 text-amber-700', eventCount: 27 },
    { id: '4', name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-700', eventCount: 31 },
    { id: '5', name: 'Art & Design', icon: '🎨', color: 'bg-pink-100 text-pink-700', eventCount: 19 },
    { id: '6', name: 'Food & Drink', icon: '🍕', color: 'bg-orange-100 text-orange-700', eventCount: 24 },
    { id: '7', name: 'Health', icon: '🧘', color: 'bg-teal-100 text-teal-700', eventCount: 16 },
    { id: '8', name: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-700', eventCount: 22 },
];

// ==================== USERS ====================
export const users: User[] = [
    {
        id: 'u1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop&q=60',
        bio: 'Event organizer & community builder',
        role: 'ADMIN',
    },
    {
        id: 'u2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&auto=format&fit=crop&q=60',
        bio: 'Tech enthusiast & startup founder',
        role: 'USER',
    },
    {
        id: 'u3',
        name: 'Emily Davis',
        email: 'emily@example.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&auto=format&fit=crop&q=60',
        bio: 'Music lover & concert organizer',
        role: 'USER',
    },
    {
        id: 'u4',
        name: 'James Wilson',
        email: 'james@example.com',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&auto=format&fit=crop&q=60',
        bio: 'Sports coach & wellness advocate',
        role: 'USER',
    },
];

// ==================== EVENTS ====================
export const events: Event[] = [
    {
        id: '1',
        title: 'Tech Innovation Summit 2026',
        description: 'Join the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Explore AI, blockchain, cloud computing, and the future of software development with 2000+ attendees from around the globe.',
        date: '2026-04-15',
        time: '9:00 AM',
        location: 'San Francisco Convention Center, CA',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        price: 299,
        maxAttendees: 2000,
        status: 'PUBLISHED',
        isFeatured: true,
        ownerId: 'u1',
        categoryId: '1',
        tags: ['AI', 'Blockchain', 'Cloud', 'Networking'],
        registrationCount: 1847,
        reviewCount: 156,
        avgRating: 4.8,
    },
    {
        id: '2',
        title: 'Summer Music Festival',
        description: 'A 3-day outdoor music festival featuring top artists across multiple stages. Enjoy live performances, food trucks, art installations, and an unforgettable summer experience under the stars.',
        date: '2026-06-20',
        time: '2:00 PM',
        location: 'Central Park, New York',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60',
        price: 149,
        maxAttendees: 5000,
        status: 'PUBLISHED',
        isFeatured: true,
        ownerId: 'u3',
        categoryId: '2',
        tags: ['Live Music', 'Outdoor', 'Festival', 'Summer'],
        registrationCount: 3421,
        reviewCount: 89,
        avgRating: 4.6,
    },
    {
        id: '3',
        title: 'Startup Pitch Night',
        description: 'Watch emerging startups pitch their ideas to a panel of top investors. Network with founders, VCs, and fellow entrepreneurs. Great opportunity to discover the next big thing or find your next investment.',
        date: '2026-04-28',
        time: '6:00 PM',
        location: 'WeWork Downtown, Austin, TX',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60',
        price: 0,
        maxAttendees: 200,
        status: 'PUBLISHED',
        isFeatured: true,
        ownerId: 'u2',
        categoryId: '3',
        tags: ['Startups', 'Investing', 'Networking', 'Free'],
        registrationCount: 187,
        reviewCount: 42,
        avgRating: 4.9,
    },
    {
        id: '4',
        title: 'Marathon for a Cause',
        description: 'Join thousands of runners in this annual charity marathon. Choose from 5K, 10K, half marathon, or full marathon distances. All proceeds go to local children\'s education programs.',
        date: '2026-05-10',
        time: '7:00 AM',
        location: 'Lakefront Trail, Chicago, IL',
        image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&auto=format&fit=crop&q=60',
        price: 45,
        maxAttendees: 3000,
        status: 'PUBLISHED',
        isFeatured: false,
        ownerId: 'u4',
        categoryId: '4',
        tags: ['Running', 'Charity', 'Fitness', 'Outdoor'],
        registrationCount: 2156,
        reviewCount: 73,
        avgRating: 4.7,
    },
    {
        id: '5',
        title: 'Digital Art Exhibition',
        description: 'Explore the intersection of technology and art in this immersive digital exhibition. Featuring interactive installations, VR experiences, and NFT showcases from 50+ digital artists worldwide.',
        date: '2026-05-22',
        time: '11:00 AM',
        location: 'Modern Art Museum, Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60',
        price: 25,
        maxAttendees: 500,
        status: 'PUBLISHED',
        isFeatured: false,
        ownerId: 'u1',
        categoryId: '5',
        tags: ['Digital Art', 'NFT', 'VR', 'Exhibition'],
        registrationCount: 342,
        reviewCount: 28,
        avgRating: 4.5,
    },
    {
        id: '6',
        title: 'Gourmet Food & Wine Tasting',
        description: 'Indulge in an evening of exquisite cuisine and fine wines from award-winning chefs and sommeliers. Sample dishes from 20+ restaurants and discover new flavor pairings.',
        date: '2026-06-05',
        time: '5:00 PM',
        location: 'Grand Hotel Ballroom, Miami, FL',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
        price: 85,
        maxAttendees: 300,
        status: 'PUBLISHED',
        isFeatured: true,
        ownerId: 'u3',
        categoryId: '6',
        tags: ['Food', 'Wine', 'Gourmet', 'Tasting'],
        registrationCount: 267,
        reviewCount: 51,
        avgRating: 4.8,
    },
    {
        id: '7',
        title: 'Mindfulness & Yoga Retreat',
        description: 'Escape the hustle with a weekend retreat focused on mindfulness, meditation, and yoga. Includes guided sessions, healthy meals, and nature walks in a serene mountain setting.',
        date: '2026-07-12',
        time: '8:00 AM',
        location: 'Mountain Zen Resort, Boulder, CO',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
        price: 199,
        maxAttendees: 50,
        status: 'PUBLISHED',
        isFeatured: false,
        ownerId: 'u4',
        categoryId: '7',
        tags: ['Yoga', 'Meditation', 'Wellness', 'Retreat'],
        registrationCount: 48,
        reviewCount: 19,
        avgRating: 5.0,
    },
    {
        id: '8',
        title: 'Web Development Bootcamp',
        description: 'Intensive 2-day bootcamp covering modern web development with React, Next.js, and Tailwind CSS. Perfect for beginners and intermediate developers looking to level up their skills.',
        date: '2026-05-03',
        time: '10:00 AM',
        location: 'Tech Hub Campus, Seattle, WA',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60',
        price: 149,
        maxAttendees: 100,
        status: 'PUBLISHED',
        isFeatured: false,
        ownerId: 'u2',
        categoryId: '8',
        tags: ['React', 'Next.js', 'Tailwind', 'Coding'],
        registrationCount: 92,
        reviewCount: 34,
        avgRating: 4.7,
    },
    {
        id: '9',
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop covering the latest in AI and machine learning. Build real projects with Python, TensorFlow, and GPT models. Suitable for developers with basic Python knowledge.',
        date: '2026-04-20',
        time: '9:30 AM',
        location: 'Innovation Lab, Boston, MA',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
        price: 199,
        maxAttendees: 80,
        status: 'PUBLISHED',
        isFeatured: false,
        ownerId: 'u1',
        categoryId: '1',
        tags: ['AI', 'Machine Learning', 'Python', 'Workshop'],
        registrationCount: 76,
        reviewCount: 22,
        avgRating: 4.9,
    },
];

// ==================== REVIEWS ====================
export const reviews: Review[] = [
    {
        id: 'r1',
        rating: 5,
        comment: 'Absolutely incredible event! The speakers were world-class and the networking opportunities were unmatched. Already signed up for next year.',
        userId: 'u2',
        eventId: '1',
        createdAt: '2025-11-20',
    },
    {
        id: 'r2',
        rating: 4,
        comment: 'Great organization and amazing lineup. The venue could have been a bit bigger but overall a fantastic experience.',
        userId: 'u3',
        eventId: '1',
        createdAt: '2025-11-18',
    },
    {
        id: 'r3',
        rating: 5,
        comment: 'Best music festival I\'ve ever attended. The atmosphere was electric and every artist delivered an amazing performance.',
        userId: 'u4',
        eventId: '2',
        createdAt: '2025-09-15',
    },
    {
        id: 'r4',
        rating: 5,
        comment: 'The startup pitches were inspiring and the investor panel gave incredible feedback. Made some great connections!',
        userId: 'u1',
        eventId: '3',
        createdAt: '2025-10-05',
    },
    {
        id: 'r5',
        rating: 4,
        comment: 'Well-organized marathon with great course support. The cause made it even more meaningful.',
        userId: 'u2',
        eventId: '4',
        createdAt: '2025-08-12',
    },
];

// ==================== REGISTRATIONS (for dashboard) ====================
export const registrations: Registration[] = [
    { id: 'reg1', userId: 'u2', eventId: '1', status: 'CONFIRMED', createdAt: '2026-03-01' },
    { id: 'reg2', userId: 'u2', eventId: '3', status: 'CONFIRMED', createdAt: '2026-03-05' },
    { id: 'reg3', userId: 'u2', eventId: '6', status: 'CONFIRMED', createdAt: '2026-03-10' },
    { id: 'reg4', userId: 'u2', eventId: '8', status: 'WAITLISTED', createdAt: '2026-03-12' },
    { id: 'reg5', userId: 'u2', eventId: '4', status: 'CANCELLED', createdAt: '2026-02-20' },
];

// ==================== SAVED EVENTS ====================
export const savedEvents: SavedEvent[] = [
    { id: 's1', userId: 'u2', eventId: '2' },
    { id: 's2', userId: 'u2', eventId: '5' },
    { id: 's3', userId: 'u2', eventId: '7' },
];

// ==================== PAYMENTS ====================
export const payments: Payment[] = [
    { id: 'p1', amount: 299, status: 'COMPLETED', method: 'card', userId: 'u2', eventId: '1', createdAt: '2026-03-01' },
    { id: 'p2', amount: 0, status: 'COMPLETED', method: 'free', userId: 'u2', eventId: '3', createdAt: '2026-03-05' },
    { id: 'p3', amount: 85, status: 'COMPLETED', method: 'card', userId: 'u2', eventId: '6', createdAt: '2026-03-10' },
    { id: 'p4', amount: 149, status: 'PENDING', method: 'card', userId: 'u2', eventId: '8', createdAt: '2026-03-12' },
];

// ==================== ADMIN STATS ====================
export const adminStats: AdminStats = {
    totalUsers: 12847,
    totalEvents: 342,
    totalRegistrations: 28453,
    totalRevenue: 847920,
    monthlyGrowth: {
        users: 12.5,
        events: 8.3,
        registrations: 15.7,
        revenue: 22.1,
    },
    recentActivity: [
        { type: 'registration', message: 'Sarah Johnson registered for Tech Innovation Summit', time: '2 min ago' },
        { type: 'event', message: 'New event "Design Thinking Workshop" created by Emily Davis', time: '15 min ago' },
        { type: 'review', message: 'Michael Chen left a 5-star review on Startup Pitch Night', time: '1 hour ago' },
        { type: 'payment', message: 'Payment of $149 received for Web Dev Bootcamp', time: '2 hours ago' },
        { type: 'registration', message: 'James Wilson registered for Summer Music Festival', time: '3 hours ago' },
        { type: 'event', message: 'Event "Marathon for a Cause" was updated', time: '5 hours ago' },
    ],
};

// ==================== TESTIMONIALS ====================
export const testimonials: Testimonial[] = [
    {
        review: 'Planora made organizing our company retreat incredibly simple. From RSVPs to reminders, everything was handled seamlessly.',
        name: 'Richard Nelson',
        about: 'Event Manager, TechCorp',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    },
    {
        review: 'I discovered amazing local events I never knew existed. The filtering and category system is brilliant!',
        name: 'Sophia Martinez',
        about: 'Community Organizer',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    },
    {
        review: 'As an event organizer, the dashboard analytics help me understand my audience better and plan more effectively.',
        name: 'Ethan Roberts',
        about: 'Conference Director',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'The registration and payment flow is so smooth. Our attendees always compliment how easy it is to sign up.',
        name: 'Isabella Kim',
        about: 'Startup Founder',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: "We've tried many platforms, but Planora is the only one that handles everything from ticketing to post-event reviews.",
        name: 'Liam Johnson',
        about: 'Marketing Director',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
        review: 'The ability to save events and get reminders means I never miss anything. Planora is my go-to for finding events.',
        name: 'Ava Patel',
        about: 'Freelance Designer',
        rating: 5,
        image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
    },
];

// ==================== FAQ DATA ====================
export const faqData: FaqItem[] = [
    {
        question: 'What is Planora and how does it work?',
        answer: 'Planora is an all-in-one event management platform that lets you discover, create, and manage events. You can browse events by category, register for them, leave reviews, and even create your own events with ticketing and attendee management.',
    },
    {
        question: 'Is it free to create events on Planora?',
        answer: 'Yes! Creating events on Planora is completely free. You can set your own ticket prices (including free events), and we only charge a small service fee on paid tickets to cover payment processing.',
    },
    {
        question: 'How do I register for an event?',
        answer: 'Simply browse our events page, find an event you like, and click "Register Now." You\'ll be guided through a quick registration process including payment if the event has a ticket price.',
    },
    {
        question: 'Can I get a refund if I can\'t attend?',
        answer: 'Refund policies are set by individual event organizers. Most events offer full refunds up to 48 hours before the event. Check the specific event page for its refund policy.',
    },
    {
        question: 'How do I manage my created events?',
        answer: 'Your Dashboard provides a complete overview of all your created events, including attendee lists, registration stats, revenue, and reviews. You can edit event details, send announcements, and manage waitlists all from one place.',
    },
    {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use industry-standard encryption and partner with trusted payment processors to ensure all transactions are secure. We never store your full payment details on our servers.',
    },
];

// Helper to get event by ID
export function getEventById(id: string): Event | undefined {
    return events.find((e) => e.id === id);
}

// Helper to get user by ID
export function getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
}

// Helper to get category by ID
export function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
}

// Helper to get reviews for an event
export function getReviewsForEvent(eventId: string): Review[] {
    return reviews.filter((r) => r.eventId === eventId);
}

// Helper to get featured events
export function getFeaturedEvents(): Event[] {
    return events.filter((e) => e.isFeatured);
}
