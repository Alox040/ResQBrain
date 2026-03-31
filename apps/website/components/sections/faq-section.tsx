import Link from "next/link";
import type { ReactNode } from "react";

import { SectionFrame } from "@/components/sections/section-frame";
import { PatternBackground } from "@/components/ui/pattern-background";
import { faqDisclosurePadding } from "@/components/ui/patterns";
import { routes } from "@/lib/routes";

type FaqItem = { q: string; a: ReactNode };

const faqItems: FaqItem[] = [
  {
    q: "Ist ResQBrain schon ein fertiges Produkt?",
    a: "Nein. Es handelt sich um ein frühes Projekt mit klarer Produktvision und technischer Ausrichtung. Diese Website dokumentiert die Richtung und lädt zu Feedback ein — nicht zu einem vollen Roll-out.",
  },
  {
    q: "Wer haftet für medizinische Inhalte?",
    a: "Medizinische und operative Inhalte unterliegen immer den verantwortlichen Organisationen und deren Freigabeprozessen. ResQBrain ist die technische und organisatorische Rahmenidee; keine automatische fachliche Bewertung durch die Plattform.",
  },
  {
    q: "Wie werden Umfrageergebnisse genutzt?",
    a: "Sie fließen in Priorisierung und Produktplanung ein. Sie ersetzen keine klinische Prüfung und führen nicht automatisch zu veröffentlichten Leitlinien-Inhalten.",
  },
  {
    q: "Gibt es schon eine App?",
    a: "Eine mobile Anwendung wird vorbereitet; der Reifegrad richtet sich nach Piloten und technischer Basis. Aktuell stehen Architektur, Domänenmodell und frühe Umsetzungsschritte im Vordergrund.",
  },
  {
    q: "Welche Daten werden auf dieser Website erhoben?",
    a: (
      <>
        Die öffentlich erreichbare Website ist weitgehend statisch ausgeliefert. Einzelheiten zu
        Hosting, Server-Logfiles, Kontakt per E-Mail, Umfrage (Microsoft Forms) und Ihren Rechten
        stehen in der{" "}
        <Link
          href={routes.datenschutz}
          className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Datenschutzerklärung
        </Link>
        .
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <SectionFrame
      id="faq"
      variant="surface"
      eyebrow="FAQ"
      title="Häufige Fragen"
      description={
        <p>
          Kurze Antworten zu Einordnung und Abgrenzung — ohne Anspruch auf Vollständigkeit;
          verbindliche oder rechtskonkrete Texte können später auf dedizierten Seiten folgen.
        </p>
      }
    >
      <div className="relative max-w-[42rem]">
        <PatternBackground
          pattern="pattern-07.svg"
          opacity={0.08}
          position="top-right"
          size="sm"
          className="translate-x-1/3 -translate-y-1/3"
        />
        <div className="relative z-10 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]/90 bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
          {faqItems.map((item) => (
            <details
              key={item.q}
              className={`group border-b border-[var(--color-border)]/70 last:border-b-0 ${faqDisclosurePadding}`}
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 text-[0.9375rem] font-medium leading-snug text-[var(--color-foreground)] marker:content-none min-[360px]:min-h-11 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 pr-1 pt-0.5">{item.q}</span>
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md border border-[var(--color-border)]/80 bg-[var(--color-surface-muted)]/40 text-[var(--color-muted)] tabular-nums group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] sm:mt-4">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
