-- Figura: Initial schema
-- profiles, sessions, figures, snapshots + RLS

-- Profiles (linked to Supabase Auth)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  client_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table sessions enable row level security;

create policy "Owners can do everything with own sessions"
  on sessions for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Figures (live board state)
create table figures (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  shape text not null check (shape in ('circle', 'square', 'triangle', 'diamond')),
  color text not null,
  label text default '',
  x real not null,
  y real not null,
  rotation real default 0,
  z_index int default 0,
  updated_at timestamptz default now()
);

alter table figures enable row level security;

create policy "Session owners can manage figures"
  on figures for all
  using (
    exists (
      select 1 from sessions
      where sessions.id = figures.session_id
        and sessions.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from sessions
      where sessions.id = figures.session_id
        and sessions.owner_id = auth.uid()
    )
  );

-- Snapshots
create table snapshots (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  note text,
  state jsonb not null,
  created_at timestamptz default now()
);

alter table snapshots enable row level security;

create policy "Session owners can manage snapshots"
  on snapshots for all
  using (
    exists (
      select 1 from sessions
      where sessions.id = snapshots.session_id
        and sessions.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from sessions
      where sessions.id = snapshots.session_id
        and sessions.owner_id = auth.uid()
    )
  );

-- Client access: anonymous users with a valid client_token can read/write figures
-- This is handled via an API route that validates the token and uses the service role.
-- For Realtime subscriptions, we add permissive policies for authenticated clients
-- who have been granted access through the join flow.

-- Enable Realtime on figures table for live sync
alter publication supabase_realtime add table figures;

-- Index for fast figure lookups by session
create index idx_figures_session_id on figures(session_id);
create index idx_snapshots_session_id on snapshots(session_id);
create index idx_sessions_owner_id on sessions(owner_id);
create index idx_sessions_client_token on sessions(client_token);
