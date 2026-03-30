import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { scrollMarginUnderHeader } from "@/components/ui/patterns";
import { links } from "@/data/links";
import { siteTitle } from "@/lib/routes";

const linksPageDescription =
  "Alle wichtigen Links zum ResQBrain Projekt – Discord, Umfragen, Updates und Kontakt";

export const metadata: Metadata = {
  title: {
    absolute: "ResQBrain Links",
  },
  description: linksPageDescription,
  openGraph: {
    title: "ResQBrain Links",
    description: linksPageDescription,
    images: [{ url: "/og-resqbrain.png" }],
  },
};

/** Glass-Karten: Blur, Schatten, Hover-Scale */
const linkCardClass =
  "group flex w-full min-h-[5.25rem] flex-col items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-surface)_55%,var(--ems-blue-soft)_45%)] bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] px-5 py-5 text-center shadow-[0_4px_24px_rgba(23,28,33,0.08),0_1px_3px_rgba(23,28,33,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:scale-[1.02] hover:border-[color-mix(in_srgb,var(--ems-red)_32%,var(--ems-blue)_68%)] hover:bg-[color-mix(in_srgb,var(--color-surface)_82%,var(--ems-blue-soft)_18%)] hover:shadow-[0_14px_44px_rgba(47,90,168,0.14),0_6px_16px_rgba(198,61,61,0.09),inset_0_1px_0_rgba(255,255,255,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--ems-blue)_55%,var(--ems-red)_45%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--color-background)_90%,transparent)] active:scale-[0.99] sm:min-h-24 sm:py-6";

function opensInNewTab(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default function LinksPage() {
  return (
    <main className="min-w-0 flex-1">
      <section
        className={`${scrollMarginUnderHeader} flex flex-col border-b border-[var(--color-border)]/80 pb-16 sm:pb-20 lg:pb-24`}
        style={{
          background: [
            "linear-gradient(150deg,",
            "color-mix(in srgb, var(--ems-red-soft) 65%, var(--color-background)) 0%,",
            "var(--color-background) 32%,",
            "color-mix(in srgb, var(--color-background) 55%, var(--ems-blue-soft) 45%) 58%,",
            "color-mix(in srgb, var(--ems-blue-soft) 35%, var(--color-background)) 100%)",
          ].join(" "),
        }}
      >
        <Container className="pt-[60px]">
          <div className="mx-auto w-full max-w-md">
            <header className="text-center">
              <h1 className="text-[1.625rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:text-[1.875rem]">
                {siteTitle}
              </h1>
              <p className="mx-auto mt-3 max-w-[22rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-base">
                Alles wichtige auf einen Blick
              </p>
              <div
                className="mx-auto mt-5 h-0.5 w-14 rounded-full opacity-90 sm:mt-6"
                style={{
                  background:
                    "linear-gradient(90deg, var(--ems-red), var(--ems-blue))",
                }}
                aria-hidden
              />
            </header>

            <nav
              className="mt-12 flex w-full flex-col gap-5 sm:mt-14 sm:gap-6"
              aria-label="ResQBrain Schnelllinks"
            >
              {links.map((item) => {
                const newTab = opensInNewTab(item.url);

                return (
                  <a
                    key={item.url}
                    href={item.url}
                    className={linkCardClass}
                    {...(newTab
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="text-base font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:text-lg">
                      {item.title}
                    </span>
                    <span className="max-w-[22rem] text-sm font-normal leading-relaxed text-[var(--color-muted)]">
                      {item.description}
                    </span>
                  </a>
                );
              })}
            </nav>

            <footer className="mt-14 space-y-2 text-center sm:mt-16">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Projekt im Aufbau
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                Feedback willkommen
              </p>
            </footer>
          </div>
        </Container>
      </section>
    </main>
  );
}
