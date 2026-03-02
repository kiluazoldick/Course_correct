# Corrige Tes Cours - Technical Documentation

## Overview
Corrige Tes Cours is a universal AI-powered study tool for students worldwide. It enhances studying efficiency through automated course summaries, personalized quizzes, AI chatbot (Tariq IA), flashcards, study guides, and performance tracking. The platform features a sales-focused landing page, an anonymous onboarding flow for conversion optimization, and a comprehensive user dashboard. It operates on a freemium model with a Premium subscription via Stripe card payments only. Pricing is intentionally hidden from the UI to focus on value/features first (psychological pricing strategy).

**Latest Update (Feb 2026):**
- **Universal Platform Pivot**: Migrated from Cameroon-focused to worldwide platform. Removed all Cameroon-specific content, XAF pricing, and Mobile Money payment options.
- **Simplified Pricing**: Premium tier via Stripe Checkout (card payments only). Price hidden from UI — users discover it at checkout only.
  - Stripe Price ID stored in STRIPE_PRICE_ID env var
  - Single checkout endpoint: /api/payment/stripe/checkout
  - Webhook-based payment verification with Stripe signature validation
  - Files: server/stripeClient.ts, server/webhookHandlers.ts, server/seed-products.ts
- **Free Tier Restrictions** (enforced in backend):
  - 3 courses maximum
  - 1 AI summary per month
  - 1 quiz per month
  - 2 file uploads per month
  - 5 Tariq AI messages per session (3h cooldown)
  - 1 flashcard set per course
  - No study guides (Premium only)
- **Premium Features**: Unlimited courses, summaries, quizzes, uploads, AI messages, flashcards, and study guides
- Implemented anonymous onboarding system allowing users to test the app (upload 1 course + generate summary) before creating an account, with seamless migration upon signup to maximize conversion rates.
- **Mobile-First UX**: Complete mobile optimization with WhatsApp-style bottom navigation bar. Sidebar hidden on mobile (<768px), replaced by fixed bottom nav with 5 items (Home, Cours, Chat, Stats, Profile). All dashboard pages optimized with responsive text sizes, compact spacing, and mobile-first layouts while desktop design remains unchanged.
- **Chat Page Redesign**: Complete UI/UX overhaul inspired by ChatGPT for minimalist, clean aesthetic. Replaced flashy gradient avatars with simple bordered icons (GraduationCap for Tariq, "Tu" badge for user). Implemented ChatGPT-style layout with centered messages (max-w-3xl), fixed input at bottom with backdrop blur, generous spacing, and responsive design. Header streamlined to h-14 with minimal branding. Mobile-optimized with hidden badge text, compact buttons, and smaller avatars.
- **Flashcards & Study Guides** (Feb 2026): NotebookLM-inspired features:
  - **AI Flashcards**: Generate flashcard sets from course content (10-15 cards), with flip animation, mastered/to-review tracking, progress bar. Free: 1 set/course, Premium: unlimited.
  - **AI Study Guides**: Premium feature generating structured guides with learning objectives, key concepts, common pitfalls, practice exercises, and study tips.
  - **Course Detail Page**: New tabbed view (Content, Summary, Quiz, Flashcards, Guide) centralizing all tools around each course. Clickable course cards navigate to detail.
  - **Dashboard Widgets**: Dynamic widgets showing recent courses, flashcards to review with progress bars, 4-column stat grid.
  - **Large PDF Fix**: Added buffer size check (50MB), 60s timeout, and content truncation (200K chars) to handle 500+ page PDFs gracefully.
  - **i18n**: Full FR/EN translations for all new features.
  - DB tables: flashcard_sets, flashcard_progress, study_guides
- **Quiz System Improvements** (Oct 20, 2025): Enhanced quiz generation and evaluation for better learning experience:
  - **Randomized MCQ Options**: AI now varies correct answer positions (A, B, C, D) instead of always placing them in the same position, ensuring fair testing
  - **Improved MCQ Evaluation**: Strict comparison of full option text for accurate scoring
  - **Benevolent Open-Answer Evaluation**: More encouraging evaluation system that rewards concise answers containing key concepts (70-100 scores for answers with main keywords), reducing discouragement from overly strict grading. Evaluation criteria prioritize content over form, making short precise answers as valuable as detailed ones.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for fast development. Wouter handles routing, and TanStack Query manages server state. UI components are built with Shadcn/ui and Radix UI, styled using Tailwind CSS, adhering to a minimalist, modern aesthetic with a NotebookLM-inspired design. The platform supports dynamic theming with dark/light modes, persists themes, and uses Inter and Poppins fonts. The design emphasizes responsiveness and a sales-focused user experience on landing pages, featuring consistent navigation and footers.

**Mobile Navigation (Oct 2025)**: Implemented WhatsApp-style bottom navigation bar (`BottomNav.tsx`) visible only on mobile (<768px). Features 5 navigation items (Home, Cours, Chat, Stats, Profile) with active state highlighting. Sidebar completely hidden on mobile via responsive classes. Desktop experience unchanged with traditional sidebar navigation.

