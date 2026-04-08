import Link from "next/link";
import { Container } from "@/components/layout/container";

const projectLinks = [
  { label: "Start", href: "/" },
  { label: "Mitwirkung", href: "/mitwirkung" },
  { label: "Links", href: "/links" },
  { label: "Kontakt", href: "/kontakt" },
];

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]"
            >
              ResQBrain
            </Link>
            <p className="max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
              Die Wissensplattform fuer den Rettungsdienst.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Projekt
            </h2>
            <nav aria-label="Projekt" className="flex flex-col gap-3">
              {projectLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Rechtliches
            </h2>
            <nav aria-label="Rechtliches" className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}
