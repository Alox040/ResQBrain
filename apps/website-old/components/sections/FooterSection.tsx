import type { SVGProps } from "react";

import { FileText, Heart, Mail } from "lucide-react";

import { Container } from "../layout/Container";
import { getFooterViewModel } from "../../lib/site-selectors";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function FooterSection() {
  const footer = getFooterViewModel();

  return (
    <footer className="border-t-4 border-gray-800 bg-gray-900 text-gray-300">
      <Container>
        <div className="py-12">
          <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
                <span className="text-2xl font-black text-white">{footer.brandName}</span>
              </div>
              <p className="mb-4 text-lg font-medium text-gray-400">{footer.tagline}</p>
              <p className="text-base font-medium text-gray-500">{footer.stageLabel}</p>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-black text-white">Rechtliches</h3>
              <ul className="space-y-3">
                {footer.legalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-white">
                      <FileText className="h-5 w-5" strokeWidth={2.5} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-black text-white">Kontakt</h3>
              <ul className="space-y-3">
                {footer.contactActions.map((action) => {
                  const isExternal = action.href.startsWith("http");
                  const Icon = action.label === "GitHub" ? GithubIcon : Mail;

                  return (
                    <li key={action.href}>
                      <a
                        href={action.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-white"
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                        {action.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-800 pt-8 text-center">
            <p className="text-base font-medium text-gray-500">{footer.copyright}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
