import { ContentCard } from "@/components/ui/content-card";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function AudiencesSection() {
  return (
    <SectionFrame id="audiences">
      <Container>
        <Stack gap="lg">
          <SectionHeading title={homeContent.zielgruppen.title} />
          <div className="home-grid home-grid--three">
            {homeContent.zielgruppen.items.map((item) => (
              <ContentCard key={item.title}>
                <Stack gap="sm">
                  <h3 className="section-title">{item.title}</h3>
                  <p className="body-text muted-text">{item.text}</p>
                </Stack>
              </ContentCard>
            ))}
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
