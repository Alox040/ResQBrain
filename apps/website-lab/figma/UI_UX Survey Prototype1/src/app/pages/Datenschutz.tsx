import React from 'react';
import { Link } from 'react-router';
import { Container, Section, H1, H2, BodyText, Divider } from '../components/Foundation';

export const Datenschutz = () => {
  return (
    <Section spacing="lg" className="animate-in fade-in duration-500">
      <Container>
        <div className="max-w-[760px] mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center text-sm font-light tracking-wide text-white/40 hover:text-white transition-colors mb-8">
              <span className="mr-2">←</span> Zurück zur Startseite
            </Link>
            <H1 className="!text-3xl md:!text-4xl !font-light !tracking-wide">Datenschutzerklärung</H1>
            <BodyText className="!text-lg text-white/60">
              Informationen über die Verarbeitung personenbezogener Daten im Rahmen des ResQBrain-Projekts.
            </BodyText>
          </div>

          <Divider spacing="sm" className="!border-white/10" />

          {/* Sections */}
          <div className="space-y-12 mt-12">
            
            <section>
              <H2 className="!text-xl !font-normal !mb-3">Einleitung</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg mb-4">
                Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres reinen Informationsangebotes auf. Das Projekt ResQBrain ist eine nicht-kommerzielle Initiative für den Rettungsdienst, bei der Datensparsamkeit höchste Priorität hat.
              </p>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Wir setzen keine werblichen Tracking-Cookies, Analysedienste oder Social-Media-Plugins ein, die Ihr Surfverhalten profilieren.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Verantwortlicher</H2>
              <div className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                <p>Max Mustermann</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Deutschland</p>
                <p className="mt-2">E-Mail: <a href="mailto:contact@resqbrain.org" className="text-[#29C5D9] hover:text-white transition-colors">contact@resqbrain.org</a></p>
              </div>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Erhebung von Daten</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Bei der bloß informatorischen Nutzung der Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen übermitteln, erheben wir nur die personenbezogenen Daten, die Ihr Browser an unseren Server übermittelt (sogenannte Server-Logfiles). Dies ist technisch erforderlich, um Ihnen unsere Website anzuzeigen und die Stabilität und Sicherheit zu gewährleisten (Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO). Zu diesen Daten gehören u. a. IP-Adresse, Datum und Uhrzeit der Anfrage, abgerufene Datei, Datenmenge und Browsertyp.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Nutzung der Website</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Unsere Webseite dient ausschließlich der Informationsbereitstellung über das Architekturkonzept von ResQBrain. Es werden keine Benutzerprofile angelegt, keine Newsletter automatisch verschickt und keine personenbezogenen Daten an Marketingnetzwerke weitergeleitet.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Externe Links</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Soweit wir auf unserer Website auf Websites Dritter verweisen oder verlinken, können wir keine Gewähr und Haftung für die Richtigkeit bzw. Vollständigkeit der Inhalte und die Datensicherheit dieser Websites übernehmen. Da wir keinen Einfluss auf die Einhaltung datenschutzrechtlicher Bestimmungen durch Dritte haben, sollten Sie die jeweils angebotenen Datenschutzerklärungen (z. B. bei GitHub, Discord, Reddit) gesondert prüfen.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Umfrage / Forms Hinweis</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Wenn Sie an unseren anonymen klinischen Umfragen (z.B. über verlinkte externe Formular-Anbieter) teilnehmen, werden die dort von Ihnen eingegebenen Daten ausschließlich zur Auswertung der SOP-Prozesse und Verbesserung der Projektarchitektur genutzt. Wir erfragen keine patientenbezogenen Daten, Institutionsnamen oder Ihre persönlichen Kontaktdaten im Rahmen der allgemeinen Umfrage. Falls wir externe Tools für diese Formulare nutzen, weisen wir dort separat auf deren Datenschutzrichtlinien hin.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Hosting Hinweis</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Wir bedienen uns zum Vorhalten unserer Onlinepräsenz der Dienste externer Hosting-Anbieter, auf deren Servern (oder Servern von ihnen beauftragter Dritter) die Website gespeichert ist und von denen sie abgerufen wird. Hierbei können Bestands-, Kontakt-, Inhalts-, Vertrags-, Nutzungsdaten, Meta- und Kommunikationsdaten verarbeitet werden, was im Rahmen unseres berechtigten Interesses an einer effizienten und sicheren Zurverfügungstellung unseres Onlineangebotes (Art. 6 Abs. 1 lit. f DSGVO) erfolgt.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Kontaktaufnahme</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Bei der Kontaktaufnahme mit uns (z. B. per E-Mail) werden die Angaben des Nutzers zur Bearbeitung der Kontaktanfrage und deren Abwicklung gem. Art. 6 Abs. 1 lit. b. (im Rahmen vertraglicher/vorvertraglicher Beziehungen), Art. 6 Abs. 1 lit. f. (andere Anfragen) DSGVO verarbeitet. Wir löschen die Anfragen, sofern diese nicht mehr erforderlich sind. Ferner gelten die gesetzlichen Archivierungspflichten.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Rechte der Nutzer</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg mb-4">
                Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.
              </p>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg mb-4">
                Sie haben ferner das Recht, entsprechend den gesetzlichen Vorgaben, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.
              </p>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Ebenso haben Sie das Recht auf Löschung, Einschränkung der Verarbeitung, Widerspruch gegen die künftige Verarbeitung sowie auf Datenübertragbarkeit. Ferner haben Sie das Recht, eine Beschwerde bei der zuständigen Aufsichtsbehörde einzureichen.
              </p>
            </section>

            <section>
              <H2 className="!text-xl !font-normal !mb-3">Änderungen</H2>
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unseres Konzepts in der Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer Funktionen in einer späteren Projektphase. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </Section>
  );
};