revoke delete on table "public"."legal_entity_members" from "anon";

revoke insert on table "public"."legal_entity_members" from "anon";

revoke references on table "public"."legal_entity_members" from "anon";

revoke select on table "public"."legal_entity_members" from "anon";

revoke trigger on table "public"."legal_entity_members" from "anon";

revoke truncate on table "public"."legal_entity_members" from "anon";

revoke update on table "public"."legal_entity_members" from "anon";

revoke delete on table "public"."legal_entity_members" from "authenticated";

revoke insert on table "public"."legal_entity_members" from "authenticated";

revoke references on table "public"."legal_entity_members" from "authenticated";

revoke select on table "public"."legal_entity_members" from "authenticated";

revoke trigger on table "public"."legal_entity_members" from "authenticated";

revoke truncate on table "public"."legal_entity_members" from "authenticated";

revoke update on table "public"."legal_entity_members" from "authenticated";

revoke delete on table "public"."legal_entity_members" from "service_role";

revoke insert on table "public"."legal_entity_members" from "service_role";

revoke references on table "public"."legal_entity_members" from "service_role";

revoke select on table "public"."legal_entity_members" from "service_role";

revoke trigger on table "public"."legal_entity_members" from "service_role";

revoke truncate on table "public"."legal_entity_members" from "service_role";

revoke update on table "public"."legal_entity_members" from "service_role";

alter table "public"."legal_entity_members" drop constraint "legal_entity_members_entity_user_unique";

alter table "public"."legal_entity_members" drop constraint "legal_entity_members_legal_entity_id_fkey";

alter table "public"."legal_entity_members" drop constraint "legal_entity_members_role_check";

alter table "public"."legal_entity_members" drop constraint "legal_entity_members_user_id_fkey";

alter table "public"."legal_entity_members" drop constraint "legal_entity_members_pkey";

drop index if exists "public"."legal_entity_members_entity_user_unique";

drop index if exists "public"."legal_entity_members_legal_entity_id_idx";

drop index if exists "public"."legal_entity_members_pkey";

drop index if exists "public"."legal_entity_members_user_id_idx";

drop table "public"."legal_entity_members";

alter table "public"."legal_entities" add column "owner_user_id" uuid not null;

alter table "public"."legal_entities" add constraint "legal_entities_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."legal_entities" validate constraint "legal_entities_owner_user_id_fkey";


  create policy "Authenticated users can create legal entities"
  on "public"."legal_entities"
  as permissive
  for insert
  to public
with check ((auth.uid() = owner_user_id));



  create policy "Owners can read their legal entities"
  on "public"."legal_entities"
  as permissive
  for select
  to public
using ((auth.uid() = owner_user_id));



  create policy "Users can read their own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Authenticated users can insert term acceptances for their own l"
  on "public"."term_acceptances"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.legal_entities
  WHERE ((legal_entities.id = term_acceptances.legal_entity_id) AND (legal_entities.owner_user_id = auth.uid())))));



  create policy "Owners can read term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.legal_entities
  WHERE ((legal_entities.id = term_acceptances.legal_entity_id) AND (legal_entities.owner_user_id = auth.uid())))));



