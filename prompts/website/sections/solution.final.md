Erstelle die Datei `apps/website/components/sections/SolutionSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Die Lösung`
  - Einleitungssatz: `ResQBrain bringt medizinisches Wissen zentralisiert, versioniert und organisationsspezifisch an jeden Einsatzort.`
  - Lösungspunkte in exakt dieser Reihenfolge:
    1. `Versionierte Algorithmen`
    2. `Organisationsspezifische Inhalte`
    3. `Zentrale Medikamentenlisten`
    4. `SOP Verwaltung`
    5. `Schnelle Einsatzsuche`
    6. `Offline Architektur`
  - Nur für `Offline Architektur` zusätzlich Badge `Geplant`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="loesung"`.
- Dunkler Hintergrund als bewusster Kontrast zur Problem-Sektion.
- Heller Text.
- Zentrierte Überschrift und Einleitung.
- Punkte als vertikale Liste oder 2-Spalten-Grid mit sauberer, konsistenter Struktur.

Visuelle Anforderungen:
- Oberhalb der Überschrift ein rotes Label `Unsere Antwort`.
- Jeder Punkt mit Checkmark-Icon links.
- `Offline Architektur` erhält zusätzlich ein Badge `Geplant`.
- Die Section soll visuell als klare Antwort auf die Problem-Sektion lesbar sein.

Inhaltliche Regeln:
- Keine Detailbeschreibungen einzelner Features.
- Keine Screenshots.
- Keine Mockups.
- Keine Pricing-Hinweise.
- Keine externen Links.
- Reihenfolge exakt beibehalten.

Implementierungsregeln:
- Verwende semantisches HTML.
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Badge nicht als Klammertext lösen, sondern als eigenes visuelles Element.
- Erfinde keine weiteren Lösungspunkte.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/SolutionSection.tsx` zurück.
