# Frontend Guideline Document

This document describes the frontend setup, architecture, design principles, and technology choices for the CodeGuide Starter Kit (TugasAKHIR). It is written in plain language so that anyone—technical or non-technical—can understand how the project is structured and why certain decisions were made.

## 1. Frontend Architecture

### 1.1 Overview
- **Framework**: Next.js 15 with the App Router. This offers file-based routing, built-in server-side rendering (SSR), and React Server Components out of the box.  
- **Language**: TypeScript for static type checking, better editor tooling, and fewer runtime errors.  
- **Styling**: TailwindCSS v4—a utility-first CSS framework—for rapid, consistent UI development.  
- **UI Components**: shadcn/ui, a library of accessible, Tailwind-styled React components (Buttons, Inputs, Cards, etc.).  
- **Authentication**: Clerk.js handles sign-up, sign-in, session management, and route protection.  
- **Database & BaaS**: Supabase (PostgreSQL) for data storage, real-time features, and Row Level Security (RLS).  
- **AI Integration**: Vercel AI SDK to stream responses from models like OpenAI or Anthropic Claude via a dedicated `/api/chat` route.  
- **Theming**: next-themes with CSS variables for seamless dark‐mode support, respecting system preferences and manual toggling.  

### 1.2 Scalability, Maintainability, Performance
- **Scalability**: Modular folder structure (`src/app`, `src/components`, `src/lib`) lets teams work on isolated features without conflicts. BaaS (Supabase) and managed auth (Clerk) remove server maintenance overhead.  
- **Maintainability**: TypeScript guarantees consistent APIs; component-based design (shadcn/ui) enforces a single source of truth for UI elements. Environment variables (.env.example) centralize configuration.  
- **Performance**: React Server Components and SSR reduce client bundle size. Lazy loading (via `next/dynamic`) and code splitting happen automatically by route. Tailwind’s purge feature strips unused CSS in production. Streaming AI responses speeds up chat interactions.  

## 2. Design Principles

### 2.1 Key Principles
- **Usability**: Intuitive layouts, clear call-to-action buttons, and consistent feedback patterns.  
- **Accessibility (A11y)**: Out-of-the-box ARIA attributes and keyboard-friendly components from shadcn/ui; semantic HTML; regular audits with tools like axe.  
- **Responsiveness**: Mobile-first approach using Tailwind’s responsive utilities (e.g., `sm:`, `md:`, `lg:`).  

### 2.2 Application of Principles
- All interactive elements (buttons, links) have focus and hover styles.  
- Color contrast meets WCAG AA standards for readability.  
- Layouts adapt gracefully from small (mobile) to large (desktop) screens.  
- Dark mode toggles adjust all background and text variables for comfortable low-light viewing.  

## 3. Styling and Theming

### 3.1 Styling Approach
- **Methodology**: Utility-first with TailwindCSS v4—no separate BEM or SMACSS files.  
- **Pre-processor**: None. Tailwind’s JIT engine and CSS variables cover theming needs.  

### 3.2 Theming
- **CSS Variables** defined in `tailwind.config.ts` for colors, spacing, and typography.  
- **Dark Mode**: Controlled by next-themes. Variables like `--background`, `--foreground`, and `--accent` swap automatically based on user preference or manual toggle.  

### 3.3 Visual Style
- **Design Style**: Modern flat design with subtle shadows and rounded corners (inspired by New York style from shadcn/ui).  
- **Color Palette** (examples; see your `tailwind.config.ts` for exact values):  
  - `--color-primary`: #6366F1 (indigo-500)  
  - `--color-primary-hover`: #4F46E5 (indigo-600)  
  - `--color-secondary`: #10B981 (emerald-500)  
  - `--color-accent`: #EAB308 (amber-500)  
  - `--color-background-light`: #FFFFFF  
  - `--color-background-dark`: #111827  
  - `--color-foreground-light`: #111827  
  - `--color-foreground-dark`: #F9FAFB  
  - `--color-error`: #EF4444 (red-500)  
  - `--color-success`: #34D399 (green-400)  

