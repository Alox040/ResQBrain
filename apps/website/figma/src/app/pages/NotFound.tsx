export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-semibold text-zinc-800 mb-4">404</h1>
      <p className="text-lg text-zinc-400 mb-8">Diese Seite existiert (noch) nicht.</p>
      <a 
        href="/"
        className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
      >
        Zurück zur Startseite
      </a>
    </div>
  );
}
