# Website Config V2 (Proposal)

Stand: 2026-03-27  
Status: Vorschlag, noch nicht in Komponenten verdrahtet.

## Ziele der V2-Struktur

- Konsistente, sprechende Feldnamen
- Klare Trennung von Verantwortlichkeiten
- UI-taugliche, section-orientierte Datenstruktur
- Rechtliche Pflichtangaben getrennt von Marketing-/Profilinhalten
- Erweiterbar fuer Partner, Presse, Beta und weitere externe Kommunikation

## Finale Config-Struktur (V2)

```json
{
  "meta": {
    "version": "2.0.0",
    "locale": "de-DE",
    "updatedAt": "2026-03-27"
  },
  "brand": {
    "productName": "ResQBrain",
    "tagline": "Einsatzwissen ohne Suchen",
    "summary": "Plattform fuer Rettungsdienst-Algorithmen, Medikamente und Nachbereitung.",
    "logo": {
      "src": "/logo.png",
      "alt": "ResQBrain"
    },
    "theme": {
      "primaryColor": "#0ea5e9"
    }
  },
  "web": {
    "baseUrl": "https://resqbrain.de"
  },
  "contact": {
    "public": {
      "email": "kontakt@resqbrain.de",
      "website": "https://resqbrain.de",
      "github": "https://github.com/Alox040/ResQBrain",
      "social": {
        "tiktok": "https://tiktok.com/@resqbrain",
        "reddit": "https://reddit.com/u/resqbrain",
        "youtube": "",
        "twitter": ""
      }
    },
    "legal": {
      "email": "legal@resqbrain.de"
    },
    "press": {
      "email": "",
      "kitUrl": ""
    }
  },
  "organization": {
    "displayName": "ResQBrain",
    "profile": {
      "statusLabel": "Early Development",
      "targetAudiences": ["Notfallsanitaeter", "Rettungsdienst", "Ausbildung"]
    }
  },
  "legal": {
    "entity": {
      "ownerName": "Alexander Posdziech",
      "organizationName": "ResQBrain"
    },
    "address": {
      "street": "Voßort 14",
      "postalCode": "21037",
      "city": "Hamburg",
      "country": "Deutschland"
    },
    "imprint": {
      "enabled": true
    },
    "privacy": {
      "enabled": true
    }
  },
  "content": {
    "home": {
      "navigation": [
        { "href": "/#problem", "label": "Problem" },
        { "href": "/#solution", "label": "Loesung" },
        { "href": "/#features", "label": "Funktionen" },
        { "href": "/#preview", "label": "Vorschau" },
        { "href": "/#use-cases", "label": "Einsatz" },
        { "href": "/#trust", "label": "Verantwortung" },
        { "href": "/#cta", "label": "Kontakt" }
      ]
    },
    "product": {
      "capabilities": {
        "algorithms": true,
        "medications": true,
        "protocols": true,
        "learning": true,
        "offline": true,
        "voice": false
      }
    },
    "surveys": {
      "items": [
        {
          "id": "survey-002",
          "title": "Funktionspriorisierung",
          "phase": "active",
          "url": "https://forms.cloud.microsoft/r/tw508dTuDK",
          "ctaLabel": "An Umfrage teilnehmen",
          "visibility": {
            "showOnHomepage": true,
            "showResults": false
          },
          "stats": {
            "responses": null
          }
        },
        {
          "id": "survey-001",
          "title": "Bedarfsanalyse Rettungsdienst App",
          "phase": "completed",
          "url": "https://forms.cloud.microsoft/r/quaHYEbjAC",
          "ctaLabel": "Ergebnisse ansehen",
          "visibility": {
            "showOnHomepage": true,
            "showResults": true
          },
          "stats": {
            "responses": 120
          }
        }
      ]
    }
  },
  "extensions": {
    "partners": {
      "enabled": false,
      "items": []
    },
    "press": {
      "enabled": false,
      "items": []
    },
    "beta": {
      "enabled": false,
      "waitlistUrl": ""
    }
  }
}
```

## Warum diese Struktur

- **`brand`, `organization`, `legal`, `contact`, `content`, `extensions`** trennen fachlich klar:
  - Branding/Produkttext
  - Organisationsprofil
  - Rechtliche Pflichtdaten
  - Oeffentliche Kontaktkanaele
  - UI-Content pro Bereich
  - spaetere Ausbaupfade (Partner/Presse/Beta)
