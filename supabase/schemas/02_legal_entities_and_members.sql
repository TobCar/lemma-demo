-- Top-level corporation/entity. Maps to the Increase API Entity.
-- PII (address, tax ID, email) is NOT stored here — it lives in the Increase Entity.
-- Use increase_entity_id to fetch PII via the Increase API.
--
-- Ownership is tracked in entity_members, not on this table.
-- Entities are created via the create_legal_entity_with_owner() function,
-- so there is no INSERT policy here — RLS blocks direct inserts.
-- RLS policies are defined in 04_rbac.sql.

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

-- ---------------------------------------------------------------------------
-- Tracks which users belong to which legal entities and their role.
-- This is the source of truth for entity ownership and membership.
-- RLS policies are defined in 04_rbac.sql.
-- ---------------------------------------------------------------------------

create type "public"."entity_member_role" as enum ('owner');

create table "public"."entity_members" (
  "id"               uuid                not null default gen_random_uuid(),
  "created_at"       timestamptz         not null default now(),
  "updated_at"       timestamptz         not null default now(),
  "legal_entity_id"  uuid                not null references "public"."legal_entities" ("id") on delete cascade,
  "user_id"          uuid                not null references "auth"."users" ("id") on delete cascade,
  "role"             entity_member_role  not null,

  constraint "entity_members_pkey" primary key ("id"),
  constraint "entity_members_unique_user_entity" unique ("legal_entity_id", "user_id")
);

-- Covering index: the custom_access_token_hook and most RLS policies look up
-- memberships by user_id and only need legal_entity_id + role. Including those
-- columns lets Postgres satisfy the query from the index alone (index-only scan).
create index "entity_members_user_id_idx"
  on "public"."entity_members" ("user_id")
  include ("legal_entity_id", "role");

-- Auto-update updated_at on every row modification
create trigger handle_updated_at
  before update on "public"."entity_members"
  for each row execute procedure moddatetime(updated_at);

-- ---------------------------------------------------------------------------
-- Security-definer function: atomically create an entity and its first owner.
--
-- This function is the ONLY way to create a legal entity. It bypasses RLS
-- (via SECURITY DEFINER) to solve the chicken-and-egg problem: you need a
-- membership to pass RLS, but you can't have a membership without an entity.
--
-- Guarantees:
--   - Only INSERTs data, never updates or deletes.
--   - Caller must be authenticated (GRANT restricted to 'authenticated' role).
--   - search_path locked to '' to prevent search-path injection.
-- ---------------------------------------------------------------------------

create or replace function create_legal_entity_with_owner(
  entity_name text,
  entity_structure text,
  entity_npi text,
  entity_website text default null,
  entity_business_phone text default null,
  entity_naics_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_entity_id uuid;
begin
  insert into "public"."legal_entities" (
    "name", "structure", "npi", "website", "business_phone", "naics_code"
  ) values (
    entity_name, entity_structure, entity_npi, entity_website, entity_business_phone, entity_naics_code
  )
  returning "id" into new_entity_id;

  insert into "public"."entity_members" ("legal_entity_id", "user_id", "role")
  values (new_entity_id, auth.uid(), 'owner');

  return new_entity_id;
end;
$$;

revoke all on function create_legal_entity_with_owner from public;
grant execute on function create_legal_entity_with_owner to authenticated;
