"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Buttons: squared, flat, no glow ─────────────────────────────────────── */
type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ink";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
};

export function Button({ href, children, variant = "primary", size = "md", className, external }: BtnProps) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors",
    size === "lg" ? "h-12 px-6 text-base" : "h-11 px-4 text-sm sm:h-10",
    variant === "primary" && "bg-accent-strong text-on-accent hover:bg-accent-2",
    variant === "secondary" && "border border-text/80 text-text hover:bg-text hover:text-bg",
    variant === "ink" && "bg-ink text-white hover:bg-black",
    variant === "ghost" && "text-muted hover:text-text",
    className,
  );
  return external ? (
    <a href={href} className={cls}>{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

/* ── Layout ──────────────────────────────────────────────────────────────── */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("py-16 md:py-24 lg:py-36", className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** Left-aligned section heading. Sentence case, no labels above it. */
export function SectionHead({ title, lead, className }: { title: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <h2 className="font-display text-[clamp(1.9rem,4.6vw,3rem)] font-bold leading-[1.06] text-balance">{title}</h2>
      {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed sm:mt-5 sm:text-lg text-muted [.text-center_&]:mx-auto">{lead}</p>}
    </div>
  );
}

/** Facts: a hairline-ruled grid, a title and a sentence each. Used instead of a grid of cards. */
export function Facts({ items, cols = 3, className }: { items: { title: string; body: ReactNode }[]; cols?: 2 | 3 | 4; className?: string }) {
  return (
    <div className={cn("grid gap-x-10 gap-y-8 md:gap-y-10", cols === 2 && "md:grid-cols-2", cols === 3 && "md:grid-cols-2 lg:grid-cols-3", cols === 4 && "md:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((f) => (
        <div key={f.title} className="border-t border-text/80 pt-5">
          <h3 className="font-display text-lg font-bold md:text-xl">{f.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

/** A plain bordered surface. No shadow, no icon tile. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-card border border-border bg-surface p-6", className)}>{children}</div>;
}

/* ── Product imagery ─────────────────────────────────────────────────────── */
/** Both theme variants are rendered; CSS (`dark:`) picks one, so there is no flash on load. */
export function Shot({ name, alt, priority, className }: { name: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <>
      <Image src={`/shots/light/${name}.png`} alt={alt} width={1440} height={900} priority={priority} className={cn("block h-auto w-full dark:hidden", className)} />
      <Image src={`/shots/dark/${name}.png`} alt={alt} width={1440} height={900} priority={priority} className={cn("hidden h-auto w-full dark:block", className)} />
    </>
  );
}

/** A quiet frame for real screenshots: hairline border, one soft shadow, no fake window chrome. */
/** A fixed-shape window onto a screenshot: shows its top part, optionally fading out at the bottom. */
export function CropShot({ name, alt, ratio = "16 / 9", fade, priority }: { name: string; alt: string; ratio?: string; fade?: boolean; priority?: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: ratio, ...(fade ? { maskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)" } : {}) }}
    >
      <Shot name={name} alt={alt} priority={priority} className="!h-full object-cover object-top" />
    </div>
  );
}

export function ShotFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[0_40px_80px_-40px_rgb(13_14_18/0.4)]", className)}>{children}</div>;
}

/* ── Channel names carry their own colour, only where a channel is named ─── */
const dot: Record<string, string> = {
  widget: "bg-ch-widget", whatsapp: "bg-ch-whatsapp", instagram: "bg-ch-instagram", facebook: "bg-ch-facebook",
  telegram: "bg-ch-telegram", slack: "bg-ch-slack", discord: "bg-ch-discord", email: "bg-ch-email",
};
const chipTone: Record<string, string> = {
  widget: "bg-ch-widget-soft text-ch-widget-text border-ch-widget/25",
  whatsapp: "bg-ch-whatsapp-soft text-ch-whatsapp-text border-ch-whatsapp/30",
  instagram: "bg-ch-instagram-soft text-ch-instagram-text border-ch-instagram/30",
  facebook: "bg-ch-facebook-soft text-ch-facebook-text border-ch-facebook/30",
  telegram: "bg-ch-telegram-soft text-ch-telegram-text border-ch-telegram/30",
  slack: "bg-ch-slack-soft text-ch-slack-text border-ch-slack/30",
  discord: "bg-ch-discord-soft text-ch-discord-text border-ch-discord/30",
  email: "bg-ch-email-soft text-ch-email-text border-ch-email/30",
};

export function ChannelChip({ id, label, className }: { id: string; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-semibold", chipTone[id], className)}>
      <span className={cn("h-2 w-2 rounded-full", dot[id])} />
      {label}
    </span>
  );
}

export function ChannelDot({ id }: { id: string }) {
  return <span aria-hidden="true" className={cn("mr-2 inline-block h-3 w-3 rounded-full align-baseline", dot[id])} />;
}

/**
 * A window onto part of a screenshot, zoomed to a region (x, y are the top-left of that region as a
 * percentage of the image, zoom is how many times larger than the container it is drawn). Used for
 * small screens, where the whole app would be unreadable but one panel of it is perfect.
 */
export function FocusShot({ name, alt, ratio = "5 / 4", zoom = 1.8, x = 0, y = 0, className }: { name: string; alt: string; ratio?: string; zoom?: number; x?: number; y?: number; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio: ratio }}>
      <div className="absolute left-0 top-0" style={{ width: `${zoom * 100}%`, transform: `translate(-${x}%, -${y}%)` }}>
        <Shot name={name} alt={alt} />
      </div>
    </div>
  );
}

/** Swipeable row on small screens (next card peeks in); a normal grid from `md` up. */
export function SnapRow({ children, className, cols = "md:grid-cols-3" }: { children: ReactNode; className?: string; cols?: string }) {
  return (
    <div className={cn("-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 no-scrollbar sm:-mx-8 sm:px-8 md:mx-0 md:grid md:gap-10 md:overflow-visible md:px-0 md:pb-0", cols, className)}>
      {children}
    </div>
  );
}
