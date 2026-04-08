import { ContributionCard } from "@/components/cards/contribution-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { routes } from "@/lib/routes";
import { content } from "@/lib/site/content";

export function ContributionSection() {
  const { mitwirkung } = content;
  const { cta } = mitwirkung;

  const surveyDescription = `${cta.description} · Stand: ${cta.date}`;

  const cards = [
    {
      title: cta.badge,
      description: surveyDescription,
      href: cta.href,
      linkLabel: cta.label,
      external: true as const,
    },
    {
      title: mitwirkung.title,
      description: mitwirkung.text,
      href: routes.mitwirkung,
      linkLabel: content.hero.ctaPrimary.label,
      external: false as const,
    },
  ];

  return (
    <section
      id="contribution"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="space-y-12">
          <SectionHeader title={mitwirkung.title} />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-2">
            {cards.map((card) => (
              <ContributionCard
                key={card.title}
                title={card.title}
                description={card.description}
                href={card.href}
                linkLabel={card.linkLabel}
                external={card.external}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
