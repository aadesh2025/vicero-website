"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A dark code window with a title bar, optional right-hand slot and a copy button. Shiki HTML comes pre-rendered. */
export function CodePane({ title, badge, html, raw, className }: { title: ReactNode; badge?: ReactNode; html: string; raw: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable: the text is still selectable */
    }
  };
  return (
    <div className={cn("overflow-hidden rounded-lg border border-white/10 bg-ink text-[#e6edf3]", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5 text-sm font-semibold">{title}</div>
        <div className="flex items-center gap-2">
          {badge}
          <button type="button" onClick={copy} aria-label="Copy code" className="inline-flex min-h-11 items-center gap-1.5 rounded-sm px-3 text-xs font-semibold lg:min-h-0 lg:px-2 lg:py-1 text-white/70 hover:bg-white/10 hover:text-white">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div
        tabIndex={0}
        aria-label="Code sample"
        className="overflow-x-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:m-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
