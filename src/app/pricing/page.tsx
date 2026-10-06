import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Faq } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { PlanPicker } from "@/components/plan-picker";
import { Button, Section, SectionHead } from "@/components/ui";
import { appLinks, PLANS } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing", description: "Start with a free 10-day trial. Starter $49, Pro $99, Business $199 a month." };

type Cell = string | boolean;
const rows: { label: string; v: [Cell, Cell, Cell] }[] = [
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

const faq = [
  { q: "Do I need a card for the trial?", a: "No. The trial lasts 10 days and includes one agent, one knowledge base and the website widget." },
  { q: "What counts as a message?", a: "A reply is reserved as a question and answer pair. Usage resets monthly, and you can see it on the dashboard." },
  { q: "What if I run out?", a: "Add a pack of 500 messages ($6 on Starter, $5 on Pro, $4 on Business) or move up a plan." },
  { q: "Which models can I use?", a: "Groq first, then Gemini, OpenRouter and local Ollama, plus OpenAI and Anthropic with your own keys." },
  { q: "Can I host it myself?", a: "Vicero ships with Docker Compose files and a self-hosting guide. Contact us about your setup." },
];

function Val({ v }: { v: Cell }) {
  if (v === true) return <Check className="h-4 w-4 text-success-text" aria-label="Included" />;
  if (v === false) return <Minus className="h-4 w-4 text-faint" aria-label="Not included" />;
  return <span className="font-semibold">{v}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero title="Start free. Pay when it works." lead="Every plan begins with a 10-day trial and no card. Prices are in US dollars." />

      <Section>
        <SectionHead title="Find your plan." lead="Slide to the messages you expect and tick what you need." />
        <div className="mt-10"><PlanPicker /></div>
      </Section>

      <Section className="overflow-x-auto pt-0">
        <SectionHead title="Everything side by side." className="mb-10" />
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="align-bottom">
              <td className="w-[34%] pb-6" />
              {PLANS.map((p) => (
                <th key={p.id} scope="col" className={cn("px-5 pb-6 align-bottom font-normal", p.featured && "bg-accent-soft")}>
                  <span className="block font-display text-2xl font-bold">{p.name}</span>
                  <span className="mt-1 block font-display text-4xl font-bold">${p.price}<span className="text-base font-medium text-faint"> a month</span></span>
                  <span className="mt-2 block max-w-[220px] text-sm leading-snug text-muted">{p.blurb}</span>
                  <Button href={appLinks.signup} external variant={p.featured ? "primary" : "secondary"} className="mt-4">Start free trial</Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <th scope="row" className="py-3.5 pr-4 font-medium text-muted">{r.label}</th>
                {r.v.map((v, i) => (
                  <td key={i} className={cn("px-5 py-3.5", PLANS[i].featured && "bg-accent-soft")}><Val v={v} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHead title="Questions people ask." />
          <Faq items={faq} />
        </div>
      </Section>
    </>
  );
}
