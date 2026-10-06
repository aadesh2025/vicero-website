import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Button, Section } from "@/components/ui";
import { appLinks, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Talk to the Vicero team about your use case." };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Tell us what your agent should do." lead="Questions about plans, channels, self-hosting or a custom setup? We reply personally." />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
          <ContactForm />
          <div className="space-y-8">
            <div className="border-t border-text/80 pt-5">
              <h2 className="font-display text-xl font-bold">Email</h2>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block font-semibold text-accent underline underline-offset-4">{CONTACT_EMAIL}</a>
            </div>
            <div className="border-t border-text/80 pt-5">
              <h2 className="font-display text-xl font-bold">Rather just try it?</h2>
              <p className="mt-2 text-muted">Start a free 10-day trial. No card and no call.</p>
              <Button href={appLinks.signup} external className="mt-4">Start free trial</Button>
            </div>
            <div className="border-t border-text/80 pt-5">
              <h2 className="font-display text-xl font-bold">Already a customer?</h2>
              <p className="mt-2 text-muted">Write from the address you signed up with. Priority plans get priority replies.</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
