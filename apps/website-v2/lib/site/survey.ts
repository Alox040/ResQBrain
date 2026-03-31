export const surveyContent = {
  label: "Zur Umfrage",
  href: "https://example.org/survey",
  description: "Platzhalter fuer externen Survey-Link.",
} as const;

export type SurveyContent = typeof surveyContent;
