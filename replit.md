# Corrige Tes Cours - Technical Documentation

## Overview

Corrige Tes Cours is an AI-powered educational platform designed for French-speaking university students. The platform helps students study more effectively by providing automated course summaries using **DeepSeek R1** (the latest reasoning model from DeepSeek), personalized quizzes, and performance tracking. The application features a modern landing page to attract users and a comprehensive dashboard for authenticated users to manage their coursework and track their progress.

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
  - HTTP headers include site referrer and title for usage tracking

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
- Custom design system based on modern EdTech platforms (Notion, Linear)
- Brand color palette: Primary blue (#007BFF) with deep night blue gradients
- Inter and Poppins fonts from Google Fonts
- Responsive design with mobile-first approach using Tailwind breakpoints
- Custom elevation system with hover/active states (`hover-elevate`, `active-elevate-2`)

**State Management:**
- React Query for async server state with aggressive caching (staleTime: Infinity)
- React hooks (useState, useContext) for local component state
- Custom hooks pattern (useAuth, useIsMobile) for reusable logic

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- Node.js runtime with ES modules (type: "module")
- TypeScript for type safety across the entire stack

**Authentication System:**
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js with OpenID Client strategy for OAuth flows
- Express session middleware with PostgreSQL session store
- Session-based authentication with secure HTTP-only cookies (7-day TTL)
- Custom `isAuthenticated` middleware for route protection

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
users (Replit Auth integrated)
  ├── courses (user's course notes)
  │     ├── summaries (AI-generated summaries)
  │     └── quizzes
  │           └── quiz_results (performance tracking)
  └── sessions (authentication state)
```

**Core Entities:**
- **Users**: Email, username, profile info (firstName, lastName, profileImageUrl)
- **Courses**: Title, content, subject, timestamps, user relationship
- **Summaries**: AI-generated course summaries linked to courses
- **Quizzes**: Questions with multiple choice answers
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
- Replit Authentication (OAuth2/OIDC)
- OpenID Connect client library for auth flows

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
2. **Authentication** redirects to Replit OIDC flow, creates/updates user in database
3. **Authenticated users** access dashboard with sidebar navigation
4. **Course management** allows creating, editing, and organizing course notes
5. **AI summarization** processes course content through OpenRouter API
6. **Quiz generation** creates personalized questions from course material
7. **Performance tracking** visualizes progress and quiz results

### Security Considerations

- Session secrets managed via environment variables
- HTTPS-only cookies in production
- CSRF protection through SameSite cookie attributes
- Input validation using Zod schemas
- SQL injection prevention via Drizzle ORM parameterized queries
- Authentication state verified on every protected API request