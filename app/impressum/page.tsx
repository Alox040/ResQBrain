import { SiteShell } from "@/components/layout/site-shell";

function TextBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
          {title}
        </h2>
        <div className="space-y-3 text-sm leading-7 text-[var(--color-text-secondary)]">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function ImpressumPage() {
  return (
    <SiteShell
      breadcrumbItems={[
        { label: "Start", href: "/" },
        { label: "Impressum" },
      ]}
      title="Impressum"
      intro="Rechtliche Angaben und Kontaktinformationen fuer diese Website."
    >
      <TextBlock title="Angaben">
        <p>Platzhalter fuer Anbieterkennzeichnung und verantwortliche Stelle.</p>
      </TextBlock>

      <TextBlock title="Kontakt">
        <p>Platzhalter fuer E-Mail, Anschrift und weitere Kontaktinformationen.</p>
      </TextBlock>

      <TextBlock title="Hinweise">
        <p>Platzhalter fuer weitere rechtliche Hinweise und Pflichtangaben.</p>
      </TextBlock>
    </SiteShell>
  );
}
