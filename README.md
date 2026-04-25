# ResQBrain

Monorepo für eine **offline nutzbare Mobile-App** (Expo/React Native) zum Nachschlagen von Medikamenten und Algorithmen aus einem eingebetteten Lookup-Bundle sowie eine **öffentliche Website** (Next.js) mit rechtlichen Seiten und CTAs. Zusätzlich liegen **Domain-Modelle und Skripte** für Content, Releases und Seed-Daten im Repo.

Die Mobile-App ist derzeit **ohne** produktives Backend, **ohne** Authentifizierung und **ohne** Mandanten-Durchsetzung zur Laufzeit; das entspricht dem dokumentierten MVP-Umfang.

---

## Aktueller Status

- **Phase:** Lookup-first MVP (siehe `docs/context/04-mvp-scope.md`).
- **Letzter dokumentierter Verifikationsstand:** April 2026 — `pnpm build`, `pnpm --filter @resqbrain/website run typecheck`, `pnpm mobile:verify`, Domain-`tsc` und `pnpm --filter @resqbrain/domain run test:content` grün (Details: [`docs/status/PROJECT_STATUS.md`](docs/status/PROJECT_STATUS.md)).
- **Website:** Deploy-Root ist `apps/website` (nicht parallele Ordner am Repo-Root).
- **Mobile:** `pnpm mobile:verify` führt u. a. Android-`expo export` aus; kein iOS-Export in derselben Kette.

---

## Wichtigste Features (Ist-Code)

### Mobile (`apps/mobile-app`)

- Listen und Detailansichten für Medikamente und Algorithmen.
- Lokale Volltextsuche (Filter; kein Relevanz-Ranking).
- Eingebettetes JSON-Bundle; optional neuerer Stand aus **AsyncStorage**; optional HTTP-Check auf neuere Bundle-Version bei gesetzter Umgebungsvariable **`EXPO_PUBLIC_LOOKUP_BUNDLE_URL`**.
- Favoriten (Stern in Detail/Liste, Bereich auf dem Home-Tab; persistiert).
- Verlauf der zuletzt geöffneten Einträge (persistiert; eigener Screen im Home-Stack).
- Statische Vitalwerte-Referenz (Home-Stack).
- `DoseCalculatorScreen` und separater `FavoritesScreen` existieren im Repo, sind **nicht** als eigene Navigator-Routen im `AppNavigator` registriert.

### Website (`apps/website`)

- Next.js 16 App Router; Seiten u. a. Start, Impressum, Datenschutz, Kontakt, Links, Mitwirkung/Mitwirken, Updates.
- Dynamische Routen: `/lab/lookup`, `/api/mitwirken`.
- Inhalte der Landingpage: `lib/site/home-content.ts` (Repo-Root), Re-Export unter `apps/website/lib/site/content.ts`.

### Pakete / weitere Apps

- **`packages/domain`:** TypeScript-Domainmodell inkl. Content-, Lifecycle-, Release-Bausteinen; `test:content` u. a.
- **`packages/api`**, **`packages/application`:** Lookup-/Service-Schichten und Ports — **nicht** als End-to-End-Laufzeit der Mobile-App verdrahtet.
- **`apps/api-local`:** lokaler HTTP-Server für Smoke-/Entwicklung.
- **`apps/api/src/`:** Lookup-Contracts und Handler als TypeScript-Quellen; **ohne** eigenes `package.json`; **nicht** im Root-`pnpm`-Workspace — Einbindung nur über andere Pakete/Skripte, sofern vorhanden.

---

## Projektstruktur (kurz)

```text
apps/
  mobile-app/     Expo-App (Lookup-MVP)
  website/        Next.js (öffentliche Site; Vercel-Root)
  api-local/      lokaler Lookup-Server
  api/            Lookup-API-Code (nicht im Root-Workspace)
packages/
  domain/         Domain-Logik und Tests
  application/    Application-Services
  api/            API-Adapter, Contracts
docs/
  context/        Produktkontext (nummerierte Dateien 01–12 u. a.)
  architecture/   technische Architektur
  status/         Projekt- und Sessionstatus
  policies/       Richtlinien (z. B. Compliance)
data/             Seed-/Referenzdaten (Skripte im Root `package.json`)
scripts/          Automatisierung (Routing-Check, Seeds, Status)
```

Nebenordner wie `apps/website-lab/`, `apps/mobile-app-lab/` und Referenz-`figma/`-Trees sind **nicht** der produktive App-Pfad.

---

## Kontext und Architektur

Maßgeblich für Produktbegriffe, MVP-Grenzen und Entscheidungen:

| Bereich | Pfad |
| --- | --- |
| Produkt & Plattform (kanonisch) | [`docs/context/`](docs/context/) — u. a. `01-product-vision.md` … `12-next-steps.md` |
| Technische Architektur | [`docs/architecture/`](docs/architecture/) |
| Ist-Stand / Verifikation | [`docs/status/PROJECT_STATUS.md`](docs/status/PROJECT_STATUS.md), [`docs/status/WORK_SESSION.md`](docs/status/WORK_SESSION.md) |
| Agenten-Hinweise (Überblick) | [`CLAUDE.md`](CLAUDE.md) |

---

## Lokales Setup

**Voraussetzungen:** Node.js ≥ 18, `pnpm` (siehe `packageManager` in `package.json`).

```bash
pnpm install
```

**Website:**

```bash
pnpm build
pnpm --filter @resqbrain/website run typecheck
```

**Mobile:**

```bash
pnpm --filter @resqbrain/mobile-app start
pnpm mobile:verify
```

---

## Hinweis zur Einordnung

ResQBrain ist als **Nachschlage- und Organisationshilfe** gedacht, keine zertifizierte Medizinprodukt-Software in diesem Repo-Zustand. Inhalte des Lookup-Bundles und jegliche Rechnerlogik ersetzen keine klinische Entscheidung oder Freigabe durch Fachpersonal.
