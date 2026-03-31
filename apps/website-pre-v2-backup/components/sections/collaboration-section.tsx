import type { ReactNode } from "react";
import Link from "next/link";

import { SectionFrame } from "@/components/sections/section-frame";
import { ContentCard } from "@/components/ui/content-card";
import { PatternBackground } from "@/components/ui/pattern-background";
import { buttonSecondaryClass } from "@/components/ui/patterns";
import { routes } from "@/lib/routes";
import { detailedProjectDescriptionUrl } from "@/lib/site-content";

const tintedCardClass =
  "border-[color:color-mix(in_srgb,var(--ems-blue-soft)_45%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--ems-blue-soft)_22%,var(--color-surface))]";

function HandshakeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 11l2.2 2.2a1.8 1.8 0 0 0 2.6 0L14 11" />
      <path d="M2.5 10.5l4-4a2 2 0 0 1 2.8 0L12 9.2l2.7-2.7a2 2 0 0 1 2.8 0l4 4" />
      <path d="M6.5 14.5l1.2 1.2m2-1 1.3 1.3m2-1 1.2 1.2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="16" cy="9" r="2.2" />
      <path d="M4.5 17.5a4.5 4.5 0 0 1 9 0M12.5 17.5a3.8 3.8 0 0 1 7.6 0" />
    </svg>
  );
}

function MessageCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 4.5c4.7 0 8.5 3.3 8.5 7.4s-3.8 7.4-8.5 7.4c-.9 0-1.7-.1-2.5-.3l-4 1.6 1.3-3.3a6.8 6.8 0 0 1-3.3-5.4c0-4.1 3.8-7.4 8.5-7.4Z" />
    </svg>
  );
}

function CardTitle({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </span>
  );
}

export function CollaborationSection() {
  return (
    <SectionFrame
      id="zusammenarbeit"
      variant="band"
      eyebrow="Zusammenarbeit"
      title="Im Austausch mit Praxis und Fachverbänden"
      description={
        <p>
          Das Projekt entsteht im Dialog mit Einsatzkräften, Fachverbänden und weiteren Akteuren aus
          der Praxis. Erste Gespräche laufen bereits.
        </p>
      }
    >
      <div className="relative">
        <PatternBackground
          pattern="pattern-07.svg"
          opacity={0.025}
          position="bottom-left"
          size="md"
          className="hidden lg:block -translate-x-1/3 translate-y-1/3"
        />
        <div className="relative z-10">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <ContentCard
              title={<CardTitle icon={<HandshakeIcon />} text="DBRD" />}
              className={tintedCardClass}
            >
              Erste Gespräche mit dem Deutschen Berufsverband Rettungsdienst (DBRD) zur möglichen
              Zusammenarbeit und inhaltlichen Abstimmung.
            </ContentCard>
            <ContentCard
              title={<CardTitle icon={<UsersIcon />} text="Weitere Gespräche" />}
              className={tintedCardClass}
            >
              Zusätzliche Gespräche mit Rettungsdienst-Praxis, Ausbildern und Organisationen laufen.
              Ziel ist eine fachlich sinnvolle und praxisnahe Ausrichtung.
            </ContentCard>
            <ContentCard
              title={<CardTitle icon={<MessageCircleIcon />} text="Offen für Austausch" />}
              className={tintedCardClass}
            >
              Interesse an Zusammenarbeit, Pilotphase oder Feedback? Kontaktaufnahme ist jederzeit
              möglich.
            </ContentCard>
          </div>

          <div className="mt-6">
            <Link href={routes.kontakt} className={buttonSecondaryClass}>
              Zur Kontaktseite
            </Link>
            <div className="mt-2 space-y-1">
              <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                Für Partner und Interessierte:
              </p>
              <p className="text-sm leading-relaxed">
                <a
                  href={detailedProjectDescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
                >
                  Ausführliche Projektbeschreibung
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

