# ================================
# FILE: prompts/website/sections/hero.prompt.md
# Blueprint Prompt: Hero Section
# ================================

## Ziel

Erster Eindruck der ResQBrain Landingpage.
Projekt sofort verständlich machen.
Zwei CTAs sichtbar anbieten.
Projektstatus transparent kommunizieren.

---

## Zieldatei

`apps/website/components/sections/HeroSection.tsx`

---

## Section ID

`id="hero"`

---

## Inhalt

### Hauptüberschrift
```
ResQBrain
```

### Unterzeile
```
Die Wissensplattform für den Rettungsdienst
```

### Keyword-Tags (visuell als Badge-Reihe)
```
Algorithmen  |  Medikamente  |  SOPs
```

### Feature-Bullets (3 kurze Punkte)
```
✓ Versioniert
✓ Organisationsspezifisch
✓ Schnell im Einsatz verfügbar
```

### Status-Banner (unterhalb der Bullets)
```
Frühe Entwicklungsphase — Community-Feedback aktiv
```

### CTA Buttons
- Primär:   `Feedback geben`  → Ziel: `#feedback` (Platzhalter)
- Sekundär: `Pilotpartner werden` → Ziel: `#cta`

---

## Layout

- Vollbild-Sektion (min-height: 100vh oder 90vh)
- Zentriert (vertikal + horizontal)
- Hintergrund: dunkel (slate-900) mit leichtem Gradient oder Pattern
- Text: weiß

---

## Visuell

- Headline: größte Schriftgröße der Seite (`text-5xl md:text-7xl font-bold`)
- Keyword-Tags: Badges nebeneinander, leicht transparent
- Status-Banner: kleines Badge in gelb/amber ("Early Stage")
- CTA-Buttons: nebeneinander auf Desktop, untereinander auf Mobile

---

## Regeln

- Keine Animationen außer dezentes Fade-in beim Load
- Kein Bild / keine Illustration im MVP
- Status-Banner immer sichtbar — nicht ausblendbar
- "use client" nicht nötig (rein statisch)

---

## Nicht erlaubt

- Video-Hintergrund
- Slider / Carousel
- Countdown-Timer
- Externe Abhängigkeiten

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 1: docs/context/website-plan.md
