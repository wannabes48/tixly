# Tixly: World Cup 2026 Ticket Platform Implementation Plan

This document outlines the implementation plan for Tixly, a secondary-market ticket marketplace focused exclusively on the FIFA World Cup 2026. The platform will be built using a Turborepo monorepo, Next.js 14 App Router, Prisma (with PostgreSQL/Supabase), Tailwind CSS, shadcn/ui, and Stripe for payments.

## User Review Required

> [!IMPORTANT]
> **Database ORM & Hosting Confirmation**
> You mentioned both Supabase and Prisma. The plan is to use **Supabase as the managed PostgreSQL database** and **Prisma as the ORM** within the Next.js app/API. Please confirm this hybrid approach.

> [!WARNING]
> **API Architecture**
> You requested scaffolding a Turborepo with `apps/web` (Next.js) and `apps/api` (Express or Next.js API routes). Given that Next.js App Router supports powerful API routes (`Route Handlers`) and Server Actions, building a separate Express API might add unnecessary complexity unless we expect heavy background processing or separate mobile apps soon. 
> *Recommendation:* Keep the API within the Next.js `apps/web` via Server Actions and Next.js Route Handlers initially to speed up development and simplify the deployment of the guest checkout flow. If a separate API is strictly preferred, we will scaffold a standalone Express app in `apps/api`.

> [!IMPORTANT]
> **Internationalization (i18n)**
> Implementing `next-intl` with `/[locale]/` routes will change the entire routing structure from the beginning (e.g., `/en/matches` instead of `/matches`). We need to set this up as the very first step in the Next.js app to avoid massive refactoring later.

## Open Questions

1. **Stripe Setup:** Do you have a Stripe account ready for testing? We will need test API keys for Checkout and Connect.
2. **NextAuth v5 (Auth.js):** Since authentication is optional for buyers, we will defer NextAuth setup until we build the seller/admin features, prioritizing the guest checkout flow as requested. Is this acceptable?
3. **Monorepo Setup:** Do you want to use `pnpm` (highly recommended for Turborepo) or standard `npm`/`yarn`?

## Proposed Architecture

We will structure the project as a Turborepo monorepo to separate concerns and allow future scalability.

### Monorepo Structure

```text
tixly/
├── apps/
│   ├── web/                # Next.js 14 App Router (Frontend + API Routes/Actions)
│   └── api/                # (Optional) Express.js API, if Next.js API routes are not preferred
├── packages/
│   ├── database/           # Prisma schema, migrations, and seed scripts
│   ├── ui/                 # Shared UI components (shadcn/ui, Tailwind)
│   ├── config/             # Shared ESLint, TypeScript, and Tailwind configs
│   └── utils/              # Shared utility functions (formatting, validation, etc.)
```

### Phase 1: Foundation & Scaffold

1. Initialize Turborepo with `pnpm`.
2. Set up `packages/database` with Prisma.
3. Create the Prisma schema encompassing: `User`, `Team`, `Stadium`, `Match`, `TicketListing`, `Order`.
4. Create the robust seed script (`seed.ts`) to populate the 104 matches, 48 teams, 16 stadiums, and host cities.
5. Scaffold `apps/web` (Next.js 14 App Router) with Tailwind CSS, shadcn/ui, and `next-intl` (routing setup).

### Phase 2: Core Pages (Read-Only)

1. **Homepage (`/`)**: Countdown, match carousel, team grid, city grid, how-it-works, buyer protection.
2. **Matches Listing (`/matches`)**: Filterable and searchable listing of all 104 matches (integrating Meilisearch later, or using Prisma text search initially).
3. **Match Detail (`/matches/[id]`)**: Detailed view of a match and a table/list of available ticket listings.

### Phase 3: Guest Checkout Flow

1. **Listing Selection**: Quantity selector and live price calculation (subtotal + 10% fee).
2. **Buyer Details Form**: Form collecting name, email, phone, and ticket-holder names without requiring authentication. Zod validation.
3. **Refund Protection Upsell**: Add-on card component.
4. **Stripe Integration**: Stripe Checkout or Payment Element integration.
5. **Confirmation & Webhooks**: Stripe webhook handler to finalize the `Order` in the database, and SendGrid integration for email confirmation.

### Prisma Schema (Draft)

```prisma
// packages/database/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Match {
  id          String   @id @default(cuid())
  slug        String   @unique
  matchNumber Int
  round       String
  group       String?
  homeTeamId  String
  awayTeamId  String
  stadiumId   String
  kickoffUtc  DateTime
  status      String   @default("SCHEDULED")
  
  homeTeam    Team     @relation("HomeTeam", fields: [homeTeamId], references: [id])
  awayTeam    Team     @relation("AwayTeam", fields: [awayTeamId], references: [id])
  stadium     Stadium  @relation(fields: [stadiumId], references: [id])
  listings    TicketListing[]
}

// ... Additional models (Team, Stadium, TicketListing, Order, User) to be defined fully in execution.
```

## Verification Plan

### Automated Verification
- Run `prisma db push` and execute the seed script to verify 104 matches, 48 teams, and 16 stadiums are populated correctly.
- Test Next.js build (`pnpm build`) to ensure there are no TypeScript or ESLint errors in the scaffolded app.
- Write a basic unit test for the price calculation logic (subtotal + 10% fee).

### Manual Verification
- Navigate through the Next.js app locally (`pnpm dev`) to ensure `next-intl` routing works (e.g., `/en`, `/es/matches`).
- Manually run through the Guest Checkout flow using Stripe test cards to ensure the webhook fires and the `Order` is marked as `PAID`.
