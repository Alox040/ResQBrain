# website-status

## Zweck

- Stabile Beschreibung der oeffentlichen Website und ihrer Rolle im Projekt.
- Antwortet auf die Frage: Was ist die Website, und wofuer ist sie nicht zustaendig?

## Inhalt

- Website-Kontext:
  - Next.js Website unter `apps/website`
  - Oeffentliche Kommunikations-, Informations- und Legal-Flache
- Typische Seiten:
  - Startseite
  - Impressum und Datenschutz
  - Kontakt und Mitwirken
  - Links und Updates
  - optionale interne Lab-Routen, sofern vorhanden
- Inhaltsquellen:
  - gemeinsame Navigations- und Content-Module
  - getrennte Sektionen fuer Landing, Legal und Mitwirkung
- Abgrenzung:
  - kein Ersatz fuer die Mobile-App
  - kein produktiver Backend-Kern
  - kein Ort fuer Domain-Regeln oder fachliche Freigabelogik
- Deploy-Regel:
  - die aktive Website ist das konfigurierte Website-Paket, nicht irgendein gleichnamiger Root-Ordner

## Was NICHT rein darf

- Kurzfristige Kampagnen, Redaktionsplaene oder Marketing-Sonderaktionen.
- Deployment-Logs, Preview-Links oder Release-Timestamps.
- Vollstaendige Textbausteine von Seiteninhalten, wenn sie sich haeufig aendern.
- Technische Experimente, die nicht Teil des produktiven Website-Pfads sind.
