export type Survey = {
  label: string;
  href: string;
  description: string;
  date: string;
};

export const surveys: {
  active: Survey;
  previous: Survey[];
} = {
  active: {
    label: "Aktuelle Umfrage",
    href: "https://forms.cloud.microsoft/r/AubZiQ0SQw",
    description: "UI & UX Feedback",
    date: "April 2026",
  },
  previous: [],
};
