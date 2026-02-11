alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."term_acceptances" drop constraint "term_acceptances_legal_entity_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."term_acceptances" add constraint "term_acceptances_legal_entity_id_fkey" FOREIGN KEY (legal_entity_id) REFERENCES public.legal_entities(id) ON DELETE RESTRICT not valid;

alter table "public"."term_acceptances" validate constraint "term_acceptances_legal_entity_id_fkey";


