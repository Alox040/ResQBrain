import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <SectionContainer>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end">
        <div className="grid gap-6">
          <Badge className="w-fit">MVP-Phase / Aktive Entwicklung</Badge>
          <div className="grid gap-4">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Struktur fuer den Einsatzalltag
            </p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-zinc-50 sm:text-6xl">
              ResQBrain baut eine klare Wissensbasis fuer den Rettungsdienst.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-300">
              Ein fokussierter MVP fuer nachvollziehbare Inhalte, schnelle Orientierung
              und praxisnahes Feedback ohne unnoetige Komplexitaet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/mitwirken" size="lg" variant="primary">
              Jetzt mitwirken
            </Button>
            <Button href="/wie-es-funktioniert" size="lg" variant="ghost">
              Wie es funktioniert
            </Button>
          </div>
        </div>

        <Card className="grid gap-5">
          <div className="grid gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
              Fokus im MVP
            </p>
            <h2 className="text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-50">
              Offline zuerst. Klarer Zugriff. Weniger Reibung.
            </h2>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-4">
              <p className="text-sm font-medium text-zinc-100">Lookup-Inhalte</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Medikamente, Algorithmen und Suche in einem sauberen, robusten Datenfluss.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-4">
              <p className="text-sm font-medium text-zinc-100">Praxisbezug</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Entscheidungen werden an realen Einsatzablaeufen und Rueckmeldungen ausgerichtet.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </SectionContainer>
  );
}
