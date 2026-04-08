import React from 'react';
import { Link } from 'react-router';
import { Container, Section, H1, H2, BodyText, Divider } from '../components/Foundation';

export const Impressum = () => {
  return (
    <Section spacing="lg" className="animate-in fade-in duration-500">
      <Container>
        <div className="max-w-[760px] mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center text-sm font-light tracking-wide text-white/40 hover:text-white transition-colors mb-8">
              <span className="mr-2">←</span> Zurück zur Startseite
            </Link>
            <H1 className="!text-3xl md:!text-4xl !font-light !tracking-wide">Impressum</H1>
            <BodyText className="!text-lg text-white/60">
              Angaben gemäß § 5 TMG für das Informationsangebot des ResQBrain-Projekts.
            </BodyText>
          </div>

          <Divider spacing="sm" className="!border-white/10" />

          {/* Sections */}
          <div className="space-y-12 mt-12">
            
            <section>
              <H2 className="!text-xl !font-normal !mb-3">Projektname</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                ResQBrain – Kollaborative Plattform für präklinische SOPs
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Verantwortlich</H2>
              <div className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                <p>Max Mustermann (Projektleitung)</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Deutschland</p>
              </div>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Kontakt</H2>
              <div className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                <p>E-Mail: <a href="mailto:contact@resqbrain.org" className="text-[#29C5D9] hover:text-white transition-colors">contact@resqbrain.org</a></p>
                <p>Webseite: resqbrain.org</p>
              </div>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Hinweis Projektstatus</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                ResQBrain ist ein nicht-kommerzielles Open-Source-Forschungsprojekt. Es handelt sich um eine Informations- und Entwicklungsplattform ohne gewerbliche Absichten. Alle bereitgestellten Inhalte dienen ausschließlich dem fachlichen Austausch und der technologischen Konzeptionierung für den Rettungsdienst.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Haftung für Inhalte</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg mb-4">
                <strong>Wichtiger medizinischer Hinweis:</strong> Die auf dieser Website dargestellten medizinischen Abläufe, Dosierungen und Algorithmen sind Konzeptbeispiele. Sie stellen <em>keine</em> medizinischen Handlungsempfehlungen dar und ersetzen unter keinen Umständen das klinische Urteilsvermögen des Anwenders. Für die reale Patientenversorgung sind ausschließlich die lokal freigegebenen und rechtlich bindenden Richtlinien des zuständigen Ärztlichen Leiters Rettungsdienst (ÄLRD) maßgeblich.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Haftung für Links</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Urheberrecht</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Software-Quellcode dieses Projekts wird unter einer separaten Open-Source-Lizenz auf GitHub bereitgestellt.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </Section>
  );
};