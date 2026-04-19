import { Users } from "lucide-react";

export function Community() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-8">
        <Users className="h-8 w-8 text-zinc-400" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">Community Plattform</h1>
      <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
        Der Austausch zur Konzeption und Entwicklung von ResQBrain wird transparent stattfinden. Wir bereiten derzeit einen Kommunikationskanal vor.
      </p>
      
      <div className="max-w-md mx-auto p-8 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <h3 className="text-base font-medium text-zinc-100 mb-2">Discord Server in Vorbereitung</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Der offizielle Discord-Server für den Austausch wird in Kürze eröffnet. Schauen Sie später wieder vorbei oder schreiben Sie uns über das Kontaktformular.
        </p>
        <button disabled className="w-full h-10 inline-flex items-center justify-center rounded-md bg-zinc-800 text-sm font-medium text-zinc-500 cursor-not-allowed">
          Noch nicht verfügbar
        </button>
      </div>
    </div>
  );
}
