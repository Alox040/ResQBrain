import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function ProjectStatusSection() {
  return (
    <SectionFrame compact>
      <Container maxWidth="content">
        <Stack gap="sm">
          <SectionHeading title={homeContent.projectStatus.title} />
          <p className="body-text muted-text">{homeContent.projectStatus.text}</p>
          <Badge>MVP-Phase</Badge>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
