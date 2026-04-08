"use client";

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import { routes } from "@/lib/routes";

const roleOptions: { value: string; label: string; disabled?: boolean }[] = [
  { value: "", label: "Bitte wählen", disabled: true },
  { value: "einsatz", label: "Einsatzkraft" },
  { value: "organisation", label: "Organisation / Rettungsdienst" },
  { value: "ausbildung", label: "Ausbildung" },
  { value: "forschung", label: "Forschung" },
  { value: "sonstiges", label: "Sonstiges" },
];

const interestOptions = [
  { value: "beta", label: "Beta testen" },
  { value: "pilot", label: "Pilotprojekt" },
  { value: "feedback", label: "Feedback" },
  { value: "updates", label: "Updates" },
  { value: "zusammenarbeit", label: "Zusammenarbeit" },
] as const;

export default function MitwirkenPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <Link className="site-nav-link" href={routes.mitwirkung} style={{ width: "fit-content" }}>
              ← Zur Mitwirkung
            </Link>
            <h1 className="hero-title">Projekt mitmachen</h1>
            <p className="body-text muted-text section-lead">
              Hier kannst du Interesse an Beta, Pilot, Feedback, Updates oder Zusammenarbeit melden.
              Es gibt noch keine Server-Verarbeitung — das Formular ist zunächst nur zur Strukturierung
              der Eingaben gedacht.
            </p>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <form
              className="mitwirken-form"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="mitwirken-form-field">
                <label htmlFor="mitwirken-name">Name</label>
                <input
                  id="mitwirken-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="mitwirken-form-control"
                />
              </div>

              <div className="mitwirken-form-field">
                <label htmlFor="mitwirken-email">E-Mail</label>
                <input
                  id="mitwirken-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mitwirken-form-control"
                />
              </div>

              <div className="mitwirken-form-field">
                <label htmlFor="mitwirken-role">Rolle</label>
                <select
                  id="mitwirken-role"
                  name="role"
                  className="mitwirken-form-control"
                  defaultValue=""
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value || "empty"} value={opt.value} disabled={opt.disabled === true}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="mitwirken-form-field mitwirken-form-fieldset">
                <legend>Interessen</legend>
                {interestOptions.map((item) => (
                  <label key={item.value} className="mitwirken-form-check">
                    <input type="checkbox" name="interests" value={item.value} />
                    <span className="body-text muted-text">{item.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="mitwirken-form-field">
                <label htmlFor="mitwirken-message">Nachricht (optional)</label>
                <textarea
                  id="mitwirken-message"
                  name="message"
                  rows={4}
                  className="mitwirken-form-control"
                />
              </div>

              <div className="mitwirken-form-actions">
                <button type="submit" className="button-link button-link--lg">
                  Absenden
                </button>

                <p className="small-text muted-text mitwirken-form-privacy">
                  Hinweise zum Datenschutz:{" "}
                  <Link className="footer-nav-link" href={routes.datenschutz}>
                    Datenschutz
                  </Link>
                </p>
              </div>
            </form>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
