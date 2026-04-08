import { SocialCard } from "@/components/cards/social-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";

export function CommunitySection() {
  const { communityChannels } = mitwirkungPageContent;

  return (
    <section
      id="community"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="space-y-12">
          <SectionHeader title="Community" />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {communityChannels.map((card) => (
              <SocialCard
                key={card.platform}
                platform={card.platform}
                description={"description" in card ? card.description : undefined}
                href={card.href}
                external={card.external}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
