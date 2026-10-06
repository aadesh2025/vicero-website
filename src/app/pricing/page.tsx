import type { Metadata } from "next";
import { ComparePlans } from "@/components/compare-plans";
import { Faq } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { PlanPicker } from "@/components/plan-picker";
import { CurrencySwitch } from "@/components/pricing-provider";
import { Section, SectionHead } from "@/components/ui";
import { getPricing } from "@/lib/currency.server";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pricing", description: "Start with a free 10-day trial. Three plans, priced in your currency." };

const faqFor = (pack: (id: "starter" | "pro" | "business") => string) => [
  { q: "Do I need a card for the trial?", a: "No. The trial lasts 10 days and includes one agent, one knowledge base and the website widget." },
  { q: "What counts as a message?", a: "A reply is reserved as a question and answer pair. Usage resets monthly, and you can see it on the dashboard." },
  { q: "What if I run out?", a: `Add a pack of 500 messages (${pack("starter")} on Starter, ${pack("pro")} on Pro, ${pack("business")} on Business) or move up a plan.` },
  { q: "Which models can I use?", a: "Groq first, then Gemini, OpenRouter and local Ollama, plus OpenAI and Anthropic with your own keys." },
  { q: "Can I host it myself?", a: "Vicero ships with Docker Compose files and a self-hosting guide. Contact us about your setup." },
];

export default async function PricingPage() {
  const d = await getPricing();
  const faq = faqFor((id) => formatMoney(d.plans[id].pack, d.currency));
  return (
    <>
      <PageHero title="Start free. Pay when it works." lead="Every plan begins with a 10-day trial and no card. Prices are shown in your currency." />

      <Section>
        <SectionHead title="Find your plan." lead="Slide to the messages you expect and tick what you need." />
        <div className="mt-8 md:mt-10"><PlanPicker /></div>
      </Section>

      <Section className="pt-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10"><SectionHead title="Everything side by side." /><CurrencySwitch /></div>
        <ComparePlans />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHead title="Questions people ask." />
          <Faq items={faq} />
        </div>
      </Section>
    </>
  );
}
