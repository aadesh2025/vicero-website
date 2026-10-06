"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Doc = { file: string; before: string; cited: string; after: string };
type QA = { q: string; a: string };

// A scripted example; the copy mirrors the demo knowledge base used for the product screenshots.
const DOCS: Doc[] = [
  { file: "shipping-policy.md", before: "We ship across India. ", cited: "Metro cities, including Chennai, receive orders in 2–3 business days. Orders above ₹999 ship free.", after: " Below that, a flat ₹60 fee applies." },
  { file: "returns-and-refunds.md", before: "", cited: "Items can be returned within 14 days of delivery if they are unused and in the original packaging.", after: " Refunds go to the original payment method within 3–5 business days." },
  { file: "showroom-and-hours.md", before: "Our showroom is at ", cited: "12 Cathedral Road, Chennai. It is open Monday to Saturday, 10am to 7pm.", after: " Furniture is available in oak, walnut and ash." },
];

const QAS: QA[] = [
  { q: "Do you ship to Chennai?", a: "Yes. Orders to Chennai arrive in 2–3 business days, and shipping is free above ₹999." },
  { q: "Can I return something I've opened?", a: "Only unused items in their original packaging, within 14 days of delivery." },
  { q: "Where is your showroom?", a: "12 Cathedral Road, Chennai. Open Monday to Saturday, 10am to 7pm." },
];

type Phase = "asked" | "typing" | "answered";

export function AnswerSource({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("answered");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ask = (i: number) => {
    timers.current.forEach(clearTimeout);
    setActive(i);
    if (reduce) {
      setPhase("answered");
      return;
    }
    setPhase("asked");
    timers.current = [setTimeout(() => setPhase("typing"), 650), setTimeout(() => setPhase("answered"), 1700)];
  };

  const qa = QAS[active];
  const answered = phase === "answered";

  return (
    <div className={className}>
      <div className="grid overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[0_30px_60px_-30px_rgb(13_14_18/0.35)] lg:grid-cols-[1.05fr_1fr]">
        {/* Your documents */}
        <div className="lg:border-r lg:border-border">
          <div className="flex items-baseline justify-between border-b border-border px-6 py-3.5">
            <p className="font-display text-base font-bold">Your documents</p>
            <p className="text-sm text-faint">3 files</p>
          </div>
          <div className="divide-y divide-border">
            {DOCS.map((d, i) => {
              const on = i === active && answered;
              return (
                <div key={d.file} className={cn("px-5 py-4 sm:px-6 sm:py-5", i !== active && "max-lg:hidden")}>
                  <p className={cn("text-sm font-semibold", i === active ? "text-text" : "text-faint")}>{d.file}</p>
                  <p className="mt-2 text-[15px] leading-7">
                    {d.before}
                    <mark
                      key={`${i}-${on}-${active}`}
                      className={cn("box-decoration-clone bg-no-repeat px-0.5", on ? "animate-sweep text-ink" : "text-inherit")}
                      style={{
                        backgroundColor: "transparent",
                        backgroundImage: "linear-gradient(rgb(var(--hl)), rgb(var(--hl)))",
                        backgroundSize: on ? "100% 100%" : "0% 100%",
                        backgroundPosition: "left center",
                      }}
                    >
                      {d.cited}
                    </mark>
                    {d.after}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* The conversation */}
        <div className="flex flex-col max-lg:order-first max-lg:border-b max-lg:border-border">
          <div className="flex items-baseline justify-between border-b border-border px-5 py-3.5 sm:px-6">
            <p className="font-display text-base font-bold">Chat on WhatsApp</p>
            <p className="text-sm text-faint">Aarav Mehta</p>
          </div>
          <div className="flex min-h-[190px] flex-1 flex-col gap-3 px-5 py-5 sm:min-h-[230px] sm:px-6 sm:py-6" aria-live="polite">
            <div className="max-w-[85%] self-end rounded-xl rounded-br-sm bg-accent-strong px-4 py-3 text-[15px] leading-snug text-on-accent">{qa.q}</div>
            {phase === "typing" && (
              <div role="status" aria-label="Vicero is typing" className="flex w-16 items-center justify-center gap-1 self-start rounded-xl rounded-bl-sm bg-surface-2 py-3.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-caret-blink rounded-full bg-faint" style={{ animationDelay: `${d * 160}ms` }} />
                ))}
              </div>
            )}
            {answered && (
              <div className="max-w-[88%] self-start">
                <div className="rounded-xl rounded-bl-sm bg-surface-2 px-4 py-3 text-[15px] leading-snug">{qa.a}</div>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <span className="rounded-sm bg-hl px-1.5 py-0.5 font-semibold text-ink">Source</span>
                  {DOCS[active].file}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="-mx-5 mt-4 flex items-center gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-5 lg:flex-wrap lg:gap-x-3 lg:gap-y-2 lg:px-0">
        <p className="mr-1 shrink-0 text-sm font-semibold">Ask it:</p>
        {QAS.map((x, i) => (
          <button
            key={x.q}
            type="button"
            aria-pressed={i === active}
            onClick={() => ask(i)}
            className={cn(
              "min-h-11 shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors lg:min-h-0",
              i === active ? "border-text bg-text text-bg" : "border-border-strong hover:border-text",
            )}
          >
            {x.q}
          </button>
        ))}
        <p className="hidden basis-full text-sm text-faint lg:ml-auto lg:block lg:basis-auto">A scripted example of how answers and sources appear.</p>
      </div>
      <p className="mt-3 text-sm text-faint lg:hidden">A scripted example of how answers and sources appear.</p>
    </div>
  );
}
