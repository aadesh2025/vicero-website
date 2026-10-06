"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodePane } from "./code-pane";

export type Snippet = { lang: string; label: string; html: string; raw: string };
export type Endpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  title: string;
  note: string;
  auth: "API key" | "Public key";
  requests: Snippet[];
  response: { status: string; label: string; html: string; raw: string };
};

const methodTone = { GET: "bg-success-soft text-success-text", POST: "bg-accent-soft text-accent" } as const;

/** Pick an endpoint, see the request in three languages and what comes back. */
export function ApiPlayground({ endpoints }: { endpoints: Endpoint[] }) {
  const [id, setId] = useState(endpoints[0].id);
  const ep = endpoints.find((e) => e.id === id) ?? endpoints[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div role="tablist" aria-label="Endpoints" aria-orientation="vertical" className="flex flex-col border-t border-text/80">
        {endpoints.map((e) => {
          const on = e.id === id;
          return (
            <button
              key={e.id}
              role="tab"
              aria-selected={on}
              onClick={() => setId(e.id)}
              className={cn("border-b border-border py-3.5 pr-3 text-left transition-colors", on ? "text-text" : "text-muted hover:text-text")}
            >
              <span className="flex items-center gap-2">
                <span className={cn("rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-bold", methodTone[e.method])}>{e.method}</span>
                <span className={cn("font-display text-lg font-bold", on && "text-accent")}>{e.title}</span>
              </span>
              <span className="mt-1 block truncate font-mono text-xs text-faint">{e.path}</span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0 space-y-4">
        <div>
          <p className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <span className={cn("rounded-sm px-1.5 py-0.5 text-xs font-bold", methodTone[ep.method])}>{ep.method}</span>
            <span className="font-semibold">{ep.path}</span>
            <span className="rounded-sm border border-border-strong px-1.5 py-0.5 font-sans text-xs text-muted">Auth: {ep.auth}</span>
          </p>
          <p className="mt-2 max-w-2xl text-muted">{ep.note}</p>
        </div>

        <Tabs.Root key={ep.id} defaultValue={ep.requests[0].lang}>
          <Tabs.List aria-label="Language" className="mb-2 flex gap-1">
            {ep.requests.map((s) => (
              <Tabs.Trigger
                key={s.lang}
                value={s.lang}
                className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:text-text data-[state=active]:border-text data-[state=active]:bg-text data-[state=active]:text-bg"
              >
                {s.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {ep.requests.map((s) => (
            <Tabs.Content key={s.lang} value={s.lang} className="focus-visible:outline-none">
              <CodePane title="Request" html={s.html} raw={s.raw} />
            </Tabs.Content>
          ))}
        </Tabs.Root>

        <CodePane
          title="Response"
          badge={<span className="rounded-sm bg-[#238636]/25 px-2 py-0.5 font-mono text-xs font-bold text-[#7ee787]">{ep.response.status}</span>}
          html={ep.response.html}
          raw={ep.response.raw}
        />
        <p className="text-sm text-faint">{ep.response.label}</p>
      </div>
    </div>
  );
}
