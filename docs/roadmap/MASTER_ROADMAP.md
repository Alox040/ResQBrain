# RESQBRAIN MASTER ROADMAP

**Stand:** 26. März 2026

---

## PRIORITÄTEN

1. Geschwindigkeit — jede Funktion muss im Einsatz sofort nutzbar sein
2. Offline — kein Feature darf Netz voraussetzen
3. Einsatznutzen — nur bauen, was eine Einsatzkraft konkret braucht

---

# PHASE 0 — LOOKUP APP

**Ziel:** Medikamente und Algorithmen finden — offline, in Sekunden.

| Feature | Beschreibung |
|---------|-------------|
| Medikamentensuche | Name, Wirkstoff, Handelsname — Dosierung + Kontraindikationen |
| Notfallalgorithmen | Schritt-für-Schritt-Ansicht, einsatzrelevante Protokolle |
| Schnelle Suche | < 3 Sekunden, keine Anmeldung erforderlich |
| Offline-Nutzung | Voller Zugriff ohne Mobilfunk oder WLAN |
| Einsatz-optimierte UI | Große Schrift, Handschuhbedienung, hoher Kontrast, schnelle Navigation |

Seed-Daten: Eine Pilot-Wache, fest konfiguriert.
Kein Login. Kein Lifecycle. Kein Editor.

Exit-Kriterium: Einsatzkraft findet Dosierung in unter 3 Klicks, offline.

---

# PHASE 1 — EINSATZ FEATURES

**Ziel:** Die App begleitet den Einsatz aktiv.

| Feature | Beschreibung |
|---------|-------------|
| Dosierungsrechner | Gewichtsbasierte Berechnung direkt in der App |
| Vitalwert-Referenzen | Normbereiche nach Alter und Patientengruppe |
| Favoriten | Häufig genutzte Medikamente und Algorithmen fixieren |
| Verlauf | Zuletzt aufgerufene Inhalte ohne erneute Suche |
| Push-Updates | Neue Inhalte kommen automatisch, sobald Netz verfügbar |

---

# PHASE 2 — LERNEN

**Ziel:** Die App hilft beim Lernen und Wiederholen — außerhalb des Einsatzes.

| Feature | Beschreibung |
|---------|-------------|
| Lernmodus | Algorithmen und Medikamente im geführten Lernpfad |
| Selbsttests / Quiz | Dosierungsfragen, Algorithmus-Abfragen |
| Fortschritt-Tracking | Was wurde gelernt, was fehlt noch |
| Fallbasiertes Lernen | Szenarien mit korrektem Protokoll als Lösung |
| Wiederholungsintervalle | Spaced Repetition für Medikamente und SOPs |

---

# PHASE 3 — ORGANISATION

**Ziel:** Mehrere Wachen und Organisationen, eigene Inhalte, Freigabeprozesse.

| Feature | Beschreibung |
|---------|-------------|
| Organisationsspezifische Inhalte | Nur freigegebene Inhalte der eigenen Wache |
| Multi-Tenant | Mehrere Organisationen isoliert voneinander |
| Freigabeprozesse | Draft → Geprüft → Freigegeben |
| Rollen-Modell | Einsatzkraft, Prüfer, Leitender Notarzt, Admin |
| Content-Editor | Algorithmen und Medikamente pflegen und versionieren |
| Audit-Log | Wer hat was wann freigegeben |

---

# PHASE 4 — KI

**Ziel:** Die App denkt mit.

| Feature | Beschreibung |
|---------|-------------|
| Symptom-Suche | Symptome eingeben → passender Algorithmus vorgeschlagen |
| Kontextbezogene Vorschläge | Offener Algorithmus → passende Medikamente direkt verfügbar |
| Dosierungsassistent | KI prüft Dosierung gegen Patientendaten |
| Lücken-Erkennung | Welche Inhalte fehlen für diese Organisation |
| Intelligente Suche | Synonyme, Tippfehler, Abkürzungen verstehen |

---

# ROADMAP-REGELN

- Phase 0 muss offline funktionieren — ohne Ausnahme
- Jede neue Phase baut auf der vorherigen auf
- Einsatz-Features vor Lern-Features vor Org-Features
- KI erst wenn Content-Basis stabil ist
- Governance (Phase 3) ist Voraussetzung für KI auf Org-Daten (Phase 4)
