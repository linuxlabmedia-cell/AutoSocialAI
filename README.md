# AutoSocial AI

An AI-powered social media automation SaaS that handles content generation, image creation, quality validation, scheduling, and publishing to Meta (Facebook + Instagram) — fully automatically.

## Project Structure

```
autosocial-ai/
├── apps/
│   ├── web/          # Next.js 14 frontend (Vercel)
│   └── workers/      # Node.js background workers (Railway)
└── packages/
    ├── db/           # Prisma schema + database client
    ├── trpc/         # tRPC routers (type-safe API)
    └── shared/       # Shared types and constants
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (Neon recommended)
- Redis (Upstash recommended)

## Setup

### 1. Clone and install

```bash
cd autosocial-ai
npm install -g pnpm
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/workers/.env
```

Fill in all values. Required services:

| Service | Purpose | Sign up at |
|---------|---------|-----------|
| Neon | PostgreSQL database | neon.tech |
| Upstash | Redis (queues + cache) | upstash.com |
| Clerk | Authentication | clerk.com |
| Anthropic | AI content generation | console.anthropic.com |
| Replicate | AI image generation | replicate.com |
| Cloudflare R2 | Image storage | dash.cloudflare.com |
| Meta Developers | Facebook/Instagram API | developers.facebook.com |
| Stripe | Payments | stripe.com |
| Resend | Email | resend.com |

### 3. Database setup

```bash
pnpm db:push       # Push schema to database
pnpm db:generate   # Generate Prisma client
```

### 4. Meta App Setup

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app (Business type)
3. Add **Facebook Login** and **Instagram Basic Display** products
4. Set OAuth callback URL to: `https://yourdomain.com/api/meta/callback`
5. Request permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `business_management`
6. Submit for App Review before going to production

### 5. Stripe Setup

```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Create products and prices in Stripe Dashboard, then add the price IDs to your `.env`.

### 6. Run development

```bash
# Terminal 1: Web app
cd apps/web && pnpm dev

# Terminal 2: Background workers
cd apps/workers && pnpm dev
```

Or from root: `pnpm dev` (runs all packages in parallel)

---

## Automation Pipeline

```
Cron (daily 11pm)
    │
    ▼
contentQueue → Claude claude-sonnet-4-6 generates caption + hashtags + image prompt
    │
    ▼
imageQueue → Replicate SDXL generates 1080x1080 image → uploads to R2
    │
    ▼
validateQueue → Claude Haiku scores content on 8 dimensions (grammar, brand, engagement, etc.)
    │                          │
    │ score ≥ 72%              │ score < 72% (up to 3 retries)
    ▼                          ▼
auto_approve=true          Regenerate
    │
    ▼
publishQueue (delayed to scheduledAt)
    │
    ▼
Meta Graph API → Facebook Page post + Instagram media publish
    │
    ▼
analyticsQueue (daily 2am) → Fetch reach/impressions/engagement from Meta Insights
```

## User Roles

| Role | Access |
|------|--------|
| `ADMIN` | Full platform access |
| `AGENCY_OWNER` | All clients in their organization |
| `MEMBER` | All clients in their organization |
| `CLIENT_VIEWER` | Read-only portal for their brand only |

## Subscription Plans

| Plan | Price | Clients | Posts/mo |
|------|-------|---------|----------|
| Starter | $49/mo | 3 | 150 |
| Growth | $149/mo | 10 | 500 |
| Agency | $299/mo | Unlimited | 2,000 |

## Deployment

### Web (Vercel)

```bash
vercel --prod
```

Set all environment variables in Vercel dashboard. Add `DATABASE_URL` and `DIRECT_DATABASE_URL` for Prisma + Neon.

### Workers (Railway)

1. Connect GitHub repo to Railway
2. Set root directory to `apps/workers`
3. Add all environment variables
4. Deploy — Railway auto-restarts on crash

### Database Migrations (Production)

```bash
pnpm db:migrate
```

---

## Key Files

| File | Purpose |
|------|---------|
| `packages/db/prisma/schema.prisma` | Full database schema |
| `packages/trpc/src/root.ts` | All API routes |
| `apps/workers/src/index.ts` | Worker bootstrap |
| `apps/workers/src/services/ai/contentGenerator.ts` | Claude content generation |
| `apps/workers/src/services/ai/imageGenerator.ts` | Replicate/DALL-E image gen |
| `apps/workers/src/services/ai/qualityValidator.ts` | AI-powered QA scoring |
| `apps/workers/src/services/meta/publisher.ts` | Facebook + Instagram publishing |
| `apps/workers/src/schedulers/postScheduler.ts` | Cron jobs |
| `apps/web/app/api/meta/callback/route.ts` | Meta OAuth handler |
| `apps/web/app/api/webhooks/stripe/route.ts` | Stripe billing webhooks |
