import { PageContainer } from "@/components/layout/page-container";
import { Body, Heading1, Lead } from "@/components/ui/typography";

export default function Page() {
  return (
    <PageContainer>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm sm:p-10">
        <Heading1>ResQBrain Website v2</Heading1>
        <Lead className="mt-4">Neue, unabhaengige Next.js Basis mit App Router und Tailwind.</Lead>
        <Body className="mt-6">
          Diese Seite ist absichtlich minimal gehalten und dient als sauberes Startfundament.
        </Body>
      </div>
    </PageContainer>
  );
}
