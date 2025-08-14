"use client";
import {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {supabase} from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string>("Completing sign-in…");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const code = search.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // Either code flow succeeded or implicit tokens were already parsed
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Set server-side cookies so SSR pages see the session
          try {
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token })
            });
          } catch {}
          router.replace('/dashboard');
        } else {
          setMessage('Could not complete sign-in. Try again.');
        }
      } catch (e: any) {
        if (!cancelled) setMessage(e?.message || 'Authentication failed.');
      }
    }
    run();
    return () => { cancelled = true; };
  }, [search, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Signing you in…</h1>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
