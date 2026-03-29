# Manuelle Testcheckliste — Lookup nach DBRD-Seed (Expo-App)

**Zweck:** Nach Einspielen bzw. Einbetten des Lookup-Bundles aus dem DBRD-Pipeline-Output (`data/lookup-seed/`) die sichtbare Funktion der Phase‑0‑Lookup-Oberfläche prüfen.  
**Kontext:** Kein Netzwerknachweis nötig; Inhalte kommen aus dem eingebetteten Bundle.

---

## 1. Bundle geladen

- [ ] App startet ohne roten Fehler-Screen / ohne Absturz beim ersten Öffnen.
- [ ] Startbildsch („Home“) zeigt Schnellzugriff (u. a. Suche, Medikamente, Algorithmen).
- [ ] Es erscheint **kein** Hinweis, dass das Lookup-Bundle fehlt oder ungültig ist (falls die App so etwas anzeigt).
- [ ] Nach Kaltstart sind Medikamenten- und Algorithmenlisten **nicht** leer (sofern das Bundle Einträge enthält).

---

## 2. Medikamentenliste

- [ ] Navigation: Home → **Medikamente** öffnet die Medikamentenliste.
- [ ] Jede Zeile zeigt mindestens **Titel** (Label) und erkennbaren **Untertitel** (Indikation bzw. erwartete Kurzinfo).
- [ ] Scrollen durch die gesamte Liste funktioniert flüssig; keine leeren Lücken zwischen erwarteten Einträgen.
- [ ] Antippen eines Eintrags öffnet das **Medikamentendetail** (kein Hängen, kein falscher Screen).

---

## 3. Medikamentendetail

- [ ] **Label** und **Indikation** sind lesbar und entsprechen dem Seed (keine Platzhalter wie `TEMPLATE` / offensichtlich falsche IDs).
- [ ] **Dosierung** (`dosage`) ist vollständig sichtbar (ggf. nach Scrollen); Zeilenumbrüche wirken sinnvoll.
- [ ] **Tags** (falls angezeigt) passen zum Eintrag und wirken konsistent mit der Listenansicht.
- [ ] **Notizen** (`notes`), falls vorhanden, sind lesbar und nicht abgeschnitten ohne Scrollmöglichkeit.
- [ ] Zurück-Navigation führt wieder zur Medikamentenliste (kein Stack-Routing-Fehler).

---

## 4. Algorithmenliste

- [ ] Navigation: Home → **Algorithmen** öffnet die Algorithmenliste.
- [ ] Jede Zeile zeigt mindestens **Titel** und **Untertitel** (Indikation).
- [ ] Reihenfolge der Einträge wirkt stabil (kein „Springen“ beim erneuten Öffnen derselben Ansicht).
- [ ] Antippen eines Eintrags öffnet das **Algorithmusdetail**.

---

## 5. Algorithmusdetail

- [ ] **Label** und **Indikation** sind lesbar und plausibel zum Seed.
- [ ] **Schritte** (`steps`) erscheinen als **lineare Liste**; jeder Schritt hat verständlichen Fließtext.
- [ ] **Warnhinweis** (`warnings`), falls vorhanden, ist optisch von Notizen unterscheidbar (z. B. warnende Farbe) und vollständig lesbar.
- [ ] **Notizen** (`notes`), falls vorhanden, sind lesbar.
- [ ] Zurück-Navigation führt wieder zur Algorithmenliste.

---

## 6. Suche

- [ ] Tab / Schnellzugriff **Suche** ist erreichbar.
- [ ] Leere Suche zeigt erwarteten **Leerzustand** (Hinweis, Suchbegriff einzugeben).
- [ ] Suchbegriff aus dem **Label** eines bekannten Medikaments liefert den Eintrag in den Ergebnissen.
- [ ] Suchbegriff aus dem **Label** eines bekannten Algorithmus liefert den Eintrag.
- [ ] Suchbegriff aus **searchTerm** (Synonym) liefert den passenden Treffer, wenn im Seed vorhanden.
- [ ] Filter **Alle / Medikamente / Algorithmen** schränkt die Trefferliste korrekt ein.
- [ ] Antippen eines Suchtreffers öffnet das passende **Detail** (richtiger Typ: Medikament vs. Algorithmus).
- [ ] Nonsense-Begriff liefert **Keine Treffer** (oder äquivalente leere Ansicht), ohne Absturz.

---

## 7. Querverweise

- [ ] Im **Medikamentendetail**: Verknüpfung(en) zu **Algorithmen** (über `relatedAlgorithmIds`) sind sichtbar und antippbar.
- [ ] Nach Antippen öffnet sich der **richtige Algorithmus** (Titel/ID plausibel).
- [ ] Im **Algorithmusdetail**: Verknüpfung(en) zu **Medikamenten** (`relatedMedicationIds`) sind sichtbar und antippbar.
- [ ] Nach Antippen öffnet sich das **richtige Medikament**.
- [ ] Mehrfaches Hin- und Navigieren zwischen verlinkten Medikamenten und Algorithmen bleibt konsistent (keine Schleife ins Leere).

---

## 8. Sichtbare Datenfehler

- [ ] Keine doppelten oder „kaputten“ Überschriften (z. B. identische IDs in zwei unterschiedlichen Detailtexten).
- [ ] Keine sichtbaren **JSON-Artefakte** (`{{`, `}}`, Escape-Monster, Roh-IDs ohne Kontext), außer bewusst als technische Anzeige.
- [ ] **Umlaute und Sonderzeichen** (ä, ö, ü, ß, Bindestriche, Gedankenstriche) werden korrekt dargestellt.
- [ ] Sehr lange Texte sind **per Scroll** vollständig lesbar; nichts Wesentliches abgeschnitten ohne Scroll.
- [ ] Keine offensichtlich **falsche Zuordnung** (z. B. Dosierungstext unter falschem Medikament nach manuellem Quervergleich mit `data/lookup-seed/*.json`).
- [ ] Vergleich stichprobenartig: Anzahl sichtbarer Medikamente/Algorithmen entspricht **ungefähr** der Erwartung aus dem Seed (kein großer Teil „fehlt“ unbemerkt).

---

## Protokoll (optional beim Test)

| Datum | Tester | App-Build / Branch | Bundle-Version (`manifest.schemaVersion` / `bundleId`) | Ergebnis kurz |
|-------|--------|--------------------|--------------------------------------------------------|---------------|
|       |        |                    |                                                        |               |
