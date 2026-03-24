# ================================
# FILE: prompts/website/sections/footer.prompt.md
# Blueprint Prompt: Footer Section
# ================================

## Ziel

Abschluss der Seite mit Markenidentität, Links und Projektstatus-Hinweis.
Schlicht, keine Ablenkung vom CTA darüber.

---

## Zieldatei

`apps/website/components/sections/Footer.tsx`

---

## Section ID

`id="footer"`
Tag: `<footer>`

---

## Inhalt

### Marke (links oder zentriert)
```
ResQBrain
Wissensplattform für den Rettungsdienst
```

### Projekthinweis
```
Community-getriebene Entwicklung · Early Stage Projekt
```

### Links

| Label | Ziel |
|---|---|
| GitHub | Externer Link (Platzhalter) |
| Reddit | Externer Link (Platzhalter) |
| Kontakt | `mailto:` Platzhalter |
| Feedback | `#feedback` |

### Copyright
```
© 2025 ResQBrain — Kein kommerzielles Produkt
```

---

## Layout

- Hintergrund: slate-900 (dunkel)
- Text: slate-400 (gedimmt)
- Zweispaltig: Marke links / Links rechts — auf Mobile einspaltig zentriert
- Schmale Sektion (kein großes Padding)

---

## Visuell

- Markenname: weiß, `font-semibold`
- Projekthinweis: `text-sm text-slate-400`
- Links: `text-sm text-slate-400 hover:text-white`
- Copyright: `text-xs text-slate-600` ganz unten
- Trennlinie oben: `border-t border-slate-800`

---

## Regeln

- Keine Social-Media-Icons — nur Text-Links
- Alle externen Links: `target="_blank" rel="noopener noreferrer"`
- Copyright-Zeile immer letzte Zeile
- Keine Navigation-Anker wiederholen (Navigation oben reicht)

---

## Nicht erlaubt

- Newsletter-Eingabe
- Sitemap mit vielen Unterseiten
- Cookie-Banner (wird separat behandelt)

---

## Referenzen

- Design System: prompts/website/components/design-system.prompt.md
- Website Plan Section 8: docs/context/website-plan.md
