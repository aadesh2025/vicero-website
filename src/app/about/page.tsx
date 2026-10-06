import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Button, Facts, Section } from "@/components/ui";

export const metadata: Metadata = { title: "About", description: "Why Vicero exists and what we believe about AI agents in business." };

const WORDS = [
  ["Grounded.", "Answers come from your documents."],
  ["Human.", "A person is one click away."],
  ["Enforced.", "Rules are checks in code."],
  ["Yours.", "Your keys, your models, your servers."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="The intelligence behind your business."
        lead="Vicero is built by AUROZEN AI so that a small team can ship an AI agent, run it, and trust it."
        visual={
          <div className="grid grid-cols-2 border-l border-t border-text/80" aria-hidden="true">
            {WORDS.map(([w, s], i) => (
              <div key={w} className="relative border-b border-r border-text/80 p-6 sm:p-8">
                <p className="font-display text-3xl font-bold leading-none sm:text-[40px]">{w}</p>
                <p className="mt-3 text-[15px] leading-snug text-muted">{s}</p>
                {i === 0 && <span className="absolute right-4 top-4 h-3 w-3 bg-hl" />}
              </div>
            ))}
          </div>
        }
      />
      <Section>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
          <p>Most chatbot tools are a prompt box and a widget. A customer-facing agent needs more: documents it can quote, tools it can call safely, a way to hand over to a person, and a team that can see what happened and what it cost.</p>
          <p>Vicero is that platform. It began as the engine behind AUROZEN AI&apos;s own chatbot service and became a product of its own.</p>
        </div>
      </Section>
      <Section className="pt-0">
        <Facts
          cols={2}
          items={[
            { title: "Grounded or silent", body: "An agent that guesses is worse than no agent. Vicero answers from your documents, names them, and says when it doesn't know." },
            { title: "People stay in the loop", body: "Hand-off, approvals and review are part of the product, not an afterthought." },
            { title: "Enforce, don't ask nicely", body: "Anything that must not happen is checked in code. A sentence in a prompt is a request, not a control." },
            { title: "Own your stack", body: "Free models first, your own keys, Docker you can run yourself, and an API for everything." },
          ]}
        />
        <div className="mt-12"><Button href="/contact" variant="secondary" size="lg">Get in touch</Button></div>
      </Section>
    </>
  );
}

