import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Button, Facts, Section, SectionHead } from "@/components/ui";
import { GuardStack } from "@/components/visuals/guard-stack";
import { CONTACT_EMAIL, DOCS_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Security", description: "How Vicero isolates tenants, guards agents and protects keys, and what we haven't done yet." };

const IN_PLACE = ["Every query scoped to your organisation", "Provider keys encrypted at rest", "Prompt injection neutralised in retrieved text", "SSRF guard on every outbound fetch", "Signed webhooks and n8n calls", "An audit log your admins can read"];
const NOT_YET = ["An independent penetration test", "Compliance certifications such as SOC 2 or ISO 27001"];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        wide
        title="A bad document can't give your agent orders."
        lead="Agents read text they don't control and call real systems. Here is how Vicero keeps that contained, and what we haven't done yet."
        visual={
          <div className="space-y-3">
            <div className="rounded-lg border border-border-strong bg-surface p-5">
              <p className="font-display text-lg font-bold">In place today</p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {IN_PLACE.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] leading-snug"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-text" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-warn/50 bg-warn-soft p-5">
              <p className="font-display text-lg font-bold text-warn-text">Not done yet</p>
              <ul className="mt-3 space-y-2">
                {NOT_YET.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] leading-snug text-warn-text"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        }
      >
        <Button href={DOCS_URL} external size="lg">Read the security docs</Button>
      </PageHero>

      <Section>
        <SectionHead title="The path a message takes." lead="Three of these steps are checks written in code, not instructions in a prompt." />
        <div className="mt-14"><GuardStack /></div>
      </Section>

      <Section className="pt-0">
        <Facts
          items={[
            { title: "Tenants are isolated", body: "Every query is scoped to the organisation. Isolation is enforced where data is fetched, not left to the interface." },
            { title: "Guardrails are code", body: "Blocked topics are refused before the model is called, retrieved text is treated as data, and secrets are redacted from replies. A line in a prompt is a request; these are checks." },
            { title: "Outbound fetches are guarded", body: "HTTP tools, URL ingestion and custom model endpoints go through an SSRF guard that also covers redirects." },
            { title: "Keys are encrypted", body: "Provider API keys are encrypted at rest and never logged. Passwords use argon2, and sessions use short-lived tokens with an httpOnly refresh cookie." },
            { title: "Changes are logged", body: "Your admins can see who changed what, and when." },
            { title: "Integrations are signed", body: "Webhooks and n8n calls are HMAC-signed in both directions, and an unsigned workflow can't be attached as a tool." },
          ]}
        />
        <p className="mt-12 text-sm text-faint">Found something? Email <a className="font-semibold text-accent underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </Section>
    </>
  );
}
