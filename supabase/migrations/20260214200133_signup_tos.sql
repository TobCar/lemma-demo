create policy "Authenticated users can insert signup term acceptances"
  on public.term_acceptances for insert
  with check (legal_entity_id is null and auth.uid() is not null);
