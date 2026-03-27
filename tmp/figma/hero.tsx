import { ArrowRight, Heart, Search, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1766325693423-69e9fe20605b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhbWVkaWMlMjBlbWVyZ2VuY3klMjBtZWRpY2FsJTIwc2VydmljZXN8ZW58MXx8fHwxNzc0NTkzMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Emergency Medical Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/98 via-gray-900/95 to-gray-900/98" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-red-600 rounded-full px-6 py-3 mb-12">
            <Heart className="w-6 h-6 text-white" fill="currentColor" />
            <span className="text-white text-lg font-semibold">Für Rettungsdienst entwickelt</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-none tracking-tight">
            ResQBrain
          </h1>
          <p className="text-3xl md:text-5xl text-white mb-6 font-bold">
            Wissen, wenn es zählt
          </p>
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            Algorithmen • Medikamente • Protokolle<br/>
            Schnell. Offline. Immer verfügbar.
          </p>

          {/* CTA Buttons - LARGE TOUCH TARGETS */}
          <div className="flex flex-col gap-6 max-w-lg mx-auto mb-20">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white h-20 text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-red-600/50 transition-all border-4 border-red-500"
            >
              Jetzt starten
              <ArrowRight className="ml-3 w-8 h-8" strokeWidth={3} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-gray-900 hover:bg-gray-100 h-16 text-xl font-bold rounded-2xl border-4 border-white"
            >
              Demo ansehen
            </Button>
          </div>

          {/* Feature Pills - LARGER, HIGH CONTRAST */}
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white text-gray-900 rounded-xl px-6 py-5 border-4 border-gray-200">
              <Search className="w-7 h-7" strokeWidth={2.5} />
              <span className="text-xl font-bold">Schnelle Suche</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white text-gray-900 rounded-xl px-6 py-5 border-4 border-gray-200">
              <BookOpen className="w-7 h-7" strokeWidth={2.5} />
              <span className="text-xl font-bold">Alle Protokolle</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-red-600 text-white rounded-xl px-6 py-5 border-4 border-red-500">
              <Heart className="w-7 h-7" strokeWidth={2.5} fill="currentColor" />
              <span className="text-xl font-bold">Offline verfügbar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - REMOVED for cleaner interface */}
    </section>
  );
}