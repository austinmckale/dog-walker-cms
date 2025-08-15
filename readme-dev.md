# Development Fix Plan (Vercel build + auth callback)

This project is Next.js 14 on Vercel. We addressed two issues:
- Vercel builds failed because devDependencies (TypeScript) were not installed.
- The `/auth/callback` page used `useSearchParams()` without a Suspense boundary, causing a build/runtime warning and prerender error.

What is already fixed in the repo:
- `vercel.json` now uses `"installCommand": "npm ci"` (no `--omit=dev`). `.npmrc` has `legacy-peer-deps=true`, so no extra UI change is required in Vercel.
- `package.json` engines target Node LTS range: `">=18.18.0 <21"`. The project `.nvmrc` pins Node `20`, which Vercel will respect when configured.
- `/auth/callback` is refactored to the Suspense pattern and marked dynamic.

Auth callback structure (current code):
```
// app/auth/callback/page.tsx
import { Suspense } from 'react'
import CallbackClient from './CallbackClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CallbackClient />
    </Suspense>
  )
}
```

```
// app/auth/callback/CallbackClient.tsx
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function CallbackClient() {
  const params = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('Completing sign-in…')
  // exchanges code, sets cookies via /api/auth/session, then redirects
}
```

Recommended verifications (local):
- Use Node 20: `nvm use 20`
- Install and build: `npm ci && npm run build`

Notes and guardrails:
- Keep TypeScript and type packages installed (they are already present). Consider moving `@types/*` to `devDependencies` in a future cleanup.
- `.gitignore` already includes `.next`.
- Do not set `output: 'export'` in `next.config.js` for this project.

Acceptance criteria:
- `npm run build` succeeds locally and on Vercel (no missing TypeScript).
- No Suspense/prerender error for `/auth/callback`.
- Vercel uses Node 20.x per project settings; no Node 22 warning.
