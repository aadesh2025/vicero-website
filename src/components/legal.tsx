import type { ReactNode } from "react";
import { Container } from "./ui";

/** Placeholder legal layout. The text passed in is a stub the owner must replace before launch. */
export function Legal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container className="max-w-3xl py-20">
      <p className="rounded-md border border-warn/40 bg-warn-soft px-4 py-3 text-sm text-warn-text">
        Placeholder text. Have this reviewed and replaced before launch.
      </p>
      <h1 className="mt-8 font-display text-4xl font-extrabold">{title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">{children}</div>
    </Container>
  );
}

