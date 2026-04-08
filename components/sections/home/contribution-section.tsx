import { ContributionCard } from "@/components/cards/contribution-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const contributionCards = [
  {
    title: "Take Survey",
    description:
      "Placeholder copy for survey participation. Final CTA text can be aligned in the content pass.",
    href: "/survey",
  },
  {
    title: "Give Feedback",
    description:
      "Placeholder copy for feedback submission. Final CTA text can be aligned in the content pass.",
    href: "/feedback",
  },
  {
    title: "Contact",
    description:
      "Placeholder copy for direct contact. Final CTA text can be aligned in the content pass.",
    href: "/contact",
  },
];

export function ContributionSection() {
  return (
    <section
      id="contribution"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Contribution"
            title="Section Title"
            subtitle="Section subtitle placeholder for contribution options."
          />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {contributionCards.map((card) => (
              <ContributionCard
                key={card.title}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
