export const surveyUrl =
  process.env.NEXT_PUBLIC_SURVEY_URL?.trim() || "#";

export const survey = {
  href: surveyUrl,
  url: surveyUrl,
  label: "Umfrage",
} as const;

export const surveyContent = survey;
