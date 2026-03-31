import { ContentCard } from "@/components/ui/content-card";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function BenefitsSection() {
  return (
    <SectionFrame>
      <Container maxWidth="content">
        <Stack gap="lg">
          <SectionHeading title={homeContent.benefits.title} />
          <p className="body-text muted-text">{homeContent.benefits.text}</p>
          <Stack gap="sm">
            {homeContent.benefits.items.map((item) => (
              <ContentCard key={item.title}>
                <Stack gap="sm">
                  <h3 className="section-title">{item.title}</h3>
                  <p className="body-text muted-text">{item.text}</p>
                </Stack>
              </ContentCard>
            ))}
          </Stack>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
