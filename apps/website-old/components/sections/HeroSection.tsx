import { ArrowRight, BookOpen, Heart, Search } from "lucide-react";

import { getPublicProfileViewModel } from "../../lib/site-selectors";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function HeroSection() {
  const publicProfile = getPublicProfileViewModel();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1766325693423-69e9fe20605b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhbWVkaWMlMjBlbWVyZ2VuY3klMjBtZWRpY2FsJTIwc2VydmljZXN8ZW58MXx8fHwxNzc0NTkzMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Emergency Medical Services"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/98 via-gray-900/95 to-gray-900/98" />
      </div>

      <Container>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <div className="mb-12 inline-flex items-center gap-3 rounded-full bg-red-600 px-6 py-3">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
              <span className="text-lg font-semibold text-white">{publicProfile.stageLabel}</span>
            </div>

            <h1 className="mb-8 text-6xl leading-none font-black tracking-tight text-white md:text-8xl">
              {publicProfile.name}
            </h1>
            <p className="mb-6 text-3xl font-bold text-white md:text-5xl">Wissen, wenn es zaehlt</p>
            <p className="mx-auto mb-16 max-w-2xl text-xl leading-relaxed font-medium text-gray-300 md:text-2xl">
              {publicProfile.tagline}
              <br />
              Schnell. Offline. Immer verfuegbar.
            </p>

            <div className="mx-auto mb-20 flex max-w-lg flex-col gap-6">
              <Button
                href="#survey"
                className="h-20 rounded-2xl border-4 border-red-500 bg-red-600 text-2xl font-bold text-white shadow-2xl transition-all hover:bg-red-700 hover:shadow-red-600/50"
              >
                Jetzt starten
                <ArrowRight className="ml-3 h-8 w-8" strokeWidth={3} />
              </Button>
              <Button
                href="#survey"
                variant="outline"
                className="h-16 rounded-2xl border-4 border-white bg-white text-xl font-bold text-gray-900 hover:bg-gray-100"
              >
                Demo ansehen
              </Button>
            </div>

            <div className="mx-auto flex max-w-md flex-col gap-4">
              <div className="flex items-center justify-center gap-3 rounded-xl border-4 border-gray-200 bg-white px-6 py-5 text-gray-900">
                <Search className="h-7 w-7" strokeWidth={2.5} />
                <span className="text-xl font-bold">Schnelle Suche</span>
              </div>
              <div className="flex items-center justify-center gap-3 rounded-xl border-4 border-gray-200 bg-white px-6 py-5 text-gray-900">
                <BookOpen className="h-7 w-7" strokeWidth={2.5} />
                <span className="text-xl font-bold">Alle Protokolle</span>
              </div>
              <div className="flex items-center justify-center gap-3 rounded-xl border-4 border-red-500 bg-red-600 px-6 py-5 text-white">
                <Heart className="h-7 w-7" strokeWidth={2.5} fill="currentColor" />
                <span className="text-xl font-bold">Offline verfuegbar</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
