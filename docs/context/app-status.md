# app-status

## Zweck

- Stabile Beschreibung des mobilen Produktpfads.
- Antwortet auf die Frage: Was ist die Mobile-App aus Sicht der Architektur und des Produktumfangs?
- Trennt aktive Kernfunktionen von vorbereiteten oder bewussten Nicht-Zustaenden.

## Inhalt

- App-Kontext:
  - Expo / React Native Mobile-App unter `apps/mobile-app`
  - Fokus auf schnellen Offline-Lookup fuer Medikamente und Algorithmen
- Kernfunktionen:
  - Listen- und Detailansichten
  - lokale Suche
  - Favoriten und Verlauf
  - Start-/Home-Zugriff und Einstellungen
  - offline nutzbares Lookup-Bundle als Basis
- Datenpfad:
  - eingebettete Seed-Daten als erste Quelle
  - optionaler lokaler Cache
  - optionale Update-Schicht nur als Erweiterung, nicht als Voraussetzung
- Arbeitsgrenzen:
  - kein produktiver Backend-Zwang fuer die Grundfunktion
  - keine Authentifizierung als Voraussetzung fuer den Lookup-Kern
  - keine klinische Entscheidungslogik als Standardmodus
- Verifikation:
  - Typecheck
  - Navigations-Guards
  - Bundle-Export / lokale Validierung

## Was NICHT rein darf

- Tagesaktuelle Testresultate, Metriken oder Debug-Ausgaben.
- Device-spezifische Probleme, die nur in einem Einzelfall auftraten.
- Screenshots, Mockups oder UI-Kopie.
- Branch-Namen, Work-in-progress-Kommentare oder persoenliche Notizen.
