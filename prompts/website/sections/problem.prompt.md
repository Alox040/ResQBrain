# ================================
# FILE: prompts/website/sections/problem.prompt.md
# Blueprint Prompt: Problem Section
# ================================

## Ziel

Reale Probleme im Rettungsdienst darstellen.
Nutzer abholen, die diese Probleme kennen.
Keine Lösung zeigen — nur das Problem benennen.

---

## Zieldatei

`apps/website/components/sections/ProblemSection.tsx`

---

## Section ID

`id="problem"`

---

## Inhalt

### Section-Überschrift
```
Das Problem
```

### Unterzeile (optional)
```
Wissen im Rettungsdienst ist fragmentiert
```

### Problem-Liste (6 Punkte)
```
1. Unterschiedliche Algorithmen je nach Region
2. Medikamentenlisten nicht zentral gepflegt
3. SOPs in PDFs oder Dokumenten verteilt
4. Änderungen schwer nachvollziehbar
5. Wissen auf mehrere Quellen verteilt
6. Keine zentrale Wissensplattform
```

---

## Layout

- Hintergrund: hell (weiß oder slate-50)
- Punkte als Grid: 2 Spalten Desktop, 1 Spalte Mobile
- Jeder Punkt als Card mit Icon + Text

---

## Visuell

### Problem-Card
- Icon links (Warning / X / Ausrufezeichen — Tailwind-kompatibles Icon-Set)
- Kurzer Text rechts
- Kein Hover-Effekt nötig
- Hintergrund: weiß, Border: slate-200

### Section-Überschrift
- Zentriert
- `text-3xl font-bold`
- Roter Akzent-Underline oder Label darüber: `"Herausforderung"`

---

## Regeln

- Keine Lösungshinweise in dieser Sektion
- Jedes Problem als eigenständige Card
- Reihenfolge exakt wie im Inhalt oben
- Statische Komponente — kein State

---

## Nicht erlaubt

- CTA-Buttons in dieser Sektion
- Links zu externen Quellen
- Statistiken oder Zahlen (nicht belegt)

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 2: docs/context/website-plan.md
- Problemraum Detail: docs/context/02-problem-space.md
