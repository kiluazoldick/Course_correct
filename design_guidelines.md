# Design Guidelines: Corrige Tes Cours Landing Page

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern EdTech platforms (Notion for clean interface, Linear for professional aesthetics) combined with the user's specific brand direction.

## Core Design Principles
- **Professional & Modern**: Clean, minimal design that inspires trust with students
- **Focus on Clarity**: Information hierarchy that guides users toward account creation
- **Subtle Sophistication**: Luxurious feel through spacing and refined details

## Color Palette

### Primary Colors
**Brand Blue Gradient**: 
- Primary Blue: 214 100% 50% (#007BFF)
- Deep Night Blue: 210 100% 12% (#001F3F)
- Use gradient backgrounds for hero and key sections

### Supporting Colors
- **White/Light**: 0 0% 100% (backgrounds, cards)
- **Dark Text**: 210 100% 8% (primary text)
- **Medium Gray**: 210 10% 50% (secondary text)
- **Success Green**: 142 71% 45% (for positive indicators)

### Interactive States
- CTA buttons: Primary blue with luminous hover effect (brightness increase)
- Links: Blue with underline on hover

## Typography

### Font Families
**Primary**: Inter (via Google Fonts)
**Alternative**: Poppins for headings if more personality needed

### Type Scale
- **Hero Title**: text-5xl md:text-6xl, font-bold, leading-tight
- **Section Headings**: text-3xl md:text-4xl, font-semibold
- **Feature Titles**: text-xl md:text-2xl, font-semibold
- **Body Text**: text-base md:text-lg, font-normal
- **Small Text**: text-sm (footer, captions)

## Layout System

### Spacing Primitives
Use Tailwind units: **4, 8, 12, 16, 20, 24, 32**
- Component padding: p-8 to p-12
- Section spacing: py-16 to py-24
- Container max-width: max-w-7xl

### Grid Structure
- Features: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Benefits: grid-cols-1 md:grid-cols-3
- Generous gaps: gap-8 to gap-12

## Component Library

### Header
- Fixed/sticky navigation with blur backdrop
- Logo (text + book/student cap icon) on left
- Navigation links center: Fonctionnalités, Tarifs, À propos
- Right: "Connexion" (text link) + "Créer un compte" (CTA button)
- Mobile: hamburger menu

### Hero Section
- Full viewport height (min-h-screen) with gradient background (blue to night blue)
- White text for high contrast
- Hero title + subtitle centered
- Illustration/mockup of student working on computer (right side on desktop, below on mobile)
- Primary CTA: Large button "Créer un compte gratuit"
- Include trust indicator: "Déjà 1000+ étudiants nous font confiance" (subtle, small)

### Feature Cards
Four cards in responsive grid:
- Icon (Remix Icon): 📝 Note, 📄 Document, ❓ Question, 📈 Chart
- Title (semibold)
- Description (2-3 lines)
- White cards with subtle shadow: shadow-lg
- Hover: slight lift (transform translate-y-1) and shadow increase

### Benefits Section
Three visual cards with:
- Large emoji/icon on top
- Bold title
- Short description
- Clean white cards with rounded corners (rounded-2xl)

### CTA Section
- Gradient background matching hero
- Centered content: Title + Subtitle + CTA button
- More compact than hero (py-20)

### Footer
- Dark background (night blue)
- Three columns: Links | Copyright | Social Icons
- Links: Mentions légales, Confidentialité, Contact
- Social icons (Remix Icon): Instagram, Twitter, LinkedIn
- Copyright: "© 2025 Corrige Tes Cours. Tous droits réservés."

## Animations

**Keep Subtle & Professional**:
- **FadeIn**: Opacity 0→1 on scroll (duration-700)
- **SlideUp**: Transform translate-y-8→0 on scroll (duration-500)
- **Hover Effects**: Scale 1.02, brightness increase on buttons
- **Stagger**: Sequential animation for feature cards (100ms delay each)

## Images

### Hero Image
**Large illustration/mockup** (right 50% on desktop, full width on mobile below text):
- Modern student using laptop with platform interface visible
- Clean, bright, professional photography or illustration style
- Shows platform in use for authenticity
- Alt: "Étudiant utilisant Corrige Tes Cours pour réviser"

### Supporting Imagery
- Feature icons: Use Remix Icon library exclusively
- Decorative elements: Minimal geometric shapes in brand blue (optional accents)

## Accessibility & Responsiveness

- High contrast text (white on dark blue, dark blue on white)
- Focus states: 2px blue outline on interactive elements
- Mobile-first responsive design
- Touch targets minimum 44px
- Semantic HTML structure

## Key Interactions

- **CTA Buttons**: Blue background, white text, rounded-lg, px-8 py-4, shadow-md, hover:brightness-110 transition
- **Navigation Links**: Underline on hover, smooth color transition
- **Cards**: Hover lift effect with shadow enhancement
- **Scroll Animations**: Trigger at 10% viewport visibility

This design creates a modern, trustworthy platform that speaks directly to students' needs while maintaining a professional, polished aesthetic.