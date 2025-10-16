# Corrige Tes Cours - Technical Documentation

## Overview

Corrige Tes Cours is an AI-powered educational platform designed for French-speaking university students in Cameroon. The platform helps students study more effectively by providing automated course summaries, personalized quizzes, and performance tracking. The application features a modern, sales-focused landing page to attract users and a comprehensive dashboard for authenticated users to manage their coursework and track their progress.

**Location**: Douala, Cameroun
**Pricing**: Two plans available:
- **Gratuit**: 0 XAF/forever - Unlimited courses, summaries, quizzes, basic stats
- **Étudiant**: 1,500 XAF/month - All Free features + AI assistant, PDF downloads, advanced stats, priority support
**Payment**: Mobile Money (MTN, Orange) and credit cards accepted
**Contact**: contact@corrigetescours.cm

## AI Integration

**OpenRouter API with DeepSeek R1:**
- Model: `deepseek/deepseek-r1` (state-of-the-art reasoning model, 671B parameters, MIT licensed)
- Features:
  - Intelligent course summary generation with structured markdown output
  - Quiz generation (MCQ, open questions, mixed types)
  - Automatic evaluation of open-ended answers with detailed feedback
- API Configuration:
  - Base URL: `https://openrouter.ai/api/v1`
  - Authentication: Bearer token via `OPENROUTER_API_KEY` environment variable
  - HTTP headers include site referrer (https://corrigetescours.com) and title for usage tracking

## Recent Changes

### October 16, 2025 (Latest)
- **Lygos Payment Integration**: Fully integrated Mobile Money payments (MTN/Orange) via Lygos API
  - Payment gateway creation with order tracking
  - Real-time payment status verification
  - Automatic Premium subscription activation upon successful payment
  - Support for MTN Mobile Money, Orange Money, and credit cards
  - Price: 1,500 XAF/month for Premium subscription
  - Premium subscription management with start/end dates
- **Premium Subscription Page**: Created dedicated subscription management interface
  - Current plan display with status badge (Free/Premium)
  - Premium features showcase with pricing
  - One-click payment initiation
  - Payment method display (MTN, Orange, Cards)
  - Real-time payment status tracking with auto-refresh
  - Success/failure payment notifications
- **Payment Backend**: Complete payment processing infrastructure
  - Lygos API service (`server/lygos.ts`) for gateway creation and status checks
  - Payment initiation endpoint (`/api/payment/initiate`)
  - Payment status verification endpoint (`/api/payment/status/:paymentId`)
  - Automatic subscription creation/update on successful payment
  - Payment history tracking in database

### October 15, 2025
- **AI Chatbot "Aide IA"**: Implemented educational chatbot using DeepSeek R1 via OpenRouter API
  - Free tier: 5 messages per session with 3-hour cooldown
  - Premium tier: Unlimited chatbot access
  - Chat history with markdown rendering
  - Session management and message tracking
- **File Upload Feature**: Added PDF/Word document upload (max 10MB)
  - Automatic text extraction from PDF and Word (.docx) files
  - Auto-creates course from extracted content
  - Uses mammoth for Word processing, pdf-parse for PDF extraction
  - Includes subject field for course categorization
- **Premium System**: Extended database schema with subscriptions, chat_sessions, and payments tables
- **Dashboard Dark/Light Mode**: Added ThemeProvider to dashboard with theme toggle in header, persists theme in localStorage
- **Course Read-Only View**: Added "Voir" button on course cards to display full course content in read-only dialog
- **PDF Branding Update**: Changed PDF signature from "DeepSeek R1" to "Corrige Tes Cours" in summary PDFs
- **PDF Markdown Rendering**: Improved markdown processing to remove raw markdown syntax (**bold**, _italic_) from PDF output
- **Domain Configuration**: Updated OAuth callback and API referer URLs to use production domain (corrigetescours.com) via CUSTOM_DOMAIN environment variable
- **Quiz Evaluation**: Verified correct evaluation logic - MCQ questions use simple answer matching, open questions use AI evaluation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router
- TanStack Query (React Query) for server state management and data fetching

**UI Component System:**
- Shadcn/ui component library (New York style variant) providing pre-built, accessible components
- Radix UI primitives for low-level accessible component foundations
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for dynamic theming support (light/dark modes)

**Styling Strategy:**
- Minimalist, modern design with clean aesthetics to attract students
- **Sales-focused content**: Simple, non-technical messaging focused on student results and benefits
- Unified components: **Navbar** (logo, navigation links, theme toggle, auth buttons) and **AppFooter** (company info, links, contact) used across all landing pages
- Brand color palette: Primary blue (#007BFF) with subtle gradients
- **Favicon**: Blue graduation cap SVG icon for browser tab identification
- Inter and Poppins fonts from Google Fonts
- Responsive design with mobile-first approach using Tailwind breakpoints
- **Dark/Light Mode**: Full theme support with ThemeProvider, localStorage persistence, and smooth transitions
  - Theme toggle in Navbar for landing pages (desktop & mobile)
  - Theme toggle in top-right corner for auth pages (Login, Signup)
  - Theme toggle in dashboard header (top-right corner) for authenticated users
  - Theme persists across navigation and browser sessions
- Custom elevation system with hover/active states (`hover-elevate`, `active-elevate-2`)
- Consistent styling across Home, Features, Pricing, About, Login, Signup, Legal, Privacy, and Terms pages

**State Management:**
- React Query for async server state with optimized caching (staleTime: 30s, refetchOnWindowFocus enabled)
- React hooks (useState, useContext) for local component state
- Custom hooks pattern (useAuth, useIsMobile) for reusable logic
- Comprehensive cache invalidation strategy for data synchronization across components

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- Node.js runtime with ES modules (type: "module")
- TypeScript for type safety across the entire stack

**Authentication System:**
- **Dual Authentication**: Email/Password + Google OAuth (replacing Replit Auth)
- Passport.js with Local Strategy (bcrypt password hashing) and Google OAuth2 Strategy
- Express session middleware with PostgreSQL session store (connect-pg-simple)
- Session-based authentication with secure HTTP-only cookies (7-day TTL)
- Custom `isAuthenticated` middleware for route protection
- Google OAuth callback URL: `/api/auth/google/callback` (configure in Google Cloud Console)
- **Domain Configuration**: Uses CUSTOM_DOMAIN environment variable for production domain (corrigetescours.com) or falls back to REPLIT_DOMAINS

**API Design:**
- RESTful API endpoints under `/api` prefix
- Protected routes requiring authentication middleware
- Request/response logging with timing information
- JSON-based request/response format
- Error handling middleware with standardized error responses

**Database Layer:**
- Drizzle ORM for type-safe database queries and schema management
- PostgreSQL (via Neon serverless) as the primary database
- Schema-first approach with Drizzle Zod for validation
- Storage abstraction layer (`IStorage` interface) for database operations
- Migration support via drizzle-kit

**Data Model:**
```
users (Dual Auth: Email/Password + Google OAuth)
  ├── courses (user's course notes)
  │     ├── summaries (AI-generated summaries)
  │     └── quizzes
  │           └── quiz_results (performance tracking)
  └── sessions (authentication state)
```

**Core Entities:**
- **Users**: 
  - Required: `email`, `firstName`, `lastName` (NOT NULL)
  - Optional: `password` (null for Google OAuth), `googleId` (null for local auth), `profileImageUrl`
  - **No username field** - uses firstName/lastName for display
- **Courses**: Title, content, subject, timestamps, user relationship
  - **View Mode**: Read-only dialog displays full course content with "Voir" button
  - **Edit Mode**: Edit dialog for modifying course content
- **Summaries**: AI-generated course summaries linked to courses
  - **PDF Export**: Downloads with "Corrige Tes Cours" branding, clean markdown rendering
- **Quizzes**: Questions with multiple choice answers and open-ended questions
  - **MCQ Evaluation**: Simple answer matching (A, B, C, D)
  - **Open Question Evaluation**: AI-powered scoring with detailed feedback
- **Quiz Results**: User performance tracking with scores and timestamps

### External Dependencies

**AI Integration:**
- OpenRouter API for AI-powered course summarization
- DeepSeek v4 model for content generation
- API integration planned for intelligent quiz generation

**Database & Infrastructure:**
- Neon PostgreSQL serverless database (via @neondatabase/serverless)
- WebSocket support for Neon connection pooling
- Connect-pg-simple for PostgreSQL session storage

**Authentication Services:**
- Google OAuth 2.0 (via passport-google-oauth20)
- Local authentication with bcryptjs for password hashing
- Passport.js for authentication strategy management

**Development Tools:**
- Replit-specific Vite plugins for development experience:
  - Runtime error overlay for better debugging
  - Cartographer for code navigation
  - Dev banner for environment awareness
- ESBuild for production server bundling

**UI & Styling Libraries:**
- Google Fonts API (Inter, Poppins)
- Lucide React for iconography
- React Icons for additional icon sets
- Class Variance Authority (CVA) for component variant management
- clsx + tailwind-merge for conditional class composition

**Form & Validation:**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for validation integration

**Utilities:**
- date-fns for date manipulation
- memoizee for function memoization and caching
- nanoid for generating unique identifiers

### Application Flow

1. **Unauthenticated users** see the landing page with feature highlights and CTAs to sign up
2. **Authentication options**:
   - Email/Password signup: Collects firstName, lastName, email, password
   - Google OAuth: Auto-creates user from Google profile (firstName/lastName extracted from displayName)
3. **Authenticated users** access dashboard with sidebar navigation showing "Bienvenue, {firstName} !"
4. **Course management** allows creating, editing, and organizing course notes
5. **AI summarization** processes course content through OpenRouter API with DeepSeek R1
6. **Quiz generation** creates personalized questions from course material
7. **Performance tracking** visualizes progress and quiz results
8. **Logout** clears session and redirects to /login via hard reload

### Security Considerations

- Session secrets managed via environment variables
- HTTPS-only cookies in production
- CSRF protection through SameSite cookie attributes
- Input validation using Zod schemas
- SQL injection prevention via Drizzle ORM parameterized queries
- Authentication state verified on every protected API request