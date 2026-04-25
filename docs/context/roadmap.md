# roadmap

Stand: April 2026

## Sofort umsetzbar (keine Voraussetzungen)

1. `.gitignore` bereinigen: `tsconfig.tsbuildinfo`, `.next/`, `dist-validation/metadata.json` entfernen
2. Root-Level-Duplikate klären: `lib/`, `app/`, `components/`, `src/` im Root — produktiv oder entfernen?
3. `/mitwirkung` vs. `/mitwirken` entscheiden — eine Route entfernen oder Zweck klar trennen
4. Website-Build lokal verifizieren — EPERM-Problem auf Windows diagnostizieren

## Phase-0 Abschluss (Lookup-Kern stabilisieren)

5. Seed-Daten-Qualität prüfen: Vollständigkeit und Korrektheit der eingebetteten Medikamenten- und Algorithmen-Daten
6. API-Test-Pipeline reparieren: `tsx --test` EPERM-Problem diagnostizieren (Umgebungsproblem Windows)
7. HTTP-Client-Dead-Code entscheiden: entweder vollständig entfernen oder für Phase-2 als Stub markieren und dokumentieren

## Phase-1 Vorbereitung (Domain-Grundlagen)

8. `packages/domain` initialisieren: erste Domain-Entities aus `docs/architecture/domain-model.md` implementieren
9. `packages/application` initialisieren: Port-Interfaces für zukünftige Dienste
10. Mapping zwischen Mobile-Lookup-Modell und Plattform-Domain-Modell spezifizieren

## Phase-2 Vorbereitung (Remote-Updates)

11. Remote-Update-Konzept spezifizieren: welche Infrastruktur (Manifest, Bundle-Download, `bundleUpdateService`) bleibt, welche wird ersetzt
12. Backend-Anforderungen für Manifest-Service definieren

## Nicht umsetzbar ohne Voraussetzungen (Phase-2+)

- Remote-Bundle-Updates: erfordert produktiven Backend-Service und Manifest-Endpoint
- Authentifizierung: erfordert Entscheidung über Auth-Provider
- Multi-Tenant-Logik: erfordert implementiertes Domain-Modell
- ContentPackage-Freigabe-Workflow: erfordert Governance-Infrastruktur und Rollen-System
