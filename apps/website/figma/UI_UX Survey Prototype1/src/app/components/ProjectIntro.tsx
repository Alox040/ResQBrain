import logoAsset from 'figma:asset/deb7804b15b16e8187653ea879d8f759526d4ac8.png';

export function ProjectIntro() {
  return (
    <section className="relative w-full border-b border-[#17233f] pb-20 lg:pb-32">

      {/* Very subtle background watermark */}
      <img
        src={logoAsset}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] object-contain opacity-[0.018] mix-blend-screen pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-2xl flex flex-col gap-8">

        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#12b5ab] relative">
            <span className="absolute inset-0 rounded-full bg-[#12b5ab] animate-ping opacity-60" />
          </span>
          <span className="text-xs text-[#4f7db3]">Frühphase · Konzept & Evaluierung</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-medium text-zinc-100 tracking-tight">
            ResQBrain
          </h1>
          <div className="w-10 h-[2px] bg-[#12b5ab] rounded-sm opacity-70" />
        </div>

        <p className="text-base text-zinc-400 leading-relaxed font-light">
          Eine Idee für ein digitales Nachschlagewerk im Rettungsdienst — gebaut von Menschen aus der Praxis, für Menschen in der Praxis.
        </p>

        <p className="text-sm text-zinc-500 leading-relaxed font-light">
          Diese Seite stellt das Projekt vor: was es werden soll, warum es das gibt, wo wir gerade stehen und wie du dich einbringen kannst.
        </p>

        <nav className="flex flex-wrap items-center gap-6 pt-4">
          <a href="#about" className="text-sm text-[#4f7db3] hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-[#17233f] hover:decoration-[#4f7db3]">
            Mehr erfahren
          </a>
          <a href="#participate" className="text-sm text-[#12b5ab] hover:text-[#1fe5d7] transition-colors underline underline-offset-4 decoration-[#12b5ab]/30 hover:decoration-[#12b5ab]">
            Mitgestalten
          </a>
        </nav>

      </div>
    </section>
  );
}
