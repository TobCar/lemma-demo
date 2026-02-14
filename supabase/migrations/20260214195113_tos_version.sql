alter table "public"."term_acceptances" add column "tos_version" text not null;

alter table "public"."term_acceptances" alter column "ip_address" set not null;

alter table "public"."term_acceptances" alter column "legal_entity_id" drop not null;


