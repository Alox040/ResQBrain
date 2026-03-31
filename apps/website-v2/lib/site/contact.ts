export const contact = {
  email: "kontakt@example.com",
  label: "Kontakt",
} as const;

export const contactInfo = {
  email: {
    label: contact.email,
    href: `mailto:${contact.email}`,
  },
} as const;
