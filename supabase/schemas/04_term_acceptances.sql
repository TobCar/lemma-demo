-- Records when a user accepts terms of service on behalf of a legal entity.

create table "public"."term_acceptances" (
  "id"               uuid        not null default gen_random_uuid(),
  "created_at"       timestamptz not null default now(),
  "user_id"         uuid        not null references "auth"."users" ("id") on delete restrict,
  "tos_version"     text        not null,
  "ip_address"      inet      not null,

  -- We set the legal entity if one exists
  -- At sign up, the legal entity will be empty and we'll create a new row when the owner registers an
  -- organization to represent the previous TOS acceptance appplies to that legal entity.
  "legal_entity_id"  uuid       references "public"."legal_entities" ("id") on delete restrict,

  constraint "term_acceptances_pkey" primary key ("id")
);

-- Auto-populate user_id with the authenticated user's UUID on insert.
-- See 01_functions.sql for why insert_username is not used here.
create trigger handle_user_id
  before insert on "public"."term_acceptances"
  for each row execute function set_auth_user_id();

-- Members can read term acceptances for their entities.
create policy "Members can read term acceptances for their entities"
  on public.term_acceptances for select
  using (public.authorize('member', legal_entity_id));

-- Members can insert term acceptances for their entities.
-- We likely want an owner to sign the terms but that validation will exist
-- in the API and frontend rather than as a DB security policy.
create policy "Members can insert term acceptances for their entities"
  on public.term_acceptances for insert
  with check (public.authorize('member', legal_entity_id));

-- Authenticated users can insert term acceptances at signup (before org creation).
create policy "Authenticated users can insert signup term acceptances"
  on public.term_acceptances for insert
  with check (legal_entity_id is null and auth.uid() is not null);
