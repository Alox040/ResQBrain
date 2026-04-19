# ResQBrain Projektstatus

Stand: 19. April 2026

## Gesamtstatus

ResQBrain ist aktuell ein Lookup-first MVP mit einer funktionsfähigen mobilen App für offline nutzbare Einsatzinhalte. Der aktive Produktpfad besteht aus eingebettetem Lookup-Bundle, optional bevorzugtem AsyncStorage-Cache und einem optionalen HTTP-Update-Check im Hintergrund.

Die Domain-Schicht ist als eigenständiges TypeScript-Paket strukturiert und für Content-, Tenant- und Release-Logik vorbereitet. Sie ist architektonisch vorhanden, aber nicht als laufender Backend- oder Freigabeprozess an die Mobile-App angebunden.

Es gibt aktuell kein produktives Sync-System, kein Backend, keine Authentifizierung und keine Tenant-Durchsetzung in der App-Laufzeit.

## Website (Next.js)

### Status

Die öffentliche Site liegt unter **`apps/website`** (Next.js App Router, `SiteShell` mit `SiteHeader` / `SiteFooter`). Die Landingpage wurde nach Abschluss des Rebuilds an die **aktuelle Figma-Vorlage** ausgerichtet und aus Section-Komponenten unter `apps/website/components/sections/` zusammengesetzt. Der Seiteninhalt kommt aus **`lib/site/home-content.ts`** (Repo-Root), re-exportiert über **`apps/website/lib/site/content.ts`** als `homeContent` / `content`.

Die **Hauptnavigation** im Header nutzt **`mainNavigation`** aus `apps/website/lib/site/navigation.ts` (konsistent mit `lib/routes.ts`). Es gibt keine separate tote Nav-Liste mehr mit nicht existierenden Pfaden.

### Produktive Struktur (kurz)

| Bereich | Pfad / Quelle |
| --- | --- |
| App Router | `apps/website/app/` |
| Startseite | `app/page.tsx` → Sections + `homeContent` |
| Globales CSS | u.a. `apps/website/app/globals.css` |
| Routing-Check (CI/manuell) | `scripts/validate-routing.ts` (Kernrouten + erwartete Section-Imports in `page.tsx`) |

### Routen (validiert / Build)

