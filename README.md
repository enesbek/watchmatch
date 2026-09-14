# WatchMatch — MVP (Phase 1)

**WatchMatch** is a swipe-based movie and TV show matching platform designed to solve the classic:

> **“What should we watch tonight?”**

Create a room, invite your partner or friends, swipe through movies and TV shows together, and get notified when you both like the same title.

This release covers the complete **Phase 1 (MVP)** scope defined in the product requirements, including:

* Guest mode with no account required
* Room creation and sharing
* TMDB-powered movie and TV show discovery
* Minimum rating filters
* Popular and hidden-gem discovery modes
* Real-time swipe synchronization
* Automatic match detection
* Match screen with movie details
* Streaming availability links via JustWatch/TMDB
* Trailer previews

---

## Features

### 🎬 Swipe-Based Matching

Browse movies and TV shows one card at a time and swipe:

* **Right** → Like
* **Left** → Pass

When both participants like the same title, WatchMatch automatically creates a match.

### 👥 Guest Rooms

No registration is required for the MVP.

One person creates a room and shares the generated room link or QR code with another participant. Both users can then start swiping immediately.

### ⚡ Real-Time Synchronization

Swipes are synchronized between participants in real time using **Supabase Realtime**.

This allows both users to stay in sync without refreshing the page.

### 🔎 TMDB Discovery & Filters

WatchMatch uses **The Movie Database (TMDB)** to provide movie and TV show data.

Users can configure discovery preferences such as:

* Minimum rating
* Popular titles
* Hidden gems
* Movies or TV shows

### 💕 Match Detection

When both participants swipe right on the same title, the title is automatically marked as a match and displayed in a dedicated match modal.

### ▶️ Trailer Preview

Users can watch available YouTube trailers directly from the swipe interface without leaving the application.

### 📺 Where to Watch

Matched titles include a link to streaming availability through **JustWatch/TMDB**, allowing users to quickly find where the title can be watched.

---

# Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **TMDB API**
* **Supabase**

  * PostgreSQL
  * Realtime
  * Row Level Security (RLS)
* **Vercel**

---

# Requirements

Before running the project locally, make sure you have:

* **Node.js 18+**
* A free **TMDB API key**
* A free **Supabase project**

### TMDB

Create an API key from your TMDB account:

[TMDB API Settings](https://www.themoviedb.org/settings/api?utm_source=chatgpt.com)

### Supabase

Create a free project:

[Supabase](https://supabase.com?utm_source=chatgpt.com)

---

# Getting Started

## 1. Install Dependencies

Clone the repository and install the required dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and configure the required environment variables:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 2. Set Up the Database

Open your **Supabase Dashboard** and navigate to:

**SQL Editor → New Query**

Copy the complete contents of:

```text
supabase/schema.sql
```

and execute the script.

This will create:

* `rooms`
* `swipes`
* `matches`
* Required RLS policies
* Supabase Realtime publication configuration

### Security Note

The current schema uses simplified access policies to support anonymous/guest rooms in the MVP.

These policies are intentionally permissive for development and testing. Before using WatchMatch with a real user base or sensitive data, the RLS policies should be reviewed and tightened accordingly.

---

# 3. Run the Application

Start the Next.js development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Create a room and share the generated room link or QR code with a second device.

For local testing, you can also open the room in a separate browser or an incognito/private window.

---

# Deployment

WatchMatch can be deployed to **Vercel**.

Install the Vercel CLI if you don't already have it:

```bash
npm install -g vercel
```

Deploy the project:

```bash
vercel
```

Alternatively, you can connect the repository directly through the Vercel dashboard.

Make sure the following environment variables are configured in your Vercel project:

```env
NEXT_PUBLIC_TMDB_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

# Project Structure

```text
app/
├── page.tsx
│   └── Lobby / room creation and joining screen
│
└── room/
    └── [code]/
        └── page.tsx
            └── Swipe interface and matching flow

components/
├── RoomSetup.tsx
│   └── Room creation/joining and discovery filters
│
├── SwipeCard.tsx
│   └── Swipeable movie/TV show card
│
├── TrailerModal.tsx
│   └── YouTube trailer modal
│
└── MatchModal.tsx
    └── Match screen, confetti, and streaming link

lib/
├── tmdb.ts
│   └── TMDB integration and discovery/filtering logic
│
├── supabase.ts
│   └── Supabase client configuration
│
└── room.ts
    └── Room management, swipe recording, and match detection

supabase/
└── schema.sql
    └── Database schema, RLS policies, and Realtime configuration
```

---

# How It Works

The MVP follows a simple flow:

```text
Create Room
     ↓
Share Room Link / QR Code
     ↓
Second Participant Joins
     ↓
Configure Discovery Preferences
     ↓
Swipe Through Titles
     ↓
Swipes Synchronized in Real Time
     ↓
Both Users Like the Same Title
     ↓
Match Created
     ↓
Match Screen
     ↓
Find Where to Watch
```

---

# Roadmap

The current release focuses on the core Phase 1 experience.

## Phase 2

Planned improvements include:

* Google authentication
* Personal watchlists
* Personalized recommendation algorithms
* Persistent user preferences
* Couple account linking
* User-based recommendation history

The existing `user_preferences` structure and the `lib/tmdb.ts` / `lib/room.ts` architecture are designed to be extended as these features are introduced.

## Phase 3

Future monetization and social features may include:

* Advertising
* Affiliate integrations
* Group matching mode
* Additional discovery and recommendation features

---

# MVP Scope

| Feature                      | Phase 1 |
| ---------------------------- | :-----: |
| Guest rooms                  |    ✅    |
| Room sharing                 |    ✅    |
| QR code sharing              |    ✅    |
| Movie discovery              |    ✅    |
| TV show discovery            |    ✅    |
| TMDB integration             |    ✅    |
| Rating filters               |    ✅    |
| Popular mode                 |    ✅    |
| Hidden gems mode             |    ✅    |
| Swipe interface              |    ✅    |
| Real-time synchronization    |    ✅    |
| Automatic matching           |    ✅    |
| Trailer previews             |    ✅    |
| Where-to-watch links         |    ✅    |
| User accounts                | Planned |
| Watchlists                   | Planned |
| Personalized recommendations | Planned |
| Group mode                   | Planned |
| Monetization                 | Planned |

---

# License

This project is currently intended for development and demonstration purposes.
