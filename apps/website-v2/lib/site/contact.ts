export const contactInfo = {
  email: {
    label: "E-Mail",
    href: "mailto:kontakt@example.org",
  },
  channels: [
    {
      label: "Kontaktseite",
      href: "https://example.org/contact",
    },
  ],
} as const;

export type ContactInfo = typeof contactInfo;