### 3.4 Typography
- **Font Family**: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`  
- **Sizing**: Tailwind’s scale (`text-sm`, `text-base`, `text-lg`, etc.) for consistent rhythm.  

## 4. Component Structure

### 4.1 Organization
- **src/components/ui/**: Core building blocks copied from shadcn/ui—Buttons, Inputs, Cards, Menus, etc.  
- **src/components/**: Feature or page-specific components, e.g., `Chat.tsx`.  

### 4.2 Reusability
- Atomic design: each component does one thing well—props control behavior and appearance.  
- UI components accept Tailwind class overrides via a `className` prop and the `cn` utility (`clsx` + `tailwind-merge`).  

### 4.3 Benefits of Component-Based Architecture
- Single source of truth for UI logic and styling.  
- Easier testing, isolation, and documentation (e.g., future Storybook integration).  
- Faster onboarding: developers recognize and reuse existing patterns.  

## 5. State Management

### 5.1 Client-Side State
- **Local State**: React’s `useState` and `useReducer` for form inputs, toggles, chat history.  
- **Context**:  
  - `ThemeProvider` (next-themes) for theme state.  
  - `ClerkProvider` for authentication context (user info, session).  

### 5.2 Server-State and Data Fetching
- **Next.js Server Components** fetch data directly, returning fully rendered HTML to the client with minimal JS.  
- **Supabase Client** in `src/lib/supabase.ts` handles queries and real-time subscriptions.  

### 5.3 Scaling State Management
- For more complex global or server-cached state, consider:  
  - **TanStack Query** for server caching and synchronization.  
  - **Zustand** or **Jotai** for lightweight global state beyond Context.  

## 6. Routing and Navigation

### 6.1 Next.js App Router
- **File-Based Routing** in `src/app/`:  
  - `layout.tsx` wraps all pages with shared providers (Theme, Clerk).  
  - `page.tsx` files define each route’s UI and data requirements.  
  - `src/app/api/chat/route.ts` is the dedicated backend for AI.  
- **Nested Layouts** let you share UI (sidebars, headers) across groups of pages.  

### 6.2 Protected Routes
- **Middleware** (`src/middleware.ts`) uses Clerk’s `withAuth` to redirect unauthenticated users away from `/dashboard`, `/profile`, etc.  

### 6.3 Navigation
- **Links**: Use `next/link` for client-side transitions.  
- **Active State**: Conditionally style nav items based on the current route.  

## 7. Performance Optimization

### 7.1 Principles
- Minimize JavaScript on the client by using Server Components and SSR.  
- Defer non-critical UI with dynamic imports (lazy loading).  
- Optimize assets and CSS (Tailwind purge).  

### 7.2 Strategies
- **Code Splitting**: Automatic per-route splitting in Next.js.  
- **Lazy Loading**: `next/dynamic` for heavy components (e.g., rich text editors).  
- **Image Optimization**: `next/image` for responsive, lazy-loaded images.  
- **Caching**: Leverage Next.js `revalidate`, `cache` and HTTP headers.  
- **AI Streaming**: Vercel AI SDK streams partial responses to improve perceived performance.  

## 8. Testing and Quality Assurance

### 8.1 Unit and Integration Testing
- **Jest** + **React Testing Library** for React components and utility functions (`src/lib/utils.ts`, `supabase.ts`, etc.).  
- **Supertest** (or Next.js built-in test runner) for API route tests (`/api/chat`).  

### 8.2 End-to-End (E2E) Testing
- **Playwright** or **Cypress** to simulate real user flows: sign-in, dashboard access, chat interactions.  

### 8.3 Linting and Formatting
- **ESLint** (with Next.js and TypeScript plugins) enforces code style and catches common errors.  
- **Prettier** for consistent formatting.  
- **Type Checking**: Run `tsc --noEmit` to catch type issues before build.  

### 8.4 Accessibility Testing
- **jest-axe** or **axe-core** in CI pipelines to automate scans.  
- Manual keyboard and screen-reader checks on critical user flows.  

## 9. Conclusion and Overall Frontend Summary

This Frontend Guideline Document lays out a clear, maintainable, and high-performance foundation for web applications using Next.js, TypeScript, TailwindCSS, and a suite of specialized services (Clerk, Supabase, Vercel AI). Key takeaways:

- A **file-based, server-component-first** architecture speeds up initial loads and reduces client bundle size.  
- **Utility-first styling** (TailwindCSS) and a **component library** (shadcn/ui) ensure consistent, responsive, and accessible UIs.  
- **Modular design** and clear folder conventions (`app/`, `components/`, `lib/`) promote collaboration and scalability.  
- **State** is managed with React hooks and Context; server state leverages Next.js data-fetching and Supabase.  
- **Performance** is optimized through SSR, code splitting, lazy loading, and streaming AI responses.  
- **Quality** is enforced by TypeScript, testing (unit, integration, E2E), linting, and accessibility audits.

By following these guidelines, teams can confidently build, extend, and maintain applications that meet modern standards for usability, performance, and security.