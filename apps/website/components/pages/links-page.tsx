import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { TextLink } from "@/components/ui/text-link";
import { linksContent } from "@/lib/site";

export default function LinksPage() {
  return (
    <Stack gap="lg">
      <PageHeader subtitle={linksContent.intro} title={linksContent.title} />
      {linksContent.items.map((item) => (
        <ContentCard key={item.label}>
          <Stack gap="sm">
            <TextLink href={item.href}>{item.label}</TextLink>
            {item.description ? <p className="body-text muted-text">{item.description}</p> : null}
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
}
