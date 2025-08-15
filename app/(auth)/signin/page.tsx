"use client";
import {useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {supabase} from "@/lib/supabase/client";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

type LoadingKey = "email"|"password"|"signup"|"google"|"github"|null

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
})

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters").regex(/\d/, "Must include a number"),
  confirm: z.string().min(1, "Confirm your password"),
}).refine((v) => v.password === v.confirm, { message: "Passwords do not match", path: ["confirm"]})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

export default function AuthPage() {
  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState<LoadingKey>(null);
  const [message, setMessage] = useState<string|undefined>(undefined);
  const [mlEmail, setMlEmail] = useState("");

  const siteBase = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.origin;
    return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  }, []);
  const authCallback = siteBase ? siteBase + "/auth/callback" : undefined;

  const signInForm = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } })
  const signUpForm = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema), defaultValues: { email: "", password: "", confirm: "" } })

  const onMagicLink = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email"); setMessage(undefined);
    const email = mlEmail || signInForm.getValues("email");
    const url = authCallback ? authCallback + (remember ? "?remember=1" : "") : undefined;
    const {error} = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: url } });
    setLoading(null);
    setMessage(error ? error.message : "Check your email for the magic link.");
  }, [mlEmail, signInForm, authCallback, remember]);

  const onPasswordSignIn = useCallback(async (values: SignInValues) => {
    setLoading("password"); setMessage(undefined);
    const {error, data} = await supabase.auth.signInWithPassword(values);
    if (error) {
      setLoading(null);
      setMessage(error.message);
      return;
    }
    try {
      if (remember) localStorage.setItem("auth:last_email", values.email);
      if (data.session) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, remember })
        });
      }
    } finally {
      setLoading(null);
    }
    window.location.assign("/");
  }, [remember]);

  const onSignUp = useCallback(async (values: SignUpValues) => {
    setLoading("signup"); setMessage(undefined);
    const {error, data} = await supabase.auth.signUp({ email: values.email, password: values.password, options: { emailRedirectTo: authCallback } });
    setLoading(null);
    if (error) setMessage(error.message);
    else if (data.user && !data.session) setMessage("Check your email to verify your account.");
    else {
      if (data.session) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, remember: true })
        });
      }
      window.location.assign("/");
    }
  }, [authCallback]);

  const onOAuth = useCallback(async (provider: 'google'|'github') => {
    setLoading(provider);
    const redirectTo = authCallback ? authCallback + (remember ? "?remember=1" : "") : undefined;
    const {error} = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    setLoading(null);
    if (error) setMessage(error.message);
  }, [authCallback, remember]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth:last_email");
      if (saved) {
        signInForm.setValue("email", saved);
        signUpForm.setValue("email", saved);
      }
    } catch {}
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'signin' ? 'Sign in to manage your walks and dogs.' : 'Sign up to start booking and tracking walks.'}
          </p>
        </div>

        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
          <button onClick={() => setMode('signin')} className={`flex-1 py-2 text-sm ${mode==='signin' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}>Sign in</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-2 text-sm ${mode==='signup' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}>Sign up</button>
        </div>

        {message && (
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-4" role="status">{message}</div>
        )}

        {mode === 'signin' ? (
          <div className="space-y-4">
            <form onSubmit={signInForm.handleSubmit(onPasswordSignIn)} className="space-y-3" noValidate>
              <div>
                <input className="input-field" type="email" autoComplete="email" placeholder="you@example.com" {...signInForm.register("email")} />
                {signInForm.formState.errors.email && (<p className="text-xs text-red-600 mt-1">{signInForm.formState.errors.email.message}</p>)}
              </div>
              <div>
                <input className="input-field" type="password" autoComplete="current-password" placeholder="Your password" {...signInForm.register("password")} />
                {signInForm.formState.errors.password && (<p className="text-xs text-red-600 mt-1">{signInForm.formState.errors.password.message}</p>)}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
              </div>
              <button disabled={loading==="password"} className="btn-primary w-full">{loading==="password" ? "Signing in..." : "Sign in"}</button>
            </form>

            <div className="relative text-center">
              <span className="px-2 bg-white text-sm text-gray-500 relative z-10">or continue with</span>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-200" />
            </div>

            <div className="space-y-3">
              <button onClick={() => onOAuth('google')} disabled={loading==='google'} className="w-full btn-primary flex items-center justify-center gap-2" aria-label="Sign in with Google">
                {loading==='google' ? 'Redirecting…' : 'Continue with Google'}
              </button>
              <button onClick={() => onOAuth('github')} disabled={loading==='github'} className="w-full btn-secondary flex items-center justify-center gap-2" aria-label="Sign in with GitHub">
                {loading==='github' ? 'Redirecting…' : 'Continue with GitHub'}
              </button>
            </div>

            <form onSubmit={onMagicLink} className="space-y-3 pt-2">
              <label className="text-sm text-gray-600">Prefer passwordless?</label>
              <div className="flex gap-2">
                <input className="input-field flex-1" type="email" autoComplete="email" placeholder="you@example.com" value={mlEmail} onChange={e=>setMlEmail(e.target.value)} />
                <button disabled={loading==="email"} className="btn-secondary">{loading==="email" ? "Sending..." : "Send link"}</button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-3" noValidate>
            <div>
              <input className="input-field" type="email" autoComplete="email" placeholder="you@example.com" {...signUpForm.register("email")} />
              {signUpForm.formState.errors.email && (<p className="text-xs text-red-600 mt-1">{signUpForm.formState.errors.email.message}</p>)}
            </div>
            <div>
              <input className="input-field" type="password" autoComplete="new-password" placeholder="Create a password" {...signUpForm.register("password")} />
              {signUpForm.formState.errors.password && (<p className="text-xs text-red-600 mt-1">{signUpForm.formState.errors.password.message}</p>)}
            </div>
            <div>
              <input className="input-field" type="password" autoComplete="new-password" placeholder="Confirm password" {...signUpForm.register("confirm")} />
              {signUpForm.formState.errors.confirm && (<p className="text-xs text-red-600 mt-1">{signUpForm.formState.errors.confirm.message}</p>)}
            </div>
            <p className="text-xs text-gray-500">Use at least 8 characters and include a number.</p>
            <button disabled={loading==="signup"} className="btn-primary w-full">{loading==="signup" ? "Creating account..." : "Create account"}</button>
            <p className="text-xs text-gray-500 text-center">By continuing, you agree to our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
          </form>
        )}
      </div>
    </div>
  );
}
