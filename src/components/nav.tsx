"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { appLinks, DOCS_URL, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" aria-label="Vicero home" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
              className={cn(
                "py-1 text-[15px] font-medium transition-colors",
                path === n.href ? "text-text underline decoration-2 underline-offset-[10px]" : "text-muted hover:text-text",
              )}
            >
              {n.label}
            </Link>
          ))}
          <a href={DOCS_URL} className="py-1 text-[15px] font-medium text-muted transition-colors hover:text-text">Docs</a>
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button href="/login" variant="ghost">Log in</Button>
          <Button href={appLinks.signup} external>Start free trial</Button>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-bg px-5 pb-6 pt-2 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-border py-3.5 text-lg font-medium">
                {n.label}
              </Link>
            ))}
            <a href={DOCS_URL} className="border-b border-border py-3.5 text-lg font-medium">Docs</a>
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button href="/login" variant="secondary">Log in</Button>
            <Button href={appLinks.signup} external>Free trial</Button>
          </div>
        </div>
      )}
    </header>
  );
}
