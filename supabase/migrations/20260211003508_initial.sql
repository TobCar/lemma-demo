create extension if not exists "moddatetime" with schema "extensions";


  create table "public"."legal_entities" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "website" text,
    "business_phone" text,
    "structure" text not null,
    "npi" text not null,
    "locations" text[] not null default '{}'::text[],
    "naics_code" text,
    "increase_entity_id" text
      );


alter table "public"."legal_entities" enable row level security;


  create table "public"."legal_entity_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "legal_entity_id" uuid not null,
    "user_id" uuid not null,
    "role" text not null
      );


alter table "public"."legal_entity_members" enable row level security;


  create table "public"."profiles" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."term_acceptances" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "legal_entity_id" uuid not null,
    "user_id" uuid not null,
    "ip_address" inet
      );


alter table "public"."term_acceptances" enable row level security;

CREATE INDEX legal_entities_increase_entity_id_idx ON public.legal_entities USING btree (increase_entity_id);

CREATE UNIQUE INDEX legal_entities_pkey ON public.legal_entities USING btree (id);

CREATE UNIQUE INDEX legal_entity_members_entity_user_unique ON public.legal_entity_members USING btree (legal_entity_id, user_id);

CREATE INDEX legal_entity_members_legal_entity_id_idx ON public.legal_entity_members USING btree (legal_entity_id);

CREATE UNIQUE INDEX legal_entity_members_pkey ON public.legal_entity_members USING btree (id);

