import { Outlet, NavLink } from "react-router";
import { Home, Search, Menu, Zap, LayoutGrid, Activity } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

export function MobileLayout() {
  const [isEKGPinned, setIsEKGPinned] = useState(false);

  useEffect(() => {
    // Initial check
    setIsEKGPinned(localStorage.getItem('pinEKGToNav') === 'true');

    // Listen for changes
    const handleNavChange = () => {
      setIsEKGPinned(localStorage.getItem('pinEKGToNav') === 'true');
    };
    
    window.addEventListener('navStateChanged', handleNavChange);
    return () => window.removeEventListener('navStateChanged', handleNavChange);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-0 md:p-6">
      {/* Phone container */}
      <div className="w-full h-[100dvh] md:w-[400px] md:h-[850px] bg-[#121212] md:rounded-[3rem] overflow-hidden md:border-[12px] border-[#1e1e1e] shadow-2xl relative flex flex-col font-sans text-neutral-100 selection:bg-red-900/50">
        
        {/* Status Bar (Fake) - Only visible on desktop mockup */}
        <div className="hidden md:flex h-12 w-full justify-between items-center px-6 text-sm font-semibold text-neutral-400 select-none z-50">
          <span>09:41</span>
          <div className="flex gap-2">
            <div className="flex gap-1 items-end h-4">
              <div className="w-1 h-2 bg-neutral-400 rounded-sm"></div>
              <div className="w-1 h-2.5 bg-neutral-400 rounded-sm"></div>
              <div className="w-1 h-3 bg-neutral-400 rounded-sm"></div>
              <div className="w-1 h-4 bg-neutral-400 rounded-sm"></div>
            </div>
            <div className="w-6 h-3 rounded-sm border border-neutral-400 flex items-center p-[1px]">
              <div className="h-full bg-neutral-400 w-full rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-[#0a0a0a]">
          <Outlet />
          {/* Spacer for bottom nav */}
          <div className="h-24" />
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#121212]/95 backdrop-blur-md border-t border-[#2a2a2a] flex justify-around items-center px-2 pb-4 pt-2 z-50 rounded-b-[2.5rem]">
          <NavItem to="/dashboard" icon={<LayoutGrid className="w-6 h-6" />} label="Dashboard" />
          <NavItem to="/einsatz" icon={<Zap className="w-6 h-6" />} label="Einsatz" />
          <NavItem to="/" icon={<Home className="w-[26px] h-[26px]" />} label="Start" isCenter />
          {isEKGPinned ? (
            <NavItem to="/ekg-spicker" icon={<Activity className="w-6 h-6" />} label="EKG" />
          ) : (
            <NavItem to="/search" icon={<Search className="w-6 h-6" />} label="Search" />
          )}
          <NavItem to="/more" icon={<Menu className="w-6 h-6" />} label="More" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, isCenter }: { to: string; icon: React.ReactNode; label: string; isCenter?: boolean }) {
  return (
    <NavLink
      to={to}
      className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
    >
      {({ isActive }) => (
        <>
          {isCenter ? (
            <div className={cn(
              "absolute -top-7 w-14 h-14 rounded-full flex items-center justify-center border-[4px] border-[#121212] shadow-xl transition-all duration-300 z-10",
              isActive ? "bg-red-600 text-white shadow-red-600/20" : "bg-[#1a1a1a] text-neutral-400"
            )}>
              {icon}
            </div>
          ) : (
            <div className={cn("transition-colors", isActive ? "text-red-500" : "text-neutral-500")}>
              {icon}
            </div>
          )}
          <span className={cn(
            "text-[10px] font-medium transition-colors",
            isCenter && "mt-[28px]",
            !isCenter && isActive && "text-red-500",
            !isCenter && !isActive && "text-neutral-500",
            isCenter && isActive && "text-white",
            isCenter && !isActive && "text-neutral-500"
          )}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
