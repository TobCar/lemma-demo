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

-- Owners can read term acceptances for entities they own.
create policy "Owners can read term acceptances for their entities"
  on public.term_acceptances for select
  using (
    exists (
      select 1 from public.legal_entities
      where legal_entities.id = term_acceptances.legal_entity_id
        and legal_entities.owner_user_id = auth.uid()
    )
  );

-- Authenticated users can insert term acceptances for their own legal entities.
create policy "Authenticated users can insert term acceptances for their own legal entities"
  on public.term_acceptances for insert
  with check (
    exists (
      select 1 from public.legal_entities
      where legal_entities.id = term_acceptances.legal_entity_id
        and legal_entities.owner_user_id = auth.uid()
    )
  );
