# Personal Data Mapping (Website)

Stand: 2026-03-27  
Quelle: `docs/context/website-config.json` (primär), Abgleich mit aktueller Website-Struktur in `apps/website`.

## Zweck und Verbindlichkeit

Dieses Dokument definiert verbindlich, **welches Config-Feld wo gerendert werden darf**, mit welchem Pflichtgrad, Fallback und Sichtbarkeitsgrad.

Leitregeln:
- Rechtliche Daten nicht unnötig in Marketingsektionen spiegeln.
- Kontaktinformationen nicht mehrfach inkonsistent rendern.
- Persönliche Daten nur dort anzeigen, wo sie Vertrauen oder Handlungsfähigkeit erhöhen.
- Keine technischen Config-Felder direkt in UI-Komponenten verwenden.

## Verbindliches Feld-Mapping

| Config-Feld | Zielkomponente / Zielseite | Pflichtfeld oder optional | Fallback-Verhalten | Darstellungsregel | Soll öffentlich sichtbar sein: ja/nein |
|---|---|---|---|---|---|
| `project.name` | Header-Brand (`Header`), Footer-Brand (`FooterSection`), SEO Basis (`app/layout` Metadaten) | Pflicht | Build-/Runtime-Guard: fehlend = Konfigurationsfehler | Als Produktname, identisch an allen Stellen | ja |
| `project.tagline` | Hero-Subheadline, optional Footer-Kurztext | Optional | Wenn leer: nicht rendern (keine Ersatzphrase) | Max. 1 kurze Zeile, keine Wiederholung in mehreren Sektionen | ja |
| `project.description` | SEO Description (`app/layout`), optional Intro-Text | Pflicht | Wenn leer: auf definierte Standardbeschreibung zurückfallen | Für Meta als Plain Text; im UI nur gekürzt | ja |
| `contact.website` | SEO `metadataBase`/Canonical, optional Footer-Link „Website“ | Pflicht | Wenn ungültig/leer: auf interne Default-Domain zurückfallen | Immer als URL validieren; nicht mehrfach als Fließtext | ja |
| `contact.email` | Primäre Kontakt-CTA (`CTASection`) und Footer-Kontakt (einheitliche Quelle) | Pflicht | Wenn leer: Kontakt-CTA ausblenden und Warnhinweis im Monitoring | Als `mailto:`; nur eine primäre Kontaktadresse systemweit | ja |
| `contact.github` | Footer-Kontaktbereich (Projektlink) | Optional | Wenn leer: Link nicht rendern | Externer Link mit eindeutiger Beschriftung | ja |
| `social.tiktok` | Footer/„Community“ (Social-Links) | Optional | Wenn leer: nicht rendern | Nur anzeigen, wenn offizieller Projektkanal | ja |
| `social.reddit` | Footer/„Community“ (Social-Links) | Optional | Wenn leer: nicht rendern | Nur anzeigen, wenn offizieller Projektkanal | ja |
| `social.youtube` | Footer/„Community“ (Social-Links) | Optional | Wenn leer: nicht rendern | Nur anzeigen, wenn offizieller Projektkanal | ja |
| `social.twitter` | Footer/„Community“ (Social-Links) | Optional | Wenn leer: nicht rendern | Nur anzeigen, wenn offizieller Projektkanal | ja |
| `product.status` | Produktstatus-Badge (Hero oder Trust, genau eine Stelle) | Optional | Wenn leer: Status-Badge ausblenden | Kurzlabel, kein rechtlicher Claim | ja |
| `product.offlineSupport` | Feature-/Trust-Hinweis | Optional | Wenn fehlt: nicht rendern | Boolean nur in textliche Aussage transformiert | ja |
| `product.targetGroup[]` | Use-Cases / Zielgruppen-Sektion | Optional | Bei leerem Array: Sektion ohne Zielgruppenliste | Als Liste, nicht als Freitextblock | ja |
| `features.algorithms` | Feature-Liste | Optional | `false`/fehlend: Feature nicht als „verfügbar“ ausgeben | Nur als Content-Entscheidung, nicht als raw Boolean | ja |
| `features.medications` | Feature-Liste | Optional | `false`/fehlend: Feature nicht als „verfügbar“ ausgeben | Nur als Content-Entscheidung, nicht als raw Boolean | ja |
| `features.protocols` | Feature-Liste | Optional | `false`/fehlend: Feature nicht als „verfügbar“ ausgeben | Nur als Content-Entscheidung, nicht als raw Boolean | ja |
| `features.learning` | Feature-Liste | Optional | `false`/fehlend: Feature nicht als „verfügbar“ ausgeben | Nur als Content-Entscheidung, nicht als raw Boolean | ja |
| `features.offline` | Feature-Liste / Trust-Hinweis | Optional | `false`/fehlend: Hinweis ausblenden | Kein technischer Boolean im UI | ja |
| `features.voice` | Feature-Liste (nur falls produktseitig gültig) | Optional | `false`/fehlend: nicht erwähnen | Keine „kommt bald“-Aussage ohne Freigabe | ja |
| `surveys.active[].title` | Surveys-Sektion (aktive Umfragen) | Pflicht (pro aktivem Eintrag) | Bei fehlendem Titel: Eintrag nicht rendern | Klarer, kurzer Survey-Titel | ja |
| `surveys.active[].status` | Surveys-Sektion (Badge/Sortierung) | Pflicht (pro aktivem Eintrag) | Bei ungültigem Wert: Eintrag als „inaktiv“ behandeln | Nur in UI-Label mappen, nicht raw anzeigen | ja |
| `surveys.active[].url` | Surveys-Sektion (CTA-Link) | Pflicht (pro aktivem Eintrag) | Wenn leer/ungültig: CTA deaktivieren | Externe URLs als externe Links kennzeichnen | ja |
| `surveys.active[].cta` | Surveys-Sektion (Button-Label) | Optional | Wenn leer: Standardlabel „Zur Umfrage“ | Max. 2-3 Wörter, handlungsorientiert | ja |
| `surveys.active[].showOnHomepage` | Interne Render-Logik Surveys | Pflicht (pro aktivem Eintrag) | Wenn fehlt: Standard `false` | Nie direkt als Text anzeigen | nein |
| `surveys.active[].id` | Interne Schlüssel/Tracking | Pflicht (pro aktivem Eintrag) | Wenn fehlt: Eintrag nicht rendern | Nur intern verwenden | nein |
| `surveys.completed[].title` | Surveys-Sektion (abgeschlossene Umfragen) | Pflicht (pro abgeschlossenem Eintrag) | Bei fehlendem Titel: Eintrag nicht rendern | Klarer, kurzer Survey-Titel | ja |
| `surveys.completed[].status` | Surveys-Sektion (Statusdarstellung) | Pflicht (pro abgeschlossenem Eintrag) | Bei ungültigem Wert: als „completed“ behandeln | In UI-Label mappen, nicht raw anzeigen | ja |
| `surveys.completed[].url` | Surveys-Sektion (Ergebnis-/Archivlink) | Optional | Wenn leer: kein Link-Button | Nur zeigen, wenn Zielseite vorhanden ist | ja |
| `surveys.completed[].responses` | Surveys-Sektion (Teilnahmezahl) | Optional | Wenn fehlt: Zahl ausblenden | Nur aggregiert, keine personenbezogenen Rohdaten | ja |
| `surveys.completed[].showResults` | Interne Render-Logik Ergebnisanzeige | Pflicht (pro abgeschlossenem Eintrag) | Wenn fehlt: Standard `false` | Nie direkt als Text anzeigen | nein |
| `surveys.completed[].id` | Interne Schlüssel/Tracking | Pflicht (pro abgeschlossenem Eintrag) | Wenn fehlt: Eintrag nicht rendern | Nur intern verwenden | nein |
| `branding.primaryColor` | Theme-Tokens / Design-Layer | Pflicht | Wenn fehlt: Design-System-Default | Niemals als Text auf der Seite rendern | nein |
| `branding.logo` | Header/Footer Logo-Asset | Optional (MVP) | Wenn fehlt: Textmarke mit `project.name` | Alt-Text immer aus `project.name` ableiten | ja |
| `legal.owner` | Impressum, Datenschutz („Verantwortlicher“) | Pflicht | Wenn fehlt: rechtliche Seite als unvollständig markieren und Veröffentlichung blockieren | Exakt und konsistent zwischen Rechtsseiten | ja |
| `legal.organization` | Impressum (Anbieterkennzeichnung) | Pflicht | Wenn fehlt: Veröffentlichung blockieren | Nur in rechtlichen Kontexten anzeigen | ja |
| `legal.street` | Impressum, ggf. Datenschutz | Pflicht | Wenn fehlt: Veröffentlichung blockieren | Nur auf Rechtsseiten anzeigen | ja |
| `legal.zip` | Impressum, ggf. Datenschutz | Pflicht | Wenn fehlt: Veröffentlichung blockieren | Nur auf Rechtsseiten anzeigen | ja |
| `legal.city` | Impressum, ggf. Datenschutz | Pflicht | Wenn fehlt: Veröffentlichung blockieren | Nur auf Rechtsseiten anzeigen | ja |
| `legal.country` | Impressum, ggf. Datenschutz | Optional | Wenn fehlt: aus Adresse ableiten oder ausblenden | Nur auf Rechtsseiten anzeigen | ja |
| `legal.email` | Impressum, Datenschutz-Kontakt | Pflicht | Wenn fehlt: Veröffentlichung blockieren | Für rechtliche Anfragen; nicht als Marketing-CTA duplizieren | ja |

