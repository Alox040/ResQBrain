export function Contact() {
  return (
    <div className="animate-in fade-in duration-700 max-w-2xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">Kontakt</h1>
      <p className="text-lg text-zinc-400 mb-12">
        Interesse am Projekt oder Feedback zur Konzeption? Wir freuen uns über jede Nachricht von Personen aus dem Rettungsdienstwesen oder der IT.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
          <input 
            type="text" 
            id="name" 
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
            placeholder="Ihr Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">E-Mail Adresse</label>
          <input 
            type="email" 
            id="email" 
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
            placeholder="ihre@email.de"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-zinc-300 mb-2">Hintergrund / Funktion (optional)</label>
          <input 
            type="text" 
            id="role" 
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
            placeholder="z.B. Notfallsanitäter, ÄLRD, Entwickler"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Nachricht</label>
          <textarea 
            id="message" 
            rows={5}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
            placeholder="Wie können Sie das Projekt unterstützen oder welches Feedback haben Sie für uns?"
          ></textarea>
        </div>
        <button 
          type="button"
          className="w-full sm:w-auto h-11 inline-flex items-center justify-center rounded-md bg-zinc-100 px-8 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          Nachricht senden
        </button>
      </form>
      <p className="text-xs text-zinc-600 mt-6">
        Dies ist ein Prototyp. Formular-Daten werden aktuell nicht real versendet.
      </p>
    </div>
  );
}
