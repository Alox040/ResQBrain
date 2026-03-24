Erstelle die Datei `apps/website/components/sections/HeroSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Headline: `ResQBrain`
  - Unterzeile: `Die Wissensplattform für den Rettungsdienst`
  - Keyword-Tags: `Algorithmen`, `Medikamente`, `SOPs`
  - Feature-Bullets:
    - `Versioniert`
    - `Organisationsspezifisch`
    - `Schnell im Einsatz verfügbar`
  - Status-Banner: `Frühe Entwicklungsphase — Community-Feedback aktiv`
  - CTA 1: Label `Feedback geben`, Ziel `#feedback`
  - CTA 2: Label `Pilotpartner werden`, Ziel `#cta`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Component-based umsetzen.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="hero"`.
- Vollbild-Sektion mit `min-h-screen` oder gleichwertig.
- Inhalt vertikal und horizontal klar zentrieren.
- Dunkler Hintergrund mit dezentem Verlauf oder Pattern innerhalb der vorhandenen Design-System-Farben.
- Text in heller Darstellung.
- Klare in sich geschlossene Section ohne Vermischung mit anderen Bereichen.

Visuelle Anforderungen:
- Headline ist die größte Typografie der Seite.
- Keyword-Tags als Badge-Reihe.
- Drei Feature-Bullets klar lesbar unter den Tags.
- Status-Banner immer sichtbar unter den Bullets.
- CTA-Buttons auf Desktop nebeneinander, auf Mobile untereinander.
- Nur dezentes Fade-in beim Laden, keine weiteren Animationen.

Nicht erlaubt:
- Keine Bilder.
- Keine Illustrationen.
- Kein Video-Hintergrund.
- Kein Slider.
- Kein Carousel.
- Kein Countdown.
- Keine Annahmen über weitere Inhalte.

Implementierungsregeln:
- Verwende semantisches HTML.
- Nutze sinnvolle Tailwind-Klassen auf Basis eines roten ResQBrain-Akzents und dunkler Flächen.
- Wenn UI-Primitiven nicht existieren, baue die Struktur direkt in der Komponente mit sauberem JSX.
- Erfinde keine zusätzlichen Texte, Labels oder Links.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/HeroSection.tsx` zurück.
