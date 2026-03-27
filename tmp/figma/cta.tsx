import { ArrowRight, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function CTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl overflow-hidden border-8 border-red-500 shadow-2xl">
          <div className="p-12 lg:p-16 text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Jetzt testen
            </h2>
            <p className="text-2xl md:text-3xl text-white mb-12 font-bold max-w-3xl mx-auto">
              Werden Sie Early-Adopter
            </p>

            <div className="space-y-4 mb-12 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm border-4 border-white/40 rounded-xl p-5">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">Kostenlos testen</p>
              </div>
              <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm border-4 border-white/40 rounded-xl p-5">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">Direktes Feedback</p>
              </div>
              <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm border-4 border-white/40 rounded-xl p-5">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">Mitgestalten</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-w-lg mx-auto">
              <Button 
                size="lg" 
                className="bg-white text-red-700 hover:bg-gray-100 h-20 text-2xl font-black rounded-2xl shadow-2xl border-4 border-white"
              >
                <Mail className="mr-3 w-8 h-8" strokeWidth={3} />
                Kontakt aufnehmen
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 h-16 text-xl font-bold rounded-2xl border-4"
              >
                Mehr erfahren
                <ArrowRight className="ml-2 w-6 h-6" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}