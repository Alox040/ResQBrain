import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { impressumContent } from "@/lib/site";

export default function ImpressumPage() {
  return (
    <Stack gap="default">
      <PageHeader title={impressumContent.title} />
      {impressumContent.sections.map((section) => (
        <ContentCard key={section.heading}>
          <Stack gap="tight">
            <h2>{section.heading}</h2>
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
