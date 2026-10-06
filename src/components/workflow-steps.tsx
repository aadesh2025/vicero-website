import { CheckCheck, GitBranch, MessageSquare, Play, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const STEPS: { title: string; body: string; Icon: ComponentType<{ className?: string }>; bar: string }[] = [
  { title: "A customer asks for a refund", body: "The workflow starts from the chat, on any channel.", Icon: Play, bar: "bg-success" },
  { title: "Look up the order", body: "An n8n step fetches the order from your shop.", Icon: Wrench, bar: "bg-warn" },
  { title: "Is it over ₹5,000?", body: "A condition splits small refunds from large ones.", Icon: GitBranch, bar: "bg-accent-strong" },
  { title: "A manager approves", body: "Large refunds pause in the inbox until a person decides.", Icon: CheckCheck, bar: "bg-hl" },
  { title: "Refund started", body: "The customer is told, and the chat is closed.", Icon: MessageSquare, bar: "bg-accent-strong" },
];

/** Small-screen version of the workflow canvas: the same flow as a readable sequence. */
export function WorkflowSteps({ className }: { className?: string }) {
  return (
    <ol className={cn("relative space-y-3", className)} aria-label="Refund approval workflow, step by step">
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface"><s.Icon className="h-5 w-5" aria-hidden="true" /></span>
            {i < STEPS.length - 1 && <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border-strong" />}
          </div>
          <div className="flex-1 overflow-hidden rounded-lg border border-border-strong bg-surface">
            <div className="flex">
              <span aria-hidden="true" className={cn("w-1 shrink-0", s.bar)} />
              <div className="p-3.5">
                <p className="font-display text-base font-bold leading-tight">{s.title}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{s.body}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
