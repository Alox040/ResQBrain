# ResQBrain Website Lab (Experimental)

Diese App ist eine **isolierte Experimentierumgebung** fuer die neue Website-Architektur und Figma-nahe Strukturen.

## Zweck

- Figma-nahe Seitenstruktur testen
- Routing und Komponentenverhalten simulieren
- Inhalte schrittweise integrieren
- Keine produktive Nutzung

## Harte Abgrenzung

- Keine Dateien in `apps/website` aendern
- Keine produktive Konfiguration ueberschreiben
- Keine produktiven Routen migrieren oder ersetzen
- Kein Vercel-Deployment aus dieser App

## Lokal starten (isoliert)

1. In den Ordner wechseln:
   - `cd apps/website-lab`
2. Abhaengigkeiten installieren:
   - `npm install`
3. Dev-Server starten:
   - `npm run dev`
4. Im Browser oeffnen:
   - [http://localhost:3100](http://localhost:3100)

## Strukturprinzipien

- `app/`: Route-Shell und Lab-Seiten
- `components/`: rein experimentelle Website-Lab-Komponenten
- `lib/`: statische Lab-Daten und Adapter fuer spaetere Inhaltsintegration
- `docs/`: Vergleichs- und Migrationsnotizen zwischen Lab und produktiver Website

## Vergleich mit produktiver Website

Siehe `docs/comparison-checklist.md` fuer einen standardisierten Soll/Ist-Vergleich zwischen:

- `apps/website-lab` (Experiment)
- `apps/website` (Produktion)
