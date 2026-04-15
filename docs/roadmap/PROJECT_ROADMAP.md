# Projekt-Roadmap

**Stand:** 15. April 2026 (abgeglichen mit Repo, Domain-Release-Slice, Website-Build, Mobile-`verify`)

## Legende

- [x] **Implementiert** — im Code vorhanden, für den beschriebenen Umfang nutzbar
- [~] **Teilweise** — Kern da, bewusste Einschränkungen oder ohne Folgefeatures
- [ ] **Ausstehend** — nicht begonnen oder nur vorbereitet (Architektur/Doku)
- [–] **Zurückgestellt** — nicht im aktuellen Fokus

---

## Phase 0 — Lookup App

**Ziel:** Medikamente und Algorithmen finden — offline, in Sekunden.

| Punkt | Status |
|-------|--------|
| Architektur- und Terminologie-Basis | [x] |
| Domain-Paket (Typen, Invarianten) | [~] — Release-Subsystem (`ReleaseBundle`, `ReleaseEngine`) im Code; Content-Entity-Tests teilweise hinter Modell (Algorithm) |
| Öffentliche Website (Landing, Legal) | [x] |
| Website Messaging auf Einsatzfokus | [x] |
| Seed-Daten aufbereiten (Medikamente + Algorithmen) | [x] |
| Lookup-Bundle-Loader (`loadLookupBundle`, `contentIndex`) | [x] |
| Start/Home (Mobile): Schnellzugriff, Favoriten-/Verlauf-Kacheln | [x] |
| Medikamentenliste (Mobile) | [x] |
| Algorithmenliste (Mobile) | [x] |
| Medikamentendetail (Mobile) | [x] |
| Algorithmusdetail / Schrittansicht (Mobile, linear) | [x] |
| Suchscreen (Mobile) | [x] |
| Suche: Ranking (Begriffe, Indikation, Sekundärfelder), Inhalts-Filter | [x] |
| Offline: eingebettetes Bundle laden (ohne Netzwerkzwang) | [x] |
| Schnelle lokale Suche (Ziel unter 3 s — ohne formales Monitoring) | [x] |
| **Nutzerdaten persistent:** Favoriten + Verlauf (`AsyncStorage`) | [x] |
| **Lookup-Bundle** auf Gerät (AsyncStorage) — neueres persistiertes Bundle vor Embedded | [x] |
| **Optional: HTTP-Bundle-URL** (`EXPO_PUBLIC_LOOKUP_BUNDLE_URL`) — Fetch, Validierung, Speicherung | [~] — kein Org-/Signatur-Produkt |
| **Offline-Update-Vorbereitung** (`lookupSource.ts` vs. `loadLookupBundleWithSource`) | [~] — zwei Pfade im Code; Start nutzt `loadLookupBundle.ts` |
| Sync / mandantenfähige Release-Pipeline (Backend, Push, Org-Scope) | [ ] |
| Einsatz-optimierte UI (Schriftgröße, Kontrast, schnelle Navigation — iterativ) | [~] |
| Pilot-Wache als feste Konfiguration (fachlich / Seed; kein Login) | [~] |

---

## Phase 1 — Einsatz Features

| Punkt | Status |
|-------|--------|
| Dosierungsrechner (gewichtsbasiert, Parser aus Dosistext) | [~] |
| Vitalwert-Referenzen nach Altersgruppe (statisch in App) | [x] |
| Favoriten (Medikamente + Algorithmen) | [x] |
| Verlauf (zuletzt aufgerufen, cap 30) | [x] |
| View-Model-Adapter (Bundle vs. UI) | [x] |
| Hintergrund-Bundle-Check bei konfigurierter URL | [~] — Poll/Fetch, kein Push |

**Hinweise:**

- **Dosisrechner:** nur wenn `mg`/`µg`-pro-kg im Freitext erkannt wird; sonst Hinweis ohne Rechnung.
- **Phase-0/1-Überlapp:** Favoriten/Verlauf sind sowohl in Phase 0 (Nutzerfluss) als auch hier als „Einsatz-Features“ gelistet — einmalig implementiert.

---

## Phase 2 — Lernen

| Punkt | Status |
|-------|--------|
| Lernmodus für Algorithmen | [–] |
| Quiz / Selbsttests | [–] |
| Fortschritt-Tracking | [–] |
| Fallbasiertes Lernen | [–] |
| Spaced Repetition | [–] |

---

## Phase 3 — Organisation

| Punkt | Status |
|-------|--------|
| Organisationsspezifische Inhalte | [–] |
| Multi-Tenant / Tenant Isolation | [–] |
| Freigabeprozesse (Draft → Approved → Released) | [–] |
| Rollen-Modell | [–] |
| Content-Editor (Algorithmen, Medikamente) | [–] |
| Audit-Log | [–] |

---

## Phase 4 — KI

| Punkt | Status |
|-------|--------|
| Symptom-Suche → Algorithmus-Vorschlag | [–] |
| Kontextbezogene Medikamenten-Vorschläge | [–] |
| Dosierungsassistent | [–] |
| Intelligente Suche (Synonyme, Tippfehler) | [–] |
| Lücken-Erkennung je Organisation | [–] |

---

## Nächste Aktion

1. **Bundle-Persistenz / Ersetzung:** Konkretisieren, wie `lookupSource` künftig „updated/cached/fallback“ befüllt (ohne bestehende Embedded-Quelle zu brechen).  
2. **Sync-Konzept** (inhaltlich + technisch), sobald Bundle-Lieferung geklärt ist.  
3. **Seed & Pilot:** Daten und Bundle-Metadaten für Feldversuch festziehen.  
4. **Einsatz-UI** und ggf. **expo-doctor**-Abweichungen bei Bedarf bereinigen.

Dokumentation zur lokalen Prüfung: `docs/context/mobile-validation-checklist.md`.

**Letzte Repo-Validierung (15. Apr. 2026):** `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` (ohne `*.test.ts`), `compile:versioning`, `compile:release`, `pnpm build`, `pnpm --filter @resqbrain/website run typecheck`, `pnpm mobile:verify` — erfolgreich (lokal).  
**Offen:** Domain-`test:content` / Graph-`createAlgorithm` an Entity-Modell angleichen; Lookup-Lade-Pfade (`lookupSource` vs. `loadLookupBundle`) konsolidieren oder klar dokumentieren.
