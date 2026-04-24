# repo-structure

## Zweck

- Liefert eine stabile Karte des Repositories.
- Zeigt, welche Ordner produktiv, vorbereitend, legacy oder nur dokumentarisch sind.
- Verhindert, dass AIs den falschen Pfad als kanonisch behandeln.

## Inhalt

- `apps/mobile-app`
  - kanonische Mobile-App
- `apps/website`
  - kanonische Website
- `apps/api-local`
  - lokaler Laufzeit- und Smoke-Pfad
- `apps/mobile-app-lab`, `apps/website-lab`
  - Labor- und Prototyp-Bereiche, nicht als produktive Referenz behandeln
- `packages/domain`
  - Domain-Modelle, Policies, Invarianten, Versionierung, Governance
- `packages/application`
  - Anwendungsdienste und Ports zwischen Domain und Laufzeit
- `packages/api`
  - API-Adapter und Vertragslogik
- `data`
  - Seeds, Schemata und Import-/Normalisierungsdaten
- `docs`
  - Architektur, Kontext, Roadmap, Status, Planung und Legacy
- `scripts`
  - Validierung, Build-, Seed- und Hilfsskripte
- `app`, `components`, `lib`, `src`
  - Root-Struktur mit eigener Bedeutung, aber nicht automatisch die Website-Quelle

## Was NICHT rein darf

- Vollstaendige Deep-Trees, Build-Artefakte, `node_modules` oder Temp-Dateien.
- Historische Branch-Strukturen.
- Allein aus Dateinamen abgeleitete Produktannahmen.
- Doppelte Listen, die bereits in `architecture.md` oder `app-status.md` beschrieben sind.
