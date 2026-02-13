drop index if exists "public"."entity_members_user_id_idx";

CREATE INDEX entity_members_user_id_idx ON public.entity_members USING btree (user_id) INCLUDE (legal_entity_id, role);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare
  claims jsonb;
  orgs jsonb;
begin
  claims := event->'claims';

  select coalesce(
    jsonb_object_agg(
      legal_entity_id::text,
      jsonb_build_object('role', role)
    ),
    '{}'::jsonb
  ) into orgs
  from public.entity_members
  where user_id = (event->>'user_id')::uuid;

  claims := jsonb_set(claims, '{orgs}', orgs);
  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$function$
;


