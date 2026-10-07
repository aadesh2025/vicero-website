import { FooterLinks } from "./footer-links";
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
      { label: "Log in", href: appLinks.login },
      { label: "Start free trial", href: appLinks.signup },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-strong">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_2.6fr] md:gap-12 lg:gap-16">
          <div>
            <Logo height={24} />
            <p className="mt-5 max-w-xs leading-relaxed text-muted">Answer customers from your own documents, and show where each answer came from.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">{CONTACT_EMAIL}</a>
          </div>
          <FooterLinks cols={cols} />
        </div>
        <p className="mt-10 border-t md:mt-14 border-border pt-6 text-sm text-faint">
          © {new Date().getFullYear()} {PRODUCT_NAME}. Built by AUROZEN AI.
        </p>
      </div>
    </footer>
  );
}