CREATE INDEX legal_entity_members_user_id_idx ON public.legal_entity_members USING btree (user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX term_acceptances_pkey ON public.term_acceptances USING btree (id);

alter table "public"."legal_entities" add constraint "legal_entities_pkey" PRIMARY KEY using index "legal_entities_pkey";

alter table "public"."legal_entity_members" add constraint "legal_entity_members_pkey" PRIMARY KEY using index "legal_entity_members_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."term_acceptances" add constraint "term_acceptances_pkey" PRIMARY KEY using index "term_acceptances_pkey";

alter table "public"."legal_entities" add constraint "legal_entities_structure_check" CHECK ((structure = ANY (ARRAY['fqhc'::text, 'govt'::text, 'professional_corporation'::text, 'professional_llc'::text, 'llc'::text, 'partnership'::text, 'sole_prop'::text, 'mso'::text, 'nonprofit'::text]))) not valid;

alter table "public"."legal_entities" validate constraint "legal_entities_structure_check";

alter table "public"."legal_entity_members" add constraint "legal_entity_members_entity_user_unique" UNIQUE using index "legal_entity_members_entity_user_unique";

alter table "public"."legal_entity_members" add constraint "legal_entity_members_legal_entity_id_fkey" FOREIGN KEY (legal_entity_id) REFERENCES public.legal_entities(id) ON DELETE RESTRICT not valid;

alter table "public"."legal_entity_members" validate constraint "legal_entity_members_legal_entity_id_fkey";

alter table "public"."legal_entity_members" add constraint "legal_entity_members_role_check" CHECK ((role = 'owner'::text)) not valid;

alter table "public"."legal_entity_members" validate constraint "legal_entity_members_role_check";

alter table "public"."legal_entity_members" add constraint "legal_entity_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."legal_entity_members" validate constraint "legal_entity_members_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."term_acceptances" add constraint "term_acceptances_legal_entity_id_fkey" FOREIGN KEY (legal_entity_id) REFERENCES public.legal_entities(id) ON DELETE CASCADE not valid;

alter table "public"."term_acceptances" validate constraint "term_acceptances_legal_entity_id_fkey";

alter table "public"."term_acceptances" add constraint "term_acceptances_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."term_acceptances" validate constraint "term_acceptances_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into "public"."profiles" ("user_id")
  values (new.id);
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_auth_user_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.user_id := auth.uid();
  return new;
end;
$function$
;

grant delete on table "public"."legal_entities" to "anon";

grant insert on table "public"."legal_entities" to "anon";

grant references on table "public"."legal_entities" to "anon";

grant select on table "public"."legal_entities" to "anon";

grant trigger on table "public"."legal_entities" to "anon";

grant truncate on table "public"."legal_entities" to "anon";

grant update on table "public"."legal_entities" to "anon";

grant delete on table "public"."legal_entities" to "authenticated";

grant insert on table "public"."legal_entities" to "authenticated";

grant references on table "public"."legal_entities" to "authenticated";

grant select on table "public"."legal_entities" to "authenticated";

grant trigger on table "public"."legal_entities" to "authenticated";

grant truncate on table "public"."legal_entities" to "authenticated";

grant update on table "public"."legal_entities" to "authenticated";

grant delete on table "public"."legal_entities" to "service_role";

grant insert on table "public"."legal_entities" to "service_role";

grant references on table "public"."legal_entities" to "service_role";

grant select on table "public"."legal_entities" to "service_role";

grant trigger on table "public"."legal_entities" to "service_role";

grant truncate on table "public"."legal_entities" to "service_role";

grant update on table "public"."legal_entities" to "service_role";

grant delete on table "public"."legal_entity_members" to "anon";

grant insert on table "public"."legal_entity_members" to "anon";

grant references on table "public"."legal_entity_members" to "anon";

grant select on table "public"."legal_entity_members" to "anon";

grant trigger on table "public"."legal_entity_members" to "anon";

grant truncate on table "public"."legal_entity_members" to "anon";

grant update on table "public"."legal_entity_members" to "anon";

grant delete on table "public"."legal_entity_members" to "authenticated";

grant insert on table "public"."legal_entity_members" to "authenticated";

grant references on table "public"."legal_entity_members" to "authenticated";

grant select on table "public"."legal_entity_members" to "authenticated";

grant trigger on table "public"."legal_entity_members" to "authenticated";

grant truncate on table "public"."legal_entity_members" to "authenticated";

grant update on table "public"."legal_entity_members" to "authenticated";

grant delete on table "public"."legal_entity_members" to "service_role";

grant insert on table "public"."legal_entity_members" to "service_role";

grant references on table "public"."legal_entity_members" to "service_role";

grant select on table "public"."legal_entity_members" to "service_role";

grant trigger on table "public"."legal_entity_members" to "service_role";

grant truncate on table "public"."legal_entity_members" to "service_role";

grant update on table "public"."legal_entity_members" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."term_acceptances" to "anon";

grant insert on table "public"."term_acceptances" to "anon";

grant references on table "public"."term_acceptances" to "anon";

grant select on table "public"."term_acceptances" to "anon";

grant trigger on table "public"."term_acceptances" to "anon";

grant truncate on table "public"."term_acceptances" to "anon";

grant update on table "public"."term_acceptances" to "anon";

grant delete on table "public"."term_acceptances" to "authenticated";

grant insert on table "public"."term_acceptances" to "authenticated";

grant references on table "public"."term_acceptances" to "authenticated";

grant select on table "public"."term_acceptances" to "authenticated";

grant trigger on table "public"."term_acceptances" to "authenticated";

grant truncate on table "public"."term_acceptances" to "authenticated";

grant update on table "public"."term_acceptances" to "authenticated";

grant delete on table "public"."term_acceptances" to "service_role";

grant insert on table "public"."term_acceptances" to "service_role";

grant references on table "public"."term_acceptances" to "service_role";

grant select on table "public"."term_acceptances" to "service_role";

grant trigger on table "public"."term_acceptances" to "service_role";

grant truncate on table "public"."term_acceptances" to "service_role";

grant update on table "public"."term_acceptances" to "service_role";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.legal_entities FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_user_id BEFORE INSERT ON public.term_acceptances FOR EACH ROW EXECUTE FUNCTION public.set_auth_user_id();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


