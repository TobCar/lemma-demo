alter table "public"."entity_members" add column "updated_at" timestamp with time zone not null default now();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.entity_members FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');


