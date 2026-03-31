import { SectionFrame } from "@/components/sections/section-frame";
import { panelClass } from "@/components/ui/patterns";

export function ProblemBenefitsSection() {
  return (
    <SectionFrame
      id="problem-nutzen"
      variant="surface"
      eyebrow="Ausgangslage"
      title="Zuverlässige Inhalte — klar gefunden, ohne Medienbruch"
      description={
        <p>
          Im Einsatz zählen wenigen Klicks und verlässliche Quellen. Gleichzeitig unterscheiden
          sich Vorgaben und Hausstandards zwischen Organisationen. ResQBrain adressiert beides:
          schneller Zugriff für das Personal und klare Zuständigkeit für die Organisation, statt
          verstreute Dokumente oder fest verdrahteter Einzel-Lösungen.
        </p>
      }
    >
      <div className={panelClass}>
        <ul className="not-prose m-0 list-none space-y-4 p-0 sm:space-y-5">
          <li className="border-b border-[var(--color-border)]/60 pb-4 last:border-0 last:pb-0 sm:pb-5">
            <strong className="font-semibold text-[var(--color-foreground)]">Zeitdruck:</strong>{" "}
            <span className="text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-sm">
              Suche und Algorithmen sollen unter Belastung lesbar und navigierbar bleiben.
            </span>
          </li>
          <li className="border-b border-[var(--color-border)]/60 pb-4 last:border-0 last:pb-0 sm:pb-5">
            <strong className="font-semibold text-[var(--color-foreground)]">Vertrauen:</strong>{" "}
            <span className="text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-sm">
              Inhalte sollen über Freigaben und Versionen nachvollziehbar sein — nicht „irgendeine
              PDF“.
            </span>
          </li>
          <li>
            <strong className="font-semibold text-[var(--color-foreground)]">Eigenständigkeit:</strong>{" "}
            <span className="text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-sm">
              Organisationen behalten ihre inhaltliche Kontrolle; die Plattform liefert die gemeinsame
              Struktur.
            </span>
          </li>
        </ul>
      </div>
    </SectionFrame>
  );
}
