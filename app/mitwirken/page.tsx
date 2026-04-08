import Link from "next/link";

import { MitwirkenFormSection } from "@/components/sections/forms/mitwirken-form-section";
import { MitwirkenIntroSection } from "@/components/sections/forms/mitwirken-intro-section";
import { routes } from "@/lib/routes";

export default function MitwirkenPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="px-6 pt-8">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href={routes.mitwirkung}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
          >
            <span aria-hidden="true">←</span>
            <span>Zur Mitwirkung</span>
          </Link>
        </div>
      </div>

      <MitwirkenIntroSection />
      <MitwirkenFormSection />
    </main>
  );
}
