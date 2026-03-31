import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { datenschutzContent } from "@/lib/site";

export default function DatenschutzPage() {
  return (
    <Stack gap="lg">
      <PageHeader subtitle={datenschutzContent.updatedAt} title={datenschutzContent.title} />
      {datenschutzContent.sections.map((section) => (
        <ContentCard key={section.heading}>
          <Stack gap="sm">
            <h2 className="section-title">{section.heading}</h2>
            {section.body.map((entry) => (
              <p key={entry} className="body-text muted-text">
                {entry}
              </p>
            ))}
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
