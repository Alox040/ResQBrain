# ResQBrain Projektstatus

Stand: 20. April 2026

## Gesamtstatus

ResQBrain ist aktuell ein Lookup-first MVP mit einer mobilen App fuer offline nutzbare Einsatzinhalte. Der aktive Produktpfad besteht aus eingebettetem Lookup-Bundle, optional bevorzugtem AsyncStorage-Cache und einem optionalen HTTP-Update-Check im Hintergrund.

Die Domain-Schicht ist als eigenstaendiges TypeScript-Paket strukturiert und fuer Content-, Tenant- und Release-Logik vorbereitet. Sie ist architektonisch vorhanden, aber nicht als laufender Backend- oder Freigabeprozess an die Mobile-App angebunden.

Es gibt aktuell kein produktives Sync-System, keine Authentifizierung und keine Tenant-Durchsetzung in der App-Laufzeit. Zusaetzliche API-/Application-Pakete sind im Repository vorhanden, aber nicht als produktiver Laufzeitpfad der Mobile-App verdrahtet.

## Website (Next.js)

### Status

Die oeffentliche Site liegt unter **`apps/website`** (Next.js App Router, `SiteShell` mit `SiteHeader` / `SiteFooter`). Die Landingpage ist aus Section-Komponenten unter `apps/website/components/sections/` zusammengesetzt. Der Seiteninhalt kommt aus **`lib/site/home-content.ts`** (Repo-Root), re-exportiert ueber **`apps/website/lib/site/content.ts`** als `homeContent` / `content`.

Die **Hauptnavigation** im Header nutzt **`mainNavigation`** aus `apps/website/lib/site/navigation.ts` (konsistent mit `lib/routes.ts`). Es gibt keine zweite aktive Nav-Liste mit nicht existierenden Pfaden.

Der Website-Typecheck ist im aktuellen Repo-Lauf nachweisbar: `pnpm.cmd --filter @resqbrain/website run typecheck` lief am 20. April 2026 erfolgreich.

### Produktive Struktur (kurz)

| Bereich | Pfad / Quelle |
| --- | --- |
| App Router | `apps/website/app/` |
| Startseite | `app/page.tsx` -> Sections + `homeContent` |
| Globales CSS | u.a. `apps/website/app/globals.css` |
| Routing-Check (CI/manuell) | `scripts/validate-routing.ts` |

### Routen (Code-Stand)

- **Skript `validate-routing.ts`:** prueft die Praesenz zentraler Routen-Dateien.
- **Route-Dateien im Repo:** `/`, `/impressum`, `/datenschutz`, `/kontakt`, `/links`, `/mitwirkung`, `/mitwirken`, `/updates`, zusaetzlich `/lab/lookup` und `/api/mitwirken`.

### CTA-Ziele (Landing, aktiv)

Zentral in **`landingPageLinks`** / **`homeContent`** (`lib/site/home-content.ts`):

- **Umfrage:** `surveys.active.href` -> `apps/website/lib/site/survey.ts` (extern)
- **GitHub:** `publicLinks.github` -> `apps/website/lib/site/public-links.ts` (extern)
- **Kontakt:** `routes.kontakt` -> intern `/kontakt`

Verteilung ueber die Sections (Hero primaer/sekundaer, Status-Link, Audiences/FAQ/Mitwirkung je nach Feld); keine zweite parallele Content-Quelle fuer `/`.

### Altstrukturen (Repo, nicht produktiv fuer die deployierte Website)

- **`apps/website/figma/`:** Figma-Referenz/Export; im Website-`tsconfig` per `exclude: ["figma/**/*"]` vom Typecheck ausgenommen.
- **`apps/website/components/layout/main-nav.tsx`**, **`footer-nav.tsx`:** nicht in `SiteShell` verwendet.
- **Repo-Root** `app/`, `components/`, `lib/`: falls vorhanden, nicht das Vercel-Root (`rootDirectory: apps/website`); produktive Website nur unter `apps/website`.

## Mobile App

### Status

Die Mobile-App ist der aktuelle Kern des Projekts. Sie laedt Lookup-Inhalte beim Start aus einem eingebetteten Seed, kann einen neueren Cache aus AsyncStorage bevorzugen und optional per HTTP nach einem neueren Bundle suchen. Die Inhalte werden danach in einen In-Memory-Store geladen und von Listen-, Such- und Detailansichten synchron verwendet.

Die aktuell verdrahtete Navigation besteht aus `Home`, `Search`, `Settings`, `MedicationTab` und `AlgorithmTab`. Im Home-Stack liegen zusaetzlich `History` und `VitalReference`. `FavoritesScreen` und `DoseCalculatorScreen` existieren im Repo, sind aber aktuell nicht in `AppNavigator.tsx` registriert.

### Technischer Stand

