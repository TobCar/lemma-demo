-- ---------------------------------------------------------------------------
-- RLS policies for entity_members
-- ---------------------------------------------------------------------------

-- Users can see their own memberships.
create policy "Users can read their own memberships"
  on public.entity_members for select
  using (auth.uid() = user_id);

-- Owners can add members to their entities.
-- NOTE: This policy self-references entity_members. It works because the SELECT
-- policy (user_id = auth.uid()) aligns with the ownership check here. If the
-- SELECT policy changes, re-verify this INSERT policy still behaves correctly.
create policy "Owners can insert entity members"
  on public.entity_members for insert
  with check (
    exists (
      select 1 from public.entity_members as em
      where em.legal_entity_id = entity_members.legal_entity_id
        and em.user_id = auth.uid()
        and em.role = 'owner'
    )
  );

-- Owners can update members in their entities (e.g. change roles).
create policy "Owners can update entity members"
  on public.entity_members for update
  using (
    exists (
      select 1 from public.entity_members as em
      where em.legal_entity_id = entity_members.legal_entity_id
        and em.user_id = auth.uid()
        and em.role = 'owner'
    )
  );

-- Owners can remove members from their entities.
create policy "Owners can delete entity members"
  on public.entity_members for delete
  using (
    exists (
      select 1 from public.entity_members as em
      where em.legal_entity_id = entity_members.legal_entity_id
        and em.user_id = auth.uid()
        and em.role = 'owner'
    )
  );

-- ---------------------------------------------------------------------------
-- RLS policies for legal_entities
-- ---------------------------------------------------------------------------

-- Members can read their own legal entities.
create policy "Members can read their legal entities"
  on public.legal_entities for select
  using (
    exists (
      select 1 from public.entity_members
      where entity_members.legal_entity_id = legal_entities.id
        and entity_members.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Auth hook: embed the user's organization memberships in the JWT.
--
-- Runs before every token is issued. Builds an `orgs` claim containing
-- each entity the user belongs to and their role:
--   { "orgs": { "<entity_id>": { "role": "owner" }, ... } }
--
-- When the user has no memberships, `orgs` is an empty object `{}`.
--
-- Enable via: Dashboard > Authentication > Hooks > Custom Access Token
-- Locally: supabase/config.toml [auth.hook.custom_access_token]
-- ---------------------------------------------------------------------------

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
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
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

grant all on table public.entity_members to supabase_auth_admin;

create policy "Allow auth admin to read entity members"
  on public.entity_members
  as permissive for select
  to supabase_auth_admin
  using (true);
