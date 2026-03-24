# ================================
# FILE: prompts/website/sections/features.prompt.md
# Blueprint Prompt: Features Section
# ================================

## Ziel

Konkrete Features von ResQBrain übersichtlich darstellen.
Zwischen verfügbaren und geplanten Features differenzieren.

---

## Zieldatei

`apps/website/components/sections/FeaturesSection.tsx`

---

## Section ID

`id="features"`

---

## Inhalt

### Section-Überschrift
```
Features
```

### Feature-Liste

| Feature | Status |
|---|---|
| Versionierte Algorithmen | Verfügbar |
| Medikamentenlisten | Verfügbar |
| SOP Verwaltung | Verfügbar |
| Mehrere Organisationen | Verfügbar |
| Offline Zugriff | Geplant |
| KI Suche | Geplant |

---

## Layout

- Hintergrund: weiß oder slate-50
- Features als Card-Grid: 3 Spalten Desktop, 2 Spalten Tablet, 1 Spalte Mobile
- Jede Feature-Card gleich groß

---

## Visuell

### Feature-Card
- Icon oben (thematisch passend — Platzhalter-Icon genügt im Blueprint)
- Feature-Name als `text-xl font-semibold`
- Status-Badge unten rechts:
  - "Verfügbar" → Badge grün
  - "Geplant" → Badge slate/grau

### Section-Überschrift
- Zentriert
- Label darüber: `"Was ResQBrain kann"` in roter Farbe

---

## Icon-Zuordnung (Vorschlag für Codex)

| Feature | Icon-Stichwort |
|---|---|
| Versionierte Algorithmen | `git-branch` / `layers` |
| Medikamentenlisten | `pill` / `list` |
| SOP Verwaltung | `file-text` / `clipboard` |
| Mehrere Organisationen | `building` / `users` |
| Offline Zugriff | `wifi-off` / `download` |
| KI Suche | `search` / `sparkles` |

Icon-Set: Lucide React (empfohlen) oder Heroicons

---

## Regeln

- Alle 6 Features anzeigen — keine ausblenden
- Status-Badge pflichtmäßig auf jeder Card
- Keine Feature-Detail-Seite verlinken (nicht vorhanden)
- Statische Komponente

---

## Nicht erlaubt

- Feature-Vergleichstabellen
- Pricing neben Features
- Externe Links aus Feature-Cards

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 4: docs/context/website-plan.md
- MVP Scope: docs/context/04-mvp-scope.md
