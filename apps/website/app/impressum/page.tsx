import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { impressumContent } from "@/lib/site/legal/impressum";

export default function ImpressumPage() {
  return (
    <Stack gap="lg">
      <PageHeader title={impressumContent.pageTitle} />
      <ContentCard>
        <Stack gap="sm">
          <h2 className="section-title">{impressumContent.sectionTitle}</h2>
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
            <strong>{impressumContent.contactLabel}</strong>
            <br />
            {impressumContent.emailLabel}
            <br />
            <a href={`mailto:${impressumContent.email}`}>{impressumContent.email}</a>
          </p>
          <p className="body-text muted-text">
            <strong>{impressumContent.noteLabel}</strong>
            <br />
            {impressumContent.noteText}
          </p>
        </Stack>
      </ContentCard>
    </Stack>
  );
}
