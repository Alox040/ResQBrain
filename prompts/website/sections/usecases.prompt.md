# ================================
# FILE: prompts/website/sections/usecases.prompt.md
# Blueprint Prompt: Use Cases Section
# ================================

## Ziel

Praxisnahe Einsatzszenarien zeigen.
Verschiedene Zielgruppen direkt ansprechen.
Nutzer erkennen sich in einem der Use Cases wieder.

---

## Zieldatei

`apps/website/components/sections/UseCasesSection.tsx`

---

## Section ID

`id="use-cases"`

---

## Inhalt

### Section-Überschrift
```
Für wen ist ResQBrain?
```

### Use Cases (4 Karten)

**1. Notfallsanitäter**
```
Rolle: Notfallsanitäter
Nutzen: Schneller Zugriff auf Algorithmen und Medikamente direkt im Einsatz
```

**2. Organisationen**
```
Rolle: Rettungsdienstorganisationen
Nutzen: Eigene Algorithmen und SOPs verwalten und freigeben
```

**3. Rettungsdienstschulen**
```
Rolle: Bildungseinrichtungen im Rettungsdienst
Nutzen: Lernalgorithmen bereitstellen und aktuell halten
```

**4. Ärztliche Leitung**
```
Rolle: Leitender Notarzt / Ärztliche Leitung Rettungsdienst
Nutzen: Inhalte freigeben, Versionen kontrollieren, Änderungen nachvollziehen
```

---

## Layout

- Hintergrund: slate-50 oder leichtes Gradient
- 4 Karten als Grid: 2x2 Desktop, 1 Spalte Mobile
- Karten gleich groß

---

## Visuell

### Use-Case-Card
- Icon oder Avatar-Platzhalter oben
- Rollenname als `text-xl font-semibold`
- Nutzentext als `text-base text-slate-600`
- Linker Akzentstreifen in Rot (Border-Left)

### Section-Überschrift
- Zentriert
- Label darüber: `"Zielgruppen"` in roter Farbe

---

## Regeln

- Genau 4 Use Cases — keine weiteren hinzufügen
- Rollenbezeichnungen aus docs/context/03-target-users.md prüfen
- Keine individuellen CTAs pro Card
- Statische Komponente

---

## Nicht erlaubt

- Testimonials (keine realen Nutzer vorhanden)
- Fotos
- Externe Links

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 5: docs/context/website-plan.md
- Zielgruppen Detail: docs/context/03-target-users.md
