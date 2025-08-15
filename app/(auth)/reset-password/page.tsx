"use client";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client";

type Stage = "request" | "reset"

export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState<"request"|"reset"|null>(null);
  const [message, setMessage] = useState<string|undefined>();

  const redirectTo = typeof window !== 'undefined'
    ? window.location.origin + "/reset-password"
    : (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "") + "/reset-password";

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStage('reset');
    });
    // Also check immediately if a session already exists (e.g., after redirect)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStage('reset');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault(); setMessage(undefined); setLoading("request");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(null);
    setMessage(error ? error.message : "Check your email for the reset link.");
  }

  async function doReset(e: React.FormEvent) {
    e.preventDefault(); setMessage(undefined);
    if (password.length < 8) { setMessage("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setMessage("Passwords do not match."); return; }
    setLoading("reset");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(null);
    if (error) setMessage(error.message); else {
      setMessage("Password updated. Redirecting...");
      setTimeout(() => { window.location.href = "/"; }, 800);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">Reset password</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          {stage === 'request' ? 'We will email you a reset link.' : 'Enter your new password.'}
        </p>

        {message && (
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-4">{message}</div>
        )}

        {stage === 'request' ? (
          <form onSubmit={requestLink} className="space-y-3">
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
            <button className="btn-primary w-full" disabled={loading==='request'}>
              {loading==='request' ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <form onSubmit={doReset} className="space-y-3">
            <input
              className="input-field"
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirm}
              onChange={e=>setConfirm(e.target.value)}
              required
            />
            <button className="btn-primary w-full" disabled={loading==='reset'}>
              {loading==='reset' ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

