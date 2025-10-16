# Corrige Tes Cours - Technical Documentation

## Overview
Corrige Tes Cours is an AI-powered educational platform for French-speaking university students in Cameroon. It aims to enhance studying efficiency through automated course summaries, personalized quizzes, and performance tracking. The platform features a sales-focused landing page and a comprehensive user dashboard. It operates on a freemium model, offering both a free tier and a Premium subscription (1,500 XAF/month) with advanced features. Payment is processed via Mobile Money and credit cards through Lygos. The business vision is to provide accessible, AI-driven educational tools to improve student outcomes in Cameroon.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for fast development. Wouter handles routing, and TanStack Query manages server state. UI components are built with Shadcn/ui and Radix UI, styled using Tailwind CSS, adhering to a minimalist, modern aesthetic with a NotebookLM-inspired design. The platform supports dynamic theming with dark/light modes, persists themes, and uses Inter and Poppins fonts. The design emphasizes responsiveness and a sales-focused user experience on landing pages, featuring consistent navigation and footers.

### Backend Architecture
The backend uses Express.js with Node.js and TypeScript. It features a dual authentication system supporting Email/Password (with bcrypt hashing) and Google OAuth via Passport.js, utilizing session-based authentication with secure HTTP-only cookies and a PostgreSQL session store. APIs are RESTful, protected by `isAuthenticated` middleware, and use JSON for communication. The database layer employs Drizzle ORM with PostgreSQL (Neon serverless) for type-safe queries and schema management, including migrations. Core entities include Users, Courses, Summaries, Quizzes, and Quiz Results, with a focus on user, course, and AI-generated content management.

### System Design Choices
- **Freemium Model**: Implemented with clear distinctions between free and premium features, including file upload limits (2/month for free, unlimited for premium) and AI chatbot message limits (5 messages/session for free, unlimited for premium).
- **AI Integration**: Central to the platform, using OpenRouter API with DeepSeek R1 for intelligent course summarization, quiz generation (MCQ and open-ended), and AI-powered evaluation of open-ended answers with feedback.
- **Payment System**: Integrated Lygos for Mobile Money (MTN, Orange) and credit card payments, enabling automatic Premium subscription activation and management.
- **Profile Management**: Users can edit personal information (firstName, lastName) and upload profile photos.
- **Content Management**: Users can create, edit, and organize course notes, upload PDF/Word documents (with automatic text extraction), and view course content in a read-only mode.
- **AI Chatbot ("Tariq IA")**: An educational chatbot with a confident, motivating personality, offering smart suggestion prompts and managing message limits based on subscription tier.
- **Subscription Management**: Automated downgrade to the Free tier upon Premium subscription expiration, with real-time status checks.

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

### Utilities
- **date-fns**: For date manipulation.
- **memoizee**: For function memoization.
- **nanoid**: For generating unique identifiers.
- **mammoth**: For Word document processing.
- **pdf-parse**: For PDF text extraction.