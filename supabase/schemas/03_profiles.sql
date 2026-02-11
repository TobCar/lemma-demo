-- 02_profiles.sql
-- User profile, auto-created by an auth trigger when a new user signs up.
-- The id column IS the auth.users id (not a separate generated UUID).

create table "public"."profiles" (
  "id"         uuid        not null references "auth"."users" ("id") on delete restrict,
  "created_at" timestamptz not null default now(),

  constraint "profiles_pkey" primary key ("id")
);
