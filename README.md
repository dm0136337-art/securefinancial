# Secure Financial

A modern full-stack financial account management demo built with Next.js, TypeScript, Tailwind CSS, and Supabase-ready tooling.

## Features

- Public marketing pages: home, about, contact
- Secure login and registration flows
- User dashboard with balance summaries and transaction status
- Admin dashboard with account search, status toggles, and balance adjustments
- Contact form submission endpoint with Supabase integration support
- Responsive dashboard layout tailored to desktop, tablet, and mobile screens

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client library
- Lucide React icons

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Populate `.env.local` with your own Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by server-side administrator operations and must never use a `NEXT_PUBLIC_` prefix or be exposed to browser code.

## Profile photo storage setup

Run [`supabase/admin-customer-actions.sql`](./supabase/admin-customer-actions.sql) first, then run [`supabase/profile-photos.sql`](./supabase/profile-photos.sql) in the Supabase SQL Editor. The first migration expects the existing Secure Financial base tables, `public.is_active_admin()` policies/helpers and `public.protect_profile_fields()` trigger-compatible schema; review and back up the correct Supabase project before applying it. The second script configures the private `profile-photos` bucket, owner-scoped Storage policies, and the `set_own_profile_photo` RPC. Both profile-photo SQL copies must be kept synchronized.

The browser uploads images under a folder named for the authenticated user's ID and stores that object path in `profiles.photo_url`. User and admin dashboards create signed photo URLs that expire after five minutes. Reload the page to obtain a fresh URL. A URL issued before suspension or archival remains usable until its expiration; Storage RLS cannot revoke an already-issued signed URL.
