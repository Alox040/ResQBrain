import { ContributionCard } from "@/components/cards/contribution-card";
import { Container } from "@/components/layout/container";
import { contactInfo, contactPageContent } from "@/lib/site/contact-page";

export function ContributionContactSection() {
  const { contact, note } = contactPageContent;

  return (
    <section
      id="contact-contribution"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="mx-auto max-w-xl space-y-6">
          <ContributionCard
            title={contact.title}
            description={contact.text}
            href={contactInfo.email.href}
            linkLabel={contact.cta}
          />

          <p className="text-center text-sm leading-7 text-[var(--color-text-secondary)] md:text-left">
            <span className="font-medium text-[var(--color-text-primary)]">
              {contactInfo.email.label}
            </span>
            <span className="mx-2 text-[var(--color-border)]">·</span>
            {note}
          </p>
        </div>
      </Container>
    </section>
  );
}
