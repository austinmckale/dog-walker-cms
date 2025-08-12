"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message); else setSent(true);
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {sent ? <p>Check your email for the magic link.</p> : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded p-2" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <button className="btn btn-primary w-full">Send magic link</button>
        </form>
      )}
    </div>
  );
}
