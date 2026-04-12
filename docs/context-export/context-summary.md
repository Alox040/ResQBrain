# Kontext-Zusammenfassung (Export)

**Stand:** 12. April 2026 — für Einfügen in externe Planungstools (z. B. ChatGPT) zusammengefasst.

---

## Aktueller Stand

ResQBrain ist ein **pnpm-Monorepo** mit einer **Expo-Mobile-App** (Phase-0-Lookup: Medikamente & Algorithmen aus **eingebettetem** JSON-Bundle, lokale Suche), einem **Next.js-Website-Paket** unter `apps/website` (Vercel-Deploy laut `vercel.json`), und einem **ausgebauten Domain-Paket** (`packages/domain`) inkl. Versioning und `ReleaseEngine` — **ohne** Anbindung dieser Domain an die Mobile-App zur Laufzeit (laut `12-next-steps.md`).

---

## Was funktioniert (code-/dokumentiert)

- Mobile: Navigation mit Tabs und Stacks; Listen, Details, Suche, Favoriten, Verlauf, Dosisrechner, Vitalreferenz, Einstellungen; Lookup-Load aus `apps/mobile-app/data/lookup-seed/`.
- Website: App-Router-Seiten inkl. Mitwirken mit API-Route und Formular.
- Domain/Application/API-Pakete: strukturierte Entities, Services, Tests (teilweise) und Compile-Scripts.
- Tooling: `pnpm verify` orchestriert Website-Build, Routing-/Content-Checks und Mobile-Verify.

---

## Was fehlt oder nur vorbereitet ist

- Bundle **ersetzen** oder **persistieren** über reines Embed hinaus; **kein** Netzwerk-Sync laut Roadmap/Next Steps.
- Produktive Auth, Multi-Tenant-Runtime, Content-Editor, vollständiger Release-Distribution-Pfad zur App — in MVP/Post-MVP-Doku zurückgestellt oder nicht begonnen.
- Mobile: kein ESLint-Setup; `lookupSource`-Erweiterungen außer `embedded` nicht produktiv geschaltet.

---

## Höchste Priorität (aus interner Roadmap)

1. **Bundle-Persistenz und Schichten** (`lookupSource`: cached/updated/fallback) ohne Embedded zu brechen.  
2. **Sync-/Lieferkonzept** für zukünftige Bundle-Updates.  
3. **Domain-Testabgleich** (`test:content` / Algorithm-Graph vs. Entity-Modell).  
4. **Pilot/Seed** festziehen.

---

## Empfohlene nächste Schritte (analytisch, keine Umsetzung)

- Externe Planung sollte **Phase-0-Mobile** und **Plattform-Domain** getrennt modellieren (zwei Datenmodelle).  
- Klären, ob **`survey.ts`** oder **`website-config.json`** die autoritative Umfrage-URL trägt.  
- Root-`app/` vs. `apps/website` bei jeder Website-Änderung explizit zuordnen, um falsche Dateien zu vermeiden.  
- Nach Festlegung des Bundle-Lieferwegs: End-to-End-Workflow „Build Seed → signieren/packen → Gerät → Fallback“ dokumentieren.
