import { Heart, Github, Mail, FileText } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-gray-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
              <span className="text-2xl font-black text-white">ResQBrain</span>
            </div>
            <p className="text-lg text-gray-400 font-medium mb-4">
              Plattform für medizinische Algorithmen im Rettungsdienst
            </p>
            <p className="text-base text-gray-500 font-medium">
              Phase 0 - Lookup-first MVP
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-black text-xl mb-6">Rechtliches</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-3 text-lg font-medium">
                  <FileText className="w-5 h-5" strokeWidth={2.5} />
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-3 text-lg font-medium">
                  <FileText className="w-5 h-5" strokeWidth={2.5} />
                  Datenschutz
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-black text-xl mb-6">Kontakt</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/Alox040/ResQBrain" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-3 text-lg font-medium"
                >
                  <Github className="w-5 h-5" strokeWidth={2.5} />
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-3 text-lg font-medium">
                  <Mail className="w-5 h-5" strokeWidth={2.5} />
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-base text-gray-500 font-medium">
              © {currentYear} ResQBrain. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}