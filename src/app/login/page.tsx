import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Shot } from "@/components/ui";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Log in", description: "Sign in to your Vicero workspace." };

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1.15fr]">
      <div className="flex items-center px-5 py-16 sm:px-12 lg:px-20">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl font-bold leading-tight">Log in to Vicero</h1>
          <p className="mt-3 text-muted">Pick up where your agents left off.</p>
          <div className="mt-9"><LoginForm /></div>
          <p className="mt-10 text-sm text-muted">
            New here? <a className="font-semibold text-accent underline underline-offset-4" href={appLinks.signup}>Start a free trial</a>. Trouble signing in? <Link className="font-semibold text-accent underline underline-offset-4" href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-surface-2 lg:block" aria-hidden="true">
        <div className="absolute left-14 top-1/2 w-[135%] -translate-y-1/2 overflow-hidden rounded-xl border border-border-strong shadow-[0_40px_80px_-40px_rgb(13_14_18/0.45)]">
          <Shot name="inbox" alt="" />
        </div>
      </div>
    </div>
  );
}
