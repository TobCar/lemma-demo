-- Records when a user accepts terms of service on behalf of a legal entity.

create table "public"."term_acceptances" (
  "id"               uuid        not null default gen_random_uuid(),
  "created_at"       timestamptz not null default now(),
  "legal_entity_id"  uuid        not null references "public"."legal_entities" ("id") on delete restrict,
  "user_id"         uuid        not null references "auth"."users" ("id") on delete restrict,
  "ip_address"      inet,

  constraint "term_acceptances_pkey" primary key ("id")
);

-- Auto-populate user_id with the authenticated user's UUID on insert.
-- See 01_functions.sql for why insert_username is not used here.
create trigger handle_user_id
  before insert on "public"."term_acceptances"
  for each row execute function set_auth_user_id();

-- Members can read term acceptances for their entities.
-- 'member' check: any role in the entity's orgs claim satisfies this.
create policy "Members can read term acceptances for their entities"
  on public.term_acceptances for select
  using (public.authorize('member', legal_entity_id));

-- Owners can insert term acceptances for their entities.
-- 'owner' check: only users with the owner role can accept terms.
create policy "Owners can insert term acceptances for their entities"
  on public.term_acceptances for insert
  with check (public.authorize('owner', legal_entity_id));
