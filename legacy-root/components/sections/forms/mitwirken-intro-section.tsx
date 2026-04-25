import { Container } from "@/components/layout/container";
import { mitwirkenContent } from "@/lib/site/mitwirken-content";

export function MitwirkenIntroSection() {
  const { introBlocks } = mitwirkenContent;

  return (
    <section
      id="mitwirken-intro"
      className="bg-[var(--color-bg)] pb-8 pt-[var(--section-padding)] text-[var(--color-text-primary)] md:pb-12"
    >
      <Container>
        <div className="mx-auto max-w-3xl space-y-10">
          {introBlocks.map((block, index) => (
            <div
              key={index}
              className="space-y-3 border-b border-[var(--color-border)] pb-10 last:border-b-0 last:pb-0"
            >
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
                {block.title}
              </h2>
              <p className="text-base leading-7 text-[var(--color-text-secondary)]">{block.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
