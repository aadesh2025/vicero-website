import Link from "next/link";
import { AnswerSource } from "@/components/answer-source";
import { CodePane } from "@/components/dev/code-pane";
import { ProductTabs } from "@/components/product-tabs";
import { Button, Container, Section, SectionHead, Shot, ShotFrame } from "@/components/ui";
import { ChannelHub } from "@/components/visuals/channel-hub";
import { highlight } from "@/lib/highlight";
import { appLinks, PLANS } from "@/lib/site";

const SEARCH = `curl -X POST https://YOUR_API_HOST/v1/knowledge/{kb_id}/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "Do you ship to Chennai?", "top_k": 3 }'`;

export default async function Home() {
  const searchHtml = await highlight(SEARCH, "bash");

  return (
    <>
      {/* Hero */}
      <section className="pt-20 sm:pt-28">
        <Container>
          <h1 className="max-w-[16ch] font-display text-[46px] font-bold leading-[0.96] sm:max-w-4xl sm:text-7xl lg:text-[84px]">
            Answer customers from your own documents.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">
            Vicero reads your files, replies on your website, WhatsApp and Instagram, shows which passage each answer came from, and hands over to a person when it isn&apos;t sure.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={appLinks.signup} external size="lg">Start free trial</Button>
            <Button href="/product" variant="secondary" size="lg">See the product</Button>
            <span className="text-sm text-faint">10 days free. No card needed.</span>
          </div>
        </Container>
        <Container className="mt-20 max-w-[1320px]">
          <ShotFrame>
            <Shot name="dashboard" alt="The Vicero dashboard for a furniture shop: 3.8K conversations in 30 days, 89% resolved without a person, daily activity and channel breakdown" priority />
          </ShotFrame>
        </Container>
      </section>

      {/* One idea, shown working */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
          <div>
            <SectionHead title="Every answer shows where it came from." lead="Ask a question and the passage it was answered from is highlighted in your own document. Customers can check it. So can you." />
          </div>
          <AnswerSource />
        </div>
      </Section>

      {/* The product */}
      <section className="border-y border-border bg-surface py-24 sm:py-36">
        <Container className="max-w-[1320px]">
          <SectionHead title="Run your whole support desk from one place." lead="Read every conversation, step in when it matters, and see what your agents are doing." />
          <div className="mt-16">
            <ProductTabs
              items={[
                { id: "inbox", label: "Inbox", shot: "inbox", alt: "Inbox: a customer asks about delivery, the agent answers, and a person from the team takes over" },
                { id: "conversations", label: "Conversations", shot: "conversations", alt: "A list of recent conversations across WhatsApp, the web widget and Instagram" },
                { id: "crm", label: "Customers", shot: "contacts", alt: "CRM listing customers with their channel, stage and last activity" },
                { id: "kb", label: "Knowledge", shot: "knowledge", alt: "A knowledge base with documents and their indexing status" },
                { id: "stats", label: "Analytics", shot: "analytics", alt: "Analytics with conversations, resolution rate, latency and cost over 30 days" },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Channels */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHead title="One agent on every channel." lead="Write the persona and load the documents once. Every channel gets the same answers." />
            <Link href="/channels" className="mt-8 inline-block font-semibold text-accent underline underline-offset-4">See the channels</Link>
          </div>
          <ChannelHub />
        </div>
      </Section>

      {/* Automations */}
      <section className="dark bg-bg py-24 text-text sm:py-36">
        <Container className="max-w-[1320px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <h2 className="font-display text-4xl font-bold leading-[1.02] text-balance sm:text-6xl">Let it do things, not only answer.</h2>
            <div>
              <p className="text-lg leading-relaxed text-muted">Build a workflow with conditions, approvals and calls to your other tools. Test it, then publish. Anything risky waits for a person.</p>
              <Link href="/automations" className="mt-5 inline-block font-semibold text-accent underline underline-offset-4">How automations work</Link>
            </div>
          </div>
          <ShotFrame className="mt-16"><Shot name="workflow" alt="Workflow builder: a refund request is checked, then approved by a person or handled automatically" /></ShotFrame>
        </Container>
      </section>

      {/* Developers */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead title="Build on it." lead="A REST API, signed webhooks and a widget you embed with one tag." />
            <Link href="/developers" className="mt-8 inline-block font-semibold text-accent underline underline-offset-4">Explore the API</Link>
          </div>
          <CodePane title="Search a knowledge base" html={searchHtml} raw={SEARCH} />
        </div>
      </Section>

      {/* Pricing */}
      <Section className="pt-0">
        <SectionHead title="Start free. Pay when it works." lead="Every plan begins with a 10-day trial, no card needed." />
        <div className="mt-14 divide-y divide-border border-y border-text/80">
          {PLANS.map((p) => (
            <div key={p.id} className="grid items-baseline gap-x-8 gap-y-2 py-8 md:grid-cols-[180px_170px_1fr_auto]">
              <p className="font-display text-2xl font-bold">{p.name}</p>
              <p className="font-display text-2xl font-bold">${p.price}<span className="text-base font-medium text-faint"> a month</span></p>
              <p className="text-muted">{p.messages} messages a month. {p.blurb}</p>
              <Link href="/pricing" className="font-semibold text-accent underline underline-offset-4">See what&apos;s included</Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <section className="bg-accent-strong py-24 text-on-accent sm:py-32">
        <Container>
          <h2 className="max-w-4xl font-display text-5xl font-bold leading-[0.98] text-balance sm:text-7xl">Put your documents to work today.</h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href={appLinks.signup} external size="lg" variant="ink">Start free trial</Button>
            <Link href="/contact" className="px-3 py-2 font-semibold underline underline-offset-4">Talk to us first</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
