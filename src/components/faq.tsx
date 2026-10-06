"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="item-0" className="border-t border-text/80">
      {items.map((f, i) => (
        <Accordion.Item key={f.q} value={`item-${i}`} className="border-b border-border">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left font-display text-xl font-bold">
              {f.q}
              <Plus aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-data-[state=open]:rotate-45" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden pb-5 pr-10 leading-relaxed text-muted data-[state=closed]:hidden">{f.a}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
