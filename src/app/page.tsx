import { ArrowRight, BookOpenCheck, Check, GitBranch, UserRound } from "lucide-react";
import Link from "next/link";
import { AnswerSource } from "@/components/answer-source";
import { CodePane } from "@/components/dev/code-pane";
import { ProductTabs } from "@/components/product-tabs";
import { Button, Container, CropShot, SectionHead, ShotFrame } from "@/components/ui";
import { ChannelHub } from "@/components/visuals/channel-hub";
import { highlight } from "@/lib/highlight";
import { appLinks, PLANS } from "@/lib/site";
import { cn } from "@/lib/utils";

const SEARCH = `curl -X POST https://YOUR_API_HOST/v1/knowledge/{kb_id}/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "Do you ship to Chennai?", "top_k": 3 }'`;

const FEATURES = [
  { Icon: BookOpenCheck, title: "Answers from your documents", body: "Upload files and web pages. Every reply is written from them and names its source.", href: "/knowledge", cta: "How knowledge works" },
  { Icon: UserRound, title: "People stay in control", body: "When the agent isn't sure, a person takes over with the whole conversation in front of them.", href: "/channels", cta: "See the inbox" },
  { Icon: GitBranch, title: "Automations that wait for approval", body: "Build workflows with conditions and calls to your tools. Risky steps pause for a person.", href: "/automations", cta: "How automations work" },
];

export default async function Home() {
  const searchHtml = await highlight(SEARCH, "bash");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 sm:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px]" style={{ background: "radial-gradient(60% 55% at 50% 0%, rgb(var(--accent) / 0.13), transparent 70%)" }} />
        <Container className="text-center">
          <h1 className="mx-auto max-w-[17ch] font-display text-[44px] font-bold leading-[1.02] text-balance sm:text-6xl lg:text-[72px]">
            Answer customers from your own documents
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted text-balance sm:text-xl">
            Vicero replies on your website, WhatsApp and Instagram, shows which passage each answer came from, and hands over to a person when it isn&apos;t sure.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={appLinks.signup} external size="lg">Start free trial</Button>
            <Button href="/product" variant="secondary" size="lg">See the product</Button>
          </div>
          <p className="mt-4 text-sm text-faint">10 days free. No card needed.</p>
        </Container>
        <Container className="mt-16 max-w-[1180px] sm:mt-20">
          <ShotFrame className="rounded-b-none border-b-0">
            <CropShot name="dashboard" ratio="16 / 8.6" fade priority alt="The Vicero dashboard for a furniture shop: 3.8K conversations in 30 days, 89% resolved without a person, with daily activity" />
          </ShotFrame>
        </Container>
      </section>

      {/* Three ideas */}
      <section className="border-y border-border bg-surface py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {FEATURES.map(({ Icon, title, body, href, cta }) => (
              <div key={title}>
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h2 className="mt-5 font-display text-2xl font-bold leading-tight">{title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{body}</p>
                <Link href={href} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">{cta} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Answers show their source */}
      <section className="py-24 sm:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="Every answer shows where it came from" lead="Ask a question and the passage it was answered from lights up in your own document. Customers can check it. So can you." />
          <div className="mx-auto mt-16 max-w-[1040px]"><AnswerSource /></div>
        </Container>
      </section>

      {/* The product */}
      <section className="border-y border-border bg-surface py-24 sm:py-36">
        <Container className="max-w-[1240px]">
          <SectionHead className="mx-auto text-center" title="Your whole support desk in one place" lead="Read every conversation, step in when it matters, and see what your agents are doing." />
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
      <section className="py-24 sm:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="One agent on every channel" lead="Set up the persona and documents once. WhatsApp, Instagram, Messenger, Telegram, Slack, Discord, email and your website all give the same answers." />
          <div className="mx-auto mt-14 max-w-[820px]"><ChannelHub /></div>
        </Container>
      </section>

      {/* Automations */}
      <section className="dark bg-bg py-24 text-text sm:py-36">
        <Container className="max-w-[1240px]">
          <SectionHead className="mx-auto text-center" title="Let it do things, not only answer" lead="Build a workflow with conditions, approvals and calls to your other tools. Test it, then publish. Anything risky waits for a person." />
          <ShotFrame className="mt-16"><CropShot name="workflow" ratio="16 / 8.6" alt="Workflow builder: a refund request is checked, then approved by a person or handled automatically" /></ShotFrame>
          <p className="mt-8 text-center"><Link href="/automations" className="font-semibold text-accent hover:underline">How automations work</Link></p>
        </Container>
      </section>

      {/* Developers */}
      <section className="py-24 sm:py-36">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <SectionHead title="Build on it" lead="A REST API, signed webhooks and a widget you embed with one tag." />
              <Link href="/developers" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">Explore the API <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <CodePane title="Search a knowledge base" html={searchHtml} raw={SEARCH} />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-surface py-24 sm:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="Start free. Pay when it works." lead="Every plan begins with a 10-day trial. No card needed." />
          <div className="mx-auto mt-16 grid max-w-[1040px] gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.id} className={cn("flex flex-col rounded-xl border bg-bg p-8", p.featured ? "border-accent shadow-[0_0_0_1px_rgb(var(--accent))]" : "border-border-strong")}>
                <p className="font-display text-xl font-bold">{p.name}</p>
                <p className="mt-4 font-display text-5xl font-bold leading-none">${p.price}<span className="text-base font-medium text-faint"> a month</span></p>
                <p className="mt-4 text-muted">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-[15px]">
                  <li className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-text" aria-hidden="true" /><span><strong>{p.messages}</strong> messages a month</span></li>
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-text" aria-hidden="true" />{f}</li>
                  ))}
                </ul>
                <Button href={appLinks.signup} external variant={p.featured ? "primary" : "secondary"} className="mt-8 w-full">Start free trial</Button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center"><Link href="/pricing" className="font-semibold text-accent hover:underline">Compare every plan</Link></p>
        </Container>
      </section>

      {/* Closing */}
      <section className="bg-accent-strong py-24 text-center text-on-accent sm:py-32">
        <Container>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-[1.02] text-balance sm:text-6xl">Put your documents to work today</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={appLinks.signup} external size="lg" variant="ink">Start free trial</Button>
            <Link href="/contact" className="px-3 py-2 font-semibold underline underline-offset-4">Talk to us first</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
