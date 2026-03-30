import { Badge } from "../ui/Badge";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";

const featureLabels = ["Medikamente", "Algorithmen", "SOP", "Lokal", "Version"];

export function AppPreviewSection() {
  return (
    <Section id="preview">
      <Container>
        <header className="mx-auto max-w-xl text-center md:mx-0 md:max-w-lg md:text-left">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-foreground md:text-[clamp(1.65rem,2.5vw,2rem)]">
            App-Vorschau
          </h2>
          <p className="muted m-0 mt-5 text-base leading-relaxed md:mt-6 md:text-[1.05rem] md:leading-[1.55]">
            Mobilansicht: Liste und Eintrag. Ersetzen durch Export, sobald der UI-Stand fix ist.
          </p>
        </header>

        <div className="mt-8 flex flex-col items-center gap-8 md:mt-10">
          <figure className="m-0 w-full max-w-[280px] md:max-w-[292px]">
            <img
              src="/app-preview.svg"
              alt=""
              width={360}
              height={720}
              className="block h-auto w-full rounded-lg border border-border"
              decoding="async"
              loading="lazy"
            />
            <figcaption className="sr-only">Schematische Darstellung der App-Oberflaeche</figcaption>
          </figure>

          <div
            className="flex max-w-2xl flex-wrap justify-center gap-6"
            aria-label="Gezeigte Bereiche"
          >
            {featureLabels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
