import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { impressumContent } from "@/lib/site";

export default function ImpressumPage() {
  return (
    <Stack gap="lg">
      <PageHeader title={impressumContent.title} />
      {impressumContent.sections.map((section) => (
        <ContentCard key={section.heading}>
          <Stack gap="sm">
            <h2 className="section-title">{section.heading}</h2>
            {section.lines.map((line) => (
              <p key={line} className="body-text muted-text">
                {line}
              </p>
            ))}
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
