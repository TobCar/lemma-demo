drop policy "Owners can delete entity members" on "public"."entity_members";

drop policy "Owners can insert entity members" on "public"."entity_members";

drop policy "Owners can update entity members" on "public"."entity_members";

drop policy "Members can read their legal entities" on "public"."legal_entities";

drop policy "Members can read term acceptances for their entities" on "public"."term_acceptances";

drop policy "Owners can insert term acceptances for their entities" on "public"."term_acceptances";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(required_role text, entity_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  user_role text;
begin
  -- Extract the user's role for this entity from the JWT orgs claim.
  -- Returns NULL if the user has no membership for this entity.
  user_role := ((auth.jwt() -> 'orgs') -> entity_id::text) ->> 'role';

  if user_role is null then
    return false;
  end if;

  -- 'owner' satisfies both 'owner' and 'member' checks.
  -- 'member' would only satisfy 'member' (when more roles are added).
  -- For now entity_member_role only has 'owner', but this is forward-compatible.
  if required_role = 'owner' then
    return user_role = 'owner';
  end if;

  -- Any valid role satisfies 'member' (i.e., the user belongs to the entity).
  return true;
end;
$function$
;


  create policy "Owners can delete entity members"
  on "public"."entity_members"
  as permissive
  for delete
  to public
using (public.authorize('owner'::text, legal_entity_id));



  create policy "Owners can insert entity members"
  on "public"."entity_members"
  as permissive
  for insert
  to public
with check (public.authorize('owner'::text, legal_entity_id));



  create policy "Owners can update entity members"
  on "public"."entity_members"
  as permissive
  for update
  to public
using (public.authorize('owner'::text, legal_entity_id));



  create policy "Members can read their legal entities"
  on "public"."legal_entities"
  as permissive
  for select
  to public
using (public.authorize('member'::text, id));



  create policy "Members can read term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for select
  to public
using (public.authorize('member'::text, legal_entity_id));



  create policy "Owners can insert term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for insert
  to public
with check (public.authorize('owner'::text, legal_entity_id));



