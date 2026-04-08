import React from 'react';
import { Link } from 'react-router';
import { 
  ClipboardEdit, 
  Globe, 
  MessageSquare, 
  Github, 
  BookOpen, 
  Mail, 
  Video, 
  FileText 
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImage from 'figma:asset/deb7804b15b16e8187653ea879d8f759526d4ac8.png';

const LinkButton = ({ 
  href, 
  icon: Icon, 
  title, 
  subtitle, 
  variant = 'primary',
  external = true
}: { 
  href: string; 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string; 
  variant?: 'primary' | 'secondary';
  external?: boolean;
}) => {
  const isPrimary = variant === 'primary';
  const baseClasses = "flex items-center w-full group transition-all duration-300 text-left border rounded-none cursor-pointer relative overflow-hidden"; 
  
  const variants = {
    primary: "p-5 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#29C5D9]/30 text-white/90",
    secondary: "p-4 border-white/5 bg-transparent hover:bg-white/[0.02] hover:border-[#1E61D9]/20 text-white/70",
  };

  const content = (
    <>
      {isPrimary && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1E61D9] to-[#29C5D9] opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <Icon 
        className={`mr-4 shrink-0 transition-colors ${
          isPrimary ? 'text-[#1E61D9] group-hover:text-[#29C5D9]' : 'text-white/40 group-hover:text-white/70'
        }`} 
        size={isPrimary ? 24 : 20} 
        strokeWidth={1.5} 
      />
      <div className="flex-grow">
        <span className={`block font-light tracking-wide ${isPrimary ? 'text-lg' : 'text-base'}`}>
          {title}
        </span>
        {subtitle && (
          <span className="block text-sm text-white/40 mt-1 font-light leading-snug">
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-white/20 group-hover:translate-x-1 group-hover:text-[#29C5D9] transition-all shrink-0 ml-4">
        →
      </div>
    </>
  );

  const wrapperClass = `${baseClasses} ${variants[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={wrapperClass}>
      {content}
    </Link>
  );
};

export const Links = () => {
  return (
    <div className="min-h-screen bg-[#070d1c] text-white/80 font-sans selection:bg-[#29C5D9]/30 flex flex-col items-center py-12 md:py-24 px-6 relative overflow-hidden">
      
      {/* Background Watermarks */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-[#1E61D9]/[0.01] to-[#29C5D9]/[0.01] blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-[420px] flex flex-col items-center animate-in fade-in duration-500 slide-in-from-bottom-4 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative w-24 h-24 mb-6 group">
            <div className="absolute inset-0 bg-[#29C5D9]/10 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <ImageWithFallback 
              src={logoImage} 
              alt="ResQBrain Logo" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(41,197,217,0.2)]"
            />
          </div>
          <h1 className="text-2xl font-medium tracking-wider text-white mb-3">ResQBrain</h1>
          <p className="text-base text-white/50 leading-relaxed font-light px-4">
            Eine kollaborative Plattform für offline-fähige SOPs im Rettungsdienst.
          </p>
        </div>

        <hr className="w-12 border-t border-white/10 mb-10" />

        {/* Primary Links */}
        <div className="w-full space-y-4 mb-10">
          <LinkButton 
            href="/mitwirkung" 
            icon={ClipboardEdit} 
            title="Aktuelle Umfrage" 
            subtitle="Hilf uns, den klinischen Workflow zu verstehen"
            external={false}
          />
          <LinkButton 
            href="/" 
            icon={Globe} 
            title="Projekt Website" 
            subtitle="Übersicht und Architektur des Systems"
            external={false}
          />
          <LinkButton 
            href="#" 
            icon={MessageSquare} 
            title="Discord Community" 
            subtitle="Technischer Austausch und Feedback"
          />
        </div>

        {/* Secondary Links */}
        <div className="w-full space-y-3 mb-16">
          <LinkButton 
            href="#" 
            icon={Github} 
            title="GitHub Projekt" 
            variant="secondary"
          />
          <LinkButton 
            href="#" 
            icon={BookOpen} 
            title="Projektbeschreibung" 
            variant="secondary"
          />
          <LinkButton 
            href="/kontakt" 
            icon={Mail} 
            title="Kontakt" 
            variant="secondary"
            external={false}
          />
        </div>

        {/* Optional Community Section */}
        <div className="w-full pt-10 border-t border-white/5 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/30 block mb-6">
            Community
          </span>
          <div className="flex justify-center gap-2 flex-wrap">
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 text-sm font-light tracking-wide text-white/40 hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
              <Video size={16} strokeWidth={1.5} /> TikTok
            </a>
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 text-sm font-light tracking-wide text-white/40 hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
              <FileText size={16} strokeWidth={1.5} /> Reddit
            </a>
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 text-sm font-light tracking-wide text-white/40 hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
              <MessageSquare size={16} strokeWidth={1.5} /> Discord
            </a>
          </div>
        </div>

        {/* Subtle Footer */}
        <div className="mt-16 mb-8 text-center text-xs font-light tracking-wide text-white/20 uppercase">
          Non-commercial open initiative
        </div>

      </div>
    </div>
  );
};