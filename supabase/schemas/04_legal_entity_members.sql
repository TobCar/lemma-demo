-- 03_legal_entity_members.sql
-- Junction table linking profiles to legal entities with a per-entity role.
-- One user can belong to multiple legal entities; one legal entity can have multiple users.

create table "public"."legal_entity_members" (
  "id"              uuid        not null default gen_random_uuid(),
  "created_at"      timestamptz not null default now(),
  "legal_entity_id" uuid        not null references "public"."legal_entities" ("id") on delete restrict,
  "user_id"         uuid        not null references "auth"."users" ("id") on delete restrict,
  "role"            text        not null,

  constraint "legal_entity_members_pkey" primary key ("id"),
  constraint "legal_entity_members_entity_user_unique" unique ("legal_entity_id", "user_id"),
  constraint "legal_entity_members_role_check" check ("role" in ('owner'))
);

create index "legal_entity_members_user_id_idx"
  on "public"."legal_entity_members" ("user_id");

create index "legal_entity_members_legal_entity_id_idx"
  on "public"."legal_entity_members" ("legal_entity_id");
