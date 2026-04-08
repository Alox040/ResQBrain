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
    href: "https://forms.office.com/r/vzHuUdFBRy",
    description: "UI & UX Feedback",
    date: "April 2026",
  },
  previous: [],
};
