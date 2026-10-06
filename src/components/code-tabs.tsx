"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type CodeTab = { label: string; code: string };

/** Always-dark code window (reads the same in both themes), with tabs and a copy button. */
export function CodeTabs({ tabs, className }: { tabs: CodeTab[]; className?: string }) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = tabs[i];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context): the text is still selectable */
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-white/10 bg-ink text-[#e8e8ee]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3">
        <div role="tablist" className="flex">
          {tabs.map((t, idx) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={idx === i}
              onClick={() => setI(idx)}
              className={cn("px-4 py-3 text-sm font-semibold transition", idx === i ? "text-white shadow-[inset_0_-2px_0_rgb(96,165,250)]" : "text-white/50 hover:text-white/80")}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={copy} aria-label="Copy code" className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${tab.label} code sample`} className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed"><code>{tab.code}</code></pre>
    </div>
  );
}

