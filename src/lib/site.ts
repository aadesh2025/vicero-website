export const PRODUCT_NAME = "Vicero";
export const TAGLINE = "The intelligence behind your business.";

/** The SaaS app. Auth lives there; the site only deep-links. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001").replace(/\/$/, "");
export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? `${APP_URL}/docs`;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@vicero.ai";

export const appLinks = {
  login: `${APP_URL}/login`,
  signup: `${APP_URL}/signup`,
};

export const NAV = [
  { href: "/product", label: "Product" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/automations", label: "Automations" },
  { href: "/channels", label: "Channels" },
  { href: "/pricing", label: "Pricing" },
  { href: "/developers", label: "Developers" },
] as const;

/** Mirrors apps/api/app/core/plans.py (display only; the API is the source of truth). */
export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    blurb: "One agent on your website, grounded in your content.",
    messages: "2,000",
    pack: "$6 / 500 extra",
    cta: "Start free trial",
    featured: false,
    features: ["3 agents", "1 knowledge base · 20 documents", "Website chat widget", "Basic analytics", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    blurb: "Automations and the channels your customers already use.",
    messages: "10,000",
    pack: "$5 / 500 extra",
    cta: "Start free trial",
    featured: true,
    features: [
      "10 agents · 2 workspaces",
      "5 knowledge bases · 100 documents",
      "WhatsApp, Instagram & Messenger",
      "10 workflows · n8n · API write access",
      "Advanced analytics · remove branding",
      "5 team members · priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    blurb: "Every channel, unlimited automation, built for teams.",
    messages: "30,000",
    pack: "$4 / 500 extra",
    cta: "Start free trial",
    featured: false,
    features: [
      "30 agents · 5 workspaces",
      "20 knowledge bases · 500 documents",
      "All channels incl. Slack, Discord, Telegram, email",
      "Unlimited workflows, tools & webhooks",
      "Analytics export · 15 team members",
      "Priority support",
    ],
  },
] as const;

export const CHANNELS = [
  { id: "widget", label: "Website widget" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Messenger" },
  { id: "telegram", label: "Telegram" },
  { id: "slack", label: "Slack" },
  { id: "discord", label: "Discord" },
  { id: "email", label: "Email" },
] as const;
