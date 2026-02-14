drop policy "Owners can insert term acceptances for their entities" on "public"."term_acceptances";


  create policy "Members can insert term acceptances for their entities"
  on "public"."term_acceptances"
  as permissive
  for insert
  to public
with check (public.authorize('member'::text, legal_entity_id));



