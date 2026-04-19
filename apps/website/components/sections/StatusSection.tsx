import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { TextLink } from "@/components/ui/text-link";

type StatusItem = {
  label: string;
  tone: "current" | "planned" | "open";
};

type StatusGroup = {
  title: string;
  items: readonly StatusItem[];
};

export type StatusSectionProps = {
  title: string;
  subtitle: string;
  groups: readonly StatusGroup[];
  disclaimer: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export function StatusSection({ title, subtitle, groups, disclaimer, cta }: StatusSectionProps) {
  return (
    <SectionFrame compact>
      <Container>
        <ContentCard>
          <Stack gap="md" className="status-board">
            <Stack gap="sm">
              <SectionHeading title={title} />
              <p className="body-text muted-text section-intro">{subtitle}</p>
            </Stack>
            {groups.map((group) => (
              <Stack key={group.title} gap="sm">
                <span className="badge">{group.title}</span>
                <div className="status-list">
                  {group.items.map((item) => (
                    <div key={item.label} className="status-list-item">
                      <span className={`status-dot status-dot--${item.tone}`} aria-hidden="true" />
                      <p className="small-text status-card-label">{item.label}</p>
                    </div>
                  ))}
                </div>
              </Stack>
            ))}
            <p className="body-text muted-text section-intro">{disclaimer}</p>
            {cta ? (
              <TextLink href={cta.href} external={cta.external}>
                {cta.label}
              </TextLink>
            ) : null}
          </Stack>
        </ContentCard>
      </Container>
    </SectionFrame>
  );
}
