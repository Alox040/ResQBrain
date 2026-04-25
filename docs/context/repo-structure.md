# repo-structure

Stand: April 2026

## Tatsächliche Ordnerstruktur

```
ResQBrain/
├── apps/
│   ├── mobile-app/                 # Expo/React Native — kanonische Mobile-App
│   │   ├── App.tsx                 # App-Einstiegspunkt
│   │   ├── src/
│   │   │   ├── data/               # contentIndex, ViewModel-Adapter
│   │   │   ├── features/           # history, favorites, lookup, references, feedback
│   │   │   ├── lib/lookup-api/     # HTTP-Client (bewusst deaktiviert)
│   │   │   ├── lookup/             # Bundle-Loading, Cache, Update-Infrastruktur
│   │   │   ├── navigation/         # AppNavigator, Stack-Definitionen
│   │   │   ├── screens/            # Home, Search, Settings, Medication, Algorithm, History
│   │   │   ├── state/              # favoritesStore, recentStore
│   │   │   ├── theme/              # ThemeContext, Palette
│   │   │   ├── types/              # Content-Typen
│   │   │   └── ui/                 # UI-Komponentenbibliothek
│   │   ├── dist-validation/        # Build-Artefakte (versioniert, sollte .gitignore)
│   │   └── ui8/_extracted/         # Design-Quelldateien (Sketch, Fig, XD)
│   ├── website/                    # Next.js App Router — kanonische Website
│   │   ├── app/                    # Route-Handler (page.tsx je Route)
│   │   ├── components/             # sections/, layout/, ui/
│   │   ├── lib/site/               # homeContent, survey, routes, CTAs
│   │   ├── tsconfig.tsbuildinfo    # Build-Artefakt (versioniert, sollte .gitignore)
│   │   └── ui8/_extracted/         # Design-Quelldateien (Figma)
│   ├── website-lab/                # Prototyp/Labor — NICHT produktiv
│   └── (mobile-app-lab/)           # Prototyp/Labor — NICHT produktiv
├── packages/
│   ├── domain/                     # geplant, leer — kein Code
│   ├── application/                # geplant, leer — kein Code
│   └── api/                        # geplant, leer — kein Code
├── data/
│   └── schemas/                    # Daten-Schemas und Seed-Beispiele
├── docs/
│   ├── context/                    # Kontextdokumente (kanonisch, dieser Ordner)
│   ├── architecture/               # Architekturdokumente (kanonisch)
│   └── legacy/                     # Prototyp-Snapshots (read-only)
├── scripts/                        # geplant, kein produktiver Code
├── app/                            # Root-Verzeichnis — Quelle unklar, NICHT apps/website
├── lib/                            # Root-Verzeichnis — Duplikate zu apps/website/lib/site/
├── components/                     # Root-Verzeichnis — Quelle unklar
├── src/                            # Root-Verzeichnis — Quelle unklar
└── vercel.json                     # Deploy-Konfiguration (rootDirectory: apps/website)
```

## Pfad-Regeln

- Die produktive Website ist `apps/website` — nicht `app/` im Repo-Root.
- Die produktive Mobile-App ist `apps/mobile-app` — nicht irgendein Lab-Ordner.
- `packages/*` sind strukturell vorhanden, aber leer.
- Root-Verzeichnisse `app/`, `lib/`, `components/`, `src/` sind nicht automatisch kanonisch — Verwendung unklar.
- `apps/website-lab/` ist ein Labor-Bereich — nicht als produktive Referenz behandeln.
