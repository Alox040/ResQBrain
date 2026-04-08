import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBadge({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'active' | 'warning' }) {
  const variants = {
    default: "bg-white/5 border-white/10 text-zinc-400",
    active: "bg-[#7f1d1d]/10 border-[#7f1d1d]/30 text-[#991b1b]",
    warning: "bg-amber-900/10 border-amber-900/30 text-amber-600/80"
  };

  return (
    <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 text-xs border rounded-sm tracking-wide", variants[variant], className)}>
      {variant === 'active' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#991b1b] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7f1d1d]"></span>
        </span>
      )}
      {children}
    </div>
  );
}
