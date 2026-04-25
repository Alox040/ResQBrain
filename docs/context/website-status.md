# website-status

Stand: April 2026

## Technologie

- Next.js App Router, TypeScript
- Pfad: `apps/website`
- Deploy: Vercel, rootDirectory `apps/website`, Branch main

## Aktive Routen

| Route | Seite | Produktiv |
|---|---|---|
| `/` | Startseite | ja |
| `/mitwirkung` | Mitwirkungsseite | ja |
| `/mitwirken` | Mitwirken-Seite | ja (semantisch überlappend mit /mitwirkung) |
| `/kontakt` | Kontaktseite | ja |
| `/updates` | Updates-Seite | ja |
| `/links` | Link-Verzeichnis | ja |
| `/impressum` | Impressum | ja |
| `/datenschutz` | Datenschutzerklärung | ja |
| `/lab/lookup` | Lookup-Lab | nicht produktiv (Experiment) |

## Startseiten-Sections (Reihenfolge)

1. `HeroSection` — Einstieg mit Survey-CTA
2. `ProblemSection` — Problem-Szenarien (3 Karten + Fazit)
3. `IdeaProjectGoalSplitSection` — Idee-Blocks + Trust-Items
4. `StatusSection` — Projektstatus-Gruppen mit CTA
5. `AudienceSection` — Zielgruppen-Use-Cases
6. `MitwirkungSection` — Mitwirkungs-Aufruf mit Survey und Pfaden
7. `FaqSection` — FAQ-Items

## CTA-Struktur

- Aktive Survey: `https://forms.cloud.microsoft/r/AubZiQ0SQw` (April 2026, "UI & UX Feedback")
- Quelle: `apps/website/lib/site/survey.ts`
- `updates-form.ts` nutzt die aktive Survey-URL als Fallback
- HeroSection und MitwirkungSection zeigen beide den Survey-CTA

## Bekannte Probleme

- `/mitwirkung` und `/mitwirken` sind beide in der Hauptnavigation definiert und aktiv — semantische Überlappung, UX-Verwirrung möglich.
- `lib/site/`-Dateien existieren sowohl in `apps/website/lib/site/` als auch im Repo-Root unter `lib/` — Synchronisation nicht gesichert, Drift möglich.
- Website-Build zuletzt nicht vollständig lokal verifiziert (EPERM bei `tsconfig.tsbuildinfo` und `.next/trace`).
- `tsconfig.tsbuildinfo` ist versioniert (sollte in `.gitignore`).
- HeroSection-Props wurden zuletzt am 25.04.2026 angepasst (war ein echter Defekt, behoben).
- `/lab/lookup` ist eine experimentelle Route ohne produktive Funktion.
- Figma-Quelldatei unter `apps/website/ui8/_extracted/` vorhanden; systematischer Abgleich Figma vs. Code nicht durchgeführt.