- **UI-tauglich** durch section-nahe Knoten (`content.home.navigation`, `content.surveys.items`)
- **Typisierbar** durch stabile Objektformen statt losem Mischmodell

## Migrationshinweise (Alt -> V2)

| Altfeld | V2-Zielfeld | Hinweis |
|---|---|---|
| `project.name` | `brand.productName` | 1:1 |
| `project.tagline` | `brand.tagline` | 1:1 |
| `project.description` | `brand.summary` | 1:1, ggf. textlich kuerzen |
| `branding.logo` | `brand.logo.src` | Alt-Text neu in `brand.logo.alt` |
| `branding.primaryColor` | `brand.theme.primaryColor` | 1:1 |
| `contact.website` | `contact.public.website` | 1:1 |
| `contact.email` | `contact.public.email` | Public-Kanal, nicht legaler Kanal |
| `contact.github` | `contact.public.github` | 1:1 |
| `social.tiktok` | `contact.public.social.tiktok` | Verschachtelung geaendert |
| `social.reddit` | `contact.public.social.reddit` | Verschachtelung geaendert |
| `social.youtube` | `contact.public.social.youtube` | Verschachtelung geaendert |
| `social.twitter` | `contact.public.social.twitter` | Verschachtelung geaendert |
| `product.status` | `organization.profile.statusLabel` | semantisch praeziser |
| `product.targetGroup[]` | `organization.profile.targetAudiences[]` | Umbenennung |
| `product.offlineSupport` | `content.product.capabilities.offline` | in Capability-Modell integriert |
| `features.*` | `content.product.capabilities.*` | Namespace-Shift |
| `legal.owner` | `legal.entity.ownerName` | 1:1 |
| `legal.organization` | `legal.entity.organizationName` | 1:1 |
| `legal.street` | `legal.address.street` | 1:1 |
| `legal.zip` | `legal.address.postalCode` | Umbenennung |
| `legal.city` | `legal.address.city` | 1:1 |
| `legal.country` | `legal.address.country` | 1:1 |
| `legal.email` | `contact.legal.email` | bewusst aus `legal` in `contact.legal` verschoben |
| `surveys.active[]` + `surveys.completed[]` | `content.surveys.items[]` | zusammengefuehrt, Status in `phase` |
| `surveys.*[].status` | `content.surveys.items[].phase` | erlaubte Werte vereinheitlichen |
| `surveys.*[].cta` | `content.surveys.items[].ctaLabel` | konsistenter Name |
| `surveys.*[].showOnHomepage` | `content.surveys.items[].visibility.showOnHomepage` | gruppiert |
| `surveys.*[].showResults` | `content.surveys.items[].visibility.showResults` | gruppiert |
| `surveys.*[].responses` | `content.surveys.items[].stats.responses` | gruppiert |

## Potenzielle Breaking Changes

1. **Pfadwechsel bei fast allen Feldern**
   - Beispiel: `project.name` -> `brand.productName`
   - Risiko: bestehende Imports/Reads brechen ohne Adapter.

2. **Survey-Modell umgestellt**
   - `active/completed` Arrays -> einheitliches `items[]` mit `phase`.
   - Risiko: vorhandene Filter-/Renderlogik muss angepasst werden.

3. **`legal.email` semantisch verschoben**
   - neu: `contact.legal.email`.
   - Risiko: Rechtsseiten zeigen sonst leere/alte Daten.

4. **`product.offlineSupport` und `features.offline` konsolidiert**
   - Risiko: Doppelquellen werden aufgeloest; alte Abfragen muessen eindeutig werden.

5. **Social-Felder verschachtelt**
   - `social.*` -> `contact.public.social.*`
   - Risiko: Footer/Social-Komponenten mit alten Pfaden fallen auf `undefined`.

6. **`zip` umbenannt zu `postalCode`**
   - Risiko: Impressum-Formatierung mit Altfeldnamen bricht.

## Empfohlene Migrationsstrategie (ohne Komponentenumbau jetzt)

1. V2-Struktur als neue Referenz dokumentieren (dieses Dokument).
2. Optional einen temporären **Read-Adapter** definieren (Alt + V2 lesbar).
3. Komponenten schrittweise auf V2-Pfade umstellen.
4. Altfelder nach Abschluss entfernen.

