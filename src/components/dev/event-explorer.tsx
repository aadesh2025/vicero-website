"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodePane } from "./code-pane";

export type WebhookEvent = { name: string; when: string; html: string; raw: string };

/** The nine events Vicero can send. Pick one to see the delivery your endpoint receives. */
export function EventExplorer({ events, verifyHtml, verifyRaw }: { events: WebhookEvent[]; verifyHtml: string; verifyRaw: string }) {
  const [name, setName] = useState(events[0].name);
  const ev = events.find((e) => e.name === name) ?? events[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div role="tablist" aria-label="Webhook events" aria-orientation="vertical" className="flex flex-col border-t border-text/80">
          {events.map((e) => {
            const on = e.name === name;
            return (
              <button
                key={e.name}
                role="tab"
                aria-selected={on}
                onClick={() => setName(e.name)}
                className={cn("flex items-center gap-2.5 border-b border-border py-2.5 text-left font-mono text-[13px] transition-colors", on ? "font-bold text-accent" : "text-muted hover:text-text")}
              >
                <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", on ? "bg-accent-strong" : "bg-border-strong")} />
                {e.name}
              </button>
            );
          })}
        </div>
        <div className="min-w-0 space-y-3">
          <p className="text-muted"><span className="font-mono font-semibold text-text">{ev.name}</span> fires when {ev.when}.</p>
          <CodePane
            title={<span className="font-mono text-xs text-white/80">POST https://your-app.example/hooks/vicero</span>}
            badge={<span className="hidden rounded-sm bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/70 sm:inline">X-Vicero-Signature: 9f3a…</span>}
            html={ev.html}
            raw={ev.raw}
          />
          <p className="text-sm text-faint">Example payload. The envelope is the same for every event; the contents of <code className="font-mono">data</code> vary.</p>
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h3 className="border-t border-text/80 pt-5 font-display text-2xl font-bold">Check the signature first</h3>
          <p className="mt-3 leading-relaxed text-muted">Compute an HMAC-SHA256 of the raw request body with your endpoint secret and compare it, in constant time, to the header. Do it before parsing the JSON.</p>
        </div>
        <CodePane title="Verify in Node" html={verifyHtml} raw={verifyRaw} />
      </div>
    </div>
  );
}
