"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import Link from "next/link";

export type FooterCol = { title: string; links: { label: string; href: string }[] };

function A({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = "flex min-h-11 items-center text-muted transition-colors hover:text-text lg:min-h-0";
  return href.startsWith("http") ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}

/** Tablet and up: link columns. Phone: one collapsible group per column. */
export function FooterLinks({ cols }: { cols: FooterCol[] }) {
  return (
    <>
      <div className="hidden grid-cols-4 gap-8 md:grid">
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-display text-base font-bold">{c.title}</h3>
            <ul className="mt-4 space-y-3">{c.links.map((l) => <li key={l.label}><A href={l.href}>{l.label}</A></li>)}</ul>
          </div>
        ))}
      </div>
      <Accordion.Root type="multiple" className="border-t border-border md:hidden">
        {cols.map((c) => (
          <Accordion.Item key={c.title} value={c.title} className="border-b border-border">
            <Accordion.Header>
              <Accordion.Trigger className="group flex min-h-12 w-full items-center justify-between font-display text-base font-bold">
                {c.title}
                <Plus aria-hidden="true" className="h-4 w-4 transition-transform group-data-[state=open]:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-2 data-[state=closed]:hidden">
              <ul>{c.links.map((l) => <li key={l.label}><A href={l.href}>{l.label}</A></li>)}</ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
}

