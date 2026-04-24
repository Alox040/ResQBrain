# known-issues

## Zweck

- Haelt wiederkehrende Risiken und Verwechslungsgefahren fest.
- Ist eine Architekturhilfe, keine Fehlerliste fuer jeden einzelnen Lauf.
- Soll andere AIs vor typischen Fehlschluessen schuetzen.

## Inhalt

- Modell-Dopplungen:
  - Mobile Lookup-Daten und Plattform-Domain sind aehnlich, aber nicht dasselbe.
  - Jedes Modell braucht eigene Regeln und eigene Konvertierungen.
- Pfad-Verwechslungen:
  - Root-`app/` und `apps/website` koennen beide existieren, sind aber nicht automatisch dieselbe Website.
  - Lab-Ordner sind nicht automatisch produktive Pfade.
- Delivery-Grenzen:
  - Offline-first Grundfunktion darf nicht von Backend, Sync oder Auth abhaengig sein.
  - Ein optionaler Update-Weg ist kein vollstaendiges Verteilungssystem.
- Governance-Grenzen:
  - Domain-Modelle sind keine implizite Runtime-Garantie.
  - Freigabe-, Rollen- und Tenant-Logik muss explizit verdrahtet werden.
- Dokumentationsrisiko:
  - Exportdokumente sind Ableitungen und nicht automatisch die kanonische Quelle.

## Was NICHT rein darf

- Einzelne, unbestaetigte Bug-Reports ohne Systembezug.
- Zeitgebundene Build-Fehler, die sich beim naechsten Lauf schon aendern koennen.
- Issue-Nummern als Ersatz fuer ein klares Architekturproblem.
- Persoenliche Vermutungen ohne belegte Ursache.
