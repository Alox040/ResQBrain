import { siteConfig } from "./site";

type NavigationItemViewModel = {
  href: string;
  label: string;
};

type LegalLinkViewModel = {
  href: string;
  label: string;
};

type ContactActionViewModel = {
  href: string;
  label: string;
};

function isNonEmptyString(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function withFallback(value: string | undefined | null, fallback: string) {
  return isNonEmptyString(value) ? value.trim() : fallback;
}

function toMailtoHref(email: string, subject?: string) {
  const normalizedEmail = withFallback(email, "pilot@resqbrain.de");
  if (!isNonEmptyString(subject)) {
    return `mailto:${normalizedEmail}`;
  }

  return `mailto:${normalizedEmail}?subject=${encodeURIComponent(subject.trim())}`;
}

export function getPublicProfileViewModel() {
  const profile = siteConfig.publicProfile;

  return {
    name: withFallback(profile.name, "ResQBrain"),
    title: withFallback(profile.title, withFallback(profile.name, "ResQBrain")),
    description: withFallback(
      profile.description,
      "ResQBrain Referenz fuer Rettungsdienst-Inhalte.",
    ),
    url: withFallback(profile.url, "https://resqbrain.example.com"),
    tagline: withFallback(
      profile.tagline,
      "Plattform fuer medizinische Algorithmen im Rettungsdienst",
    ),
    stageLabel: withFallback(profile.stageLabel, "Phase 0"),
  };
}

export function getNavigationViewModel(): NavigationItemViewModel[] {
  return siteConfig.navigation.map((item) => ({
    href: withFallback(item.href, "/"),
    label: withFallback(item.label, "Link"),
  }));
}

export function getContactViewModel() {
  const contact = siteConfig.contact;
  const email = withFallback(contact.email, "pilot@resqbrain.de");
  const feedbackLabel = withFallback(contact.feedbackLabel, "Feedback");
  const repositoryUrl = withFallback(contact.repositoryUrl, "");

  const actions: ContactActionViewModel[] = [
    {
      href: toMailtoHref(email),
      label: feedbackLabel,
    },
  ];

  if (isNonEmptyString(repositoryUrl)) {
    actions.unshift({
      href: repositoryUrl,
      label: "GitHub",
    });
  }

  return {
    email,
    feedbackLabel,
    repositoryUrl: isNonEmptyString(repositoryUrl) ? repositoryUrl : null,
    feedbackHref: toMailtoHref(email),
    contactHref: toMailtoHref(email, "Kontakt ResQBrain"),
    learnMoreHref: toMailtoHref(email, "Mehr erfahren ResQBrain"),
    pilotHref: toMailtoHref(email, "ResQBrain Pilotpartner"),
    actions,
  };
}

export function getLegalViewModel() {
  const fallbackLinks: LegalLinkViewModel[] = [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
  ];

  const links = siteConfig.legal.links
    .map((link) => ({
      href: withFallback(link.href, "/"),
      label: withFallback(link.label, "Rechtliches"),
    }))
    .filter((link) => isNonEmptyString(link.href) && isNonEmptyString(link.label));

  return {
    links: links.length > 0 ? links : fallbackLinks,
  };
}

export function getFooterViewModel() {
  const profile = getPublicProfileViewModel();
  const footer = siteConfig.footer;
  const legal = getLegalViewModel();
  const contact = getContactViewModel();
  const currentYear = new Date().getFullYear();
  const copyrightSuffix = withFallback(
    footer.copyrightSuffix,
    "Alle Rechte vorbehalten.",
  );

  return {
    brandName: profile.name,
    tagline: profile.tagline,
    stageLabel: profile.stageLabel,
    legalLinks: legal.links,
    contactActions: contact.actions,
    copyright: `© ${currentYear} ${profile.name}. ${copyrightSuffix}`,
  };
}
