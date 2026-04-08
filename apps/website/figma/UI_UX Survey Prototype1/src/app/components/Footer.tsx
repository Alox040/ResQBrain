import React from 'react';
import { Link } from 'react-router';
import { Container } from './Foundation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/deb7804b15b16e8187653ea879d8f759526d4ac8.png';

export const Footer = () => {
  return (
    <footer className="border-t border-[#1E61D9]/10 bg-[#070d1c] pt-16 md:pt-24 pb-8 mt-12 md:mt-24 relative overflow-hidden">
      {/* Subtle logo glow in background */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1E61D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">
          
          {/* Left: Logo & Description */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 flex items-center justify-center">
                <ImageWithFallback 
                  src={logoImage} 
                  alt="ResQBrain Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(30,97,217,0.3)] opacity-80"
                />
              </div>
              <span className="text-white/90 font-medium tracking-wide text-lg">ResQBrain</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Eine kollaborative Initiative zur Schaffung einer klaren, zugänglichen und offline-fähigen Plattform für Standardarbeitsanweisungen (SOPs) im Rettungsdienst.
            </p>
          </div>

          {/* Center: Navigation */}
          <div className="md:col-span-3 lg:col-span-3 lg:col-start-7">
            <h4 className="text-white/80 text-sm font-medium mb-6">Projekt</h4>
            <ul className="space-y-4">
              {[
                { name: 'Start', href: '/' },
                { name: 'Mitwirkung', href: '/mitwirkung' },
                { name: 'Links', href: '/links' },
                { name: 'Kontakt', href: '/kontakt' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-white/50 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Legal */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-white/80 text-sm font-medium mb-6">Rechtliches</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/impressum" className="text-white/50 hover:text-white transition-colors text-sm">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-white/50 hover:text-white transition-colors text-sm">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom: Copyright & Note */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; 2026 ResQBrain Project. Alle Rechte vorbehalten.
          </p>
          <p className="text-white/40 text-xs">
            Ein unabhängiges Forschungs- und Entwicklungsprojekt für die präklinische Notfallmedizin.
          </p>
        </div>
      </Container>
    </footer>
  );
};