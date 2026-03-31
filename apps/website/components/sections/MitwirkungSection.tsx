import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type MitwirkungSectionProps = {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
};

export function MitwirkungSection({
  title,
  text,
  href,
  buttonLabel,
}: MitwirkungSectionProps) {
  return (
    <Section>
      <article className="mitwirkung-card">
        <Stack gap="var(--space-5)">
          <Stack gap="var(--space-3)">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text">{text}</p>
          </Stack>

          <div>
            <Link className="button-link" href={href}>
              {buttonLabel}
            </Link>
          </div>
        </Stack>
      </article>
    </Section>
  );
}