### Backend Architecture
The backend uses Express.js with Node.js and TypeScript. It features a dual authentication system supporting Email/Password (with bcrypt hashing) and Google OAuth via Passport.js, utilizing session-based authentication with secure HTTP-only cookies and a PostgreSQL session store. APIs are RESTful, protected by `isAuthenticated` middleware, and use JSON for communication. The database layer employs Drizzle ORM with PostgreSQL (Neon serverless) for type-safe queries and schema management, including migrations. Core entities include Users, Courses, Summaries, Quizzes, and Quiz Results, with a focus on user, course, and AI-generated content management.

### System Design Choices
- **Freemium Model**: Implemented with clear distinctions between free and premium features, including file upload limits (2/month for free, unlimited for premium) and AI chatbot message limits (5 messages/session for free, unlimited for premium).
- **AI Integration**: Central to the platform, using OpenRouter API with DeepSeek R1 for intelligent course summarization, quiz generation (MCQ and open-ended), and AI-powered evaluation of open-ended answers with feedback.
- **Payment System**: Integrated Stripe via Replit connector for card and Mobile Money payments, supporting dual currency pricing (500 XAF for Cameroon, $1 USD for international). Payment flow: user selects currency → Stripe Checkout session created → redirected to Stripe hosted checkout → webhook verifies payment → activates Premium subscription (1 month). Uses stripe-replit-sync for automatic schema management and data sync. Stripe webhook registered before express.json() middleware for raw body processing.
- **Profile Management**: Users can edit personal information (firstName, lastName) and upload profile photos.
- **Content Management**: Users can create, edit, and organize course notes, upload PDF/Word documents (with automatic text extraction), and view course content in a read-only mode.
- **AI Chatbot ("Tariq IA")**: An educational chatbot with a confident, motivating personality, offering smart suggestion prompts and managing message limits based on subscription tier.
- **Subscription Management**: Automated downgrade to the Free tier upon Premium subscription expiration, with real-time status checks.
- **Anonymous Onboarding Flow**: Conversion-focused system allowing visitors to test the app without account creation. Users upload a file, get AI summary generated, then create account with automatic migration of their test course. Features 48-hour expiration, sessionId tracking via localStorage, and hourly automated cleanup of expired uploads.
- **Referral System** (Dec 2025): Users can invite friends to earn 14 days of free Premium. Each user gets a unique referral code (8 alphanumeric characters). When a new user signs up via a referral link (/signup?ref=CODE), the referrer receives 14 days added to their Premium subscription. The system is fully bilingual (FR/EN) and includes:
  - Database schema: `referrals` table tracking referrer, referred user, reward status, and expiration
  - User fields: `referralCode` (unique), `referredBy` (stores the code used during signup)
  - API routes: `GET /api/referral` (user's referral info), `GET /api/referral/validate/:code` (validates a code)
  - Account page: Displays referral link, copy button, stats (total referrals, days earned), and recent referral list
  - Signup page: Shows green banner when valid referral code is detected in URL

## External Dependencies

### AI Integration
- **OpenRouter API**: For AI-powered features like summarization and quiz generation.
- **DeepSeek R1**: The primary AI model used via OpenRouter for content generation and evaluation.

### Database & Infrastructure
- **Neon PostgreSQL**: Serverless database solution via `@neondatabase/serverless` for data storage.
- **Connect-pg-simple**: For PostgreSQL session storage.

### Authentication Services
- **Google OAuth 2.0**: Via `passport-google-oauth20` for social login.
- **Passport.js**: For managing authentication strategies.
- **bcryptjs**: For password hashing in local authentication.

### UI & Styling Libraries
- **Google Fonts API**: For "Inter" and "Poppins" fonts.
- **Lucide React**: For iconography.
- **React Icons**: For additional icon sets.
- **Shadcn/ui**: Component library.
- **Radix UI**: Low-level accessible component primitives.
- **Tailwind CSS**: Utility-first styling framework.
- **Class Variance Authority (CVA)**: For component variant management.
- **clsx** & **tailwind-merge**: For conditional class composition.

### Form & Validation
- **React Hook Form**: For form state management.
- **Zod**: For schema validation.
- **@hookform/resolvers**: For integrating Zod with React Hook Form.

### Email Service
- **Resend**: Transactional and marketing email service via Replit integration
- **Global Contacts API**: Uses Resend's November 2024 global contacts model (no audienceId required)
- **Automated Email System** (Dec 2025):
  - **Welcome Email**: Sent automatically on registration (both local and Google OAuth)
  - **Premium Congratulations Email**: Sent automatically after successful CinetPay payment
  - **Reminder Email**: Template available for admin use
  - **Weekly Motivation Email**: Template for bulk sends
- **Contact Sync**: New users automatically synced to Resend contacts on registration
- **Email Templates**: Beautiful HTML templates with French/English bilingual support
- **Email Preferences**: Users can opt-in/opt-out of marketing emails via profile settings
- **Admin Routes**: 
  - POST `/api/admin/send-weekly-emails` for bulk sends (requires `x-admin-key: admin-{SESSION_SECRET}`)
  - POST `/api/admin/sync-users-to-resend` for initial bulk sync of all users to Resend contacts
- **Test Route**: POST `/api/email/test-weekly` for sending test emails to logged-in users
- **Non-blocking**: All email operations are non-blocking - registration/payment flows continue even if email fails

### Utilities
- **date-fns**: For date manipulation.
- **memoizee**: For function memoization.
- **nanoid**: For generating unique identifiers.
- **mammoth**: For Word document processing.
- **pdf-parse**: For PDF text extraction.