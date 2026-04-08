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

export default function DatenschutzPage() {
  return (
    <SiteShell
      breadcrumbItems={[
        { label: "Start", href: "/" },
        { label: "Datenschutz" },
      ]}
      title="Datenschutz"
      intro="Informationen zur Verarbeitung personenbezogener Daten auf dieser Website."
    >
      <TextBlock title="Uebersicht">
        <p>Platzhalter fuer eine Einleitung zur Datenverarbeitung und zum Geltungsbereich.</p>
      </TextBlock>

      <TextBlock title="Verarbeitete Daten">
        <p>Platzhalter fuer Angaben zu erhobenen Daten, Zwecken und Rechtsgrundlagen.</p>
      </TextBlock>

      <TextBlock title="Rechte der betroffenen Personen">
        <p>Platzhalter fuer Auskunft, Berichtigung, Loeschung und weitere Rechte.</p>
      </TextBlock>
    </SiteShell>
  );
}
