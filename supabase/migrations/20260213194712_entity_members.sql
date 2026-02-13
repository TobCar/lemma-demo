drop trigger if exists "on_auth_user_created" on "auth"."users";

create type "public"."entity_member_role" as enum ('owner');

drop policy "Authenticated users can create legal entities" on "public"."legal_entities";

drop policy "Owners can read their legal entities" on "public"."legal_entities";

drop policy "Users can read their own profile" on "public"."profiles";

drop policy "Users can update their own profile" on "public"."profiles";

drop policy "Authenticated users can insert term acceptances for their own l" on "public"."term_acceptances";

drop policy "Owners can read term acceptances for their entities" on "public"."term_acceptances";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

alter table "public"."legal_entities" drop constraint "legal_entities_owner_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

drop function if exists "public"."handle_new_user"();

alter table "public"."profiles" drop constraint "profiles_pkey";

drop index if exists "public"."profiles_pkey";

drop table "public"."profiles";


  create table "public"."entity_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "legal_entity_id" uuid not null,
    "user_id" uuid not null,
    "role" public.entity_member_role not null
      );


alter table "public"."entity_members" enable row level security;

alter table "public"."legal_entities" drop column "owner_user_id";

CREATE UNIQUE INDEX entity_members_pkey ON public.entity_members USING btree (id);

CREATE UNIQUE INDEX entity_members_unique_user_entity ON public.entity_members USING btree (legal_entity_id, user_id);

CREATE INDEX entity_members_user_id_idx ON public.entity_members USING btree (user_id);

alter table "public"."entity_members" add constraint "entity_members_pkey" PRIMARY KEY using index "entity_members_pkey";

alter table "public"."entity_members" add constraint "entity_members_legal_entity_id_fkey" FOREIGN KEY (legal_entity_id) REFERENCES public.legal_entities(id) ON DELETE CASCADE not valid;

alter table "public"."entity_members" validate constraint "entity_members_legal_entity_id_fkey";

alter table "public"."entity_members" add constraint "entity_members_unique_user_entity" UNIQUE using index "entity_members_unique_user_entity";

alter table "public"."entity_members" add constraint "entity_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."entity_members" validate constraint "entity_members_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_legal_entity_with_owner(entity_name text, entity_structure text, entity_npi text, entity_website text DEFAULT NULL::text, entity_business_phone text DEFAULT NULL::text, entity_naics_code text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare
  claims jsonb;
  orgs jsonb;
  member record;
begin
  claims := event->'claims';
  orgs := '{}'::jsonb;

  for member in
    select legal_entity_id, role
    from public.entity_members
    where user_id = (event->>'user_id')::uuid
  loop
    orgs := jsonb_set(
      orgs,
      array[member.legal_entity_id::text],
      jsonb_build_object('role', member.role)
    );
  end loop;

  claims := jsonb_set(claims, '{orgs}', orgs);
  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$function$
;

grant delete on table "public"."entity_members" to "anon";

grant insert on table "public"."entity_members" to "anon";

grant references on table "public"."entity_members" to "anon";

grant select on table "public"."entity_members" to "anon";

grant trigger on table "public"."entity_members" to "anon";

grant truncate on table "public"."entity_members" to "anon";

grant update on table "public"."entity_members" to "anon";

grant delete on table "public"."entity_members" to "authenticated";

grant insert on table "public"."entity_members" to "authenticated";

grant references on table "public"."entity_members" to "authenticated";

grant select on table "public"."entity_members" to "authenticated";

grant trigger on table "public"."entity_members" to "authenticated";

grant truncate on table "public"."entity_members" to "authenticated";

grant update on table "public"."entity_members" to "authenticated";

grant delete on table "public"."entity_members" to "service_role";

grant insert on table "public"."entity_members" to "service_role";

grant references on table "public"."entity_members" to "service_role";

grant select on table "public"."entity_members" to "service_role";

grant trigger on table "public"."entity_members" to "service_role";

grant truncate on table "public"."entity_members" to "service_role";

grant update on table "public"."entity_members" to "service_role";

grant delete on table "public"."entity_members" to "supabase_auth_admin";

grant insert on table "public"."entity_members" to "supabase_auth_admin";

grant references on table "public"."entity_members" to "supabase_auth_admin";

grant select on table "public"."entity_members" to "supabase_auth_admin";

grant trigger on table "public"."entity_members" to "supabase_auth_admin";

grant truncate on table "public"."entity_members" to "supabase_auth_admin";

grant update on table "public"."entity_members" to "supabase_auth_admin";


  create policy "Allow auth admin to read entity members"
  on "public"."entity_members"
  as permissive
  for select
  to supabase_auth_admin
using (true);



  create policy "Owners can delete entity members"
  on "public"."entity_members"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.entity_members em
  WHERE ((em.legal_entity_id = entity_members.legal_entity_id) AND (em.user_id = auth.uid()) AND (em.role = 'owner'::public.entity_member_role)))));



  create policy "Owners can insert entity members"
  on "public"."entity_members"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.entity_members em
  WHERE ((em.legal_entity_id = entity_members.legal_entity_id) AND (em.user_id = auth.uid()) AND (em.role = 'owner'::public.entity_member_role)))));



  create policy "Owners can update entity members"
  on "public"."entity_members"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.entity_members em
  WHERE ((em.legal_entity_id = entity_members.legal_entity_id) AND (em.user_id = auth.uid()) AND (em.role = 'owner'::public.entity_member_role)))));



  create policy "Users can read their own memberships"
  on "public"."entity_members"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Members can read their legal entities"
  on "public"."legal_entities"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.entity_members
  WHERE ((entity_members.legal_entity_id = legal_entities.id) AND (entity_members.user_id = auth.uid())))));



  create policy "Members can read term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.entity_members
  WHERE ((entity_members.legal_entity_id = term_acceptances.legal_entity_id) AND (entity_members.user_id = auth.uid())))));



  create policy "Owners can insert term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.entity_members
  WHERE ((entity_members.legal_entity_id = term_acceptances.legal_entity_id) AND (entity_members.user_id = auth.uid()) AND (entity_members.role = 'owner'::public.entity_member_role)))));



