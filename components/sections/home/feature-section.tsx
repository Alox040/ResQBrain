import { PhaseItem } from "@/components/cards/phase-item";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { content } from "@/lib/site/content";

const ideaPhaseLabels = ["01", "02", "03"] as const;
const goalPhaseLabels = ["04", "05", "06"] as const;

export function FeatureSection() {
  const { idea, projectGoal } = content;

  return (
    <section id="features" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader title={idea.title} />

          <div className="space-y-6">
            {idea.cards.map((item, index) => (
              <PhaseItem
                key={item.headline}
                label={ideaPhaseLabels[index] ?? String(index + 1)}
                title={item.headline}
                description={item.text}
              />
            ))}
          </div>

          <div className="space-y-8 border-t border-[var(--color-border)] pt-12">
            <SectionHeader title={projectGoal.title} subtitle={projectGoal.intro} />

            <div className="space-y-6">
              {projectGoal.items.map((item, index) => (
                <PhaseItem
                  key={item.headline}
                  label={goalPhaseLabels[index] ?? String(index + 4)}
                  title={item.headline}
                  description={item.text}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
