// IMPORTANT: Use static references so Next can inline
// env in the client bundle. Dynamic indexing breaks in the browser.
export function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      `[ENV MISSING] Set NEXT_PUBLIC_SUPABASE_URL in Vercel → Project → Settings → Environment Variables`
    )
  }
  if (!anon) {
    throw new Error(
      `[ENV MISSING] Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Project → Settings → Environment Variables`
    )
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
  }
}
