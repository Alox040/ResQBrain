import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { mitwirkungContent } from "@/lib/site";

export default function MitwirkungPage() {
  return (
    <Stack gap="default">
      <PageHeader subtitle={mitwirkungContent.intro} title={mitwirkungContent.title} />
      {mitwirkungContent.sections.map((section) => (
        <ContentCard key={section.title}>
          <Stack gap="tight">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
