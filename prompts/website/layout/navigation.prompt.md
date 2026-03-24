# ================================
# FILE: prompts/website/layout/navigation.prompt.md
# Blueprint Prompt: Navigation
# ================================

## Ziel

Sticky Top-Navigation für die ResQBrain Landingpage.
Anker-basierte Navigation zu den Hauptsektionen.
Responsiv: Desktop Menü + Mobile Hamburger.

---

## Zieldatei

`apps/website/components/layout/Navigation.tsx`

---

## Einbindung

In `apps/website/app/layout.tsx` als oberste Komponente.

---

## Inhalt

### Logo / Marke
- Text: `ResQBrain`
- Links zur Startseite (`/` oder `#hero`)

### Navigationslinks (Desktop)
| Label | Ziel |
|---|---|
| Problem | `#problem` |
| Lösung | `#loesung` |
| Features | `#features` |
| Use Cases | `#use-cases` |
| Status | `#status` |

### CTA Button (rechts)
- Label: `Feedback geben`
- Ziel: externer Link (Platzhalter `#feedback`)
- Visuell hervorgehoben (Primary Button aus Design System)

---

## Verhalten

- Sticky: bleibt beim Scrollen oben sichtbar
- Hintergrund: leicht transparent mit Backdrop-Blur, wird bei Scroll opak
- Aktiver Abschnitt wird in der Nav visuell markiert (Intersection Observer)
- Mobile: Hamburger-Icon öffnet vertikales Drawer-Menü
- Mobile Menü schließt bei Link-Klick

---

## Barrierefreiheit

- `<nav>` mit `aria-label="Hauptnavigation"`
- Hamburger-Button mit `aria-expanded` und `aria-controls`
- Fokus-Reihenfolge korrekt (Desktop + Mobile)

---

## Regeln

- Keine externe Routing-Bibliothek — nur Anker-Links
- Kein Zustand außer: Menü offen/geschlossen + aktiver Abschnitt
- Komponente ist "use client" wegen Scroll-Listener und Menü-State

---

## Nicht erlaubt

- Authentifizierungs-Links
- Dropdown-Menüs
- Externe Abhängigkeiten außer Next.js und React

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Landingpage: prompts/website/landingpage/landingpage-structure.prompt.md
