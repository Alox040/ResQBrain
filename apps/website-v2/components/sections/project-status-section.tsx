import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function ProjectStatusSection() {
  return (
    <Container maxWidth="content">
      <SectionFrame compact>
        <Stack gap="tight">
          <SectionHeading title={homeContent.projectStatus.title} />
          <p>{homeContent.projectStatus.text}</p>
          <Badge>{homeContent.projectStatus.title}</Badge>
        </Stack>
      </SectionFrame>
    </Container>
  );
}
