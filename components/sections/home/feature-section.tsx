import { PhaseItem } from "@/components/cards/phase-item";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const phaseItems = [
  {
    label: "Phase 01",
    title: "Phase Item 01",
    description:
      "Placeholder content for the first phase item. Final content can be aligned to the Figma source in the content pass.",
  },
  {
    label: "Phase 02",
    title: "Phase Item 02",
    description:
      "Placeholder content for the second phase item. Final content can be aligned to the Figma source in the content pass.",
  },
  {
    label: "Phase 03",
    title: "Phase Item 03",
    description:
      "Placeholder content for the third phase item. Final content can be aligned to the Figma source in the content pass.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Phases"
            title="Section Title"
            subtitle="Section subtitle placeholder for the phase overview."
          />

          <div className="space-y-6">
            {phaseItems.map((item) => (
              <PhaseItem
                key={item.label}
                label={item.label}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
