# Phase-11-Abschlussprüfung — Website (nach DBRD-Seed-Kontext)

**Datum:** 2026-03-29  
**Art:** reine Prüfung und Protokoll — kein Website-Content geändert.

---

## Ausgeführte Befehle

| Befehl | Ergebnis (Exit) |
|--------|-----------------|
| `pnpm build` (Repo-Root) | Exit **0** |
| `pnpm exec tsx scripts/validate-content-isolation.ts` | Exit **0** |
| `pnpm --filter @resqbrain/website phase11:website` | Exit **1** (siehe unten) |

---

## 1. Routing-Struktur (`/impressum`, `/datenschutz`)

**Status: PASS**

**Beleg:**

- Dateien vorhanden: `apps/website/app/impressum/page.tsx`, `apps/website/app/datenschutz/page.tsx` (per Dateisystem / Build-Output).
- `pnpm build` (Next.js 16.2.1) listet statische Routen: `/`, `/impressum`, `/datenschutz` (plus `/_not-found`).

---

## 2. Link-Quellen (Footer, HeroSection, CTASection, SurveysSection)

### 2.1 Footer (`FooterSection.tsx`)

**Status: PASS**

**Beleg:**

- Rechtliche Links kommen aus `getFooterViewModel()` → `legalLinks` = `getLegalViewModel().links`.
- In `apps/website/lib/site.ts` sind `legal.links` mit `href: "/impressum"` und `href: "/datenschutz"` gesetzt.
- `FooterSection` rendert `<a href={link.href}>` für jeden Eintrag in `footer.legalLinks` — die Ziele sind damit zur Laufzeit `/impressum` und `/datenschutz`, ohne dass die Literale `href="/impressum"` in der Komponentendatei vorkommen müssen.

### 2.2 HeroSection (`HeroSection.tsx`)

**Status: PASS** (mit fachlicher Einschränkung, siehe Restpunkte)

**Beleg:**

- Die beiden primären Buttons nutzen `href="#survey"` (Anker zur Sektion `id="survey"` in `SurveysSection`).
- Keine direkten Links zu `/impressum` oder `/datenschutz` in der Hero — das ist eine Design-/Informationsentscheidung, kein Routing-Defekt.

### 2.3 CTASection (`CTASection.tsx`)

**Status: PASS**

**Beleg:**

- Buttons verwenden `contact.contactHref` und `contact.learnMoreHref` aus `getContactViewModel()`.
- `site-config` (`apps/website/lib/site.ts`): `contact.email` ist `triggerhub@outlook.com`; die ViewModel-Funktion erzeugt daraus `mailto:`-URLs (inkl. Subject-Encoding für die beiden CTAs).

### 2.4 SurveysSection (`SurveysSection.tsx`)

**Status: WARN**

**Beleg:**

- Zwei Karten-Buttons: `href` auf externe Microsoft-Forms-URLs (`https://forms.cloud.microsoft/r/...`) mit `target="_blank"` und `rel="noopener noreferrer"`.
- Der untere Button **„Direktes Feedback senden“** ist ein `Button` **ohne** `href` — rendert damit als `<button>` ohne Navigation (vgl. `Button`-Typ in `components/ui/Button.tsx`: Link nur bei gesetztem `href`).

---

## 3. Build (Repo-Root)

**Status: PASS**

**Beleg:**

- `pnpm build` → `@resqbrain/website` → `next build`: „Compiled successfully“, statische Seiten erzeugt, Exit 0.

---

## 4. Website-Phase-11-Script (`phase11:website`)

**Status: FAIL** (Script), **Website-Build separat: PASS**

**Beleg:**

- Script-Definition: `apps/website/package.json` → `"phase11:website": "pnpm run validate:routing && pnpm run validate:isolation && pnpm run build"`.
- Lauf bricht bei `validate:routing` ab (Exit 1), **bevor** `validate:isolation` und `build` innerhalb dieser Pipeline ausgeführt werden (bei diesem Laufmuster).
- `scripts/validate-routing.ts` bewertet u. a.:
  - Footer: Suche nach den Literalstrings `href="/impressum"` und `href="/datenschutz"` **in** `FooterSection.tsx` → **fehlt** (Links kommen aus dem ViewModel).
  - HeroSection: erwartet `href="/#cta"` in der Datei → **fehlt** (Ist-Zustand: `href="#survey"`).
  - CTASection: erwartet Substring `pilot@resqbrain.de` → **fehlt** (Ist-Zustand: E-Mail aus Config `triggerhub@outlook.com`).
- Nur `id="cta"` in CTASection wird vom Script als **gesetzt** gemeldet.

**Ergänzung:** `validate-content-isolation.ts` einzeln ausgeführt: **pass** für erlaubte Routen inkl. `/impressum`, `/datenschutz`.

---

## Zusammenfassung PASS / WARN / FAIL

| Prüfabschnitt | Status | Kurzbegründung |
|---------------|--------|----------------|
| Routing `/impressum`, `/datenschutz` | **PASS** | App-Routen und `next build` bestätigen beide Pfade. |
| Footer → Rechtslinks | **PASS** | Config + ViewModel liefern `/impressum`, `/datenschutz`; Footer rendert dynamisch. |
| HeroSection Links | **PASS** | Anker `#survey`; keine Pflicht für Rechtslinks in Hero. |
| CTASection Links | **PASS** | `mailto:` aus aktueller Site-Config. |
| SurveysSection Links | **WARN** | MS Forms pro Karte ok; „Direktes Feedback senden“ ohne `href`. |
| `pnpm build` (Root) | **PASS** | Erfolgreicher Produktions-Build. |
| `phase11:website` (gesamte Kette) | **FAIL** | `validate-routing` scheitert an veralteten/brittlen Datei-Substring-Regeln, nicht an fehlenden Routen. |

---

## Offene Restpunkte

1. **`scripts/validate-routing.ts`:** Erwartungen an Footer/Hero/CTA an die aktuelle Implementierung anbinden (ViewModel/Config statt fester Literale in TSX), damit `phase11:website` wieder aussagekräftig grün laufen kann.
2. **SurveysSection:** Klarstellen, ob „Direktes Feedback senden“ bewusst ohne Link bleiben soll; falls nicht, fehlendes `href` (z. B. `mailto:` oder Anker) ergänzen — **nicht** in dieser Prüfung geändert.
3. **Pipeline:** Bei Bedarf `phase11:website` so umbauen, dass nach einem Routing-Fail einzelne Schritte dennoch dokumentiert werden, oder `validate:routing` vorübergehend von der Merge-Kriterien-Kette entkoppeln, bis die Checks aktualisiert sind.
