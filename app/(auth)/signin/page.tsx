"use client";
import {useCallback, useMemo, useState} from "react";
import {supabase} from "@/lib/supabase/client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState<"email"|"password"|"google"|"github"|null>(null);
  const [message, setMessage] = useState<string|undefined>(undefined);

  const redirectTo = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.origin;
    return process.env.NEXT_PUBLIC_BASE_URL || undefined;
  }, []);

  const onMagicLink = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email"); setMessage(undefined);
    const {error} = await supabase.auth.signInWithOtp({email, options: {emailRedirectTo: redirectTo}});
    setLoading(null);
    if (error) setMessage(error.message); else setMessage("Check your email for the magic link.");
  }, [email, redirectTo]);

  const onPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("password"); setMessage(undefined);
    // Note: Supabase-js persists session in localStorage by default. "Remember me" here
    // simply lets browsers offer to save the password via autocomplete.
    const {error} = await supabase.auth.signInWithPassword({email, password});
    setLoading(null);
    if (error) setMessage(error.message); else window.location.href = "/";
  }, [email, password]);

  const onOAuth = useCallback(async (provider: 'google'|'github') => {
    setLoading(provider);
    const {error} = await supabase.auth.signInWithOAuth({provider, options: {redirectTo}});
    setLoading(null);
    if (error) setMessage(error.message);
  }, [redirectTo]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Sign in</h1>

      {message && (
        <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">{message}</div>
      )}

      <div className="space-y-2">
        <form onSubmit={onPassword} className="space-y-3" autoComplete="on">
          <input
            className="input-field"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            Remember me (allows browser to save password)
          </label>
          <button disabled={loading==="password"} className="btn-primary w-full">
            {loading==="password" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">or</div>

        <form onSubmit={onMagicLink} className="space-y-3">
          <input
            className="input-field"
            type="email"
            name="ml-email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <button disabled={loading==="email"} className="btn-secondary w-full">
            {loading==="email" ? "Sending..." : "Send magic link"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onOAuth('google')}
          disabled={loading==='google'}
          className="w-full btn-primary flex items-center justify-center gap-2"
          aria-label="Sign in with Google"
        >
          {loading==='google' ? 'Redirecting…' : 'Continue with Google'}
        </button>
        <button
          onClick={() => onOAuth('github')}
          disabled={loading==='github'}
          className="w-full btn-secondary flex items-center justify-center gap-2"
          aria-label="Sign in with GitHub"
        >
          {loading==='github' ? 'Redirecting…' : 'Continue with GitHub'}
        </button>
      </div>
    </div>
  );
}
