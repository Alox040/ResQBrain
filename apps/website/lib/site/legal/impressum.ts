import { contactDetails } from "@/lib/site/contact-page";

export const impressumContent = {
  pageTitle: "Impressum",
  sectionTitle: "Angaben gemäß § 5 TMG",
  projectLabel: "Projekt:",
  responsibleLabel: "Verantwortlich:",
  contactLabel: "Kontakt:",
  emailLabel: "E-Mail:",
  noteLabel: "Hinweis:",
  noteText: "Dies ist ein nicht-kommerzielles Projekt in früher Phase.",
  projectName: contactDetails.projectName,
  responsibleName: contactDetails.responsibleName,
  email: contactDetails.email,
} as const;
