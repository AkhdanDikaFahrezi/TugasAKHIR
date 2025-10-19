# TugasAKHIR Tech Stack Document

This document explains the technology choices behind the CodeGuide Starter Kit (TugasAKHIR) in clear, everyday language. Each section describes what tools we use, why we chose them, and how they work together.

## 1. Frontend Technologies

We picked these tools to build a fast, interactive, and easy-to-maintain user interface:

- **Next.js 15 (App Router)**
  • Handles page routing, server-side rendering (SSR), and React Server Components out of the box.  
  • Improves initial load speed and search-engine friendliness.  
- **React + TypeScript**  
  • React powers our component-based UI.  
  • TypeScript adds type checking, which helps catch errors early and makes code easier to understand.  
- **TailwindCSS v4**  
  • A utility-first CSS framework that lets us style elements with small, reusable classes.  
  • Speeds up design work and keeps our style rules consistent.  
- **shadcn/ui component library**  
  • A collection of pre-built, accessible UI components (buttons, cards, dialogs, etc.).  
  • Built on top of TailwindCSS, so they fit seamlessly into our design system.  
- **next-themes**  
  • Manages light/dark mode toggling.  
  • Automatically respects the user’s system preference and lets them switch manually.  
- **Vercel AI SDK (client side)**  
  • Provides the `useChat` hook to stream AI responses in real time.  
  • Integrates smoothly with our chat component for a natural conversation flow.

These choices give us a modern, consistent design system with excellent performance and accessibility.

## 2. Backend Technologies

On the server side, we use a mix of managed services and built-in frameworks to handle data, authentication, and AI integration:

- **Next.js API Routes**  
  • Define server-side endpoints under `src/app/api/`.  
  • Used for our `/api/chat` route, which handles AI requests and streams back responses.  
- **Node.js Runtime**  
  • Powers the server environment that runs our API routes and server components.  
- **Supabase**  
  • Provides a PostgreSQL database, real-time subscriptions, and basic auth features.  
  • We set up tables with Row Level Security (RLS) to ensure that users can only access their own data.  
- **Clerk.js**  
  • Handles user sign-up, sign-in, session management, and protected routes via middleware.  
  • Simplifies secure authentication flows without building them from scratch.  
- **Vercel AI SDK (server side)**  
  • Called from our API route to forward chat messages to OpenAI or Anthropic Claude.  
  • Streams the AI’s response back to the client in chunks, reducing wait times.  
- **Utility Libraries**  
  • `clsx` + `tailwind-merge` for merging CSS class names safely.  
  • Custom helpers for initializing Supabase and working with Clerk user data.

Together, these technologies manage data storage, user identity, and AI logic in a maintainable, secure way.

## 3. Infrastructure and Deployment

We set up the project to deploy reliably, scale automatically, and keep our code organized:

- **Hosting Platform: Vercel**  
  • Automatic deployments on every Git push, with preview URLs for pull requests.  
  • Built-in support for Next.js optimizations (edge functions, SSR, caching).  
- **Version Control: Git + GitHub**  
  • Stores code history, branches, and pull requests.  
  • Collaborators can review changes, suggest fixes, and merge safely.  
- **CI/CD Pipeline**  
  • Vercel handles continuous deployment.  
  • (Optional) GitHub Actions can run tests and linters before merging.  
- **Environment Variables**  
  • Stored in Vercel’s dashboard and a local `.env` file for development.  
  • Keep API keys, database URLs, and other secrets out of the codebase.  
- **Build Tools**  
  • TailwindCSS JIT compiler and Next.js bundler remove unused code to keep assets small.  

This setup ensures fast, consistent deployments and easy collaboration.

## 4. Third-Party Integrations

We leverage external services to speed up development and add powerful features:

- **Clerk.js** for authentication and user management  
- **Supabase** for a hosted PostgreSQL database with real-time updates  
- **OpenAI & Anthropic Claude** accessed via the **Vercel AI SDK** for AI chat capabilities  

Benefits:

- No need to build and maintain your own auth or database servers.  
- Instant access to best-in-class AI models without manual API wiring.  
- Reduced development time and operational overhead.

## 5. Security and Performance Considerations

We’ve built security and speed into every layer:

- **Authentication & Authorization**  
  • Clerk middleware protects private routes (`/dashboard`, `/profile`).  
  • RLS policies in Supabase ensure users only see their own records.  
- **Data Protection**  
  • Environment variables keep secrets out of version control.  
  • HTTPS and secure cookies by default on Vercel.  
- **Performance Optimizations**  
  • Server Components in Next.js reduce client-side JavaScript.  
  • Streaming API responses minimize perceived wait times for AI chat.  
  • TailwindCSS and Next.js tree-shaking remove unused code.  
  • Image and asset optimizations handled by Next.js automatically.  

Regular security audits, error handling, and performance monitoring (e.g., Vercel Analytics) are recommended as the app grows.

## 6. Conclusion and Overall Tech Stack Summary

TugasAKHIR combines modern web tools to deliver a robust starting point for any web application. Here’s a quick recap:

- **Framework**: Next.js 15 with App Router for routing, SSR, and server components  
- **Language & Styling**: React + TypeScript, TailwindCSS v4, shadcn/ui components  
- **Auth & Data**: Clerk.js for user flows, Supabase (PostgreSQL + RLS) for data  
- **AI**: Vercel AI SDK integrating OpenAI and Anthropic Claude  
- **Deployment**: Vercel for hosting, GitHub for version control, CI/CD readiness  

Unique strengths:

- Pre-built authentication and database setup save weeks of work.  
- Modular UI library ensures consistent design with full code control.  
- Built-in AI chat example accelerates adding LLM capabilities.  
- Modern Next.js patterns (App Router, server components) optimize performance and scalability.

This tech stack aligns with the goal of giving developers a solid, production-ready foundation so they can focus on building features—not infrastructure.