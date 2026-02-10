## Running the frontend locally

`npm run dev`

## Running Supabase locally

Create an empty `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Run `npx supabase start`. You will see a section called "Authentication Keys". Copy the publishable key into `.env.local` as the value for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
