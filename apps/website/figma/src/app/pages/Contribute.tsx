import { MessageSquare, GitMerge, FileText } from "lucide-react";

export function Contribute() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">Mitwirken</h1>
      <p className="text-lg text-zinc-400 mb-12 max-w-2xl">
        ResQBrain ist ein von der Community getriebenes Projekt. Um etwas zu bauen, das in der Praxis tatsächlich funktioniert, sind wir auf den Austausch mit Praktikern angewiesen.
      </p>

      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-zinc-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Als Pilotpartner oder Experte</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Arbeiten Sie in der Leitung eines Rettungsdienstes oder im Qualitätsmanagement? Wir suchen Gesprächspartner, die mit uns über ihre aktuellen Prozesse sprechen und ehrliches Feedback zu unseren Prototypen geben.
            </p>
            <a href="/kontakt" className="text-sm font-medium text-zinc-300 hover:text-zinc-50 underline underline-offset-4 decoration-zinc-700">
              Kontakt aufnehmen
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <GitMerge className="h-6 w-6 text-zinc-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Als Entwickler oder Designer</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Sie haben technische oder gestalterische Fähigkeiten und möchten ein Open-Source-Projekt im Bereich präklinischer Notfallmedizin unterstützen? Wir strukturieren aktuell die technische Architektur.
            </p>
            <span className="text-sm font-medium text-zinc-500">GitHub Repository folgt bald</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <FileText className="h-6 w-6 text-zinc-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Anforderungen definieren</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Diskutieren Sie mit uns spezifische Edge-Cases, rechtliche Anforderungen oder Besonderheiten regionaler Rettungsdienste, die das System abbilden muss.
            </p>
            <a href="/community" className="text-sm font-medium text-zinc-300 hover:text-zinc-50 underline underline-offset-4 decoration-zinc-700">
              Zur Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
