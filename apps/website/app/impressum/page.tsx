import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { impressumContent } from "@/lib/site/legal/impressum";

export default function ImpressumPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{impressumContent.sectionTitle}</p>
            <h1 className="hero-title">{impressumContent.pageTitle}</h1>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            }}
          >
            <ContentCard>
              <Stack gap="md">
                <SectionHeading title={impressumContent.sectionTitle} />
                <p className="body-text muted-text">
                  <strong>{impressumContent.projectLabel}</strong>
                  <br />
                  {impressumContent.projectName}
                </p>
                <p className="body-text muted-text">
                  <strong>{impressumContent.responsibleLabel}</strong>
                  <br />
                  {impressumContent.responsibleName}
                </p>
                <p className="body-text muted-text">
                  <strong>{impressumContent.noteLabel}</strong>
                  <br />
                  {impressumContent.noteText}
                </p>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={impressumContent.contactLabel} />
                <p className="body-text muted-text">
                  <strong>{impressumContent.emailLabel}</strong>
                  <br />
                  <a href={`mailto:${impressumContent.email}`}>{impressumContent.email}</a>
                </p>
              </Stack>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>
    </>
  );
}
