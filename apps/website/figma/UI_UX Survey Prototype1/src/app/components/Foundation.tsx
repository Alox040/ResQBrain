import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router'; // for link cards if internal

// --- 1. TYPOGRAPHY TOKENS ---
export const typography = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white",
  h2: "text-2xl md:text-3xl font-light tracking-wide text-white/90",
  h3: "text-lg md:text-xl font-medium text-[#29C5D9]",
  body: "text-base md:text-lg text-white/70 leading-relaxed",
  small: "text-sm text-white/50 leading-relaxed",
  label: "text-xs font-semibold tracking-widest uppercase text-[#1E61D9]",
};

export const H1 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h1 className={`${typography.h1} mb-8 ${className}`}>{children}</h1>
);

export const H2 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`${typography.h2} mb-6 ${className}`}>{children}</h2>
);

export const H3 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`${typography.h3} mb-3 ${className}`}>{children}</h3>
);

export const BodyText = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`${typography.body} mb-6 max-w-[75ch] ${className}`}>{children}</p>
);

export const SmallText = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`${typography.small} ${className}`}>{children}</p>
);

export const LabelText = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <span className={`${typography.label} block mb-2 ${className}`}>{children}</span>
);


// --- 2. LAYOUT & CONTAINERS ---

export const Container = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`max-w-[1100px] mx-auto px-[20px] md:px-[32px] w-full ${className}`}>
    {children}
  </div>
);

type SpacingVariant = 'sm' | 'md' | 'lg';

export const Section = ({ 
  children, 
  className = '', 
  spacing = 'md' 
}: { 
  children: React.ReactNode, 
  className?: string, 
  spacing?: SpacingVariant 
}) => {
  const spacingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32 lg:py-40'
  };
  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
};

export const Grid = ({ 
  children, 
  className = '', 
  spacing = 'md',
  cols = 3
}: { 
  children: React.ReactNode, 
  className?: string, 
  spacing?: SpacingVariant,
  cols?: 2 | 3 | 4
}) => {
  const gapClasses = {
    sm: 'gap-4 md:gap-6',
    md: 'gap-6 md:gap-8',
    lg: 'gap-8 md:gap-12'
  };
  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};


// --- 3. UI COMPONENTS ---

export const Divider = ({ 
  spacing = 'md',
  className = ''
}: { 
  spacing?: SpacingVariant,
  className?: string
}) => {
  const spacingClasses = {
    sm: 'my-8',
    md: 'my-16',
    lg: 'my-24'
  };
  return <hr className={`border-t border-white/5 ${spacingClasses[spacing]} ${className}`} />;
};

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-8 border border-white/5 bg-white/[0.02] rounded-none hover:bg-white/[0.03] transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

export const TextBlock = ({ 
  label, 
  title, 
  body, 
  className = '' 
}: { 
  label?: string, 
  title: string, 
  body: string | React.ReactNode,
  className?: string 
}) => (
  <div className={`max-w-2xl ${className}`}>
    {label && <LabelText>{label}</LabelText>}
    <H2>{title}</H2>
    {typeof body === 'string' ? <BodyText>{body}</BodyText> : body}
  </div>
);

// Backward compatibility name for existing pages
export const CalmCTA = ({ 
  title, 
  description, 
  buttonText, 
  onClick,
  href
}: { 
  title: string, 
  description: string, 
  buttonText: string, 
  onClick?: () => void,
  href?: string
}) => (
  <div className="border-l border-[#29C5D9]/50 pl-6 md:pl-10 py-2 my-12 relative">
    <div className="absolute -left-[1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#29C5D9] to-[#1E61D9] opacity-80" />
    <H3 className="!mb-2 text-[#29C5D9]">{title}</H3>
    <BodyText className="!mb-8">{description}</BodyText>
    {href ? (
      <a 
        href={href}
        className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-white/80 hover:text-[#29C5D9] transition-colors cursor-pointer"
      >
        {buttonText}
        <ArrowRight size={16} className="text-[#1E61D9] group-hover:text-[#29C5D9] group-hover:translate-x-1 transition-all" />
      </a>
    ) : (
      <button 
        onClick={onClick} 
        className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-white/80 hover:text-[#29C5D9] transition-colors cursor-pointer"
      >
        {buttonText}
        <ArrowRight size={16} className="text-[#1E61D9] group-hover:text-[#29C5D9] group-hover:translate-x-1 transition-all" />
      </button>
    )}
  </div>
);

// Generic CTABlock (alias for above, but part of standard library)
export const CTABlock = CalmCTA;

export const Button = ({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  icon: Icon
}: {
  children: React.ReactNode,
  onClick?: () => void,
  href?: string,
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  className?: string,
  icon?: React.ElementType
}) => {
  const baseClasses = "inline-flex items-center gap-3 text-sm tracking-wide uppercase transition-colors duration-300 cursor-pointer group relative overflow-hidden";
  
  const variants = {
    primary: "px-6 py-3 border border-[#29C5D9]/30 bg-[#29C5D9]/5 text-[#29C5D9] hover:bg-[#29C5D9]/10 hover:border-[#29C5D9]/60",
    secondary: "px-6 py-3 border border-[#1E61D9]/30 bg-[#1E61D9]/5 text-[#1E61D9] hover:bg-[#1E61D9]/10 hover:border-[#1E61D9]/60",
    outline: "px-6 py-3 border border-white/10 text-white/70 hover:bg-white/5 hover:text-[#29C5D9] hover:border-[#29C5D9]/30",
    ghost: "text-white/50 hover:text-[#29C5D9] tracking-widest"
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {Icon && <Icon size={16} className="group-hover:translate-x-1 transition-transform" />}
      </span>
    </>
  );

  if (href) {
    // If it's an internal link
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={`${baseClasses} ${variants[variant]} ${className}`}>
          {content}
        </Link>
      );
    }
    // External link
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {content}
    </button>
  );
};

export const LinkCard = ({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  colorClass = "text-[#29C5D9]",
  isExternal = true
}: { 
  href: string, 
  icon: React.ElementType, 
  title: string, 
  description: string, 
  colorClass?: string,
  isExternal?: boolean
}) => {
  const CardContent = () => (
    <Card className="h-full flex flex-col relative overflow-hidden transition-all duration-300 border-white/5 group-hover:border-[#29C5D9]/30 group-hover:bg-white/[0.04]">
      {isExternal && (
        <div className="absolute top-6 right-6 text-white/10 group-hover:text-[#29C5D9]/40 transition-colors">
          <ExternalLink size={18} strokeWidth={1.5} />
        </div>
      )}
      <Icon className={`mb-6 ${colorClass} opacity-80 group-hover:opacity-100 transition-opacity group-hover:text-[#29C5D9]`} size={28} strokeWidth={1.5} />
      <H3 className="!mb-2 group-hover:text-white transition-colors">{title}</H3>
      <BodyText className="!mb-0 !text-sm flex-grow">{description}</BodyText>
    </Card>
  );

  if (isExternal || !href.startsWith('/')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block group h-full">
        <CardContent />
      </a>
    );
  }

  return (
    <Link to={href} className="block group h-full">
      <CardContent />
    </Link>
  );
};