import type { Metadata } from "next";
import { Legal } from "@/components/legal";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
  return (
    <Legal title="Terms of service">
      <p>These are placeholder terms for the marketing site. The terms governing use of the Vicero service are presented when you create an account.</p>
      <p>Plans, limits and prices shown on this site describe the service at the time of writing and may change.</p>
    </Legal>
  );
}
