import { Container } from "@/components/layout/container";

export function FooterSection() {
  return (
    <footer id="footer" className="border-t border-slate-800 bg-slate-950 py-10 text-slate-300">
      <Container>
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:text-left">
          <div>
            <p className="text-base font-semibold text-slate-100">ResQBrain</p>
            <p className="mt-2 text-sm text-slate-400">Wissensplattform für den Rettungsdienst</p>
            <p className="mt-3 text-sm text-slate-500">
              Community-getriebene Entwicklung · Early Stage Projekt
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm md:items-end">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-slate-100"
            >
              GitHub
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-slate-100"
            >
              Reddit
            </a>
            <a
              href="mailto:"
              className="transition-colors duration-200 hover:text-slate-100"
            >
              Kontakt
            </a>
            <a
              href="#feedback"
              className="transition-colors duration-200 hover:text-slate-100"
            >
              Feedback
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          © 2025 ResQBrain — Kein kommerzielles Produkt
        </p>
      </Container>
    </footer>
  );
}
