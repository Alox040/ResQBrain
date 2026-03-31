# Next Steps

**Last Updated:** 2026-03-31

Nur konkrete naechste Tasks fuer den aktuellen MVP-Pfad (aus Repo-Zustand abgeleitet):

## 1) Offline-Bundle jenseits "embedded"

- `lookupSource`-Schichten sind vorbereitet, aber nur `embedded` ist aktiv.
- Geraete-seitige Bundle-Persistenz/Ersetzung (cached/updated/fallback) ist offen.

## 2) Sync-/Update-Konzept

- Kein Netzwerk-Sync fuer medizinische Inhalte im App-Code.
- Update-Pfad fuer neue Bundle-Versionen ist offen.

## 3) Datenpfad konsolidieren

- Mobile-App nutzt `data/lookup-seed/*` direkt; keine Nutzung von `@resqbrain/domain`.
- Mapping/Vertragsklarheit zwischen Seed-JSON, App-Typen und Domain-Entitaeten fehlt als umgesetzter Laufzeitpfad.

## 4) Website-Validierungsskripte aktualisieren

- `scripts/validate-routing.ts` und `scripts/validate-content-isolation.ts` sind vorhanden.
- Bindung an aktive `apps/website`-Struktur ist UNVERIFIED in dieser Synchronisierung.

## 5) Deployment-Status sauber dokumentieren

- Vercel-Konfigurationen sind vorhanden (`vercel.json` Root, `apps/website/vercel.json`, `apps/website-old/vercel.json`).
- Produktiver Deployment-Status bleibt UNVERIFIED ohne Dashboard/API-Nachweis.

## Last synchronized

- 2026-03-31

## Verification basis

- `apps/mobile-app/src/navigation/AppNavigator.tsx`
- `apps/mobile-app/src/screens/*`
- `apps/mobile-app/src/lookup/*`
- `data/lookup-seed/*`
- `apps/website/app/*`
- `scripts/validate-routing.ts`
- `scripts/validate-content-isolation.ts`
- `vercel.json`, `apps/website/vercel.json`, `apps/website-old/vercel.json`
