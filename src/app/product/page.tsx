import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Tour, type TourItem } from "@/components/tour";
import { Button, Section, SectionHead, Shot, ShotFrame } from "@/components/ui";
import { WorkflowSteps } from "@/components/workflow-steps";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Product", description: "Dashboard, inbox, customers, knowledge, workflows, analytics and team access: the whole Vicero workspace." };

const items: TourItem[] = [
  { id: "dashboard", shot: "dashboard", title: "See what your agents did", body: "Conversations, how many were resolved without a person, tokens and cost, over the last 30 days.", alt: "Dashboard with 3.8K conversations in 30 days and a daily activity chart" , crop: { zoom: 2.08, x: 18.2, y: 9, ratio: "4 / 3.3" } },
  { id: "inbox", shot: "inbox", title: "Step in when it matters", body: "Every channel in one list. Open a thread, take over from the agent, and hand it back when you're done.", alt: "Inbox with a conversation where a person has taken over from the agent" , crop: { zoom: 1.78, x: 42.2, y: 13, ratio: "1 / 1" } },
  { id: "customers", shot: "contacts", title: "Know your customers", body: "Everyone who has talked to your agents, with their channel, lead stage and last activity.", alt: "CRM listing customers across WhatsApp and Instagram with lead stages" , crop: { zoom: 1.55, x: 19, y: 10 } },
  { id: "knowledge", shot: "knowledge", title: "Manage what it knows", body: "Add files and pages, and see which are indexed and ready to answer from.", alt: "Knowledge base with six documents marked ready" , crop: { zoom: 1.55, x: 19, y: 10 } },
  { id: "agent", shot: "agent", title: "Set up an agent on one screen", body: "Persona, model, tools, knowledge, channels and workflows are tabs on the agent, with a test chat beside them.", alt: "Agent builder for Support Concierge" , crop: { zoom: 1.5, x: 19, y: 8 } },
  { id: "analytics", shot: "analytics", title: "Find where it struggles", body: "Volume, reply times and cost, filtered by agent and channel.", alt: "Analytics with conversations, resolution rate and latency" , crop: { zoom: 1.6, x: 19, y: 8 } },
  { id: "team", shot: "team", title: "Run it as a team", body: "Roles, API keys, webhooks, saved replies and an audit log, so more than one person can look after it.", alt: "Settings with five team members and their roles" , crop: { zoom: 1.5, x: 19, y: 4 } },
];

export default function ProductPage() {
  return (
    <>
      <PageHero title="One workspace for the whole conversation." lead="Real screens from the running product, loaded with a month of demo data for a fictional furniture shop.">
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
      </PageHero>

      <Section>
        <Tour items={items} />
      </Section>

      <Section className="pt-0">
        <SectionHead title="Build workflows without writing code." lead="Conditions, approvals and calls to your other tools, on a canvas." />
        <div className="mx-auto mt-10 max-w-md md:hidden"><WorkflowSteps /></div>
        <ShotFrame className="mt-14 hidden md:block"><Shot name="workflow" alt="Workflow builder showing a refund approval flow" /></ShotFrame>
      </Section>
    </>
  );
}
