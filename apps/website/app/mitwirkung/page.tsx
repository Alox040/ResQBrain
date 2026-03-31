import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { participationContent, survey } from "@/lib/site";

export default function MitwirkungPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{participationContent.hero.subtitle}</p>
            <h1 className="hero-title">{participationContent.hero.title}</h1>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{participationContent.hero.text}</p>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={participationContent.why.title} />
              <p className="body-text muted-text">{participationContent.why.text}</p>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={participationContent.survey.title} />
              <p className="body-text muted-text">{participationContent.survey.text}</p>
              <div>
                <ButtonLink href={survey.href}>{survey.label}</ButtonLink>
              </div>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={participationContent.additional.title} />
              <ul className="stack stack--sm">
                {participationContent.additional.items.map((item) => (
                  <li key={item} className="body-text muted-text">
                    {item}
                  </li>
                ))}
              </ul>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{participationContent.note.text}</p>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
