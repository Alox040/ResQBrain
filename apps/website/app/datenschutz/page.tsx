import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { datenschutzContent } from "@/lib/site/legal/datenschutz";

export default function DatenschutzPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{datenschutzContent.updatedAt}</p>
            <h1 className="hero-title">{datenschutzContent.title}</h1>
            <p className="body-text muted-text section-lead">{datenschutzContent.intro}</p>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            {datenschutzContent.sections.map((section) => (
              <ContentCard key={section.heading}>
                <Stack gap="sm">
                  <SectionHeading title={section.heading} />
                  {section.body.map((entry) => (
                    <p key={entry} className="body-text muted-text prose">
                      {entry}
                    </p>
                  ))}
                </Stack>
              </ContentCard>
            ))}
          </div>
        </Container>
      </SectionFrame>
    </>
  );
}
