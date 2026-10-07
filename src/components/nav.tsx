"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { appLinks, DOCS_URL, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // While the menu is open: lock page scroll, close on Escape, keep Tab inside the menu, then return focus.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toggle = toggleRef.current;
    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []).concat(toggle ? [toggle] : []);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const els = focusables();
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" aria-label="Vicero home" className="inline-flex min-h-11 shrink-0 items-center">
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
          <Button href={appLinks.login} external variant="ghost">Log in</Button>
          <Button href={appLinks.signup} external>Start free trial</Button>
        </div>
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-strong"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* Rendered outside <header>: the header's backdrop blur would make this "fixed" panel size itself to the header instead of the screen. */}
    {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto overscroll-contain bg-bg px-5 pb-8 pt-2 sm:px-8 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={path === n.href ? "page" : undefined}
                className={cn("flex min-h-14 items-center border-b border-border font-display text-2xl font-bold", path === n.href && "text-accent")}
              >
                {n.label}
              </Link>
            ))}
            <a href={DOCS_URL} className="flex min-h-14 items-center border-b border-border font-display text-2xl font-bold">Docs</a>
          </nav>
          <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
            <Button href={appLinks.login} external variant="secondary" size="lg" className="w-full">Log in</Button>
            <Button href={appLinks.signup} external size="lg" className="w-full">Start free trial</Button>
          </div>
        </div>
      )}
    </>
  );
}
