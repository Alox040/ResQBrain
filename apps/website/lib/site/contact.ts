export const contact = {
  email: "kontakt@example.com",
  name: "ResQBrain Projekt",
  label: "Kontakt",
} as const;

export const contactInfo = {
  email: {
    label: contact.email,
    href: `mailto:${contact.email}`,
  },
} as const;
