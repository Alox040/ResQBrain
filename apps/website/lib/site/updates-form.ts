import { surveys } from "@/lib/site/survey";

/**
 * Single source of truth for survey/interest form URL.
 */
export const updatesInterestFormHref: string = surveys.active.href;
