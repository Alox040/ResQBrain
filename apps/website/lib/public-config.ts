/**
 * Zentrale öffentliche Konfiguration für `website-ui8` (ohne Backend).
 *
 * **Kurzumfrage:** `surveyPublishedUrlFromCode` oder `NEXT_PUBLIC_RESQBRAIN_SURVEY_URL` (HTTPS).
 * **Abgeschlossene Umfrage:** nur Dokumentation (`surveyClosedDocumentationUrlFromCode`), keine CTA-Logik.
 *
 * Siehe: `lib/routes.ts` → `resolveSurveyLink()`.
 */

/** Aktive Umfrage (Microsoft Forms). */
export const surveyPublishedUrlFromCode = "<FORM_LINK_HIER_EINFÜGEN>";

/**
 * Abgeschlossene Umfrage — referenziert unter `/mitwirkung`, nicht in `resolveSurveyLink()`.
 */
export const surveyClosedDocumentationUrlFromCode = "https://forms.cloud.microsoft/r/ZFVgC0L1BZ";

/** Öffentliche Zusammenfassung / Datei zu den Ergebnissen der ersten (abgeschlossenen) Umfrage. */
export const firstSurveyResultsUrlFromCode =
  "https://drive.google.com/file/d/1uKMuiNduTUMstE_5W3EmHEzpnGnL5n6_/view?usp=sharing";

function readEnvSurveyUrl(): string {
  if (typeof process === "undefined") return "";
  return (process.env.NEXT_PUBLIC_RESQBRAIN_SURVEY_URL ?? "").trim();
}

/** Effektive Umfrage-URL: Umgebungsvariable schlägt den Code-Wert. */
export function getSurveyPublishedUrl(): string {
  const fromEnv = readEnvSurveyUrl();
  if (fromEnv.length > 0) return fromEnv;
  return surveyPublishedUrlFromCode.trim();
}

/** `true`, wenn eine http(s)-Umfrageadresse konfiguriert ist. */
export function hasPublishedSurveyUrl(): boolean {
  const u = getSurveyPublishedUrl();
  return u.length > 0 && /^https?:\/\//i.test(u);
}
