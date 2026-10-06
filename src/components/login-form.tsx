"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { appLinks } from "@/lib/site";

const field = "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-base outline-none transition placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/25";

/**
 * Collects only an email address, then hands off to the app's own sign-in, where the password is
 * entered. This site never receives or stores a password.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(appLinks.login);
    if (email.trim()) url.searchParams.set("email", email.trim());
    window.location.href = url.toString();
  };

  return (
    <div>
      <a href={appLinks.login} className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-border-strong bg-surface font-semibold transition-colors hover:bg-surface-2">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.5 7l7.1 5.5c4.2-3.8 7.1-9.5 7.1-17z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.2-8.8 2.2-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
        Continue with Google
      </a>
      <div className="my-6 flex items-center gap-4 text-sm text-faint"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-semibold">
          Work email
          <input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={`${field} mt-2 font-normal`} />
        </label>
        <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent-strong font-semibold text-on-accent transition-colors hover:bg-accent-2">
          <Mail className="h-4 w-4" aria-hidden="true" /> Continue with email
        </button>
      </form>
      <p className="mt-6 text-sm text-faint">You&apos;ll enter your password on the next screen, in the Vicero app.</p>
    </div>
  );
}
