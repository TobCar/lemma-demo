-- Top-level corporation/entity. Maps to the Increase API Entity.
-- PII (address, tax ID, email) is NOT stored here — it lives in the Increase Entity.
-- Use increase_entity_id to fetch PII via the Increase API.

create table "public"."legal_entities" (
  "id"                       uuid        not null default gen_random_uuid(),
  "created_at"               timestamptz not null default now(),
  "updated_at"               timestamptz not null default now(),
  "name"                     text        not null,
  "website"                  text,
  "business_phone"           text,
  "structure"                text        not null,
  "npi"                      text        not null,
  "locations"                text[]      not null default '{}',
  "naics_code"               text,
  "owner_user_id"            uuid        not null references "auth"."users" ("id") on delete restrict,
  "increase_entity_id"       text,

  constraint "legal_entities_pkey" primary key ("id"),
  constraint "legal_entities_structure_check" check (
    "structure" in (
      'fqhc', 'govt', 'professional_corporation', 'professional_llc', 'llc', 'partnership',
      'sole_prop', 'mso', 'nonprofit'
    )
  )
);

-- Indexes for common lookups and Increase API correlation
create index "legal_entities_increase_entity_id_idx"
  on "public"."legal_entities" ("increase_entity_id");

-- Auto-update updated_at on every row modification
create trigger handle_updated_at
  before update on "public"."legal_entities"
  for each row execute procedure moddatetime(updated_at);

-- Owners can read their own legal entities.
create policy "Owners can read their legal entities"
  on public.legal_entities for select
  using (auth.uid() = owner_user_id);

-- Authenticated users can create a legal entity if they are the owner.
create policy "Authenticated users can create legal entities"
  on public.legal_entities for insert
  with check (auth.uid() = owner_user_id);
