"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "accettazione",
    title: "1. Accettazione dei Termini",
    content: (
      <>
        <p>
          I presenti Termini di Servizio (di seguito &quot;Termini&quot;) regolano l&apos;accesso e l&apos;utilizzo della piattaforma Concorsi Premium (di seguito &quot;Piattaforma&quot;) da parte degli utenti. Leggili attentamente prima di procedere con la registrazione o con qualsiasi utilizzo della Piattaforma.
        </p>
        <p>
          Accedendo alla Piattaforma o utilizzando i nostri servizi, dichiari di aver letto, compreso e accettato integralmente i presenti Termini. Se non accetti i Termini, non sei autorizzato ad accedere o utilizzare la Piattaforma.
        </p>
        <p>
          I presenti Termini si applicano congiuntamente alla nostra Privacy Policy e alla Cookie Policy, che costituiscono parte integrante del rapporto contrattuale tra l&apos;utente e il Gestore.
        </p>
      </>
    ),
  },
  {
    id: "servizio",
    title: "2. Descrizione del Servizio",
    content: (
      <>
        <p>
          Concorsi Premium è una piattaforma digitale che consente agli utenti registrati di partecipare a concorsi a premi mediante l&apos;acquisto di ticket numerati. Il servizio include:
        </p>
        <ul>
          <li>La messa a disposizione di un catalogo di concorsi a premi attivi.</li>
          <li>Un sistema di acquisto sicuro dei ticket tramite provider di pagamento certificati.</li>
          <li>Un sistema di estrazione live, trasparente e verificabile in tempo reale.</li>
          <li>La gestione della comunicazione e della consegna del premio al vincitore.</li>
          <li>Un&apos;area personale per il monitoraggio dei ticket acquistati e delle partecipazioni.</li>
        </ul>
        <p>
          Il Gestore si riserva il diritto di modificare, aggiornare o interrompere qualsiasi aspetto del servizio in qualsiasi momento, con ragionevole preavviso agli utenti.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "3. Account Utente",
    content: (
      <>
        <p>
          Per accedere al servizio è necessario creare un account fornendo informazioni accurate e complete. L&apos;utente è responsabile di:
        </p>
        <ul>
          <li>Mantenere la riservatezza delle proprie credenziali di accesso.</li>
          <li>Aggiornare prontamente le informazioni del profilo in caso di variazioni.</li>
          <li>Notificare immediatamente il Gestore in caso di accesso non autorizzato al proprio account.</li>
          <li>Tutte le attività svolte tramite il proprio account, autorizzate o meno.</li>
        </ul>
        <p>
          È vietato cedere, vendere o trasferire il proprio account a terzi. Ogni account è strettamente personale. Il Gestore può sospendere o chiudere un account in caso di violazione dei presenti Termini, attività sospetta o frode accertata.
        </p>
      </>
    ),
  },
  {
    id: "pagamenti",
    title: "4. Pagamenti e Fatturazione",
    content: (
      <>
        <p>
          Tutti i pagamenti effettuati sulla Piattaforma sono elaborati da Stripe, Inc., provider di servizi di pagamento certificato PCI DSS Level 1. Il Gestore non conserva né ha accesso diretto ai dati della carta di credito o debito degli utenti.
        </p>
        <p>
          I prezzi dei ticket sono indicati in euro e comprensivi di IVA. Il Gestore si riserva il diritto di modificare i prezzi in qualsiasi momento; le modifiche non avranno effetto retroattivo sui ticket già acquistati.
        </p>
        <p>
          Completato l&apos;acquisto, verrà emessa regolare ricevuta elettronica all&apos;indirizzo email dell&apos;utente. Su richiesta, è possibile richiedere una fattura intestata completa di dati fiscali.
        </p>
        <p>
          I ticket non sono rimborsabili salvo nei casi previsti dal Regolamento dei Concorsi (cancellazione del concorso per causa del Gestore).
        </p>
      </>
    ),
  },
  {
    id: "condotta",
    title: "5. Condotta dell'Utente",
    content: (
      <>
        <p>Utilizzando la Piattaforma, l&apos;utente si impegna a:</p>
        <ul>
          <li>Non tentare di manipolare o alterare il sistema di estrazione in alcun modo.</li>
          <li>Non creare account multipli per aggiungere probabilità di vincita oltre i limiti previsti.</li>
          <li>Non utilizzare bot, script automatici o altri mezzi automatici per interagire con la Piattaforma.</li>
          <li>Non pubblicare contenuti diffamatori, offensivi o illeciti nelle comunicazioni con il supporto.</li>
          <li>Non tentare di accedere a porzioni della Piattaforma per cui non si è autorizzati.</li>
          <li>Non condurre attività di scraping, reverse engineering o decompilazione della Piattaforma.</li>
        </ul>
        <p>
          La violazione di queste regole comporta la sospensione immediata dell&apos;account e, nei casi più gravi, l&apos;adozione di azioni legali.
        </p>
      </>
    ),
  },
  {
    id: "proprieta-intellettuale",
    title: "6. Proprietà Intellettuale",
    content: (
      <>
        <p>
          Tutto il contenuto della Piattaforma, inclusi testi, grafica, loghi, icone, immagini, software e codice sorgente, è di proprietà del Gestore o dei suoi licenzianti ed è protetto dalle leggi sul diritto d&apos;autore e sulla proprietà intellettuale.
        </p>
        <p>
          L&apos;utente riceve una licenza limitata, non esclusiva e non trasferibile per accedere e utilizzare la Piattaforma ai fini previsti dai presenti Termini. Non è consentito riprodurre, distribuire, modificare o creare opere derivate dal contenuto della Piattaforma senza autorizzazione scritta del Gestore.
        </p>
      </>
    ),
  },
  {
    id: "responsabilita",
    title: "7. Limitazione di Responsabilità",
    content: (
      <>
        <p>
          La Piattaforma è fornita &quot;così com&apos;è&quot; e &quot;come disponibile&quot;. Il Gestore non garantisce che il servizio sarà ininterrotto, privo di errori o adatto a scopi specifici. Nella misura massima consentita dalla legge:
        </p>
        <ul>
          <li>Il Gestore non è responsabile per danni indiretti, incidentali, consequenziali o punitivi.</li>
          <li>La responsabilità complessiva del Gestore è limitata all&apos;importo pagato dall&apos;utente negli ultimi 12 mesi.</li>
          <li>Il Gestore non risponde per interruzioni di servizio causate da terzi o da forza maggiore.</li>
        </ul>
        <p>
          Alcune giurisdizioni non consentono l&apos;esclusione di determinate garanzie o limitazioni di responsabilità; in tali casi, la responsabilità del Gestore sarà limitata nella misura massima consentita dalla legge applicabile.
        </p>
      </>
    ),
  },
  {
    id: "legge-applicabile",
    title: "8. Legge Applicabile e Foro Competente",
    content: (
      <>
        <p>
          I presenti Termini sono regolati dalla legge italiana. Qualsiasi controversia derivante dall&apos;utilizzo della Piattaforma o in relazione ai presenti Termini sarà sottoposta alla giurisdizione esclusiva dei tribunali italiani.
        </p>
        <p>
          Prima di ricorrere alle vie legali, le parti si impegnano a tentare una risoluzione amichevole della controversia entro 30 giorni dalla notifica scritta del problema.
        </p>
        <p>
          Per i consumatori residenti nell&apos;Unione Europea, si applicano i diritti inderogabili previsti dalla legge del paese di residenza, inclusa la possibilità di ricorrere alla Piattaforma ODR (Online Dispute Resolution) della Commissione Europea disponibile all&apos;indirizzo ec.europa.eu/consumers/odr.
        </p>
        <p className="text-white/30 text-sm">Ultima revisione: Marzo 2025</p>
      </>
    ),
  },
];

