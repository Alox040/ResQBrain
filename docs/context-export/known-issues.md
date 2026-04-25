# Bekannte Themen & Risiken (Export)

**Stand:** 12. April 2026 — nur Einträge mit **Beleg** in Repo-Doku oder konkreten Dateien. Keine Build-Lauf-Verifikation in dieser Session.

---

## Aus Projekt-Dokumentation

| Thema | Beleg |
|-------|--------|
| Domain-Tests / Algorithm-Modell | `docs/roadmap/PROJECT_ROADMAP.md`: „Offen: Domain-`test:content` / Graph-`createAlgorithm` an Entity-Modell angleichen.“ |
| Expo-Doctor / Dependency-Hinweise | `docs/context/12-next-steps.md`: `expo-doctor`-Hinweise (Beispiel `@expo/vector-icons`-Version) „bereinigen, wenn relevant“. |
| ESLint Mobile | `apps/mobile-app/package.json` Script `lint` meldet explizit: keine ESLint-Konfiguration. |
| Datenqualität (historisch Plattform-Baseline) | `docs/context/11-implementation-baseline.md`: Seed-Duplikate/Textinkonsistenzen als bekanntes Thema der Prototyp-Ära. |

---

## Struktur / Routing (Repo)

| Thema | Beleg |
|-------|--------|
| Zwei mögliche „Website“-Wurzeln | Root-Verzeichnis `app/` mit Next-App-Router-Dateien vs. deploytes Projekt `apps/website` laut Root-`vercel.json` — Root hat **kein** `next.config.*`; Risiko der Verwechslung bei Bearbeitung. |
| Umfrage-URLs | `apps/website/lib/site/survey.ts` vs. `docs/context/website-config.json` — unterschiedliche Links (manueller Abgleich nötig für „eine Wahrheit“). |

---

## Encoding

| Thema | Beleg |
|-------|--------|
| Mojibake in Kommentar | `apps/mobile-app/src/lookup/loadLookupBundle.ts`: Kommentar enthält eine kaputte Mojibake-Zeichenfolge statt erwarteter Satzzeichen — Datei-basiert. |

---

## Build / CI

| Thema | Beleg |
|-------|--------|
| Keine GitLab CI-Datei im Root | Suche ergab keine `.gitlab-ci*.yml` — kein automatisierter CI-Pfad aus diesem Artefakt ersichtlich. |
| Vercel Branch-Filter | `scripts/vercel-ignore.js`: Builds auf Nicht-`main`/`master` werden übersprungen — kann als „Deployment erscheint nicht“ interpretiert werden, ist aber beabsichtigte Logik. |

---

## SDK / Workspace

| Thema | Beleg |
|-------|--------|
| `apps/api` ohne `package.json` | Ordner existiert, ist aber **nicht** in `pnpm-workspace.yaml` als App gelistet — ggf. verwaister oder manuell genutzter Codepfad. |
| TypeScript-Versionen | Root `devDependencies` TypeScript 5.7; `apps/website` und `packages/domain` listen TypeScript 6.x — belegte Versionsheterogenität zwischen Paketen. |

---

## Nicht belegt (keine Einträge)

- Konkrete **Build-Fehler-Logs** aus CI — in diesem Export nicht eingesehen.
- Spezifische **Navigation-Bugs** in der Mobile-App — keine Issue-Liste in den gelesenen Dateien.
- Produktions-**Deployment-Warnungen** von Vercel — nicht im Repo-Text dokumentiert.
