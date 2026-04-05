const SURVEY_URL = "https://forms.cloud.microsoft/r/ZFVgC0L1BZ" as const;

export const survey = {
  href: SURVEY_URL,
  url: SURVEY_URL,
  label: "Umfrage",
} as const;

export const surveyContent = survey;
