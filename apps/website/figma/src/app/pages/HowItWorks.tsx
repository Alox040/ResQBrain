export function HowItWorks() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-12">Wie es funktioniert</h1>
      
      <div className="space-y-16">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="text-5xl font-light text-zinc-800 mb-4">01</div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Organisation anlegen</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Ein administrativer Zugang wird für den Rettungsdienstbereich oder die Hilfsorganisation eingerichtet. Dieser agiert als isolierter Mandant (Tenant).</p>
          </div>
          <div className="md:col-span-8 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col gap-3">
             <div className="h-4 w-1/4 rounded bg-zinc-800"></div>
             <div className="h-10 w-full rounded bg-zinc-800/50 border border-zinc-800"></div>
             <div className="h-10 w-full rounded bg-zinc-800/50 border border-zinc-800"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="text-5xl font-light text-zinc-800 mb-4">02</div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Inhalte strukturieren</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Medizinische Verantwortliche importieren oder erstellen ihre spezifischen Algorithmen, SOPs und Medikamentenlisten in einem standardisierten Format.</p>
          </div>
          <div className="md:col-span-8 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
             <div className="flex gap-4 h-full">
                <div className="w-1/3 space-y-2">
                  <div className="h-3 w-full rounded bg-zinc-800"></div>
                  <div className="h-3 w-5/6 rounded bg-zinc-800"></div>
                  <div className="h-3 w-full rounded bg-zinc-800"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="h-20 w-full rounded bg-zinc-800/40 border border-zinc-800/50"></div>
                  <div className="h-20 w-full rounded bg-zinc-800/40 border border-zinc-800/50"></div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="text-5xl font-light text-zinc-800 mb-4">03</div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Freigabe & Versionierung</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Ein Entwurf wird überprüft und durch die ärztliche Leitung freigegeben. Das System erzeugt einen neuen unveränderlichen Stand (Version).</p>
          </div>
          <div className="md:col-span-8 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 flex items-center justify-center">
             <div className="flex items-center gap-4">
               <div className="px-4 py-2 rounded bg-zinc-800/50 border border-zinc-700 text-xs text-zinc-400">v1.4 (Entwurf)</div>
               <div className="h-px w-8 bg-zinc-700"></div>
               <div className="px-4 py-2 rounded bg-zinc-100 text-xs font-medium text-zinc-900">Freigabe</div>
               <div className="h-px w-8 bg-zinc-700"></div>
               <div className="px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">v1.5 (Aktiv)</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
