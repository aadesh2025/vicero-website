import type { Metadata } from "next";
import { ApiPlayground } from "@/components/dev/api-playground";
import { CodePane } from "@/components/dev/code-pane";
import { EventExplorer } from "@/components/dev/event-explorer";
import { PageHero } from "@/components/page-hero";
import { Button, Facts, Section, SectionHead } from "@/components/ui";
import { WidgetOnSite } from "@/components/visuals/phones";
import { EMBED, getEndpoints, getEvents, VERIFY } from "@/lib/dev-content";
import { highlight } from "@/lib/highlight";
import { DOCS_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Developers", description: "A REST API, signed webhooks and a one-line widget, with examples you can read and copy." };

export default async function DevelopersPage() {
  const [endpoints, events, verifyHtml, embedHtml, heroHtml] = await Promise.all([
    getEndpoints(),
    getEvents(),
    highlight(VERIFY, "javascript"),
    highlight(EMBED, "html"),
    highlight(`curl https://YOUR_API_HOST/v1/agents \\\n  -H "Authorization: Bearer YOUR_API_KEY"`, "bash"),
  ]);

  return (
    <>
      <PageHero
        title="An API that behaves like infrastructure."
        lead="Bearer-key REST under /v1, typed errors, signed webhooks, and a widget you embed with one script tag."
        visual={
          <div className="space-y-4">
            <CodePane title="List your agents" html={heroHtml} raw={`curl https://YOUR_API_HOST/v1/agents \\\n  -H "Authorization: Bearer YOUR_API_KEY"`} />
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                ["REST", "JSON over /v1"],
                ["Webhooks", "9 signed events"],
                ["Widget", "one script tag"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-md border border-border-strong bg-surface px-3 py-2.5">
                  <p className="font-display text-base font-bold">{t}</p>
                  <p className="text-faint">{s}</p>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <Button href={DOCS_URL} external size="lg">Read the docs</Button>
        <Button href="/pricing" variant="secondary" size="lg">API access by plan</Button>
      </PageHero>

      <Section>
        <SectionHead title="Try the API without leaving the page." lead="Pick an endpoint. The request is shown in cURL, JavaScript and Python, with the response it returns. Examples are abridged." />
        <div className="mt-12">
          <ApiPlayground endpoints={endpoints} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHead title="Put it on your website with one tag." lead="The widget has no dependencies and runs in a Shadow DOM, so your site's CSS can't break it. The public key is safe to leave in client-side HTML." />
            <CodePane className="mt-8" title="Paste before </body>" html={embedHtml} raw={EMBED} />
          </div>
          <WidgetOnSite />
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHead title="Know the moment something happens." lead="Register an endpoint and Vicero sends a signed POST for the events you choose. Pick one to see what arrives." />
        <div className="mt-12">
          <EventExplorer events={events} verifyHtml={verifyHtml} verifyRaw={VERIFY} />
        </div>
      </Section>

      <Section className="pt-0">
        <Facts
          items={[
            { title: "Typed errors", body: "Every failure returns an error with a code, a message and details, never a stack trace." },
            { title: "Rate limits", body: "Public endpoints are rate limited, and the limits are documented." },
            { title: "Streaming", body: "Server-sent events stream tokens as they are written, and a WebSocket drives the live inbox." },
          ]}
        />
      </Section>
    </>
  );
}
