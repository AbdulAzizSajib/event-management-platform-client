# Planora - Event Management Platform

A full-stack event management platform where users can discover, create, and manage events. Built with Next.js App Router, TanStack Query, and real-time chat via Socket.IO.

## Live URL

**Frontend:** [https://client-emp-weld.vercel.app](https://client-emp-weld.vercel.app)

## Features

- **Event Discovery** - Browse, search, and filter events by category, type, and more
- **Event Management** - Create, edit, and delete events with image uploads
- **User Authentication** - Email/password login, Google OAuth, email verification with OTP
- **Forgot/Reset Password** - OTP-based password recovery flow
- **Event Registration** - Join events with real-time seat tracking
- **Payment Integration** - Stripe checkout for paid events with ticket PDF download
- **Real-time Chat** - Socket.IO powered messaging between event organizers and participants
- **Reviews & Ratings** - Leave, edit, and delete reviews on events
- **Save Events** - Bookmark events for later
- **User Dashboard** - Overview stats, my events, registrations, payments, saved events, reviews, messages, and profile settings
- **Admin Dashboard** - Platform stats, manage users (block/activate/delete), manage events (delete/feature), manage categories (CRUD)
- **Dark Mode** - Full dark mode support across all pages
- **Responsive Design** - Mobile-first, works on all screen sizes
- **SEO Optimized** - Server-side rendering with Next.js App Router

## Technologies Used

### Frontend
- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **TanStack Query** (Server Prefetch + Hydration Pattern)
- **TanStack Form** (Form validation)
- **Zod** (Schema validation)
- **Socket.IO Client** (Real-time chat)
- **Lucide React** (Icons)
- **React Share** (Social sharing)
- **@react-pdf/renderer** (Ticket PDF generation)
- **next-themes** (Dark mode)
- **Lenis** (Smooth scrolling)

### Backend
- Express.js
- Better Auth (Google OAuth)
- Prisma ORM
- PostgreSQL
- Socket.IO
- Stripe

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

## Setup Instructions

### Prerequisites
- Node.js 18+ or Bun
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/client-EMP.git
cd client-EMP
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Create environment file
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=your_jwt_access_secret
```

### 4. Run development server
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```
