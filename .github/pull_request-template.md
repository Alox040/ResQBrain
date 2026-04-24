# Zweck des PR

## Was wird geändert?
<!-- Kurz beschreiben -->

## Warum ist diese Änderung notwendig?
<!-- Kontext / Problem / Ziel -->

## Betroffene Bereiche
- [ ] Content
- [ ] Suche
- [ ] UI/UX
- [ ] Versionierung
- [ ] Offline
- [ ] Architektur
- [ ] Sonstiges

---

# MDR-Safe Review

## Regulatory Boundary geprüft?
- [ ] Ich habe `docs/context/regulatory-boundary.md` gelesen und geprüft.

## Enthält dieser PR verbotene Logik?
- [ ] Keine Entscheidungslogik
- [ ] Keine Empfehlung / Priorisierung
- [ ] Keine patientenspezifische Verarbeitung
- [ ] Keine Dosierungsberechnung
- [ ] Keine klinische Interpretation
- [ ] Keine KI-gestützte medizinische Bewertung

## UI/UX geprüft?
- [ ] Keine Labels wie „Empfohlen“, „Nächster Schritt“, „Jetzt durchführen“
- [ ] Keine visuelle medizinische Priorisierung
- [ ] Neutrale Darstellung ohne Guidance

## Architektur geprüft?
- [ ] Kein Decision Layer eingeführt
- [ ] Kein Clinical Logic Layer eingeführt
- [ ] Kein AI Recommendation Layer eingeführt

---

# Technische Validierung

## Checks
- [ ] TypeScript Build / Typecheck erfolgreich
- [ ] Bestehende Funktionen nicht regulatorisch verschärft
- [ ] Keine riskanten Funktionsnamen eingeführt (`recommend*`, `calculate*`, `suggest*`, `evaluate*`)

---

# Risiko-Einschätzung

## Einschätzung dieses PR
- [ ] SAFE
- [ ] REVIEW NEEDED
- [ ] AT RISK

## Falls REVIEW NEEDED / AT RISK:
<!-- kurz begründen -->

---

# Zusätzliche Hinweise
<!-- optional -->