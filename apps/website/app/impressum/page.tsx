import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import { impressumContent } from "@/lib/site/legal/impressum";

export default function ImpressumPage() {
  return (
    <SectionFrame>
      <Container>
        <Stack gap="lg">
          <PageHeader title={impressumContent.pageTitle} />
          <ContentCard>
            <Stack gap="sm">
              <h2 className="section-title">{impressumContent.sectionTitle}</h2>
              <p className="body-text muted-text prose">
                <strong>{impressumContent.projectLabel}</strong>
                <br />
                {impressumContent.projectName}
              </p>
              <p className="body-text muted-text prose">
                <strong>{impressumContent.responsibleLabel}</strong>
                <br />
                {impressumContent.responsibleName}
              </p>
              <p className="body-text muted-text prose">
                <strong>{impressumContent.contactLabel}</strong>
                <br />
                {impressumContent.emailLabel}
                <br />
                <a href={`mailto:${impressumContent.email}`}>{impressumContent.email}</a>
              </p>
              <p className="body-text muted-text prose">
                <strong>{impressumContent.noteLabel}</strong>
                <br />
                {impressumContent.noteText}
              </p>
            </Stack>
          </ContentCard>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
