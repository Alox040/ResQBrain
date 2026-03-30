import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { impressum } from "@/legal/impressum";
import { getLegalViewModel, getPublicProfileViewModel } from "@/lib/site-selectors";

const publicProfile = getPublicProfileViewModel();
const legal = getLegalViewModel();
const impressumLabel =
  legal.links.find((link) => link.href === "/impressum")?.label ?? "Impressum";

export const metadata = {
  title: `${impressumLabel} | ${publicProfile.name}`,
  robots: "index, follow",
};

const body = impressum.replace(/^Impressum\s*\n+/, "").trim();

export default function ImpressumPage() {
  return (
    <main>
      <Section>
        <Container>
          <article className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight text-foreground md:mb-6">
              {impressumLabel}
            </h1>
            <div className="whitespace-pre-line leading-relaxed text-foreground">{body}</div>
          </article>
        </Container>
      </Section>
    </main>
  );
}
