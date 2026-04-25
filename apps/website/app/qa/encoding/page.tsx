const umlautSample = "ä ö ü Ä Ö Ü ß";

export default function EncodingQaPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Encoding QA</h1>
        <p className="text-sm text-zinc-400">
          Diese Testseite vergleicht UTF-8 im Quelltext und im gerenderten DOM.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Sample</p>
        <p className="mt-3 text-2xl font-medium text-zinc-50" data-umlaut-sample={umlautSample}>
          {umlautSample}
        </p>
      </section>
    </main>
  );
}
