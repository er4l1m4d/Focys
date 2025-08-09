# Supabase Setup Guide for Focys

This guide will help you set up Supabase for the Focys application to enable cross-browser profile syncing.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up/log in
2. Click "New Project"
3. Enter your project details:
   - Name: `focys`
   - Database Password: (generate a secure password)
   - Region: Choose one closest to your users
4. Click "Create new project"

## 2. Set Up Database Tables

Run this SQL in the Supabase SQL Editor to create the required tables:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  wallet_address text not null unique,
  username text not null,
  level integer not null default 1,
  xp integer not null default 0,
  total_focus_time integer not null default 0,
  total_sessions integer not null default 0,
  streak integer not null default 0,
  last_session_date text,
  unlocked_crystals text[] not null default '{base_crystal}',
  active_crystal text default 'base_crystal',
  achievements jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies for secure access
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Create a function for updating the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger to update the updated_at column
create or replace trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
```

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
1. Go to Project Settings > API
2. Copy the `URL` and `anon` public key

## 4. Install Required Dependencies

Run this command to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## 5. Enable Realtime Updates (Optional)

If you want real-time updates across devices:

1. Go to the Supabase Dashboard
2. Select your project
3. Go to Database > Replication
4. Enable replication for the `profiles` table

## 6. Test the Integration

1. Start your development server
2. Log in with a wallet
3. Check the browser console for any errors
4. Verify that profile data is being saved to Supabase

## Troubleshooting

- If you get CORS errors, make sure to add your local development URL to the allowed origins in Supabase:
  1. Go to Authentication > URL Configuration
  2. Add your local development URL (e.g., `http://localhost:3000`)

- If you have issues with the database connection, verify your Supabase URL and anon key in the environment variables.

## Next Steps

1. Consider setting up database backups in Supabase
2. Monitor your database usage in the Supabase dashboard
3. Set up proper error handling and user feedback in the UI
