-- 05_terms_acceptances.sql
-- Records when a user accepts terms of service on behalf of a legal entity.

create table "public"."terms_acceptances" (
  "id"               uuid        not null default gen_random_uuid(),
  "created_at"       timestamptz not null default now(),
  "legal_entity_id"  uuid        not null references "public"."legal_entities" ("id") on delete cascade,
  "user_id"         uuid        not null references "auth"."users" ("id") on delete restrict,
  "ip_address"      inet,

  constraint "terms_acceptances_pkey" primary key ("id")
);

-- Auto-populate user_id with the authenticated user's UUID on insert.
-- See 01_functions.sql for why insert_username is not used here.
create trigger handle_user_id
  before insert on "public"."terms_acceptances"
  for each row execute function set_auth_user_id();
