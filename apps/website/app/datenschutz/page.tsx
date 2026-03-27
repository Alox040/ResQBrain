import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { datenschutz } from "@/legal/datenschutz";

export const metadata = {
  title: "Datenschutz | ResQBrain",
  robots: "index, follow",
};

const body = datenschutz.replace(/^Datenschutzerklaerung\s*\n+/, "").trim();

export default function DatenschutzPage() {
  return (
    <main>
      <Section>
        <Container>
          <article className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight text-foreground md:mb-6">
              Datenschutz
            </h1>
            <div className="whitespace-pre-line leading-relaxed text-foreground">{body}</div>
          </article>
        </Container>
      </Section>
    </main>
  );
}
