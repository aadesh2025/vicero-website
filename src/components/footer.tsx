import Link from "next/link";
import { appLinks, CONTACT_EMAIL, DOCS_URL, PRODUCT_NAME } from "@/lib/site";
import { Logo } from "./logo";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Knowledge", href: "/knowledge" },
      { label: "Automations", href: "/automations" },
      { label: "Channels", href: "/channels" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API and webhooks", href: "/developers" },
      { label: "Documentation", href: DOCS_URL },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Start free trial", href: appLinks.signup },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-strong">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo height={24} />
            <p className="mt-5 max-w-xs leading-relaxed text-muted">Answer customers from your own documents, and show where each answer came from.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 inline-block font-semibold text-accent underline underline-offset-4">{CONTACT_EMAIL}</a>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="font-display text-base font-bold">{c.title}</h3>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} className="text-muted transition-colors hover:text-text">{l.label}</a>
                    ) : (
                      <Link href={l.href} className="text-muted transition-colors hover:text-text">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-14 border-t border-border pt-6 text-sm text-faint">
          © {new Date().getFullYear()} {PRODUCT_NAME}. Built by AUROZEN AI.
        </p>
      </div>
    </footer>
  );
}
