<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Aesthetic Proof — Agent Handoff Guide

This repo was scaffolded with **Google Antigravity IDE** and has been worked on by
its Gemini-powered agent. This section documents everything a new agent (Claude Code,
Cursor, Copilot, etc.) needs to continue seamlessly.

## 1. Antigravity IDE Artifacts — What AG Left Behind

AG generates several files and directories when it initialises a project. Here is
exactly what exists (and what does not) in this repo:

| AG Artifact | Expected Location | Present? | Notes |
|---|---|---|---|
| `AGENTS.md` | `/AGENTS.md` (root) | Yes | This file. AG seeded it with the Next.js agent-rules block. Extend below the markers only. |
| `CLAUDE.md` | `/CLAUDE.md` (root) | Yes | Contains `@AGENTS.md` — an import directive so Claude Code inherits these rules automatically. |
| `GEMINI.md` | `/GEMINI.md` (root) | **No** | AG's own behavioral config for the Gemini agent. Not present — rules were likely kept in AG's global `~/.gemini/GEMINI.md` on the developer's machine. |
| `.agent/` (Brain) | `/.agent/` | **No** | AG's "Fractal Core" — stores skills, rules, and workflows. Not committed to this repo. If you need to recreate, see Section 6. |
| `.antigravity/` | `/.antigravity/` | **No** | AG's dynamic shared-knowledge directory for multi-agent context. Not committed. |
| `.cursorrules` | `/.cursorrules` | **No** | AG can bootstrap these for cross-IDE compat. Not present. |
| `.windsurfrules` | `/.windsurfrules` | **No** | Same. Not present. |
| `~/.gemini/antigravity/brain/` | User home dir | N/A | AG's global persistent memory (Knowledge Items). Lives on the original developer's machine, not in the repo. |

**Bottom line:** AG built this project but only committed the code and two agent files
(`AGENTS.md`, `CLAUDE.md`). The "brain" (`.agent/`), learned knowledge (`~/.gemini/`),
and cross-IDE bootstrap files were never checked in.

## 2. What This Project Is

**Aesthetic Proof** is a micro-SaaS API that generates beautiful, themed testimonial /
review images on the fly. Customers sign up, get an API key, buy credits via Stripe,
and hit a single endpoint to produce an image.

### Tech Stack

- **Framework:** Next.js 16.2.3 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion, Lucide React icons
- **Auth & Database:** Supabase (email/password auth, Postgres with RLS)
- **Payments:** Stripe Checkout (one-time $19 for 10,000 credits)
- **Image Generation:** `@vercel/og` (Edge runtime, `ImageResponse`)
- **Validation:** Zod v4
- **Utilities:** clsx, tailwind-merge

## 3. Project Structure

```
/
├── AGENTS.md              # Cross-agent rules (this file)
├── CLAUDE.md              # Imports @AGENTS.md for Claude Code
├── supabase_schema.sql    # Full DB schema (tables, RLS, triggers, RPCs)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (Inter font, Navbar, footer)
│   │   ├── page.tsx               # Marketing landing page
│   │   ├── globals.css            # Tailwind + custom CSS variables
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     # Login form
│   │   │   └── signup/page.tsx    # Signup form
│   │   ├── auth/
│   │   │   └── actions.ts         # Server actions for auth (login, signup, logout)
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Dashboard: API key display, credits, buy button
│   │   │   └── actions.ts         # Server action: generateApiKey()
│   │   ├── docs/
│   │   │   └── page.tsx           # API documentation page
│   │   └── api/
│   │       ├── v1/generate/
│   │       │   └── route.tsx      # CORE: Image generation endpoint (Edge)
│   │       ├── checkout/
│   │       │   └── route.ts       # Creates Stripe Checkout session
│   │       └── webhook/
│   │           └── route.ts       # Stripe webhook → increment_credits RPC
│   ├── components/
│   │   ├── navbar.tsx             # Site navigation
│   │   ├── copy-button.tsx        # Client component: copy API key to clipboard
│   │   └── theme-switcher.tsx     # Interactive preset showcase on landing page
│   ├── lib/
│   │   └── stripe.ts              # Stripe client initialisation
│   ├── proxy.ts                   # Route protection + API key validation + credit check (Next.js 16: renamed from middleware.ts)
│   └── utils/supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client (cookie-based)
├── public/
│   └── presets/                   # Preview images for preset themes
│       ├── frost.png
│       ├── midnight.png
│       ├── minimal.png
│       └── sunset.png
├── generate_presets.js            # Script to generate preset preview images
├── test_api.js                    # Script to test the /api/v1/generate endpoint
└── node_modules/next/dist/docs/   # Bundled Next.js 16 docs — READ THESE, not your training data
```

## 4. Critical Architecture Decisions

### API Key Auth (Middleware-Level)
The middleware (`src/middleware.ts`) handles two concerns in a single file:
1. **API routes** (`/api/v1/*`): Extracts `Bearer` token, validates against `api_keys`
   table using the **Supabase Service Role** (bypasses RLS), checks `credits_left > 0`,
   and injects `x-user-id` into request headers for downstream routes.
2. **Session routes** (dashboard, login, signup): Standard Supabase SSR cookie auth with
   redirect logic.

### Image Generation (Edge Runtime)
`/api/v1/generate/route.tsx` runs on the Edge. It uses `@vercel/og` `ImageResponse` to
render JSX to a PNG. It supports four built-in presets (midnight, frost, sunset, minimal),
three theme modes (dark, light, transparent), compact mode, and arbitrary `styles` overrides.

### Credit System
- Credits are stored as `credits_left` on the `api_keys` row (one key per user).
- Middleware validates credits before the request reaches the route handler.
- The Stripe webhook calls the `increment_credits` Supabase RPC (SECURITY DEFINER)
  to atomically add 10,000 credits.
- API key format: `ap_` + 48 hex chars.

### Database Schema
Two tables with RLS enabled. See `supabase_schema.sql` for the complete schema including
policies, triggers (auto-create `public.users` row on signup), and the `increment_credits` RPC.

## 5. Environment Variables

These are required in `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=            # Optional, used in checkout redirect
```

## 6. Recreating AG's Brain (Optional)

If you want to restore the Antigravity IDE structure for use with AG or Gemini CLI:

1. Create `GEMINI.md` at root with project-specific Gemini agent rules.
2. Create `.agent/` directory:
   - `.agent/skills/` — one subdirectory per skill, each with a `SKILL.md`
   - `.agent/rules/` — governance markdown files
   - `.agent/workflows/` — step-by-step automation recipes (`.md` files)
3. Create `.antigravity/` for shared multi-agent knowledge if running multiple AG agents.
4. Global AG state lives at `~/.gemini/antigravity/brain/` (per-developer, not repo-level).

## 7. Agent Rules

1. **Read the bundled Next.js docs** in `node_modules/next/dist/docs/` before writing any
   Next.js code. This version (16.2.3) has breaking changes from your training data.
2. **Never commit `.env.local`** or any file containing secrets.
3. **Supabase Service Role** (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS — only use it in
   server-side code (middleware, webhook). Never expose it to the client.
4. **Edge runtime** is declared on the generate route. Not all Node.js APIs are available.
5. The middleware matcher excludes static assets. If you add new API routes under `/api/v1/`,
   they automatically get API-key auth. Routes outside that prefix do not.
6. Stripe webhook verification uses raw body + signature. Do not add body-parsing middleware
   to the webhook route.
7. One API key per user (current design). The dashboard assumes `.single()` on the query.
