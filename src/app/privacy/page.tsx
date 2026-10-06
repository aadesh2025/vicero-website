import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <Legal title="Privacy policy">
      <p>This site does not set tracking cookies. It stores one preference in your browser — your light or dark theme.</p>
      <p>If you use the contact form, your message is composed in your own email app and sent to {CONTACT_EMAIL}; we use it only to reply.</p>
      <p>The Vicero application has its own data handling, covered by the terms you accept when creating a workspace.</p>
    </Legal>
  );
}
