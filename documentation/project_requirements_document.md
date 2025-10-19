# Project Requirements Document (PRD)

## 1. Project Overview

The CodeGuide Starter Kit (named **TugasAKHIR**) is a fully configured Next.js starter project designed to help developers launch modern web applications in minutes. It bundles user authentication, database integration, AI-driven chat, theming, and a reusable UI component library—all wired together using best practices. Instead of spending days setting up boilerplate code and plumbing, developers can focus on their core features from day one.

We’re building this starter kit to solve the common pain point of initial project setup: wiring up auth, database, styling, AI integrations, and routing. Key objectives include:

• Provide a robust, secure authentication flow (signup, login, sessions) via **Clerk.js**
• Enable scalable data management and row-level security using **Supabase**
• Offer a plug-and-play AI chat interface powered by the **Vercel AI SDK** with OpenAI and Anthropic Claude models
• Deliver a modular, themeable UI built on **shadcn/ui** and **TailwindCSS v4**
• Follow modern Next.js 15 App Router patterns and TypeScript for maintainability and performance

Success will be measured by how quickly a developer can spin up the kit, authenticate users, perform database operations, and interact with the AI chat without additional setup.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (First Version)

• Next.js 15 App Router with TypeScript
• User signup, login, session management via Clerk.js
• Protected routes (dashboard, profile) enforced by middleware
• Supabase configuration and example tables with Row Level Security (RLS)
• Basic CRUD utilities for Supabase (via `src/lib/supabase.ts`)
• AI chat feature at `/api/chat` using Vercel AI SDK, streaming responses from OpenAI/Claude
• Reusable UI components folder (`src/components/ui`) built with shadcn/ui and TailwindCSS
• Theming (light/dark) via next-themes + CSS variables
• Utility modules for user data and CSS class merging (`cn` function)
• Environment variable management via `.env.example` and docs (`CLAUDE.md`, `SUPABASE_CLERK_SETUP.md`)

### Out-of-Scope (Future Phases)

• End-to-end testing setup (Cypress/Playwright)
• Comprehensive unit/integration test suites
• CI/CD pipelines (GitHub Actions, Vercel workflows)
• Storybook or isolated component documentation
• Multi-language (i18n) support
• Analytics/monitoring dashboards
• Advanced caching or edge-side rendering configurations
• Mobile-only app or React Native integration

---

## 3. User Flow

**Paragraph 1:** A new developer clones the TugasAKHIR repository, installs dependencies, and sets up `.env` with their Supabase and Clerk credentials. They run `npm run dev` and arrive at the landing page (`/`). If they aren’t signed in, the navigation bar shows “Sign In” and “Sign Up” buttons. Clicking “Sign Up” opens Clerk’s signup widget. After entering email/password (or OAuth), they get redirected to `/dashboard` with a welcome message.

**Paragraph 2:** On the dashboard, the left sidebar lets them navigate to pages like “Profile,” “Chat,” and “Data.” In “Chat,” they can type messages into a text field. Each message triggers a POST to `/api/chat`, which streams back AI replies in real time. Under “Data,” they see example records pulled from Supabase, and CRUD buttons (Create, Edit, Delete) are enabled if the logged-in user passes RLS checks. They can toggle dark/light modes at any time via a button in the header.

---

## 4. Core Features

• **Authentication Module**: Sign-up, login, logout, session persistence via Clerk.js
• **Protected Routes**: Middleware in `middleware.ts` redirects unauthenticated users
• **Database Integration**: Supabase client setup with example tables and RLS
• **CRUD Utilities**: Basic create/read/update/delete helpers in `src/lib`
• **AI Chat Interface**: `useChat` hook + `/api/chat` route streaming from Vercel AI SDK
• **UI Component Library**: Shadcn/ui components (Button, Input, Card) styled by Tailwind
• **Theming**: Light/dark mode with next-themes and CSS custom properties
• **App Layout**: Global root layout (`layout.tsx`) wrapping ThemeProvider + ClerkProvider
• **Utility Functions**: `cn()` for class merging, `getUserData()` for Clerk user info
• **Environment Management**: `.env.example` template + setup docs for secrets

---

## 5. Tech Stack & Tools

• **Frontend Framework**: Next.js 15 (App Router, React Server Components)  
• **Language**: TypeScript  
• **Styling**: TailwindCSS v4 + CSS variables  
• **UI Library**: shadcn/ui (React components)  
• **Authentication**: Clerk.js  
• **Database / BaaS**: Supabase (PostgreSQL + RLS)  
• **AI Integration**: Vercel AI SDK with OpenAI and Anthropic Claude  
• **Theming**: next-themes  
• **Utilities**: clsx + tailwind-merge (`cn`), custom hooks  
• **IDE Recommendations**: VSCode with GitHub Copilot, Cursor, Windsurf plugins  
• **Deployment**: Vercel (serverless functions for `/api/chat`)

---

## 6. Non-Functional Requirements

• **Performance**:  
  – Initial page TTFB < 200ms  
  – AI chat streaming latency < 500ms per chunk  
  – CSS bundle < 100KB (Tailwind purge enabled)

• **Security**:  
  – All API keys in environment variables  
  – Clerk’s secure JWT sessions + HTTPS only  
  – Supabase RLS policies enforcing per-user access  
  – Input validation/sanitization in `/api/chat`

• **Compliance**:  
  – GDPR-ready data handling (user can delete account)  
  – Secure storage of user data in PostgreSQL

• **Usability & Accessibility**:  
  – WCAG 2.1 AA color contrast  
  – Keyboard navigation for all interactive elements  
  – ARIA labels on custom components  
  – Responsive design (mobile, tablet, desktop)

---

## 7. Constraints & Assumptions

• **Network**: Users have stable internet to reach Clerk, Supabase, and AI endpoints  
• **Environment**: Node.js v18+ local dev, modern browsers (Chrome, Firefox, Safari)  
• **Service Availability**: Clerk, Supabase, OpenAI, and Anthropic APIs are accessible and within rate limits  
• **Secrets Management**: Developers will populate `.env` correctly before running  
• **Scale**: Starter kit for small-to-medium projects; not tuned for massive concurrent traffic

---

## 8. Known Issues & Potential Pitfalls

• **API Rate Limits**: OpenAI/Anthropic may throttle; mitigate with exponential backoff and caching  
• **Cold Starts**: Serverless functions (`/api/chat`) might cold-start; consider warm-up strategies or deploying on a region close to users  
• **RLS Complexity**: Misconfigured Row Level Security can block legitimate queries; provide clear RLS examples in docs  
• **Environment Misconfiguration**: Missing or wrong env vars can break auth or DB; emphasize `.env.example` and setup docs  
• **Theme FOUC**: Flash of unstyled content on theme switch; pre-hydrate theme value in `layout.tsx`


---

This PRD lays out precisely what the CodeGuide Starter Kit delivers, what’s deferred for later, and how users and developers will interact with it. All subsequent technical documents—like the Tech Stack deep dive, Frontend Guidelines, or Backend Structure—can reference this single source of truth without ambiguity.