import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Button, ChannelChip, Section, SectionHead } from "@/components/ui";
import { ChannelHub } from "@/components/visuals/channel-hub";
import { InstagramPhone, WhatsAppPhone, WidgetOnSite } from "@/components/visuals/phones";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Channels", description: "One agent on your website, WhatsApp, Instagram, Messenger, Telegram, Slack, Discord and email." };

const channels = [
  { id: "widget", label: "Website widget", body: "One script tag. It runs in a Shadow DOM, so your site's CSS can't break it, and replies stream in as they're written.", plan: "All plans" },
  { id: "whatsapp", label: "WhatsApp", body: "Signed inbound webhooks, and the 24-hour service window is tracked so you don't message outside it by accident.", plan: "Pro and Business" },
  { id: "instagram", label: "Instagram", body: "Answer direct messages from the same agent and documents, with hand-off to your team.", plan: "Pro and Business" },
  { id: "facebook", label: "Messenger", body: "Page conversations land in the shared inbox with their full history.", plan: "Pro and Business" },
  { id: "telegram", label: "Telegram", body: "Add a bot token and conversations arrive. The webhook is registered for you.", plan: "Business" },
  { id: "slack", label: "Slack", body: "Let your team ask the agent in the place they already work.", plan: "Business" },
  { id: "discord", label: "Discord", body: "Community support with the same grounded answers.", plan: "Business" },
  { id: "email", label: "Email", body: "Threaded replies from a support address, with the same hand-off.", plan: "Business" },
] as const;

export default function ChannelsPage() {
  return (
    <>
      <PageHero
        wide
        title="Write it once. Answer everywhere."
        lead="Set up the agent and its documents one time, then connect as many channels as your plan allows."
        visual={
          <div className="relative mx-auto flex max-w-[600px] justify-center">
            <WhatsAppPhone className="-rotate-3" />
            <InstagramPhone className="-ml-12 mt-14 hidden rotate-3 sm:block" />
          </div>
        }
      >
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/pricing" variant="secondary" size="lg">Channels by plan</Button>
      </PageHero>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead title="One agent, one set of documents, one inbox." lead="Every channel runs the same agent, so an answer on WhatsApp matches the answer on your website." />
          <ChannelHub />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <WidgetOnSite />
          <SectionHead title="On your own site, too." lead="The widget sits in the corner of any page. A visitor asks, and the answer names the document it came from." />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="divide-y divide-border border-y border-text/80">
          {channels.map((c) => (
            <div key={c.id} className="grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-[220px_1fr_160px]">
              <div><ChannelChip id={c.id} label={c.label} /></div>
              <p className="leading-relaxed text-muted">{c.body}</p>
              <p className="font-semibold md:text-right">{c.plan}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
