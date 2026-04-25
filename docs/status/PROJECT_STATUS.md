# ResQBrain Projektstatus

Stand: 25. April 2026 (Verifikation in dieser Session: `pnpm build`, `pnpm --filter @resqbrain/website run typecheck`, `pnpm mobile:verify`, `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`, `pnpm --filter @resqbrain/domain run test:content` — jeweils Exit 0)

## Gesamtstatus

**OK** — Kernpfade bauen und typisieren; Mobile-`verify:local` (Typecheck, Nav-Skripte, `expo export --platform android`) grün; Domain-`tsc` und `test:content` grün.

**Abgrenzung:** MVP-Umfang ohne produktives Backend, ohne Auth und ohne Mandanten-Durchsetzung in der App-Laufzeit. Das ist dokumentierter Ist-Umfang, kein Buildfehler.

---

## Wichtigste funktionierende Teile

| Bereich | Kurzbeschreibung |
| --- | --- |
| **Website** (`apps/website`) | Next.js 16.2.1 App Router; `pnpm build` und `tsc --noEmit` grün. Routen u. a. `/`, `/impressum`, `/datenschutz`, `/kontakt`, `/links`, `/mitwirkung`, `/mitwirken`, `/updates`; dynamisch `/lab/lookup`, `/api/mitwirken`. |
| **Website-Inhalt** | Startseite über Sections; zentral `lib/site/home-content.ts`, Re-Export `apps/website/lib/site/content.ts`. Navigation Header: `apps/website/lib/site/navigation.ts` (`mainNavigation`). |
| **Mobile-App** (`apps/mobile-app`) | Lookup-Start über eingebettetes Seed, bevorzugter AsyncStorage-Cache, optionaler HTTP-Bundle-Check bei `EXPO_PUBLIC_LOOKUP_BUNDLE_URL`. In-Memory-Store; Suche, Listen, Details. |
| **Mobile-Qualitätsskripte** | `apps/mobile-app/tsconfig.json` schließt u. a. `figma`, `design`, `ui8` aus. `verify:static` = `typecheck` + `verify:navigation` + `verify:nav-routes`. |
| **Domain** (`packages/domain`) | Entities, Release-Slice, Lifecycle u. a.; `tsc --noEmit` grün; `test:content` (20 Tests) grün. |
| **Zusatzpakete (Repo)** | `apps/api`, `apps/api-local`, `packages/api`, `packages/application` — vorhanden; nicht als End-to-End-Produktpfad mit Mobile-Runtime verdrahtet. |

---

## Wichtigste Probleme / Lücken

| Thema | Sachstand |
| --- | --- |
| **Kein produktives Sync-/Tenant-Backend** | Kein kontinuierlicher Sync, kein Push/Pull, keine serverseitige Mandanten-Durchsetzung in der App. |
| **Keine geschlossene Release-zu-Hosting-Kette** | Seed-/Skriptpfad und Domain-Release-Logik existieren; durchgängige Pipeline „freigegebenes Release → gebautes Bundle → betriebener Endpunkt“ im Repo nicht als Produktionsprozess abgebildet. |
| **Mobile: nicht alles im Navigator** | `FavoritesScreen`, `DoseCalculatorScreen` existieren; nicht in `AppNavigator.tsx` als Hauptflow registriert (Ist-Code). |
| **Verifikationslücke** | `pnpm mobile:verify` nutzt `verify:expo-bundle` nur für **Android**; kein iOS-Export in diesem Skript. Kein automatisierter Browser-E2E-Test der Website in der genannten Befehlskette. |
| **Parallele Repo-Strukturen** | Root kann `app/`, `components/`, `lib/` parallel zu `apps/website` enthalten; produktives Vercel-Root bleibt `apps/website` (Konfiguration im Repo). |

---

## Nächste Schritte (Top 5)

1. **Bundle-Betrieb:** Hosting, Rotation, Fehler-/Rollback-Strategie für `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` festlegen und dokumentieren.
2. **Release-Pipeline:** Entscheidung und Umsetzung, wie gebaute Lookup-Bundles aus Domain/Seed-Prozess zu einem stabilen Download-Endpunkt gelangen.
3. **API / Auth / Organization:** Architekturgrenze für spätere Mandantenfähigkeit skizzieren oder implementieren — außerhalb des aktuellen MVP-Laufzeitpfads.
4. **Mobile CI optional erweitern:** z. B. `expo export --platform ios` oder `mobile:verify:doctor` in eigener Pipeline, wenn iOS/Doctor relevant werden.
5. **Produktentscheid:** Favoriten-Root und Dosisrechner im `AppNavigator` verdrahten oder bewusst aus MVP streichen und Doku angleichen.

---

## Website (Detail)

- App Router: `apps/website/app/`.
- Routing-Check: `scripts/validate-routing.ts`.
- CTAs: `landingPageLinks` / `homeContent` in `lib/site/home-content.ts`; Umfrage `apps/website/lib/site/survey.ts`; GitHub u. a. `apps/website/lib/site/public-links.ts`.
- Nicht produktiv für die Website-App: `apps/website/figma/` (Referenz; `apps/website/tsconfig.json` schließt `figma/**/*` aus).

---

## Mobile-App (Detail)

- Start: `App.tsx` → `loadLookupBundleWithSource` / zugehörige Loader; Store-Initialisierung.
- Embedded: `apps/mobile-app/data/lookup-seed/`.
- Cache: AsyncStorage unter `@resqbrain/lookup/bundle-v1` (validiertes Bundle).
- Navigation (Ist): u. a. `Home`, `Search`, `Settings`, `MedicationTab`, `AlgorithmTab`; im Home-Stack u. a. `History`, `VitalReference`.
- Zusätzliche Lookup-Dateien (`lookupSource.ts`, `LookupBundleUpdateService.ts` u. a.) sind im Commit `a81561d` (25.04.2026) stark gekürzt; maßgeblich für den Start bleibt der in `App.tsx` verdrahtete Pfad.

---

## Domain (Detail)

- Paket `packages/domain`: Content-, Tenant-, Release-Modellierung; Tests für Content-Foundation laufen grün (`test:content`).
- Laufzeit: Mobile-App nutzt `@resqbrain/domain` nicht als primäre Lookup-Runtime-Quelle.

---

## Risikoüberblick (kurz)

- Bundle-Verteilung bleibt ohne Betriebskonzept technisch unvollständig.
- Eingebetteter Mobile-Seed muss bewusst mit `data/lookup-seed/` synchron gehalten werden (Build-Disziplin).
- Mehrere vorbereitete Lookup-/API-Dateien im Repo können verwirren, wenn nicht klar der aktive Pfad ist.

---

## Kurzfazit

Repo-Verifikationspfad (Website-Build/Typecheck, Mobile verify inkl. Android-Export, Domain `tsc` und Content-Tests) ist am 25. April 2026 grün. Offen bleiben bewusst MVP-fremde Themen: Backend, Auth, Mandant in der App, geschlossene Bundle-Veröffentlichung und erweiterte Geräte-/E2E-Abdeckung.
