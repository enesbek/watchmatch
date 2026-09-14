-- WatchMatch Supabase Şeması (Faz 1 + Faz 2 temelleri)
-- Bu dosyayı Supabase Dashboard > SQL Editor içine yapıştırıp çalıştırın.

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_id text not null,
  guest_id text,
  media_type text not null default 'movie' check (media_type in ('movie', 'tv')),
  discovery_mode text not null default 'popular' check (discovery_mode in ('popular', 'hidden_gems', 'mixed')),
  min_score numeric not null default 6.0,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists swipes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id text not null,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user1_id text not null,
  user2_id text not null,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  watched_status boolean not null default false,
  created_at timestamptz not null default now()
);

-- Faz 2: Üyelik & kişiselleştirme için (Google login ile birlikte kullanılır)
create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_genres integer[] default '{}',
  min_imdb_score numeric default 6.0,
  discovery_mode text default 'popular'
);

alter table rooms enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table user_preferences enable row level security;

-- Misafir modu (anonim) için basit erişim politikaları.
-- Not: Prodüksiyonda daha sıkı kurallar önerilir (ör. sadece oda üyeleri erişsin).
create policy "public read rooms" on rooms for select using (true);
create policy "public insert rooms" on rooms for insert with check (true);
create policy "public update rooms" on rooms for update using (true);

create policy "public read swipes" on swipes for select using (true);
create policy "public insert swipes" on swipes for insert with check (true);

create policy "public read matches" on matches for select using (true);
create policy "public insert matches" on matches for insert with check (true);

create policy "users manage own preferences" on user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Realtime yayınına tabloları ekle
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table swipes;
alter publication supabase_realtime add table matches;
