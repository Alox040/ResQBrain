import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { content } from "@/lib/site/content";

export default function HomePage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
              alignItems: "start",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            }}
          >
            <Stack gap="md">
              <span className="badge badge--hero">{content.hero.badge}</span>
              <h1 className="hero-title">{content.hero.headline}</h1>
              <p className="body-text muted-text section-lead">{content.hero.subline}</p>
              <div className="cta-actions">
                <ButtonLink href={content.hero.ctaPrimary.href} size="lg">
                  {content.hero.ctaPrimary.label}
                </ButtonLink>
                <ButtonLink
                  href={content.hero.ctaSecondary.href}
                  variant="secondary"
                  size="lg"
                  external={content.hero.ctaSecondary.external}
                >
                  {content.hero.ctaSecondary.label}
                </ButtonLink>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                {content.hero.hints.map((hint) => (
                  <span key={hint} className="badge">
                    {hint}
                  </span>
                ))}
              </div>
            </Stack>

            <ContentCard>
              <Stack gap="md">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
                  <span className="badge">{content.mitwirkung.cta.badge}</span>
                  <span className="eyebrow muted-text">Stand: {content.mitwirkung.cta.date}</span>
                </div>
                <p className="body-text muted-text">{content.mitwirkung.cta.description}</p>
                <div className="status-cards-grid">
                  {content.status.cards.map((item) => (
                    <div key={item} className="card card--nested">
                      <p className="small-text status-card-label">{item}</p>
                    </div>
                  ))}
                </div>
              </Stack>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <Stack gap="md">
            <Stack gap="sm">
              <SectionHeading title={content.problem.title} />
              <p className="body-text muted-text section-intro">{content.problem.intro}</p>
            </Stack>
            <div className="cards-grid">
              {content.problem.cards.map((card) => (
                <ContentCard key={card.headline}>
                  <Stack gap="sm">
                    <h2 className="card-heading">{card.headline}</h2>
                    <p className="body-text muted-text">{card.text}</p>
                  </Stack>
                </ContentCard>
              ))}
            </div>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            }}
          >
            <ContentCard>
              <Stack gap="md">
                <SectionHeading title={content.idea.title} />
                <div className="cards-grid">
                  {content.idea.cards.map((card) => (
                    <div key={card.headline} className="card card--nested">
                      <Stack gap="sm">
                        <h2 className="card-heading">{card.headline}</h2>
                        <p className="body-text muted-text">{card.text}</p>
                      </Stack>
                    </div>
                  ))}
                </div>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="md">
                <Stack gap="sm">
                  <SectionHeading title={content.projectGoal.title} />
                  <p className="body-text muted-text section-intro">{content.projectGoal.intro}</p>
                </Stack>
                <div className="cards-grid">
                  {content.projectGoal.items.map((item) => (
                    <div key={item.headline} className="card card--nested">
                      <Stack gap="sm">
                        <h2 className="card-heading">{item.headline}</h2>
                        <p className="body-text muted-text">{item.text}</p>
                      </Stack>
                    </div>
                  ))}
                </div>
              </Stack>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="md">
              <Stack gap="sm">
                <SectionHeading title={content.status.title} />
                <p className="body-text muted-text section-intro">{content.status.intro}</p>
              </Stack>
              <div className="status-cards-grid">
                {content.status.cards.map((item) => (
                  <div key={item} className="card card--nested">
                    <p className="small-text status-card-label">{item}</p>
                  </div>
                ))}
              </div>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <Stack gap="md">
            <Stack gap="sm">
              <SectionHeading title={content.audience.title} />
              <p className="body-text muted-text section-intro">{content.audience.intro}</p>
            </Stack>
            <div className="cards-grid">
              {content.audience.cards.map((item) => (
                <ContentCard key={item.title}>
                  <Stack gap="sm">
                    <h2 className="card-heading">{item.title}</h2>
                    <p className="body-text muted-text">{item.text}</p>
                  </Stack>
                </ContentCard>
              ))}
            </div>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <div
              style={{
                display: "grid",
                gap: "var(--space-5)",
                alignItems: "start",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              }}
            >
              <Stack gap="md">
                <Stack gap="sm">
                  <SectionHeading title={content.mitwirkung.title} />
                  <p className="body-text muted-text section-intro">{content.mitwirkung.text}</p>
                </Stack>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
                  <span className="badge">{content.mitwirkung.cta.badge}</span>
                  <span className="eyebrow muted-text">{content.mitwirkung.cta.description}</span>
                  <span className="eyebrow muted-text">Stand: {content.mitwirkung.cta.date}</span>
                </div>
              </Stack>
              <div className="cta-actions" style={{ alignSelf: "end" }}>
                <ButtonLink href={content.mitwirkung.cta.href} size="lg" external>
                  {content.mitwirkung.cta.label}
                </ButtonLink>
              </div>
            </div>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <Stack gap="md">
            <SectionHeading title={content.faq.title} />
            <div className="faq-accordion">
              {content.faq.items.map((item) => (
                <details key={item.question} className="card card--accordion faq-item">
                  <summary className="faq-question">
                    <span className="faq-question-text">{item.question}</span>
                  </summary>
                  <p className="faq-answer small-text muted-text">{item.answer}</p>
                </details>
              ))}
            </div>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <div
              style={{
                display: "grid",
                gap: "var(--space-5)",
                alignItems: "end",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              }}
            >
              <Stack gap="sm">
                <SectionHeading title={content.cta.title} />
                <p className="body-text muted-text section-intro">{content.cta.text}</p>
              </Stack>
              <div className="cta-actions" style={{ alignSelf: "end" }}>
                <ButtonLink href={content.cta.button.href} size="lg">
                  {content.cta.button.label}
                </ButtonLink>
              </div>
            </div>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
