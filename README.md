# WatchMatch

WatchMatch is a web app where two people join a shared room, swipe through movies and TV shows, and get a match when they both like the same title.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from the example and fill in your Supabase values:

   ```bash
   cp .env.local.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Run `supabase/schema.sql` in the Supabase SQL Editor to create the tables.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.
