# ================================
# FILE: prompts/website/sections/cta.prompt.md
# Blueprint Prompt: Call to Action Section
# ================================

## Ziel

Nutzer zur Interaktion bewegen.
Mehrere niedrigschwellige Einstiegspunkte anbieten.
Community-Charakter des Projekts betonen.

---

## Zieldatei

`apps/website/components/sections/CtaSection.tsx`

---

## Section ID

`id="cta"`

---

## Inhalt

### Section-Überschrift
```
Mach mit
```

### Unterzeile
```
ResQBrain wird gemeinsam mit der Community entwickelt.
Dein Feedback formt das Produkt.
```

### CTA-Optionen (5 Karten)

| Aktion | Beschreibung | Button-Label |
|---|---|---|
| Feedback geben | Teile deine Erfahrungen aus dem Rettungsdienst | `Feedback geben` |
| Idee einreichen | Schlage Features oder Verbesserungen vor | `Idee einreichen` |
| Pilotpartner werden | Teste ResQBrain in deiner Organisation | `Pilotpartner werden` |
| Projekt folgen | Bleib über Fortschritte informiert | `Folgen` |
| Community beitreten | Diskutiere mit anderen im Rettungsdienst | `Community beitreten` |

Alle Ziele sind Platzhalter (`#`) — werden in späterer Phase befüllt.

---

## Layout

- Hintergrund: Gradient oder kräftiges Dunkel (slate-900)
- Überschrift + Unterzeile zentriert oben
- CTA-Karten als Grid: 3+2 oder 5 nebeneinander Desktop, 1 Spalte Mobile

---

## Visuell

### CTA-Card
- Hintergrund: leicht aufgehellt (slate-800 auf dunklem BG)
- Icon oben
- Kurze Beschreibung
- Button unten (Primary oder Secondary je nach Priorität)

### Primäre CTAs (hervorgehoben)
- `Feedback geben`
- `Pilotpartner werden`

### Sekundäre CTAs
- Restliche drei

---

## Regeln

- Alle 5 CTAs anzeigen
- Keine echten Links bis Infrastruktur bereit — Platzhalter `href="#"`
- Primäre CTAs visuell stärker — nicht nur Farbe, auch Größe/Gewicht
- Statische Komponente

---

## Nicht erlaubt

- E-Mail-Eingabe / Newsletter-Formular (noch nicht gebaut)
- Externe Tracking-Pixel
- Preisliste

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 7: docs/context/website-plan.md