| Bereich | Status | Ist-Stand |
| --- | --- | --- |
| Lookup-Startup | PASS | `App.tsx` laedt ueber `loadLookupBundleWithSource()` und initialisiert danach den zentralen Content-Store. |
| Embedded Bundle | PASS | `apps/mobile-app/data/lookup-seed/` ist der Offline-Fallback im App-Binary. |
| Cache | PASS | `lookupCache.ts` speichert validierte Bundles in AsyncStorage unter `@resqbrain/lookup/bundle-v1`. |
| Optionaler Remote-Check | PASS | `bundleUpdateService.ts` prueft nur bei gesetzter `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` auf ein neueres Bundle. |
| Lookup-Views | PASS | Suche, Listen, Detailseiten und Adapter arbeiten auf dem initialisierten In-Memory-Store. Die Suche ist aktuell eine einfache Textsuche auf Label/Indikation, kein Ranking-System. |
| Qualitaetsrahmen | WARN | Skripte fuer `typecheck`, Navigation und Export sind vorhanden, aber `pnpm.cmd --filter @resqbrain/mobile-app run verify:static` ist am 20. April 2026 fehlgeschlagen: `apps/mobile-app/figma/**` ist nicht vom Typecheck ausgeschlossen und referenziert fehlende Web-/Radix-/Vite-Abhaengigkeiten. |
| Vollstaendiges Sync-System | FAIL | Es gibt keinen kontinuierlichen Sync, kein Push/Pull-Modell und keinen Backend-gestuetzten Datenabgleich. |

### Ist vs. bewusst offen

Ist:

- Offline-Start mit eingebettetem Bundle
- Bevorzugung eines neueren lokal gespeicherten Bundles
- Optionaler HTTP-Check auf ein neueres Bundle nach dem App-Start
- Zentrale In-Memory-Initialisierung fuer Lookup-Daten
- Persistierte Favoriten und Verlauf
- `History` und `VitalReference` als verdrahtete Screens im Home-Stack

Bewusst offen:

- Kein serverseitiges Content-Backend
- Kein Benutzer-Login und keine Authentifizierung
- Keine mandantenspezifische Laufzeitaufloesung in der App
- Kein inkrementeller Sync und keine Signaturpruefung fuer Bundle-Downloads
- Kein aktiv verdrahteter Dosisrechner-Flow im Navigator

## Domain

### Status

Die Domain ist als separates Paket unter `packages/domain` vorhanden. Content-Entities, Tenant- und Release-Typen sind modelliert und durch Tests abgesichert, soweit sie im Paket selbst genutzt werden. Die Domain wird derzeit nicht als produktiver Freigabe- oder API-Layer von der Mobile-App verwendet.

### Technischer Stand

| Bereich | Status | Ist-Stand |
| --- | --- | --- |
| Content-Entities | PASS | Medication, Protocol, Guideline, ContentPackage und Algorithm sind im Paket modelliert. |
| Content-Tests | WARN | Testskripte sind vorhanden. Ein frischer Nachweis im aktuellen Lauf gelang nicht: `pnpm.cmd --filter @resqbrain/domain run test:content` scheiterte in der Sandbox an `spawn EPERM`, daher aktuell kein erneuter PASS-Beleg. |
| Algorithm-Modell | PASS | Das aktuelle Modell ist schlank gehalten; Testdateien und Services sind auf diesen Stand ausgerichtet. |
| Release-Slice | PASS | Release-Versionen, Release-Bundles und Release-Validierung sind vorhanden. |
| Produktive Nutzung des Release-Slice | WARN | Die Release-Logik ist nicht an den Seed- oder Bundle-Build gekoppelt. |
| App-Integration | WARN | Die Mobile-App nutzt das Domain-Paket nicht als Laufzeitquelle oder API-Vertrag. |

## Weitere Repo-Bausteine

Zusaetzlich zum aktuellen Produktpfad sind weitere Pakete und Apps vorhanden:

- **`apps/api`**: Route-/Contract-Exports fuer Lookup-Endpunkte
- **`apps/api-local`**: lokaler HTTP-Server fuer Lookup-Smoke-/Entwicklungspfad
- **`packages/api`**: Lookup-Adapter, Handler und Contract-Mapping
- **`packages/application`**: Lookup- und Release-Services / Ports

Diese Bausteine sind technisch vorhanden, aber weder im README-Kurzausblick noch in der Mobile-App als aktiver Produktpfad vollstaendig integriert.

## Kritische technische Punkte

### 1. Lookup-Pfade: kanonischer Laufzeitpfad plus Phase-2-Entwurf

Der aktive Laufzeitpfad ist heute eindeutig:

- `App.tsx`
- `loadLookupBundleWithSource()`
- `initializeContent(store)`

