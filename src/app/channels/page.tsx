import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Button, ChannelChip, Section, SectionHead } from "@/components/ui";
import { ChannelHub } from "@/components/visuals/channel-hub";
import { InstagramPhone, WhatsAppPhone, WidgetOnSite } from "@/components/visuals/phones";
import { appLinks, CHANNELS } from "@/lib/site";

export const metadata: Metadata = { title: "Channels", description: "One agent on your website, WhatsApp, Instagram, Messenger, Telegram, Slack, Discord and email." };

export default function ChannelsPage() {
  return (
    <>
      <PageHero
        wide
        title="Write it once. Answer everywhere."
        lead="Set up the agent and its documents one time, then connect as many channels as your plan allows."
        visual={
          <div
            className="relative mx-auto flex max-w-[600px] justify-center max-sm:h-[420px] max-sm:overflow-hidden"
            style={{ maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)" }}
          >
            <WhatsAppPhone className="-rotate-3" />
            <InstagramPhone className="-ml-12 mt-14 hidden rotate-3 sm:block" />
          </div>
        }
      >
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/pricing" variant="secondary" size="lg">Channels by plan</Button>
      </PageHero>

      <Section>
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          <SectionHead title="One agent, one set of documents, one inbox." lead="Every channel runs the same agent, so an answer on WhatsApp matches the answer on your website." />
          <ChannelHub />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <WidgetOnSite />
          <SectionHead title="On your own site, too." lead="The widget sits in the corner of any page. A visitor asks, and the answer names the document it came from." />
        </div>
      </Section>

      {/* On phones the channel picker above already shows each channel's details, so the list is for larger screens. */}
      <Section className="hidden pt-0 sm:block">
        <div className="divide-y divide-border border-y border-text/80">
          {CHANNELS.map((c) => (
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