## Konsistenzregeln (verbindlich)

1. **Single Source of Truth Kontakt**
   - Öffentliche Kontakt-E-Mail wird exakt aus `contact.email` gerendert.
   - Rechtliche Kontakt-E-Mail wird aus `legal.email` gerendert.
   - Falls beide identisch sein sollen, wird dies in Config gepflegt, nicht im Code hart codiert.

2. **Rechtliches strikt begrenzen**
   - `legal.*` Felder ausschließlich auf `Impressum`/`Datenschutz`.
   - Keine Spiegelung von Adresse/Verantwortlichem in Hero, Footer-Marketing oder CTA-Texten.

3. **Technische Felder nicht direkt rendern**
   - IDs, Toggle-Flags und Status-Rohwerte (`show*`, `id`, booleans) nie als Rohtext in UI.
   - Nur über definierte View-Model-Transformationen in darstellbare Labels/Zustände.

4. **Keine inkonsistenten Mehrfachquellen**
   - Felder, die in `website-config.json` definiert sind, werden nicht parallel als harte Strings in Komponenten gepflegt.
   - Bestehende statische Texte mit denselben Inhalten gelten als Migrationskandidaten.

## Geltungsbereich

Dieses Mapping ist die verbindliche Referenz für:
- Content-Rendering der Website
- rechtliche Pflichtangaben
- Umgang mit persönlichen und organisationsbezogenen Profildaten

Änderungen an Feldern oder Sichtbarkeitsregeln erfordern eine Aktualisierung dieses Dokuments.
