# MedLens

AI-assisted **triage support** (not a diagnosis): structured symptom + optional vision flows, a **rule-based safety layer** that can escalate above the model, interactive 3D anatomy (React Three Fiber), Supabase persistence when configured, and Clerk auth (optional).

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind, Framer Motion  
- shadcn-style UI primitives (`components/ui`)  
- `@react-three/fiber`, `three`, `@react-three/drei`  
- Google Gemini (JSON mode) for text + vision  
- Supabase (Postgres) via **service role** from API routes only  
- Clerk (optional) for user identity  
- PostHog (optional) for `$pageview` capture  

## Environment

Copy `.env.example` to `.env.local` and fill values:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | Optional, default `gemini-2.0-flash` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to the client |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional, default PostHog US host |

Without Clerk, triage APIs still run; history is not attributed. Without Supabase keys, saves no-op. Without `GEMINI_API_KEY`, AI returns a safe development stub and rules still run.

## Database

Apply SQL in [`supabase/migrations/20260509000000_init.sql`](supabase/migrations/20260509000000_init.sql) in the Supabase SQL editor (or Supabase CLI). Tables: `symptom_sessions`, `image_analyses`. Server code filters by Clerk `user_id`.

## Mobile and “app-like” install

- Layout uses **safe-area** insets, **dynamic viewport** height (`min-h-dvh`), and a **bottom tab bar** on small screens (primary navigation).
- **Add to Home Screen**: `manifest.ts` + `appleWebApp` metadata + generated icons (`/icon`, `/apple-icon`) enable a standalone-style shell on iOS/Android when installed from the browser.
- The **3D body** viewer uses viewport-based height, `touch-none` on the canvas wrapper, and orbit controls tuned for **one-finger rotate / two-finger zoom** on touch devices.


## Vercel

1. Set all env vars in the Vercel project (including `SUPABASE_SERVICE_ROLE_KEY` as **secret**).  
2. Use Node runtime for `/api/vision` (already `export const runtime = "nodejs"`).  
3. Keep image payloads small (client compresses to JPEG in the scan flow).  
4. Add Clerk production URLs to the Clerk dashboard.  

## Safety

Disclaimers are shown in the shell and on flows. The rule engine in `lib/triage` is deterministic and merged so **final urgency is the stricter of rules vs model** for the supported patterns.
