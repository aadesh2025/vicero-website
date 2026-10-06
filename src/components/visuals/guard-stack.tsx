import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Message arrives", body: "Rate limited and size-checked before anything else happens.", guard: false },
  { title: "Blocked topics", body: "Topics you rule out are refused before the model is called.", guard: true },
  { title: "Retrieval", body: "Documents are data. Instructions hidden in them are neutralised.", guard: true },
  { title: "Model and tools", body: "Only the tools you attached, and every outbound fetch passes an SSRF guard.", guard: false },
  { title: "Output check", body: "Secrets are redacted and unsafe replies are replaced.", guard: true },
  { title: "Reply, or a person", body: "If it isn't sure, a human takes over with the thread.", guard: false },
];

/** The path a message takes. Guards are marked, because they are the point. */
export function GuardStack() {
  return (
    <ol className="grid gap-3 lg:grid-cols-6" aria-label="How a message is checked on its way to a reply">
      {STEPS.map((s, i) => (
        <li key={s.title} className={cn("relative rounded-lg border p-4", s.guard ? "border-accent bg-accent-soft" : "border-border-strong bg-surface")}>
          {s.guard && <span className="absolute -top-2.5 left-3 rounded-sm bg-accent-strong px-1.5 py-0.5 text-[11px] font-semibold text-on-accent">Check in code</span>}
          <p className="font-display text-lg font-bold leading-tight">{s.title}</p>
          <p className="mt-2 text-sm leading-snug text-muted">{s.body}</p>
          {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg text-xs lg:flex">›</span>}
        </li>
      ))}
    </ol>
  );
}
