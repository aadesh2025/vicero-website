import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Tour, type TourItem } from "@/components/tour";
import { Button, Section, SectionHead, Shot, ShotFrame } from "@/components/ui";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Product", description: "Dashboard, inbox, customers, knowledge, workflows, analytics and team access: the whole Vicero workspace." };

const items: TourItem[] = [
  { id: "dashboard", shot: "dashboard", title: "See what your agents did", body: "Conversations, how many were resolved without a person, tokens and cost, over the last 30 days.", alt: "Dashboard with 3.8K conversations in 30 days and a daily activity chart" },
  { id: "inbox", shot: "inbox", title: "Step in when it matters", body: "Every channel in one list. Open a thread, take over from the agent, and hand it back when you're done.", alt: "Inbox with a conversation where a person has taken over from the agent" },
  { id: "customers", shot: "contacts", title: "Know your customers", body: "Everyone who has talked to your agents, with their channel, lead stage and last activity.", alt: "CRM listing customers across WhatsApp and Instagram with lead stages" },
  { id: "knowledge", shot: "knowledge", title: "Manage what it knows", body: "Add files and pages, and see which are indexed and ready to answer from.", alt: "Knowledge base with six documents marked ready" },
  { id: "agent", shot: "agent", title: "Set up an agent on one screen", body: "Persona, model, tools, knowledge, channels and workflows are tabs on the agent, with a test chat beside them.", alt: "Agent builder for Support Concierge" },
  { id: "analytics", shot: "analytics", title: "Find where it struggles", body: "Volume, reply times and cost, filtered by agent and channel.", alt: "Analytics with conversations, resolution rate and latency" },
  { id: "team", shot: "team", title: "Run it as a team", body: "Roles, API keys, webhooks, saved replies and an audit log, so more than one person can look after it.", alt: "Settings with five team members and their roles" },
];

export default function ProductPage() {
  return (
    <>
      <PageHero title="One workspace for the whole conversation." lead="Real screens from the running product, loaded with a month of demo data for a fictional furniture shop.">
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-[1320px] px-0"><Tour items={items} /></div>
      </Section>

      <Section className="pt-0">
        <SectionHead title="Build workflows without writing code." lead="Conditions, approvals and calls to your other tools, on a canvas." />
        <ShotFrame className="mt-14"><Shot name="workflow" alt="Workflow builder showing a refund approval flow" /></ShotFrame>
      </Section>
    </>
  );
}
