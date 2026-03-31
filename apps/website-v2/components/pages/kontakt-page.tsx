import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { kontaktContent } from "@/lib/site";

export default function KontaktPage() {
  return (
    <Stack gap="default">
      <PageHeader subtitle={kontaktContent.intro} title={kontaktContent.title} />
      <ContentCard>
        <p>{kontaktContent.availabilityNote}</p>
      </ContentCard>
    </Stack>
  );
}
