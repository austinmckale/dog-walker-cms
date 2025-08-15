# Goal
Fix Next.js build error:
"useSearchParams() should be wrapped in a suspense boundary at page '/auth/callback'"
and the subsequent prerender/export failure for /auth/callback.

# What to change
1) Refactor the App Router page at app/auth/callback/page.(ts|tsx):
   - Do not call `useSearchParams` directly in this file.
   - Mark this route as dynamic so it isn't statically prerendered.
   - Wrap the client part in <Suspense>.

   === New file: app/auth/callback/CallbackClient.tsx ===
   'use client';
   import { useSearchParams, useRouter } from 'next/navigation';
   import { useEffect } from 'react';

   export default function CallbackClient() {
     const params = useSearchParams();
     const router = useRouter();

     // Read typical OAuth params
     const code = params.get('code');
     const error = params.get('error');
     const state = params.get('state');

     // Example side-effect: forward to our API route or Supabase handler
     useEffect(() => {
       // TODO: replace with real handler if needed
       // If you already have a callback handler, call it here.
       // After handling, redirect the user where appropriate.
       // router.replace('/dashboard');
     }, [code, error, state, router]);

     return <p>Signing you in…</p>;
   }

   === Replace contents of: app/auth/callback/page.tsx ===
   import { Suspense } from 'react';
   import CallbackClient from './CallbackClient';

   // Do not prerender; OAuth callbacks are dynamic by nature
   export const dynamic = 'force-dynamic';   // prevents static generation
   export const revalidate = 0;              // ensure no caching during build

   export default function Page() {
     return (
       <Suspense fallback={<p>Loading…</p>}>
         <CallbackClient />
       </Suspense>
     );
   }

2) Ensure any other routes that use `useSearchParams` in App Router are wrapped similarly:
   - If a *page* needs `useSearchParams`, create a sibling Client Component (*.Client.tsx),
     use the hook there, and wrap it with <Suspense> in the page.
   - Or keep the hook in a Client Component inside the page.

3) Prevent static export from breaking dynamic routes:
   - Open next.config.js.
   - If `output: 'export'` is set, REMOVE it so Vercel can run a dynamic build.
   - The file should export a normal config, e.g.:
     /** @type {import('next').NextConfig} */
     const nextConfig = {
       reactStrictMode: true,
       // DO NOT set output: 'export' for this project.
     };
     module.exports = nextConfig;

4) Keep Node/engines tidy (optional):
   - package.json:
     {
       "engines": { "node": "20.x" },
       "engineStrict": false
     }

5) Run type check and build locally to confirm:
   - npm ci
   - npm run build

6) Commit and push changes to main with message:
   "fix(auth): wrap useSearchParams in Suspense and make /auth/callback dynamic"

# Acceptance criteria
- `npm run build` completes with no "missing suspense" or "prerender error" for /auth/callback.
- Vercel deployment turns green.
- Visiting /auth/callback during an OAuth flow renders (shows "Signing you in…" or your final redirect).
