-- User profile, auto-created by an auth trigger when a new user signs up.
-- The id column IS the auth.users id (not a separate generated UUID).

create table "public"."profiles" (
  "id"         uuid        not null references "auth"."users" ("id") on delete cascade,
  "created_at" timestamptz not null default now(),

  constraint "profiles_pkey" primary key ("id")
);

-- Users can read their own profile.
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
