import React from 'react';
import { Link } from 'react-router';
import { Container, Section, H1, BodyText } from '../components/Foundation';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

export const Anmeldung = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Formular-Logik hier implementieren (z.B. API Call)
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen relative overflow-hidden flex flex-col bg-[#070d1c]">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#29C5D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1E61D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <Section className="py-12 md:py-20 flex-grow flex flex-col relative z-10">
        <Container>
          <div className="max-w-[680px] mx-auto w-full">
            {/* Back link */}
            <Link to="/" className="inline-flex items-center text-sm font-light tracking-wide text-white/40 hover:text-[#29C5D9] transition-colors mb-12 group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Zurück zur Startseite
            </Link>

            {/* Top Section */}
            <div className="mb-10">
              <H1 className="!text-3xl md:!text-4xl !mb-3 text-white">Mitwirken & Updates erhalten</H1>
              <h2 className="text-lg md:text-xl font-light text-[#29C5D9] mb-4">
                Eintragen für Tests, Pilotwachen oder Projektupdates
              </h2>
              <BodyText className="!text-base text-white/60 !mb-0">
                Das Projekt befindet sich in früher Entwicklung.
                Interessierte können sich für Tests oder Pilotprojekte eintragen.
              </BodyText>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & E-Mail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 tracking-widest uppercase block">Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#070d1c] border border-white/10 p-3 text-white focus:outline-none focus:border-[#29C5D9]/50 transition-colors text-sm font-light placeholder:text-white/20"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 tracking-widest uppercase block">E-Mail</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#070d1c] border border-white/10 p-3 text-white focus:outline-none focus:border-[#29C5D9]/50 transition-colors text-sm font-light placeholder:text-white/20"
                    placeholder="mail@beispiel.de"
                  />
                </div>
              </div>

              {/* Row 2: Rolle (Dropdown) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 tracking-widest uppercase block">Rolle</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-[#070d1c] border border-white/10 p-3 pr-10 text-white focus:outline-none focus:border-[#29C5D9]/50 transition-colors text-sm font-light cursor-pointer"
                    defaultValue="Einzelperson / Tester"
                  >
                    <option value="Einzelperson / Tester">Einzelperson / Tester</option>
                    <option value="Rettungswache">Rettungswache</option>
                    <option value="Organisation">Organisation</option>
                    <option value="Schule / Ausbildung">Schule / Ausbildung</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <ChevronDown size={18} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Row 3: Interesse */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-semibold text-white/50 tracking-widest uppercase block">Interesse</label>
                <div className="flex flex-col gap-2">
                  {[
                    'Beta testen', 
                    'Pilotprojekt Wache', 
                    'Feedback geben', 
                    'Updates erhalten', 
                    'Zusammenarbeit'
                  ].map((interest) => (
                    <label key={interest} className="flex items-center gap-3 cursor-pointer group py-1">
                      <div className="relative flex items-center justify-center w-5 h-5 border border-white/20 bg-transparent group-hover:border-[#29C5D9]/50 transition-colors">
                        <input type="checkbox" name="interesse" value={interest} className="peer sr-only" />
                        <Check 
                          size={14} 
                          strokeWidth={2.5} 
                          className="text-[#29C5D9] opacity-0 peer-checked:opacity-100 transition-opacity" 
                        />
                      </div>
                      <span className="text-white/70 text-sm font-light group-hover:text-white transition-colors">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 4: Freitext */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-white/50 tracking-widest uppercase block">Nachricht (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#070d1c] border border-white/10 p-3 text-white focus:outline-none focus:border-[#29C5D9]/50 transition-colors text-sm font-light resize-y placeholder:text-white/20 leading-relaxed"
                  placeholder="Beschreiben Sie kurz Ihre Idee oder Ihren Einsatzbereich (optional)"
                ></textarea>
              </div>

              {/* Bottom: Submit & Privacy */}
              <div className="pt-6 mt-2 border-t border-white/5">
                <button
                  type="submit"
                  className="w-full bg-[#29C5D9]/10 border border-[#29C5D9]/30 text-[#29C5D9] hover:bg-[#29C5D9]/20 hover:border-[#29C5D9]/60 transition-all py-3.5 text-sm tracking-widest uppercase cursor-pointer font-medium"
                >
                  Eintragen
                </button>
                <p className="text-center text-xs text-white/40 font-light mt-4">
                  Wir behandeln Ihre Daten vertraulich. Weitere Informationen in der{' '}
                  <Link to="/datenschutz" className="text-white/50 hover:text-[#29C5D9] underline underline-offset-2 transition-colors">
                    Datenschutzerklärung
                  </Link>.
                </p>
              </div>

            </form>

          </div>
        </Container>
      </Section>
    </div>
  );
};