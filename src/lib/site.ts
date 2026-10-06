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

/** Plan copy and limits for display. Prices live in lib/pricing.ts (fixed USD / EUR / INR lists). */
export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    blurb: "One agent on your website, grounded in your content.",
    messages: "2,000",
    cta: "Start free trial",
    featured: false,
    features: ["3 agents", "1 knowledge base · 20 documents", "Website chat widget", "Basic analytics", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Automations and the channels your customers already use.",
    messages: "10,000",
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
    blurb: "Every channel, unlimited automation, built for teams.",
    messages: "30,000",
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
  { id: "widget", label: "Website", body: "One script tag. It runs in a Shadow DOM, so your site's CSS can't break it, and replies stream in as they're written.", plan: "All plans" },
  { id: "whatsapp", label: "WhatsApp", body: "Signed inbound webhooks, and the 24-hour service window is tracked so you don't message outside it by accident.", plan: "Pro and Business" },
  { id: "instagram", label: "Instagram", body: "Answer direct messages from the same agent and documents, with hand-off to your team.", plan: "Pro and Business" },
  { id: "facebook", label: "Messenger", body: "Page conversations land in the shared inbox with their full history.", plan: "Pro and Business" },
  { id: "telegram", label: "Telegram", body: "Add a bot token and conversations arrive. The webhook is registered for you.", plan: "Business" },
  { id: "slack", label: "Slack", body: "Let your team ask the agent in the place they already work.", plan: "Business" },
  { id: "discord", label: "Discord", body: "Community support with the same grounded answers.", plan: "Business" },
  { id: "email", label: "Email", body: "Threaded replies from a support address, with the same hand-off.", plan: "Business" },
] as const;

export type Cell = string | boolean;
/** Plan comparison rows: [Starter, Pro, Business]. Mirrors plans.py by hand, like PLANS above. */
export const COMPARE: { label: string; v: [Cell, Cell, Cell] }[] = [
  { label: "Messages a month", v: ["2,000", "10,000", "30,000"] },
  { label: "Agents", v: ["3", "10", "30"] },
  { label: "Workspaces", v: ["1", "2", "5"] },
  { label: "Knowledge bases", v: ["1", "5", "20"] },
  { label: "Documents", v: ["20", "100", "500"] },
  { label: "Storage", v: ["500 MB", "5 GB", "10 GB"] },
  { label: "Team members", v: ["1", "5", "15"] },
  { label: "Website widget", v: [true, true, true] },
  { label: "WhatsApp, Instagram, Messenger", v: [false, true, true] },
  { label: "Telegram, Slack, Discord, email", v: [false, false, true] },
  { label: "Workflows", v: [false, "10", "Unlimited"] },
  { label: "n8n automations", v: [false, true, true] },
  { label: "Tools (HTTP and MCP)", v: [false, "8", "Unlimited"] },
  { label: "Outbound webhooks", v: [false, "5", "Unlimited"] },
  { label: "API access", v: ["Read", "Full", "Full"] },
  { label: "Analytics", v: ["Basic", "Advanced", "Advanced and export"] },
  { label: "Remove Vicero branding", v: [false, true, true] },
  { label: "Support", v: ["Email", "Priority", "Priority"] },
];
