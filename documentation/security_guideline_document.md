# Security Guidelines for CodeGuide Starter Kit (TugasAKHIR)

This document outlines security best practices tailored to the CodeGuide Starter Kit (TugasAKHIR) repository. It integrates core security principles—Security by Design, Least Privilege, Defense in Depth, and Secure Defaults—into each major component and workflow.

---

## 1. Security by Design & Architecture

- **Embed Security Early:** Incorporate threat modeling and risk assessments when extending or customizing this starter kit. Every new feature should be evaluated for potential attack vectors.
- **Least Privilege:** 
  - Grant Clerk and Supabase minimal permissions. For example, configure Supabase roles so only authenticated users access specific tables via Row Level Security (RLS).
  - Limit AI API credentials (OpenAI/Anthropic) to scoped API keys with usage quotas.
- **Defense in Depth:**
  - Combine database RLS, server-side authorization, and UI-level access controls for sensitive operations.
  - Use Next.js middleware _and_ API route guards to double-verify authentication.

---

## 2. Authentication & Access Control (Clerk.js)

- **Strong Authentication Flows:**
  - Enforce Clerk’s built-in email verification and multi-factor authentication (MFA) for administrative or privileged accounts.
  - Disable deprecated authentication algorithms; rely on Clerk’s default secure algorithms.
- **Session Management:**
  - Use HttpOnly, Secure, and SameSite=strict cookies. 
  - Configure session timeouts (idle and absolute) in the Clerk dashboard.
  - Invalidate sessions on password resets or suspicious activity.
- **Role-Based Access Control (RBAC):**
  - Define roles (e.g., `user`, `admin`, `moderator`) in Clerk and propagate them to Supabase as custom claims.
  - Enforce server-side role checks in `middleware.ts` and API routes before executing sensitive logic.

---

## 3. Input Validation & Output Encoding

- **Server-Side Validation:**
  - Validate all inputs in API routes (`/api/chat`, Supabase queries) using a schema validation library (e.g., Zod, Joi).
  - Reject malformed requests early with generic error messages to avoid information leakage.
- **Prevent Injection Attacks:**
  - Use Supabase client’s parameterized queries or an ORM to avoid SQL injection.
  - Sanitize AI prompt inputs to prevent prompt injection and untrusted code execution.
- **Output Encoding & XSS Defense:**
  - Escape user-supplied content in React components. Although shadcn/ui components render safe HTML by default, avoid using `dangerouslySetInnerHTML`.
  - Implement a Content Security Policy (CSP) header in `next.config.js` or a custom server to block inline scripts and unauthorized domains.

---

## 4. Data Protection & Privacy (Supabase)

- **Encryption in Transit & At Rest:**
  - Enforce TLS 1.2+ for all Supabase and API communications.
  - Verify Supabase storage buckets have at-rest encryption enabled.
- **Row Level Security (RLS):**
  - Maintain strict RLS policies (e.g., `auth.uid() = user_id`) to ensure users only access their own data.
  - Regularly audit RLS policies in migration files like `001_example_tables_with_rls.sql`.
- **Secrets Management:**
  - Remove any hard-coded secrets from the repository. Use environment variables stored in a secure vault or your platform’s secret manager (Vercel/AWS Secrets Manager).
  - Provide a `.env.example` without actual values and document required variables.

---

## 5. API & Service Security

- **HTTPS Enforcement:**
  - In production, redirect all HTTP requests to HTTPS using `next.config.js` rewrites or a proxy/load balancer rule.
- **Rate Limiting & Throttling:**
  - Integrate rate limiting middleware (e.g., `express-rate-limit` or a serverless equivalent) on `/api/chat` to prevent abuse and brute-force.
- **CORS Configuration:**
  - Allow only your application’s origin(s) in CORS policies for API routes. Avoid using wildcard (`*`).
- **Principle of Least Data Exposure:**
  - Return only necessary fields in API responses. Strip sensitive fields (e.g., tokens, internal IDs) before sending JSON.
- **API Versioning:**
  - Prefix major API routes with a version (`/api/v1/chat`) to handle breaking changes securely.

---

## 6. Web Application Security Hygiene

- **CSRF Protection:**
  - Use Next.js’s built-in CSRF protection for API routes or a custom anti-CSRF token (synchronizer token pattern) for form submissions.
- **Security Headers:**
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer-when-downgrade`
- **Secure Cookies:**
  - Set `HttpOnly`, `Secure`, and `SameSite=Strict` on session cookies issued by Clerk.
- **Content Security Policy (CSP):**
  - Define a strict CSP that whitelists only required domains for scripts, styles, images, and connects (e.g., Supabase, Clerk, AI providers).

---

## 7. Infrastructure & Configuration Management

- **Environment Hardening:**
  - Disable all debugging endpoints and verbose error logs in production. Use `NEXT_PUBLIC` and server-only environment variables appropriately.
- **Dependency Management:**
  - Maintain `package-lock.json` or `yarn.lock` for deterministic builds.
  - Run periodic vulnerability scans (e.g., `npm audit`, GitHub Dependabot) and update critical dependencies promptly.
- **Secure CI/CD:**
  - Store secrets in the CI/CD environment (GitHub Actions, Vercel) and avoid exposing them in logs.
  - Implement mandatory pull-request reviews and automated testing (lint, type checks, security scans) before merging.

---

## 8. Monitoring, Logging & Incident Response

- **Audit Logging:**
  - Log authentication events (sign-ins, sign-outs, failed attempts), RLS access denials, and AI usage anomalies to a centralized, tamper-resistant log store.
- **Error Handling:**
  - Fail securely by returning generic error messages to clients. Capture stack traces and sensitive details only in internal logs.
- **Incident Response Plan:**
  - Define procedures for secret rotation, vulnerability patching, and communication in case of a security incident.

---

By integrating these guidelines into your development lifecycle, CodeGuide Starter Kit (TugasAKHIR) can maintain a robust security posture and support the secure growth of your web applications.
