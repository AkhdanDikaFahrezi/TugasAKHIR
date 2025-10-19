# Backend Structure Document for TugasAKHIR (CodeGuide Starter Kit)

This document describes how the backend of the TugasAKHIR starter kit is put together. It covers the overall setup, the database, the APIs, hosting, infrastructure, security, and how we keep everything running smoothly. You don’t need a deep technical background to understand it.

## 1. Backend Architecture

**Overview**
- We use Next.js (version 15) to run our server code and define API routes alongside the frontend pages.
- The code is written in TypeScript for added safety and clearer code structure.
- Authentication is handled by Clerk.js, so we don’t need to build login systems from scratch.
- Supabase (a hosted PostgreSQL service) manages our data storage and real-time features.
- AI functionality (chat interface) is powered by the Vercel AI SDK, which calls OpenAI or Anthropic Claude behind the scenes.

**Key design patterns and frameworks**
- **Server-side rendering & Server Components**: Next.js App Router lets us render pages and data on the server for faster load times.
- **API Routes**: We keep server logic (like AI chat) in dedicated endpoints under `/api/`.
- **Middleware**: Next.js middleware checks user sessions with Clerk.js before letting people access protected routes.

**How it supports scalability, maintainability, and performance**
- **Scalability**: Serverless functions (via Vercel) spin up on demand, handling more traffic without manual setup.
- **Maintainability**: Clear folder structure (`app/`, `lib/`, `components/`) keeps code organized. TypeScript catches mistakes early.
- **Performance**: Server Components reduce the amount of JavaScript sent to the browser. Caching and streaming responses (for AI) make interactions snappy.

## 2. Database Management

**Database technology**
- We use **Supabase**, which runs a **PostgreSQL** database under the hood.
- It also provides built-in authentication hooks and real-time features, all in one service.

**How data is structured and accessed**
- Tables are defined with SQL migrations, and we enable **Row Level Security (RLS)** so each user only sees their own data.
- The Supabase client is set up in `src/lib/supabase.ts`, where we read credentials from environment variables.
- Data is fetched or updated using Supabase’s JavaScript API, keeping queries readable and consistent.

**Data management practices**
- Environment variables (in `.env`) keep credentials and keys out of our codebase.
- RLS policies enforce who can read or write each table.
- We include example migrations (`001_example_tables_with_rls.sql`) to show how to set up tables and security rules.

## 3. Database Schema

Below is a human-friendly summary of our main tables, followed by actual SQL for creating them in PostgreSQL.

**Tables and their fields**

Profiles
- `id`: Unique identifier (UUID)
- `user_id`: References the Clerk user
- `bio`: Short text about the user (optional)
- `avatar_url`: Link to profile picture (optional)
- `created_at`: Timestamp when profile was created

ChatMessages
- `id`: Unique identifier (UUID)
- `user_id`: References the Clerk user
- `sender`: Who sent the message (`user` or `ai`)
- `content`: The text of the message
- `created_at`: Timestamp when message was sent

**SQL schema (PostgreSQL)**
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Only allow users to read/write their own profile
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Only allow users to read/write their own messages
CREATE POLICY "Users can manage their own messages" ON chat_messages
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

## 4. API Design and Endpoints

We follow a simple, RESTful approach with JSON over HTTP.

**Key endpoints**

POST `/api/chat`
- **Purpose**: Receive a user message, forward it to the AI model (OpenAI or Claude), and stream the response back.
- **How it works**:
  1. Client sends `{ message: string }` in the body.
  2. The route uses Vercel AI SDK with server API keys.
  3. AI response is streamed back to the client in real time.

(Additional endpoints can be added as needed, for example to fetch a user’s profile or messages from Supabase.)

## 5. Hosting Solutions

**Where code runs**
- The frontend and API routes are deployed on **Vercel**, which handles automatic scaling, CDN, and SSL.
- The database is hosted by **Supabase**, offering a managed PostgreSQL cluster with daily backups.
- Clerk.js runs on its own infrastructure, providing secure user management.

**Benefits**
- **Reliability**: Vercel and Supabase manage servers, backups, and failover for us.
- **Scalability**: Both Vercel and Supabase automatically adjust resources as traffic or data grows.
- **Cost-effectiveness**: We pay for usage rather than provisioning our own machines.

## 6. Infrastructure Components

**Load balancing & CDN**
- Vercel’s platform automatically distributes incoming requests across multiple servers and caches static assets at edge locations worldwide.

**Caching**
- Static pages and assets (CSS, images) are served from the CDN.
- API responses can be cached at the edge if configured (e.g., using Next.js cache options).

**Content Delivery**
- All static files and optimized images are delivered via Vercel’s CDN to minimize latency for users everywhere.

## 7. Security Measures

**Authentication & Authorization**
- **Clerk.js** handles sign-up, sign-in, session tokens, and secure cookie management.
- Next.js middleware checks each request to protected routes (`/dashboard`, `/profile`) and redirects unauthenticated users.

**Data protection**
- All connections use HTTPS/TLS by default (Vercel and Supabase enforce this).
- Data at rest in Supabase is encrypted.
- Row Level Security ensures users only access their own records.

**Environment variables**
- Sensitive keys (Clerk API keys, Supabase URL and key, OpenAI/Claude keys) live in `.env` files and are never committed to the code repo.

## 8. Monitoring and Maintenance

**Performance monitoring**
- Vercel provides basic metrics for serverless function execution times and failures.
- Supabase dashboard shows database performance, query history, and error logs.

**Error tracking**
- We recommend integrating a service like Sentry or LogRocket to capture runtime errors and stack traces.

**Routine maintenance**
- Keep dependencies up to date with automated tools (e.g., Dependabot).
- Review RLS policies and environment variables whenever user roles or integrations change.
- Run periodic audits for security (e.g., checking for vulnerable packages).

## 9. Conclusion and Overall Backend Summary

The TugasAKHIR starter kit uses a modern, serverless-friendly backend built on Next.js, Supabase, and Clerk.js. It provides:

- A clear folder structure separating pages, API routes, utilities, and components.
- A secure database setup with PostgreSQL and Row Level Security.
- A single, dedicated API route for AI chat that streams responses.
- Hosting on Vercel and Supabase, ensuring global delivery, automatic scaling, and cost efficiency.
- Strong security practices around authentication, encryption, and environment management.

Together, these components ensure the backend is easy to understand, simple to extend, and robust enough to grow with your project’s needs.