import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { mitwirkungContent } from "@/lib/site";

export default function MitwirkungPage() {
  return (
    <Stack gap="lg">
      <PageHeader subtitle={mitwirkungContent.intro} title={mitwirkungContent.title} />
      {mitwirkungContent.sections.map((section) => (
        <ContentCard key={section.title}>
          <Stack gap="sm">
            <h2 className="section-title">{section.title}</h2>
            <p className="body-text muted-text">{section.text}</p>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
