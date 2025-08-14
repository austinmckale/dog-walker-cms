Prompt for Codex

You are working on a Next.js (App Router) + Supabase auth UI. Improve /signin into a polished Auth page that supports social logins and a full sign‑up flow.

Project context

Tech: Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui, @supabase/supabase-js, @supabase/auth-helpers-nextjs.

Deployed on Vercel. ENV already set:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
OAuth providers will be Google + GitHub (easy to add more later).

Current page shows email/password, magic link, and provider buttons, but there is no sign‑up UI and the UX is plain.

Goals

Single Auth screen with tabs: Sign in | Sign up.

Support the following:

Email + password (both sign in and sign up).

Magic link sign‑in (passwordless).

OAuth: Google and GitHub (buttons).

Add “Continue as guest” (demo) optional button that creates an anonymous Supabase auth session or routes to a /demo page without auth (config flag to hide).

Forgot password + Reset password flows.

Clean, mobile‑first UI using shadcn/ui components, good a11y, and form validation.

Redirects: after auth, go to /dashboard; if already logged in, redirect from /signin to /dashboard.

Toast feedback for errors/success; disable buttons during submit; handle Supabase errors nicely.

Design requirements

Centered card up to max-w-md, with brand area (logo/title), then Tabs.

Social buttons first (“Continue with Google/GitHub”), then a divider “or”.

Forms with labels, placeholders, helper text, inline errors.

“Remember me” on sign in (store email only in localStorage when checked).

Legal text under sign up: “By creating an account you agree to the Terms and Privacy Policy” with links to /legal/terms and /legal/privacy.

Link at bottom to switch modes: “New here? Create an account” / “Already have an account? Sign in”.

Implementation details

Create app/(auth)/signin/page.tsx → AuthPage component.

Use shadcn/ui: Card, Button, Input, Label, Separator, Tabs, TabsList, TabsTrigger, TabsContent, Form, FormField, FormItem, FormMessage.

Use react-hook-form + zod for validation:

Sign in: email (valid), password (min 8) OR magic‑link only email.

Sign up: first name, last name (optional), email, password (min 8, 1 number), confirm password checkbox for terms (must be checked).

Add Supabase helpers:

OAuth: supabase.auth.signInWithOAuth({ provider: 'google' | 'github', options: { redirectTo: '<site-url>/auth/callback' }})

Email/password sign up: supabase.auth.signUp({ email, password, options: { emailRedirectTo: '<site-url>/auth/callback' }})

Email/password sign in: supabase.auth.signInWithPassword({ email, password })

Magic link: supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '<site-url>/auth/callback' }})

Build an /auth/callback/route.ts (App Router) to complete OAuth and then redirect('/dashboard'). Use createRouteHandlerClient from @supabase/auth-helpers-nextjs.

Protect /dashboard with server component auth (redirect to /signin if no session).

Create password reset routes:

/forgot-password page (asks for email, calls supabase.auth.resetPasswordForEmail(email, { redirectTo: '<site-url>/reset-password' })).

/reset-password page (reads code from URL, updates password with supabase.auth.updateUser({ password })).

Add NEXT_PUBLIC_SITE_URL in env and use it for redirectTo values. Make sure OAuth Redirect URLs are registered in Supabase:
${NEXT_PUBLIC_SITE_URL}/auth/callback and ${NEXT_PUBLIC_SITE_URL}/reset-password.

Files to create/modify

app/(auth)/signin/page.tsx (new UI with tabs)

app/auth/callback/route.ts (handles OAuth)

app/forgot-password/page.tsx

app/reset-password/page.tsx

app/dashboard/page.tsx (placeholder protected page)

lib/supabaseClient.ts (singleton browser client)

lib/supabaseServer.ts (server client via auth-helpers)

components/ui/SocialButtons.tsx (Google/GitHub)

components/ui/AuthDivider.tsx (decorative “or”)

components/ui/TermsNote.tsx

components/ui/Toaster.tsx (if not already present)

Edge cases to handle

OAuth popup blocked → show link fallback.

Email already registered on sign up → show “Try signing in or reset your password”.

Magic link sent → display “Check your email for a secure sign‑in link”.

If SUPABASE_AUTH_EXTERNAL_* provider disabled, hide that button automatically (query auth.admin.listIdentities or gate via env).

Acceptance criteria

All four auth methods work end‑to‑end (email/pass in & up, magic link, Google, GitHub).

Redirects function as specified; authenticated users can’t see /signin.

Form errors are visible and accessible; buttons show loading state.

Mobile layout looks great; Lighthouse a11y ≥ 95.

Clean TypeScript types, no ESLint errors.

Example component structure (generate the code)

Export a default AuthPage with:

<Card> → header (logo/title), <Tabs defaultValue="signin">

<TabsList> with <TabsTrigger value="signin"> and <TabsTrigger value="signup">

<TabsContent value="signin"> → SocialButtons → Divider → SignInForm → magic link form → remember me + forgot password

<TabsContent value="signup"> → SocialButtons → Divider → SignUpForm (first/last/email/password/confirm password) + TermsNote

Footer link to toggle modes (for deep link /signin?mode=signup, default the tab)

Implement getSession server‑side; if session exists, redirect('/dashboard').

Testing checklist (write Playwright tests if possible)

Sign up with new email → email verification → redirect to /dashboard after callback.

Sign in with email/pass.

Request magic link → success toast.

OAuth both providers → redirect to /dashboard.

Reset password end‑to‑end.

Visiting /signin when logged in → redirected away.

Generate all files with complete, runnable code and minimal styles consistent with Tailwind + shadcn. Include notes where I must add OAuth redirect URLs in Supabase and Vercel envs.