export default function TerminiPage() {
  const [activeSection, setActiveSection] = useState<string>("accettazione");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/50 font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documento legale
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">Termini di Servizio</h1>
            <p className="text-white/50 font-[family-name:var(--font-inter)] max-w-2xl">
              I termini e le condizioni che regolano l&apos;accesso e l&apos;utilizzo della piattaforma
              Concorsi Premium. Leggi attentamente prima di registrarti.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <aside className="lg:col-span-1">
              <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-5 sticky top-28"
                aria-label="Indice termini di servizio"
              >
                <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Indice</h2>
                <ul className="space-y-1">
                  {sections.map(({ id, title }) => (
                    <li key={id}>
                      <button
                        onClick={() => scrollTo(id)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 font-[family-name:var(--font-inter)] ${
                          activeSection === id
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                        }`}
                      >
                        {title}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            </aside>

            <div className="lg:col-span-3 space-y-8">
              {sections.map(({ id, title, content }, i) => (
                <motion.article
                  key={id}
                  id={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="glass p-8 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-amber-400 mb-6">{title}</h2>
                  <div className="text-white/60 font-[family-name:var(--font-inter)] leading-relaxed space-y-4 [&_p]:text-white/60 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-white/60 [&_strong]:text-white/80 [&_strong]:font-semibold">
                    {content}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
