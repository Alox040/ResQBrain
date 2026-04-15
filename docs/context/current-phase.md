# Current Phase

**Last Updated:** 2026-04-15

## Aktuelle Phase: Phase 0 (Lookup App) mit Phase-1-nahen Einsatz-Features

## Begruendung

Der aktuell sichtbare Implementierungsstand entspricht Phase 0 (Lookup App), erweitert um Einsatz-Features (Favoriten, Verlauf, Dosisrechner, Vitalreferenz), weil:

- Mobile UI konzentriert sich auf Suche, Listen und Detailansichten fuer Medikamente/Algorithmen
- Datenquellen sind das eingebettete Lookup-Bundle mit optional persistiertem Cache und optionalem HTTP-Update — **keine** produktive mandantenfaehige API fuer Content
- keine produktive Multi-Tenant-Runtime (Auth/Org) in der App
- keine aktive Lernlogik oder KI-Assistenz integriert

Parallel existiert ein fortgeschrittenes Domain-Zielbild fuer spaetere Phasen (Governance, Versioning, Release, Tenant-Isolation).  
Diese Teile sind als Plattform-Fundament im Paket vorhanden, aber nicht als vollstaendiger End-to-End-Produktbetrieb in App + Backend umgesetzt.
