-- 01_functions.sql
-- Helper functions and extensions used across the schema:
--   1. rls_auto_enable()        -- event trigger: auto-enable RLS on every new public table
--   2. moddatetime extension    -- auto-set updated_at on row update
--   3. set_auth_user_id()       -- trigger fn: auto-set user_id to auth.uid() on insert

-- =============================================================================
-- 1. Event trigger: automatically enable RLS on every new table in the public schema.
--    This is a safety net — no table can ever be created without RLS.
-- =============================================================================
create or replace function rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    if cmd.schema_name is not null
      and cmd.schema_name in ('public')
      and cmd.schema_name not in ('pg_catalog', 'information_schema')
      and cmd.schema_name not like 'pg_toast%'
      and cmd.schema_name not like 'pg_temp%'
    then
      begin
        execute format('alter table if exists %s enable row level security', cmd.object_identity);
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      end;
    else
      raise log 'rls_auto_enable: skip % (schema: %)', cmd.object_identity, cmd.schema_name;
    end if;
  end loop;
end;
$$;

drop event trigger if exists ensure_rls;
create event trigger ensure_rls
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function rls_auto_enable();

-- =============================================================================
-- 2. Enable moddatetime extension for automatic updated_at handling.
--    Usage: create trigger handle_updated_at before update on <table>
--           for each row execute procedure moddatetime(updated_at);
-- =============================================================================
create extension if not exists moddatetime schema extensions;

-- =============================================================================
-- 3. Trigger function: set user_id to the authenticated user's UUID on insert.
--
--    Why not use the insert_username extension?
--    insert_username (from PostgreSQL's spi contrib module) sets a text column
--    to current_user — the PostgreSQL role name. In Supabase, current_user
--    resolves to "authenticated" (the Postgres role), NOT the user's UUID.
--    Since user_id is a uuid referencing auth.users(id), insert_username would
--    either fail with a type error or store the wrong value.
--
--    This custom function uses auth.uid() which correctly returns the UUID of
--    the authenticated Supabase user from the JWT.
--
--    Usage: create trigger handle_user_id before insert on <table>
--           for each row execute function set_auth_user_id();
-- =============================================================================
create or replace function set_auth_user_id()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$;

-- =============================================================================
-- 4. Trigger function: create a public.profiles row when a new auth user signs up.
--
--    Runs as SECURITY DEFINER because the trigger fires in the auth schema
--    context and needs to write into the public schema.
--    search_path is locked to '' to prevent search-path injection.
--
--    Only the id is passed — role defaults to 'owner', created_at to now().
-- =============================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into "public"."profiles" ("id")
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
