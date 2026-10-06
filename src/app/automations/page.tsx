import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Button, Facts, Section, SectionHead, Shot, ShotFrame } from "@/components/ui";
import { N8nDiagram, NodeLibrary, TestsVisual } from "@/components/visuals/automation-bits";
import { appLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Automations", description: "A visual workflow builder, n8n tools, human approval and regression tests for your agents." };

export default function AutomationsPage() {
  return (
    <>
      <PageHero title="Agents that do things, not only answer." lead="Build a workflow on a canvas, run it in test mode, then publish. Or hand the work to n8n.">
        <Button href={appLinks.signup} external size="lg">Start free trial</Button>
        <Button href="/developers" variant="secondary" size="lg">API and webhooks</Button>
      </PageHero>

      <Section>
        <ShotFrame><Shot name="workflow" alt="Workflow builder: a refund request is checked, then approved by a person or handled automatically" /></ShotFrame>
        <p className="mt-4 text-sm text-faint">The real workflow builder. A refund request branches on a condition and can wait for a person to approve it.</p>
      </Section>

      <Section className="pt-0">
        <SectionHead title="Twelve building blocks, and no scripts." lead="Conditions and transforms are whitelisted operations, so a workflow can't run arbitrary code." />
        <div className="mt-14"><NodeLibrary /></div>
      </Section>

      <Section className="pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <SectionHead title="Let n8n do the heavy lifting." lead="Attach an n8n workflow to an agent as a tool. Calls are signed in both directions, and a workflow that doesn't verify the signature can't be attached." />
          <N8nDiagram />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="lg:order-2"><SectionHead title="Test before you publish." lead="Write test cases for agents and workflows. A workflow can be required to pass them before it goes live." /></div>
          <div className="lg:order-1"><TestsVisual /></div>
        </div>
      </Section>

      <Section className="pt-0">
        <Facts
          items={[
            { title: "A person approves risky steps", body: "An approval pauses the run. It appears in the inbox and carries on when someone approves or rejects it." },
            { title: "Versions and diff", body: "Every publish is a version. Compare two, send one for review, or roll back." },
            { title: "Capped runs", body: "Steps, tool calls, run time and cost are limited per run, so a runaway loop stops itself." },
          ]}
        />
      </Section>
    </>
  );
}
