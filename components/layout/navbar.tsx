"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/layout/container";

type NavItem = {
  label: string;
  href: string;
  id: string;
};

const navItems: NavItem[] = [
  { label: "Problem", href: "#problem", id: "problem" },
  { label: "Lösung", href: "#loesung", id: "loesung" },
  { label: "Features", href: "#features", id: "features" },
  { label: "Use Cases", href: "#use-cases", id: "use-cases" },
  { label: "Status", href: "#status", id: "status" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  const observedIds = useMemo(() => ["hero", ...navItems.map((item) => item.id)], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [observedIds]);

  const baseLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-slate-800 bg-slate-950/95 backdrop-blur"
          : "border-slate-900/60 bg-slate-950/70 backdrop-blur"
      }`}
    >
      <Container>
        <nav aria-label="Hauptnavigation" className="flex h-16 items-center justify-between">
          <a href="#hero" className="text-base font-semibold tracking-tight text-slate-50">
            ResQBrain
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${baseLinkClass} ${
                    isActive
                      ? "bg-red-600/20 text-red-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:block">
            <a
              href="#feedback"
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Feedback geben
            </a>
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 transition-colors duration-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="sr-only">Menü öffnen</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={
                  mobileOpen
                    ? "M6 6L18 18M18 6L6 18"
                    : "M4 7H20M4 12H20M4 17H20"
                }
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>

        {mobileOpen ? (
          <div id="mobile-menu" className="border-t border-slate-800 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`${baseLinkClass} ${
                      isActive
                        ? "bg-red-600/20 text-red-300"
                        : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href="#feedback"
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                onClick={() => setMobileOpen(false)}
              >
                Feedback geben
              </a>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