Zusaetzlich existieren weitere Lookup-Dateien wie `lookupSource.ts`, `bundleStorage.ts`, `LookupBundleUpdateService.ts` und `sourceResolver.ts`. Diese Dateien sind derzeit nicht in `App.tsx` verdrahtet und im Code als Phase-2-Entwuerfe markiert.

Das ist aktuell kein Produktfehler, bleibt aber eine technische Spannungsstelle: Es gibt vorbereitete Alternativpfade im Repository, die bewusst nicht Teil des aktiven MVP-Ladepfads sind.

### 2. Keine End-to-End-Verbindung zwischen Release, Seed und Hosting

Die Seed- und Bundle-Erzeugung ist als Skriptkette vorhanden. Die Release-Domain weiss ebenfalls, welche Inhalte freigegeben waeren. Dazwischen fehlt aber weiterhin die verbindende Pipeline.

Aktuell nicht vorhanden:

- Freigegebenes Domain-Release als Input fuer den Seed-Build
- durchgehender Build bis zu einem gehosteten Bundle-Endpunkt
- serverseitig erzwungene Freigabe- oder Tenant-Regeln

Damit ist die technische Verarbeitungskette von Seed bis App lokal vorhanden, aber nicht als vollstaendige produktive Veroeffentlichungsstrecke geschlossen.

### 3. Kein Backend, keine Auth, kein Tenant Enforcement

Im aktuellen MVP gibt es:

- kein Backend
- keine Benutzeridentitaet
- keine Rechtepruefung
- keine mandantenbezogene Durchsetzung in der App-Laufzeit

Vorbereitete Multi-Tenant- oder regionenspezifische Resolver sind deshalb nur Vorarbeiten und nicht als aktives Feature zu verstehen.

## Bundle-System

### Aktiver Stand

Das Bundle-System der Mobile-App besteht aktuell aus drei klar getrennten Schichten:

1. Embedded Bundle im App-Paket
2. validierter AsyncStorage-Cache
3. optionaler HTTP-Check auf ein neueres Bundle

Der Remote-Check erweitert nur den naechsten Kaltstartpfad, er ersetzt keinen lokalen Startup und etabliert kein echtes Sync-System.

### Technische Grenzen

- Versionsvergleich ist vorhanden, aber kein vollstaendiges Release-Management
- HTTP-Download ist optional, nicht verpflichtend
- kein Rollback-Workflow im aktiven Pfad
- keine Authentifizierung des Bundle-Ursprungs
- kein produktiv verdrahtetes Hosting-Konzept im Repository

## Risiken

### 1. Bundle-Verteilung bleibt organisatorisch, nicht technisch geschlossen

Die Skripte fuer Seed- und Region-Builds existieren, aber das Hosting der erzeugten JSON-Bundles ist nicht Teil des laufenden Systems. Damit bleibt der Remote-Update-Pfad technisch vorbereitet, aber operativ unvollstaendig.

### 2. Phase-2-Dateien koennen kuenftige Implementierungen verwirren

Die nicht aktiven Lookup-Dateien sind inzwischen als Entwuerfe markiert. Trotzdem bleiben mehrere vorbereitete Komponenten im Repository, die nicht Teil des aktuellen Produktpfads sind.

### 3. Seed-Synchronisation zur App ist weiterhin ein Build-Disziplin-Thema

Der eingebettete Mobile-Seed ist eine Kopie aus `data/lookup-seed/`. Wenn diese Synchronisation nicht bewusst ausgefuehrt wird, kann das eingebettete Bundle hinter dem aktuellen Seed-Stand zurueckbleiben.

### 4. Domain und App entwickeln derzeit nebeneinander

Die Domain ist technisch weiter als ihre produktive Nutzung. Solange keine Backend- oder Release-Anbindung existiert, bleibt sie vor allem Architektur- und Sicherheitsrahmen, nicht aktiver Laufzeitkern der App.

### 5. Mobile-Verifikation ist aktuell nicht gruen

Der dokumentierte Mobile-Verify-Pfad ist derzeit nicht konsistent mit dem Repo-Zustand: `tsconfig.json` in `apps/mobile-app` schliesst `figma/` nicht aus, wodurch Web-Referenzquellen mit fehlenden Abhaengigkeiten den Typecheck blockieren.

## Kurzfazit

Der aktuelle Repo-Stand ist fuer ein Lookup-first MVP in den Kernpfaden konsistent: Die Mobile-App startet offline, kann lokale oder aktualisierte Bundles laden, und die Website unter `apps/website` ist typseitig verifizierbar. Offen bleiben nicht kosmetische, sondern systemische Themen: Veroeffentlichungsstrecke fuer Bundles, Anbindung des Release-Slice, gruene Mobile-Verifikation und jede Form von Backend-, Auth- oder Tenant-Durchsetzung.