- **Skript `validate-routing.ts`:** Präsenz von `page.tsx` u.a. für `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
- **`pnpm build` (Website):** u.a. statisch `○ /`, `/impressum`, `/datenschutz`, `/kontakt`, `/links`, `/mitwirkung`, `/mitwirken`, `/updates`; dynamisch z.B. `/lab/lookup`, `/api/mitwirken`.

### CTA-Ziele (Landing, aktiv)

Zentral in **`landingPageLinks`** / **`homeContent`** (`lib/site/home-content.ts`):

- **Umfrage:** `surveys.active.href` → `apps/website/lib/site/survey.ts` (Microsoft Forms, extern).
- **GitHub:** `publicLinks.github` → `apps/website/lib/site/public-links.ts` (extern).
- **Kontakt:** `routes.kontakt` → intern `/kontakt`.

Verteilung über die Sections (Hero primär/sekundär, Status-Link, Audiences/FAQ/Mitwirkung je nach Feld); keine zweite parallele Content-Quelle für `/`.

### Altstrukturen (Repo, nicht produktiv für die deployierte Website)

- **`apps/website/figma/`:** Figma-Referenz/Export; im Website-`tsconfig` per `exclude: ["figma/**/*"]` vom Typecheck ausgenommen.
- **`apps/website/components/layout/main-nav.tsx`**, **`footer-nav.tsx`:** nicht in `SiteShell` verwendet (ältere Nav-Komponenten).
- **Repo-Root** ggf. `app/`, `components/`, `lib/`:** falls vorhanden, nicht das Vercel-Root (`rootDirectory: apps/website`); produktive Website nur unter `apps/website`.

## Mobile App

### Status

Die Mobile-App ist der aktuelle Kern des Projekts. Sie lädt Lookup-Inhalte beim Start aus einem eingebetteten Seed, kann einen neueren Cache aus AsyncStorage bevorzugen und optional per HTTP nach einem neueren Bundle suchen. Die Inhalte werden danach in einen In-Memory-Store geladen und von Listen-, Such- und Detailansichten synchron verwendet.

### Technischer Stand

| Bereich | Status | Ist-Stand |
| --- | --- | --- |
| Lookup-Startup | PASS | `App.tsx` lädt über `loadLookupBundleWithSource()` und initialisiert danach den zentralen Content-Store. |
| Embedded Bundle | PASS | `apps/mobile-app/data/lookup-seed/` ist der Offline-Fallback im App-Binary. |
| Cache | PASS | `lookupCache.ts` speichert validierte Bundles in AsyncStorage unter `@resqbrain/lookup/bundle-v1`. |
| Optionaler Remote-Check | PASS | `bundleUpdateService.ts` prüft nur bei gesetzter `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` auf ein neueres Bundle. |
| Lookup-Views | PASS | Suche, Listen, Detailseiten und Adapter arbeiten auf dem initialisierten In-Memory-Store. |
| Qualitätsrahmen | PASS | `typecheck`, Navigations-Checks, Routen-Checks und Expo-Bundle-Check sind vorhanden. |
| Vollständiges Sync-System | FAIL | Es gibt keinen kontinuierlichen Sync, kein Push/Pull-Modell und keinen Backend-gestützten Datenabgleich. |

### Ist vs. bewusst offen

Ist:

- Offline-Start mit eingebettetem Bundle
- Bevorzugung eines neueren lokal gespeicherten Bundles
- Optionaler HTTP-Check auf ein neueres Bundle nach dem App-Start
- Zentrale In-Memory-Initialisierung für Lookup-Daten

Bewusst offen:

- Kein serverseitiges Content-Backend
- Kein Benutzer-Login und keine Authentifizierung
- Keine mandantenspezifische Laufzeitauflösung in der App
- Kein inkrementeller Sync und keine Signaturprüfung für Bundle-Downloads

## Domain

### Status

Die Domain ist als separates Paket unter `packages/domain` vorhanden. Content-Entities, Tenant- und Release-Typen sind modelliert und durch Tests abgesichert, soweit sie im Paket selbst genutzt werden. Die Domain wird derzeit nicht als produktiver Freigabe- oder API-Layer von der Mobile-App verwendet.

### Technischer Stand

| Bereich | Status | Ist-Stand |
| --- | --- | --- |
| Content-Entities | PASS | Medication, Protocol, Guideline, ContentPackage und Algorithm sind im Paket modelliert. |
| Content-Tests | PASS | `pnpm --filter @resqbrain/domain run test:content` ist wieder lauffähig und an den aktuellen Algorithm-Stand angepasst. |
| Algorithm-Modell | PASS | Das aktuelle Modell ist schlank gehalten; Tests und Factory-Nutzung sind darauf abgestimmt. |
| Release-Slice | PASS | Release-Versionen, Release-Bundles und Release-Validierung sind vorhanden. |
| Produktive Nutzung des Release-Slice | WARN | Die Release-Logik ist nicht an den Seed- oder Bundle-Build gekoppelt. |
| App-Integration | WARN | Die Mobile-App nutzt das Domain-Paket nicht als Laufzeitquelle oder API-Vertrag. |

## Kritische technische Punkte

### 1. Lookup-Pfade: kanonischer Laufzeitpfad plus Phase-2-Entwurf

Der aktive Laufzeitpfad ist heute eindeutig:

- `App.tsx`
- `loadLookupBundleWithSource()`
- `initializeContent(store)`

Zusätzlich existieren weitere Lookup-Dateien wie `lookupSource.ts`, `bundleStorage.ts`, `LookupBundleUpdateService.ts` und `sourceResolver.ts`. Diese Dateien sind derzeit nicht in `App.tsx` verdrahtet und im Code als Phase-2-Entwürfe markiert.

Das ist aktuell kein Produktfehler, bleibt aber eine technische Spannungsstelle: Es gibt vorbereitete Alternativpfade im Repository, die bewusst nicht Teil des aktiven MVP-Ladepfads sind.

### 2. Keine End-to-End-Verbindung zwischen Release, Seed und Hosting

Die Seed- und Bundle-Erzeugung ist als Skriptkette vorhanden. Die Release-Domain weiß ebenfalls, welche Inhalte freigegeben wären. Dazwischen fehlt aber weiterhin die verbindende Pipeline.

Aktuell nicht vorhanden:

- Freigegebenes Domain-Release als Input für den Seed-Build
- durchgehender Build bis zu einem gehosteten Bundle-Endpunkt
- serverseitig erzwungene Freigabe- oder Tenant-Regeln

Damit ist die technische Verarbeitungskette von Seed bis App lokal vorhanden, aber nicht als vollständige produktive Veröffentlichungsstrecke geschlossen.

### 3. Kein Backend, keine Auth, kein Tenant Enforcement

Im aktuellen MVP gibt es:

- kein Backend
- keine Benutzeridentität
- keine Rechteprüfung
- keine mandantenbezogene Durchsetzung in der App-Laufzeit

Vorbereitete Multi-Tenant- oder regionenspezifische Resolver sind deshalb nur Vorarbeiten und nicht als aktives Feature zu verstehen.

## Bundle-System

### Aktiver Stand

Das Bundle-System der Mobile-App besteht aktuell aus drei klar getrennten Schichten:

1. Embedded Bundle im App-Paket
2. validierter AsyncStorage-Cache
3. optionaler HTTP-Check auf ein neueres Bundle

Der Remote-Check erweitert nur den nächsten Kaltstartpfad, er ersetzt keinen lokalen Startup und etabliert kein echtes Sync-System.

### Technische Grenzen

- Versionsvergleich ist vorhanden, aber kein vollständiges Release-Management
- HTTP-Download ist optional, nicht verpflichtend
- kein Rollback-Workflow im aktiven Pfad
- keine Authentifizierung des Bundle-Ursprungs
- kein produktiv verdrahtetes Hosting-Konzept im Repository

## Risiken

### 1. Bundle-Verteilung bleibt organisatorisch, nicht technisch geschlossen

Die Skripte für Seed- und Region-Builds existieren, aber das Hosting der erzeugten JSON-Bundles ist nicht Teil des laufenden Systems. Damit bleibt der Remote-Update-Pfad technisch vorbereitet, aber operativ unvollständig.

### 2. Phase-2-Dateien können künftige Implementierungen verwirren

Die nicht aktiven Lookup-Dateien sind inzwischen als Entwürfe markiert. Trotzdem bleiben mehrere vorbereitete Komponenten im Repository, die nicht Teil des aktuellen Produktpfads sind.

### 3. Seed-Synchronisation zur App ist weiterhin ein Build-Disziplin-Thema

Der eingebettete Mobile-Seed ist eine Kopie aus `data/lookup-seed/`. Wenn diese Synchronisation nicht bewusst ausgeführt wird, kann das eingebettete Bundle hinter dem aktuellen Seed-Stand zurückbleiben.

### 4. Domain und App entwickeln derzeit nebeneinander

Die Domain ist technisch weiter als ihre produktive Nutzung. Solange keine Backend- oder Release-Anbindung existiert, bleibt sie vor allem Architektur- und Sicherheitsrahmen, nicht aktiver Laufzeitkern der App.

## Kurzfazit

Der aktuelle Repo-Stand ist für ein Lookup-first MVP technisch konsistent: Die Mobile-App startet offline stabil, kann lokale oder aktualisierte Bundles laden und hat einen kleinen, funktionierenden Qualitätsrahmen. Die **Website** (`apps/website`) ist als öffentliche Next.js-App mit dokumentierter Route-/CTA-Struktur beschrieben (siehe Abschnitt Website). Offen bleiben nicht kosmetische, sondern systemische Themen: Veröffentlichungsstrecke für Bundles, Anbindung des Release-Slice und jede Form von Backend-, Auth- oder Tenant-Durchsetzung.
