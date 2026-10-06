import { ArrowRight, Bot, Braces, CheckCheck, Flag, GitBranch, Hourglass, MessageSquare, Repeat, Split, Wand2, Workflow, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const NODES: { name: string; body: string; Icon: ComponentType<{ className?: string }>; bar: string }[] = [
  { name: "Start and end", body: "Where a run begins and finishes.", Icon: Flag, bar: "bg-success" },
  { name: "Message", body: "Send text, with {{variables}} filled in.", Icon: MessageSquare, bar: "bg-accent-strong" },
  { name: "Condition", body: "Branch on a value: yes or no.", Icon: GitBranch, bar: "bg-accent-strong" },
  { name: "Switch", body: "Pick one of many branches.", Icon: Split, bar: "bg-accent-strong" },
  { name: "Set variable", body: "Remember something for later steps.", Icon: Braces, bar: "bg-muted" },
  { name: "Transform", body: "Change case, trim, join, count.", Icon: Wand2, bar: "bg-muted" },
  { name: "Loop", body: "Repeat for each item in a list.", Icon: Repeat, bar: "bg-muted" },
  { name: "Delay", body: "Wait, then carry on.", Icon: Hourglass, bar: "bg-muted" },
  { name: "Approval", body: "Pause until a person decides.", Icon: CheckCheck, bar: "bg-hl" },
  { name: "Tool", body: "Call an n8n workflow or an API.", Icon: Wrench, bar: "bg-warn" },
  { name: "Agent", body: "Hand a step to another agent.", Icon: Bot, bar: "bg-ai" },
  { name: "Sub-workflow", body: "Run another workflow as a step.", Icon: Workflow, bar: "bg-ai" },
];

export function NodeLibrary() {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {NODES.map((n) => (
        <li key={n.name} className="flex overflow-hidden rounded-md border border-border-strong bg-surface">
          <span aria-hidden="true" className={cn("w-1.5 shrink-0", n.bar)} />
          <div className="flex gap-2.5 p-3 sm:gap-3 sm:p-3.5">
            <n.Icon className="mt-0.5 h-4 w-4 shrink-0 text-text" />
            <div>
              <p className="font-display text-base font-bold leading-tight">{n.name}</p>
              <p className="mt-1 hidden text-sm leading-snug text-muted sm:block">{n.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

const TESTS: [string, "Passed" | "Failed", string?][] = [
  ["A refund under ₹5,000 skips approval", "Passed"],
  ["A refund over ₹5,000 asks a manager", "Passed"],
  ["An unknown order number ends politely", "Passed"],
  ["An angry customer is handed to a person", "Failed", "Expected a hand-off, the workflow replied instead."],
];

export function TestsVisual() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-lg border border-border-strong bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-base font-bold">Refund approval · tests</p>
        <span className="rounded-full bg-warn-soft px-2.5 py-0.5 text-xs font-semibold text-warn-text">Publish blocked</span>
      </div>
      <div className="divide-y divide-border">
        {TESTS.map(([t, s, note]) => (
          <div key={t} className="px-4 py-3">
            <div className="flex items-center gap-3 text-[14px]">
              <span className={cn("h-2.5 w-2.5 rounded-full", s === "Passed" ? "bg-success" : "bg-error")} />
              <span className="flex-1 font-medium">{t}</span>
              <span className={cn("text-xs font-bold", s === "Passed" ? "text-success-text" : "text-error-text")}>{s}</span>
            </div>
            {note && <p className="ml-[22px] mt-1 text-[13px] text-muted">{note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Box({ t, s, strong }: { t: string; s: string; strong?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-4 py-3", strong ? "border-accent bg-accent-soft" : "border-border-strong bg-surface")}>
      <p className="font-display text-base font-bold">{t}</p>
      <p className="text-sm text-muted">{s}</p>
    </div>
  );
}

function Link({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-6">
      <ArrowRight className="h-4 w-4 rotate-90 text-faint" />
      <span className="rounded-sm bg-hl px-1.5 py-0.5 text-[11px] font-semibold text-ink">{label}</span>
    </div>
  );
}

export function N8nDiagram() {
  return (
    <div aria-hidden="true" className="mx-auto flex w-full max-w-sm flex-col">
      <Box t="Vicero agent" s="asks for the order" strong />
      <Link label="signed call" />
      <Box t="n8n workflow" s="verifies the signature" />
      <Link label="your tools" />
      <Box t="Shopify, Sheets, email" s="whatever n8n connects" />
    </div>
  );
}
