# ================================
# FILE: prompts/website/sections/solution.prompt.md
# Blueprint Prompt: Solution Section
# ================================

## Ziel

ResQBrain als Antwort auf die zuvor genannten Probleme vorstellen.
Klare Verbindung Problem → Lösung herstellen.
Kein Feature-Detail — nur Überblick.

---

## Zieldatei

`apps/website/components/sections/SolutionSection.tsx`

---

## Section ID

`id="loesung"`

---

## Inhalt

### Section-Überschrift
```
Die Lösung
```

### Einleitungssatz
```
ResQBrain bringt medizinisches Wissen zentralisiert, versioniert und organisationsspezifisch an jeden Einsatzort.
```

### Lösungs-Liste (6 Punkte)
```
1. Versionierte Algorithmen
2. Organisationsspezifische Inhalte
3. Zentrale Medikamentenlisten
4. SOP Verwaltung
5. Schnelle Einsatzsuche
6. Offline Architektur (geplant)
```

---

## Layout

- Hintergrund: dunkel (slate-900) — bewusster Kontrast zur Problem-Sektion
- Text: weiß
- Punkte als vertikale Liste oder 2-Spalten-Grid
- Einleitungssatz zentriert und groß

---

## Visuell

### Lösungs-Item
- Checkmark-Icon (grün) links
- Text rechts
- Items mit "geplant" bekommen Badge `Geplant` in slate-Farbe

### Section-Überschrift
- Zentriert
- Label darüber: `"Unsere Antwort"` in roter Farbe

### Übergangseffekt
- Visuell als "Flip" von Problem zu Lösung lesbar
- Gleiche Grid-Struktur wie Problem-Section für visuelle Konsistenz

---

## Regeln

- Punkte mit "(geplant)" erhalten Badge — nicht einfach eingeklammert lassen
- Keine detaillierten Feature-Beschreibungen — das kommt in Features-Section
- Reihenfolge exakt wie im Inhalt oben
- Statische Komponente

---

## Nicht erlaubt

- Screenshots oder Mockups der App
- Pricing-Hinweise
- Externe Links

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 3: docs/context/website-plan.md
- Produktvision: docs/context/01-product-vision.md
