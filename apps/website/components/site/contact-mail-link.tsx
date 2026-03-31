import { TextLink } from "@/components/ui/text-link";
import { contactInfo } from "@/lib/site";

export function ContactMailLink() {
  return <TextLink href={contactInfo.email.href}>{contactInfo.email.label}</TextLink>;
}
