import type { Metadata } from "next";
import { AnswerSource } from "@/components/answer-source";
import { PageHero } from "@/components/page-hero";
import { Button, Facts, Section, SectionHead, Shot, ShotFrame } from "@/components/ui";
import { PipelineVisual } from "@/components/visuals/pipeline";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Knowledge", description: "Ground your agent in your own documents and get answers that name their source." };

export default function KnowledgePage() {
  return (
    <>
      <PageHero title="Answers that name their source." lead="Upload what your business already knows. Vicero finds the passage, answers from it, and says so when it can't.">
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/automations" variant="secondary" size="lg">See automations</Button>
      </PageHero>

      <Section>
        <AnswerSource />
      </Section>

      <Section className="pt-0">
        <SectionHead title="From file to answer." lead="What happens to a document, and then to a question." />
        <div className="mt-16"><PipelineVisual /></div>
      </Section>

      <Section className="pt-0">
        <SectionHead title="Manage the documents your agent reads." lead="Add files and web pages, and see which are indexed and ready." />
        <ShotFrame className="mt-14"><Shot name="knowledge" alt="A knowledge base with its documents and their status" /></ShotFrame>
      </Section>

      <Section className="pt-0">
        <Facts
          items={[
            { title: "It says when it doesn't know", body: "If the answer isn't in your documents, the agent offers a person instead of inventing a policy." },
            { title: "Documents can't give it orders", body: "Retrieved text is treated as data. A planted instruction inside a file is neutralised before the model sees it." },
            { title: "Web pages go through a guard", body: "URLs are fetched through an SSRF guard, redirects included, so ingestion can't be pointed at your own network." },
          ]}
        />
      </Section>
    </>
  );
}
