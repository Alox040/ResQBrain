# architecture

Stand: April 2026

## Aktuelle Schichten

### Presentation (implementiert)

**Mobile App** (`apps/mobile-app`, Expo/React Native, TypeScript)
- `src/screens/` — Home, Search, Settings, MedicationList, MedicationDetail, AlgorithmList, AlgorithmDetail, History
- `src/features/` — History, Favorites, Lookup, References (VitalReference), Feedback
- `src/navigation/` — AppNavigator (Bottom-Tab + Stack), homeStackParamList
- `src/data/` — contentIndex (Einziger produktiver Init-Einstiegspunkt), ViewModel-Adapter
- `src/lookup/` — Bundle-Loading, Validierung, Cache, Update-Infrastruktur (deaktiviert)
- `src/lib/lookup-api/` — HTTP-Client (bewusst deaktiviert)
- `src/state/` — favoritesStore, recentStore
- `src/theme/` — ThemeContext, Palette
- `src/types/` — Content-Typen (ContentItem, Medication, Algorithm, ContentKind, ContentCategory)
- `src/ui/` — UI-Komponentenbibliothek

**Website** (`apps/website`, Next.js App Router, TypeScript)
- `app/` — Route-Handler (page.tsx je Route)
- `components/sections/` — HeroSection, ProblemSection, IdeaProjectGoalSplitSection, StatusSection, AudienceSection, MitwirkungSection, FaqSection
- `components/layout/` — SiteHeader, Footer
- `lib/site/` — homeContent, survey, routes, updates-form, public-links

### Domain / Application / API (geplant, nicht implementiert)

- `packages/domain` — Ordner vorhanden, kein Code
- `packages/application` — Ordner vorhanden, kein Code
- `packages/api` — Ordner vorhanden, kein Code

### Daten

- `data/schemas/` — Schemas und Seed-Beispiele
- Mobile Lookup-Bundle: eingebettet in App-Build (compile-time), kein externer Datenzugriff zur Laufzeit

## Wichtige Module

| Modul | Pfad | Funktion |
|---|---|---|
| contentIndex | `src/data/contentIndex.ts` | Einziger Init-Einstiegspunkt; `ensureContentStoreReady()` lädt Embedded-Bundle, idempotent |
| AppNavigator | `src/navigation/AppNavigator.tsx` | Bottom-Tab + Stack-Navigation |
| LookupRamStore | `src/lookup/loadLookupBundle.ts` | In-Memory-Datenstruktur für alle Lookup-Inhalte |
| lookup-api/client | `src/lib/lookup-api/client.ts` | HTTP-Client, bewusst deaktiviert; jeder Aufruf wirft `LOOKUP_HTTP_DISABLED` |
| bundleUpdateService | `src/lookup/bundleUpdateService.ts` | Update-Infrastruktur; `downloadBundle()` gibt immer `{status: 'error', reason: 'network'}` zurück |
| fetchRemoteManifest | `src/lookup/fetchRemoteManifest.ts` | Deaktiviert; gibt immer `{status: 'error', reason: 'offline'}` zurück |
| homeContent | `apps/website/lib/site/content.ts` | Zentrale Inhaltsdaten der Startseite |

## Bekannte Architekturprobleme

- HTTP-Client und gesamter Remote-Update-Pfad sind als Dead-Code im Repository vorhanden (bewusste Phase-0-Entscheidung, aber nicht entfernt).
- `packages/domain`, `packages/application`, `packages/api` existieren nur als leere Ordner — die geplante Domain-Schicht ist nicht implementiert.
- Mobile Lookup-Modell (Phase-0) und das geplante Plattform-Domain-Modell sind konzeptionell verwandt, aber das Mapping ist noch nicht definiert.
- Website hat zwei semantisch ähnliche Routen (`/mitwirkung` und `/mitwirken`), beide in der Hauptnavigation aktiv.
- Root-Verzeichnis enthält `app/`, `lib/`, `components/`, `src/` parallel zu `apps/website/` — Verwechslungsgefahr für AIs und neue Entwickler.
