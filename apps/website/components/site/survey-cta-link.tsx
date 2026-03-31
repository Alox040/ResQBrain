import { ButtonLink } from "@/components/ui/button-link";
import { surveyContent } from "@/lib/site";

export function SurveyCtaLink() {
  return <ButtonLink href={surveyContent.href}>{surveyContent.label}</ButtonLink>;
}
