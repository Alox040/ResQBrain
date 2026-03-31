import { ContentCard } from "@/components/ui/content-card";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function BenefitsSection() {
  return (
    <Container maxWidth="content">
      <SectionFrame compact>
        <Stack gap="default">
          <SectionHeading title={homeContent.benefits.title} />
          <Stack gap="tight">
            {homeContent.benefits.items.map((item) => (
              <ContentCard key={item.title}>
                <Stack gap="tight">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Stack>
              </ContentCard>
            ))}
          </Stack>
        </Stack>
      </SectionFrame>
    </Container>
  );
}
