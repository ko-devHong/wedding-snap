# Wedding Snap - AI Agents Architecture

## 1. Project Overview
"Wedding Snap" is a wedding photography promotion and booking platform. The goal is to provide a visually stunning, SEO-optimized experience that converts visitors into customers through an integrated booking system.

## 2. Tech Stack
- **Framework**: Astro (v5.x) - Chosen for superior SEO and performance (Islands Architecture).
- **UI Library**: React (v19) - Used for complex interactive components like the Booking System.
- **Styling**: Tailwind CSS (v4) - Rapid, utility-first styling.
- **Animations**: CSS Animations & Canvas Confetti (already installed) / Framer Motion (recommended for complex transitions).
- **Package Manager**: Yarn.

## 3. SEO Strategy (Requirement: High Discoverability)
- **Metadata**: Strict usage of `<title>`, `<meta name="description">`, and Open Graph tags (OG) in the global Layout.
- **SSR/SSG**: Astro defaults to static generation which is perfect for search crawlers (Naver, Google).
- **Semantic HTML**: Use `<main>`, `<section>`, `<header>`, `<footer>`, `<h1>` tags correctly.
- **Performance**: Minimize client-side JavaScript using Astro Islands (`client:load` only when necessary).

## 4. Design & UX (Requirement: Wedding Atmosphere)
- **Visuals**: Soft color palettes (White, Cream, Soft Pink, Gold).
- **Typography**: Elegant Serif fonts for headings, clean Sans-Serif for body text.
- **Animations**: 
  - Hero section fade-ins.
  - Scroll-triggered reveal effects.
  - Confetti effect on booking success.

## 5. Functional Architecture
### 5.1 Booking System
- **Frontend**: React Component (`BookingSystem.tsx`).
- **State**: Manage booking steps (Date Selection -> Time Selection -> User Info -> Confirmation).
- **Calendar Logic**: Display available slots, block booked slots.
- **Google Integration**:
  - **Auth**: Google OAuth 2.0 (Client-side or via Auth provider).
  - **Calendar API**: 
    - `calendar.events.list` to check availability.
    - `calendar.events.insert` to create bookings.

### 5.2 Email Notification
- Integration with an email service (e.g., EmailJS, Resend, or AWS SES).
- Triggered upon successful Google Calendar insertion.

## 6. Directory Structure
```
src/
├── components/
│   ├── BookingSystem.tsx  # React: Calendar & Form
│   ├── Hero.astro         # Astro: Main Visual
│   └── Header.astro       # Astro: Navigation
├── layouts/
│   └── Layout.astro       # SEO & Global Styles
├── pages/
│   └── index.astro        # Landing Page
└── styles/
    └── global.css         # Tailwind directives
```

## 7. Future AI Directives
- **Agent Role**: Maintain the "Wedding" aesthetic.
- **Constraint**: Always check `package.json` before adding libraries.
- **Testing**: Add unit tests for utility functions (e.g., date formatting).