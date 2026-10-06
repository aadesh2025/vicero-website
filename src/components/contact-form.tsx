"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const field = "mt-2 w-full rounded-md border border-border-strong bg-surface px-4 py-3 text-[15px] outline-none transition placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/25";

/** No backend yet: this opens the visitor's mail client with the message filled in. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Vicero enquiry from ${String(f.get("name") ?? "")}`);
    const body = encodeURIComponent(`${String(f.get("message") ?? "")}\n\n— ${String(f.get("name") ?? "")} (${String(f.get("email") ?? "")})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Name<input name="name" required autoComplete="name" className={field} placeholder="Maya Iyer" /></label>
        <label className="block text-sm font-semibold">Work email<input name="email" type="email" required autoComplete="email" className={field} placeholder="maya@company.com" /></label>
      </div>
      <label className="block text-sm font-semibold">How can we help?<textarea name="message" required rows={6} className={field} placeholder="Tell us about your use case: channels, volume, and what the agent should do." /></label>
      <button type="submit" className="inline-flex h-12 items-center justify-center rounded-md bg-accent-strong px-6 text-base font-semibold text-on-accent transition-colors hover:bg-accent-2">Send message</button>
      {sent && <p role="status" className="text-sm text-muted">Your email app should have opened. If not, write to <a className="font-semibold text-accent" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
    </form>
  );
}

