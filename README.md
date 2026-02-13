## Monorepo

Our project includes a Nextjs project and a Supabase schema definition.

## Running the frontend locally

From the root, run `npm run dev`. The package.json has a shortcut so it's actually running `npm run dev --workspace=@lemma/web` under the hood.

## Environment variables

You need to create an empty `.env.local` in `apps/web/.env.local` to run Supabase locally. The env variables have to live in the same directory as next.config.ts.

Add this to your new `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Running Supabase locally

1. Make sure Docker is open.
2. Run `npx supabase start`. The start command will have a section called "Authentication Keys". Copy the publishable key into `.env.local` as the value for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
