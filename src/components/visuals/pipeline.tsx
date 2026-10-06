import type { ReactNode } from "react";

function Stage({ n, title, body, children }: { n: number; title: string; body: string; children: ReactNode }) {
  return (
    <li className="flex flex-col">
      <div aria-hidden="true" className="flex h-[132px] items-center justify-center overflow-hidden rounded-lg border border-border-strong bg-surface p-3">{children}</div>
      <p className="mt-4 font-display text-xl font-bold"><span className="mr-2 text-accent">{n}</span>{title}</p>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">{body}</p>
    </li>
  );
}

/** Five small pictures of what happens to a document, then a question. Decorative; the text carries the meaning. */
export function PipelineVisual() {
  return (
    <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      <Stage n={1} title="Add sources" body="PDF, Word, text, CSV, Markdown, a web page or pasted text.">
        <div className="w-full space-y-1.5">
          {[["PDF", "catalogue-2026.pdf"], ["MD", "shipping-policy.md"], ["URL", "lumenhome.in/care"]].map(([t, n]) => (
            <div key={n} className="flex items-center gap-2 rounded-md border border-border bg-bg px-2 py-1 text-[10.5px] font-semibold"><span className="rounded-sm bg-accent-soft px-1 text-[9px] text-accent">{t}</span>{n}</div>
          ))}
        </div>
      </Stage>
      <Stage n={2} title="Split" body="Documents are cut into passages that overlap, so each keeps its context.">
        <div className="w-full space-y-1.5">
          {[[90, 70, 80], [60, 85], [75, 55, 88]].map((row, i) => (
            <div key={i} className="flex gap-1.5">{row.map((w, j) => <i key={j} className="h-4 rounded-sm border border-border-strong bg-surface-2" style={{ width: `${w / 2.6}%`, flex: "none" }} />)}</div>
          ))}
        </div>
      </Stage>
      <Stage n={3} title="Index" body="Each passage becomes a vector, so meaning can be searched, not just words.">
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} className="h-3 w-3 rounded-full bg-accent-strong" style={{ opacity: 0.2 + ((i * 37) % 80) / 100 }} />
          ))}
        </div>
      </Stage>
      <Stage n={4} title="Retrieve" body="A question is matched by meaning and by keyword. Weak matches are dropped.">
        <div className="w-full space-y-1.5">
          <div className="rounded-md border border-border-strong bg-bg px-2 py-1 text-[10px] font-semibold">Do you ship to Chennai?</div>
          {[["91%", true], ["84%", false], ["62%", false]].map(([s, top]) => (
            <div key={s as string} className="flex items-center gap-2 text-[9.5px] font-bold">
              <span className="h-2 flex-1 rounded-full bg-surface-3"><i className={`block h-full rounded-full ${top ? "bg-hl" : "bg-accent-strong"}`} style={{ width: s as string }} /></span>{s as string}
            </div>
          ))}
        </div>
      </Stage>
      <Stage n={5} title="Answer" body="The agent replies from what it found and names the document.">
        <div className="w-full space-y-1.5">
          <div className="rounded-lg rounded-bl-sm bg-surface-3 px-2.5 py-1.5 text-[10.5px] leading-snug">Yes. Orders to Chennai arrive in 2–3 business days.</div>
          <span className="inline-flex items-center gap-1 text-[9.5px] text-faint"><i className="rounded-sm bg-hl px-1 font-semibold not-italic text-ink">Source</i>shipping-policy.md</span>
        </div>
      </Stage>
    </ol>
  );
}
