import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Container } from './Foundation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/deb7804b15b16e8187653ea879d8f759526d4ac8.png';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Start', href: '/' },
    { name: 'Mitwirkung', href: '/mitwirkung' },
    { name: 'Links', href: '/links' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070d1c]/90 backdrop-blur-md border-b border-[#29C5D9]/10">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#29C5D9]/20 to-transparent" />
      <Container>
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#29C5D9]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ImageWithFallback 
                src={logoImage} 
                alt="ResQBrain Logo" 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(41,197,217,0.3)]"
              />
            </div>
            <span className="text-white/90 font-medium tracking-wide text-lg">ResQBrain</span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm transition-colors duration-300 relative ${
                  location.pathname === link.href ? 'text-white font-medium' : 'text-white/50 hover:text-white'
                }`}
              >
                {link.name}
                {location.pathname === link.href && (
                  <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-[#29C5D9] rounded-t-sm" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Subtle CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link 
              to="/anmeldung"
              className="inline-block px-5 py-2.5 border border-[#29C5D9]/20 text-[#29C5D9]/80 hover:bg-[#29C5D9]/10 hover:text-[#29C5D9] hover:border-[#29C5D9]/40 transition-all duration-300 text-xs tracking-widest uppercase cursor-pointer"
            >
              Updates erhalten
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#29C5D9]/60 hover:text-[#29C5D9] p-2 -mr-2 transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

        </div>
      </Container>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#070d1c] border-b border-[#29C5D9]/10 absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
          <Container>
            <nav className="flex flex-col py-6 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-lg font-light transition-colors ${location.pathname === link.href ? 'text-[#29C5D9]' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                <Link 
                  to="/anmeldung"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-4 border border-[#29C5D9]/20 text-[#29C5D9]/80 hover:bg-[#29C5D9]/10 transition-colors text-sm tracking-widest uppercase cursor-pointer"
                >
                  Updates erhalten
                </Link>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};