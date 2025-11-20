-- Enable necessary extensions
create extension if not exists "vector" with schema extensions;

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- DOCUMENTS
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  file_url text,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;

create policy "Users can view their own documents."
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents."
  on documents for insert
  with check ( auth.uid() = user_id );

-- SCREENSHOTS
create table public.screenshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  ocr_text text,
  app_name text,
  window_title text,
  taken_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.screenshots enable row level security;

create policy "Users can view their own screenshots."
  on screenshots for select
  using ( auth.uid() = user_id );

-- MEETINGS
create table public.meetings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  transcript text,
  summary text,
  recording_url text,
  started_at timestamp with time zone not null,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meetings enable row level security;

create policy "Users can view their own meetings."
  on meetings for select
  using ( auth.uid() = user_id );

-- TIMELINE EVENTS
create table public.timeline_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  source_type text not null, -- 'screenshot', 'meeting', 'document', 'web'
  source_id uuid,
  description text,
  timestamp timestamp with time zone not null,
  metadata jsonb
);

alter table public.timeline_events enable row level security;

create policy "Users can view their own timeline events."
  on timeline_events for select
  using ( auth.uid() = user_id );

-- KNOWLEDGE GRAPH
create table public.nodes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  label text not null,
  type text not null,
  properties jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.edges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  source_id uuid references public.nodes(id) on delete cascade,
  target_id uuid references public.nodes(id) on delete cascade,
  relationship text not null,
  properties jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.nodes enable row level security;
alter table public.edges enable row level security;

create policy "Users can view their own nodes."
  on nodes for select
  using ( auth.uid() = user_id );

create policy "Users can view their own edges."
  on edges for select
  using ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
