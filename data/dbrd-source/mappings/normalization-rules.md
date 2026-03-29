# Normalisierungsregeln: PDF → Phase-0 Lookup (Mobile)

**Zweck:** Einheitliche Aufbereitung von extrahiertem oder redaktionell übernommenem PDF-Inhalt für `medications.json` und `algorithms.json`.  
**Bezug:** `current-app-target-schema.md`, `field-map.medications.json`, `field-map.algorithms.json`, App-Validierung `validateLookupBundle`.

---

## 1. Identifikatoren (`id`)

- **`id` in kebab-case:** Kleinbuchstaben, Ziffern, Bindestriche; keine Leerzeichen, keine Umlaute (ersetzen oder transkribieren, z. B. `ae`, `ue`).
- Stabil über Bundle-Versionen, solange derselbe fachliche Eintrag gemeint ist; bei neuem fachlichen Inhalt neue `id`, nicht wiederverwenden mit anderem Inhalt.
- Keine Kollision: eine `id` darf nicht gleichzeitig als Medikation und als Algorithmus vorkommen.

---

## 2. Suchbegriffe (`searchTerms`)

- **Immer lowercase:** Gesamter String pro Eintrag in Kleinbuchstaben normalisieren (für deutsche Texte: `ß` konsistent behandeln, z. B. als `ss`, projektweit einheitlich).
- Leere Strings nach Trim entfernen; Duplikate innerhalb eines Eintrags entfernen.
- `label` nicht blind duplizieren, wenn der Suchbegriff identisch wäre.

---

## 3. Tags (`tags`)

- **Ausschließlich kontrollierte Liste** — genau die Werte aus `CONTENT_TAG_VALUES` / `ContentTag` in der App (`kreislauf`, `atemwege`, `neurologie`, `analgesie`, `intoxikation`, `stoffwechsel`).
- Keine eigenen Schlagworte, kein CamelCase, keine Mehrsprachigkeit im String.
- Wenn keine sichere Zuordnung möglich ist: lieber **weniger** Tags als falsch zugeordnete.

---

## 4. Dosierung (`dosage`, nur Medikation)

- **Knapp und einsatztauglich:** Was der Nutzer im Einsatz braucht (Weg, Orientierungsdosis, Altersgruppe), nicht der vollständige Tabellenband.
- Organisationsspezifische Bindung explizit lassen, wenn im Quell-PDF vorgesehen („nach Medikamentenhandbuch …“).
- Keine App-Logik vortäuschen (keine automatische Berechnung); reiner Lesetext.

---

## 5. Hinweise (`notes`)

- **Nur bei echtem Mehrwert:** Zusatzinformation, die weder in `label`, `indication` noch in `dosage` (bzw. bei Algorithmen: nicht in `steps`) sinnvoll untergebracht ist.
- Wenn der Absatz nur wiederholt oder rein haftungsrechtlich generisch ist ohne fachlichen Zusatz: **Feld weglassen** (optional im Schema).

---

## 6. Warnungen (`warnings`, nur Algorithmus)

- **Nur bei klarer Relevanz:** Risiko, häufiger Fehler, kritische Einschränkung des Ablaufs — inhaltlich aus einem echten Warnkontext des PDF oder eindeutig daraus abgeleitet.
- Nicht füllen für allgemeine Floskeln oder Text, der besser in einen einzelnen Schritt gehört.
- Abgrenzung zu `notes`: `warnings` sicherheitsnah; `notes` erklärend/kontextuell.

---

## 7. Schritte (`steps`, nur Algorithmus)

- **Nur lineare Textschritte:** Jedes Element `{ "text": "..." }`; Reihenfolge = Ausführungsreihenfolge.
- Keine Unterzweige, keine IDs, keine Metadaten pro Schritt in Phase 0.
- Linearisierung nur, wenn sie fachlich vertretbar ist; sonst Inhalt nicht in dieses Schema pressen.

---

## 8. Leere Arrays

- **`relatedAlgorithmIds` / `relatedMedicationIds`:** Leeres Array `[]` **nur** verwenden, wenn sachlich keine Querverknüpfung existiert (Schema erlaubt es; Validierung verlangt nur auflösbare Referenzen, wenn IDs vorhanden sind).
- **`tags` / `searchTerms`:** Leere Arrays sind schema-seitig möglich; **vermeiden**, wenn mindestens ein sinnvoller Tag bzw. Suchbegriff aus dem PDF ableitbar ist. Wirklich leer lassen, wenn keine sichere Zuordnung ohne Fantasie möglich ist.
- Keine Arrays mit „Platzhalter“-Einträgen.

---

## 9. PDF-Formatierungsreste

- **Nicht übernehmen:** Kopf-/Fußzeilen, Seitenzahlen, wiederholte Kapiteltitel in jedem Absatz, Spaltenumbrüche als mitten im Wort, mehrfache Leerzeichen, Tabulatoren als synthetische Struktur.
- Tabellen: Inhalt **umschreiben** in kurzen Fließtext oder Listen von Kurzsätzen für `dosage` / `steps`, nicht die Rohzellenfolge einfügen.
- Sonderzeichen und Steuerzeichen aus der Extraktion bereinigen; typographische Anführungszeichen vereinheitlichen oder vereinfachen, wenn sie Parsing stören.

---

## 10. Konsistenz mit der App

- Keine zusätzlichen JSON-Keys auf Datensatz- oder Schritt-Ebene — strikte Whitelist wie in `lookupSchema.ts`.
- Querverweise immer bidirektional konsistent halten (referenzierte IDs müssen im Bundle existieren).
