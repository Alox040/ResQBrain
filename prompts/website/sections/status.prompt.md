# ================================
# FILE: prompts/website/sections/status.prompt.md
# Blueprint Prompt: Projektstatus Section
# ================================

## Ziel

Aktuellen Entwicklungsstand transparent kommunizieren.
Vertrauen durch Ehrlichkeit aufbauen.
Pilotpartner und Community ansprechen.

---

## Zieldatei

`apps/website/components/sections/StatusSection.tsx`

---

## Section ID

`id="status"`

---

## Inhalt

### Section-Überschrift
```
Projektstatus
```

### Status-Schritte (Timeline / Roadmap)

```
[✓] Frühe Entwicklungsphase
[✓] Architekturphase
[→] Community Feedback Sammlung   ← aktuell aktiv
[ ] Pilotbetrieb
[ ] MVP Release
```

### Textblock
```
ResQBrain befindet sich in der frühen Entwicklungsphase.
Die Architektur ist definiert. Jetzt suchen wir Feedback und Pilotpartner aus dem Rettungsdienst.
```

### Badge
```
Early Stage — Offen für Feedback
```

---

## Layout

- Hintergrund: weiß
- Timeline vertikal (Mobile) / horizontal (Desktop)
- Aktiver Schritt visuell hervorgehoben

---

## Visuell

### Timeline-Item
- Abgeschlossen: grüner Kreis mit Checkmark
- Aktiv: roter Kreis mit Pfeil + Puls-Animation
- Ausstehend: grauer leerer Kreis
- Verbindungslinie zwischen Items

### Textblock
- Zentriert unter der Timeline
- `text-base text-slate-600 max-w-xl`

### Status-Badge
- Amber/Gelb (`Geplant`-Variante aus Design System)
- Zentriert über oder unter dem Textblock

---

## Regeln

- Aktuell aktiver Schritt ist "Community Feedback Sammlung"
- Keine konkreten Datumsangaben
- Puls-Animation nur auf aktivem Schritt — dezent
- Statische Komponente (kein API-Fetch für Status)

---

## Nicht erlaubt

- Fortschrittsbalken in Prozent
- Versionsnummern
- Commit-Aktivität / GitHub-Widget

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 6: docs/context/website-plan.md
- Implementierungsstand: docs/context/11-implementation-baseline.md
- Nächste Schritte: docs/context/12-next-steps.md
