import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function FaqSection() {
  return (
    <SectionFrame id="faq">
      <Container>
        <Stack gap="lg">
          <SectionHeading title={homeContent.faq.title} />
          <div className="home-grid home-grid--two">
            {homeContent.faq.items.map((item) => (
              <ContentCard key={item.question}>
                <Stack gap="sm">
                  <h3 className="section-title">{item.question}</h3>
                  <p className="body-text muted-text">{item.answer}</p>
                </Stack>
              </ContentCard>
            ))}
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
