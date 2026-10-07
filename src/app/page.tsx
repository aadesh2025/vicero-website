import { ArrowRight, BookOpenCheck, GitBranch, UserRound } from "lucide-react";
import Link from "next/link";
import { AnswerSource } from "@/components/answer-source";
import { CodePane } from "@/components/dev/code-pane";
import { PlanCards } from "@/components/plan-cards";
import { ProductTabs } from "@/components/product-tabs";
import { Button, Container, CropShot, SectionHead, Shot, ShotFrame, SnapRow } from "@/components/ui";
import { ChannelHub } from "@/components/visuals/channel-hub";
import { WorkflowSteps } from "@/components/workflow-steps";
import { highlight } from "@/lib/highlight";
import { appLinks } from "@/lib/site";

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
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] lg:h-[780px]" style={{ background: "radial-gradient(60% 55% at 50% 0%, rgb(var(--accent) / 0.13), transparent 70%)" }} />
        <Container className="text-center">
          <h1 className="mx-auto max-w-[17ch] font-display text-[clamp(2.3rem,7.2vw,4.5rem)] font-bold leading-[1.03] text-balance">
            Answer customers from your own documents
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted text-balance sm:mt-7 sm:text-xl">
            Vicero replies on your website, WhatsApp and Instagram, shows which passage each answer came from, and hands over to a person when it isn&apos;t sure.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center">
            <Button href={appLinks.signup} external size="lg" className="w-full sm:w-auto">Start free trial</Button>
            <Button href="/product" variant="secondary" size="lg" className="w-full sm:w-auto">See the product</Button>
          </div>
          <p className="mt-4 text-sm text-faint">10 days free. No card needed.</p>
        </Container>
        <Container className="mt-10 max-w-[1180px] sm:mt-16 lg:mt-20">
          <ShotFrame className="sm:rounded-b-none sm:border-b-0">
            {/* The whole dashboard on every screen size; on phones it fades out lower down, tablet and up crop a little less. */}
            <div className="sm:hidden">
              <Shot name="dashboard" alt="The Vicero dashboard: 3.8K conversations in 30 days, 89% resolved without a person, with daily activity and a channel breakdown" priority />
            </div>
            <div className="hidden sm:block">
              <CropShot name="dashboard" ratio="16 / 8.6" fade priority alt="The Vicero dashboard for a furniture shop: 3.8K conversations in 30 days, 89% resolved without a person, with daily activity" />
            </div>
          </ShotFrame>
        </Container>
      </section>

      {/* Three ideas: swipeable on phones */}
      <section className="border-y border-border bg-surface py-14 md:py-20 lg:py-28">
        <Container>
          <SnapRow>
            {FEATURES.map(({ Icon, title, body, href, cta }) => (
              <div key={title} className="w-[82%] shrink-0 snap-start rounded-xl border border-border-strong bg-bg p-6 sm:w-[60%] md:w-auto md:rounded-none md:border-0 md:bg-transparent md:p-0">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h2 className="mt-4 font-display text-xl font-bold leading-tight md:mt-5 md:text-2xl">{title}</h2>
                <p className="mt-2 leading-relaxed text-muted md:mt-3">{body}</p>
                <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent hover:underline md:mt-5">{cta} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            ))}
          </SnapRow>
        </Container>
      </section>

      {/* Answers show their source */}
      <section className="py-16 md:py-24 lg:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="Every answer shows where it came from" lead="Ask a question and the passage it was answered from lights up in your own document. Customers can check it. So can you." />
          <div className="mx-auto mt-10 max-w-[1040px] md:mt-16"><AnswerSource /></div>
        </Container>
      </section>

      {/* The product */}
      <section className="border-y border-border bg-surface py-16 md:py-24 lg:py-36">
        <Container className="max-w-[1240px]">
          <SectionHead className="mx-auto text-center" title="Your whole support desk in one place" lead="Read every conversation, step in when it matters, and see what your agents are doing." />
          <div className="mt-10 md:mt-16">
            <ProductTabs
              items={[
                { id: "inbox", label: "Inbox", shot: "inbox", alt: "Inbox: a customer asks about delivery, the agent answers, and a person from the team takes over", crop: { zoom: 1.78, x: 42.2, y: 13, ratio: "1 / 1" } },
                { id: "conversations", label: "Conversations", shot: "conversations", alt: "A list of recent conversations across WhatsApp, the web widget and Instagram", crop: { zoom: 1.55, x: 19, y: 10 } },
                { id: "crm", label: "Customers", shot: "contacts", alt: "CRM listing customers with their channel, stage and last activity", crop: { zoom: 1.55, x: 19, y: 10 } },
                { id: "kb", label: "Knowledge", shot: "knowledge", alt: "A knowledge base with documents and their indexing status", crop: { zoom: 1.55, x: 19, y: 10 } },
                { id: "stats", label: "Analytics", shot: "analytics", alt: "Analytics with conversations, resolution rate, latency and cost over 30 days", crop: { zoom: 1.6, x: 19, y: 8 } },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Channels */}
      <section className="py-16 md:py-24 lg:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="One agent on every channel" lead="Set up the persona and documents once. Every channel gives the same answers." />
          <div className="mx-auto mt-10 max-w-[820px] md:mt-14"><ChannelHub /></div>
        </Container>
      </section>

      {/* Automations */}
      <section className="dark bg-bg py-16 text-text md:py-24 lg:py-36">
        <Container className="max-w-[1240px]">
          <SectionHead className="mx-auto text-center" title="Let it do things, not only answer" lead="Build a workflow with conditions, approvals and calls to your other tools. Anything risky waits for a person." />
          {/* Phone: the same flow as a readable sequence. Tablet and up: the real builder. */}
          <div className="mx-auto mt-10 max-w-md md:hidden"><WorkflowSteps /></div>
          <ShotFrame className="mt-16 hidden md:block"><CropShot name="workflow" ratio="16 / 8.6" alt="Workflow builder: a refund request is checked, then approved by a person or handled automatically" /></ShotFrame>
          <p className="mt-8 text-center"><Link href="/automations" className="inline-flex min-h-11 items-center font-semibold text-accent hover:underline">How automations work</Link></p>
        </Container>
      </section>

      {/* Developers */}
      <section className="py-16 md:py-24 lg:py-36">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <SectionHead title="Build on it" lead="A REST API, signed webhooks and a widget you embed with one tag." />
              <Link href="/developers" className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent hover:underline lg:mt-8">Explore the API <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <CodePane title="Search a knowledge base" html={searchHtml} raw={SEARCH} />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-surface py-16 md:py-24 lg:py-36">
        <Container>
          <SectionHead className="mx-auto text-center" title="Start free. Pay when it works." lead="Every plan begins with a 10-day trial. No card needed." />
          <div className="mx-auto mt-10 max-w-[1040px] md:mt-16"><PlanCards /></div>
          <p className="mt-6 text-center md:mt-8"><Link href="/pricing" className="inline-flex min-h-11 items-center font-semibold text-accent hover:underline">Compare every plan</Link></p>
        </Container>
      </section>

      {/* Closing */}
      <section className="bg-accent-strong py-16 text-center text-on-accent md:py-24 lg:py-32">
        <Container>
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,6vw,3.75rem)] font-bold leading-[1.04] text-balance">Put your documents to work today</h2>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center">
            <Button href={appLinks.signup} external size="lg" variant="ink">Start free trial</Button>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center px-3 py-2 font-semibold underline underline-offset-4">Talk to us first</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
