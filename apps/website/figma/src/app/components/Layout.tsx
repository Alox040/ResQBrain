import { Outlet, NavLink } from "react-router";
import { Activity, Menu, X, HeartPulse } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Projekt", href: "/projekt" },
    { name: "Wie es funktioniert", href: "/wie-es-funktioniert" },
    { name: "Features", href: "/features" },
    { name: "Mitwirken", href: "/mitwirken" },
    { name: "Community", href: "/community" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center gap-2 text-zinc-50 hover:text-zinc-300 transition-colors">
                <HeartPulse className="h-6 w-6 text-zinc-500" />
                <span className="font-semibold tracking-tight text-lg">ResQBrain</span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${
                          isActive
                            ? "text-zinc-50"
                            : "text-zinc-400 hover:text-zinc-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-100 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Menü öffnen</span>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-zinc-950">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-base font-medium ${
                      isActive
                        ? "bg-zinc-900 text-zinc-50"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <HeartPulse className="h-5 w-5" />
            <span className="text-sm">ResQBrain — Community Project (Alpha)</span>
          </div>
          <div className="flex gap-6 text-sm">
            <NavLink to="/links" className="text-zinc-500 hover:text-zinc-300 transition-colors">Links</NavLink>
            <NavLink to="/kontakt" className="text-zinc-500 hover:text-zinc-300 transition-colors">Kontakt</NavLink>
            <NavLink to="/impressum" className="text-zinc-500 hover:text-zinc-300 transition-colors">Impressum</NavLink>
            <NavLink to="/datenschutz" className="text-zinc-500 hover:text-zinc-300 transition-colors">Datenschutz</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
