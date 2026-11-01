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
```

The app will work in demo mode without Supabase credentials, while still exposing the required contact submission route and dashboard UI.
