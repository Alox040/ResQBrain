import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { datenschutz } from "@/legal/datenschutz";
import { getLegalViewModel, getPublicProfileViewModel } from "@/lib/site-selectors";

const publicProfile = getPublicProfileViewModel();
const legal = getLegalViewModel();
const datenschutzLabel =
  legal.links.find((link) => link.href === "/datenschutz")?.label ?? "Datenschutz";

export const metadata = {
  title: `${datenschutzLabel} | ${publicProfile.name}`,
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
              {datenschutzLabel}
            </h1>
            <div className="whitespace-pre-line leading-relaxed text-foreground">{body}</div>
          </article>
        </Container>
      </Section>
    </main>
  );
}
