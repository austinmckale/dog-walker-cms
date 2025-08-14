"use client";
import {useMemo, useState} from "react";
import {supabase} from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|undefined>();

  const siteBase = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.origin;
    return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  }, []);
  const redirectTo = siteBase ? siteBase + "/reset-password" : undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    setMessage(error ? error.message : 'Check your email for the reset link.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">Forgot password</h1>
        <p className="text-sm text-gray-600 text-center mb-4">Enter your email to receive a reset link.</p>
        {message && (
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-4">{message}</div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}

