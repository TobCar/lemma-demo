You will generate a migration file then execute the changes. Do not delete migration files. Migration files are like Git commits we keep forever.

```
supabase db diff -f commit_message_no_spaces
supabase migration up
```
