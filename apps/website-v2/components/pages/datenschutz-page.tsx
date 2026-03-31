import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { datenschutzContent } from "@/lib/site";

export default function DatenschutzPage() {
  return (
    <Stack gap="default">
      <PageHeader subtitle={datenschutzContent.updatedAt} title={datenschutzContent.title} />
      {datenschutzContent.sections.map((section) => (
        <ContentCard key={section.heading}>
          <Stack gap="tight">
            <h2>{section.heading}</h2>
            {section.body.map((entry) => (
              <p key={entry}>{entry}</p>
            ))}
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
