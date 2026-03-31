# Phase 11 — Website build & routing validation

**Datum:** 31. März 2026  
**Umfang:** Routing `/impressum`, `/datenschutz`; Link-Quellen; `pnpm build`; Skripte; Dev-Smoke.

## Ergebnisüberblick

| Prüfung | Ergebnis | Klassifizierung |
|---------|----------|-----------------|
| `pnpm build` (root) | **PASS** | — |
| `scripts/validate-routing.ts` | **PASS** | — |
| `scripts/validate-content-isolation.ts` | **PASS** | — |
| Dev: `GET /impressum`, `GET /datenschutz` | **200 OK**, Body enthält erwartete Begriffe | — |

**Real blocker:** keine.  
**Veraltete Validierungsregel:** keine Abweichung — Erwartungen der Skripte passen zum aktuellen `app/`-Baum.  
**Non-blocking warning:** keine aus diesem Lauf (weder Build-Warnungen noch Skript-Warnungen).

---

## 1. Routing `/impressum` und `/datenschutz`

- **Dateien:** `apps/website/app/impressum/page.tsx`, `apps/website/app/datenschutz/page.tsx` — laut `validate-routing.ts` **vorhanden**.
- **Production build:** Next.js listet beide als statische Routen `○ /impressum`, `○ /datenschutz`.
- **Quelle Inhalt:** `legal/impressum-content.ts`, `legal/datenschutz-content.ts` (über `page.tsx` + `AutoLinkText`).

---

## 2. Link-Quellen (aktuelle Architektur)

| Bereich | Relevante Ziele | Befund |
|---------|-----------------|--------|
| **Footer** | `footerNav` in `lib/routes.ts` → Kontakt, Mitwirkung, **Impressum**, **Datenschutz** | `site-footer.tsx` rendert alle vier per `next/link`. |
| **Hero** | `SurveyCtaLink` (Umfrage), `#mitmachen`, `FeedbackButton` | Kein direkter Link zu Impressum/Datenschutz (absichtlich über Footer/FAQ). |
| **CTA-artig** | `SurveyInviteSection`: Umfrage-CTA + `routes.kontakt` | Kein Impressum/Datenschutz in diesem Block. |
| **`collaboration-section`** | `routes.kontakt` | Kein Impressum/Datenschutz. |
| **Survey / Pilot** | `pilot-feedback-section`: `routes.kontakt` | Kein Impressum/Datenschutz. |
| **FAQ (Survey-/Daten-Bezug)** | **`routes.datenschutz`** | Inline-Link „Datenschutzerklärung“ in der Antwort zu erhobenen Daten. |

**Hinweis:** `problem-benefits-section` und `features-overview-section` enthalten **keine** `Link`-Komponenten (nur Inhalt, keine externen Routing-Ziele in diesen Dateien).

---

## 3. Ausgeführte Befehle

```bash
pnpm build
pnpm exec tsx scripts/validate-routing.ts
pnpm exec tsx scripts/validate-content-isolation.ts
```

Zusätzlich lokal: `pnpm dev` in `apps/website`, dann HTTP auf `http://localhost:3000/impressum` und `…/datenschutz`.

---

## 4. Fehleranalyse (Erwartung vs. Regression)

- **`validate-routing`:** Prüft Existenz fester Pfade und optionaler Section-Dateien. Alle Einträge **vorhanden** — kein Hinweis auf veraltete Pflicht-Section oder fehlende Legal-Route.
- **`validate-content-isolation`:** Erlaubt genau die sechs Marketing-Routen + `/`; `app/`-Verzeichnisse entsprechen dem **Allowlist**-Set. Kein `public/` am Repo-Root, keine verbotenen Unterordner unter `apps/website/public`. **Kein False-Fail** durch neue, legitime Route außerhalb der Liste — aktuell keine Diskrepanz.

---

## 5. Dev-Smoke (kurz)

- `/impressum`: HTTP 200, HTML enthält „Impressum“.
- `/datenschutz`: HTTP 200, HTML enthält „Datenschutz“.

---

## 6. Follow-up (außerhalb dieses Laufs)

- Vercel: Skript-Hinweis weiterhin **Root Directory = `apps/website`** in Projekt-Einstellungen (operativ, nicht durch diesen Build geprüft).
