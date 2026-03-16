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
    id: "definizioni",
    title: "1. Definizioni",
    content: (
      <>
        <p>
          Ai fini del presente Regolamento, si intende per:
        </p>
        <ul>
          <li><strong>Piattaforma:</strong> il sito web e l&apos;applicazione Concorsi Premium, accessibili all&apos;indirizzo concorsipremium.it.</li>
          <li><strong>Concorso:</strong> ogni singola manifestazione a premio organizzata e gestita tramite la Piattaforma.</li>
          <li><strong>Ticket:</strong> il documento elettronico numerato che attribuisce al possessore il diritto di partecipare all&apos;estrazione relativa a un specifico Concorso.</li>
          <li><strong>Partecipante:</strong> qualsiasi persona fisica che abbia acquistato almeno un Ticket per un determinato Concorso.</li>
          <li><strong>Vincitore:</strong> il Partecipante il cui numero di Ticket risulta estratto al termine della procedura di estrazione.</li>
          <li><strong>Gestore:</strong> la società che gestisce la Piattaforma, responsabile dell&apos;organizzazione e dello svolgimento dei Concorsi.</li>
          <li><strong>Premio:</strong> il bene o servizio messo in palio dal Gestore per ciascun Concorso.</li>
        </ul>
      </>
    ),
  },
  {
    id: "partecipazione",
    title: "2. Requisiti di Partecipazione",
    content: (
      <>
        <p>
          La partecipazione ai Concorsi è consentita a persone fisiche che soddisfino tutti i seguenti requisiti:
        </p>
        <ul>
          <li>Aver compiuto il diciottesimo anno di età al momento dell&apos;acquisto del Ticket.</li>
          <li>Essere residenti o domiciliati nel territorio italiano.</li>
          <li>Essere in possesso di un account registrato sulla Piattaforma con dati veritieri e aggiornati.</li>
          <li>Non rientrare tra il personale del Gestore, i suoi collaboratori, o i loro familiari di primo grado.</li>
        </ul>
        <p>
          Il Gestore si riserva il diritto di richiedere la verifica dell&apos;identità del Partecipante in qualsiasi momento. In caso di dati falsi o incompleti, il Gestore potrà annullare i Ticket acquistati senza diritto al rimborso.
        </p>
      </>
    ),
  },
  {
    id: "acquisto-ticket",
    title: "3. Acquisto dei Ticket",
    content: (
      <>
        <p>
          I Ticket possono essere acquistati esclusivamente tramite la Piattaforma, attraverso i metodi di pagamento messi a disposizione (carte di credito/debito, Apple Pay, Google Pay). I prezzi dei Ticket sono indicati in euro e comprensivi di IVA.
        </p>
        <p>
          Ogni Partecipante può acquistare un numero massimo di Ticket per Concorso come indicato nella pagina specifica del Concorso medesimo. Il limite è stabilito per garantire equità e pari opportunità tra tutti i Partecipanti.
        </p>
        <p>
          L&apos;acquisto è definitivo e non rimborsabile, salvo nei casi espressamente previsti dal presente Regolamento (art. 7). Al completamento dell&apos;acquisto, il Partecipante riceverà via email la conferma con i numeri assegnati al suo account.
        </p>
        <p>
          I numeri di Ticket sono assegnati in modo casuale dal sistema al momento dell&apos;acquisto. Il Partecipante non può scegliere i numeri specifici.
        </p>
      </>
    ),
  },
  {
    id: "estrazione",
    title: "4. Procedura di Estrazione",
    content: (
      <>
        <p>
          Le estrazioni avvengono in diretta sulla Piattaforma alla data e all&apos;ora specificate per ciascun Concorso. Il processo di estrazione è automatizzato e si basa su un algoritmo crittograficamente sicuro (CSPRNG — Cryptographically Secure Pseudo-Random Number Generator).
        </p>
        <p>
          L&apos;estrazione si svolge in tre fasi progressive:
        </p>
        <ol>
          <li><strong>Fase Rapida:</strong> eliminazione in blocchi dei Ticket fino a raggiungere gli ultimi 200.</li>
          <li><strong>Fase Lenta:</strong> eliminazione individuale con cadenza crescente degli intervalli.</li>
          <li><strong>Fase Finale (Showdown):</strong> gli ultimi 3 Ticket vengono mostrati simultaneamente prima della rivelazione del Vincitore.</li>
        </ol>
        <p>
          Il Ticket che rimane l&apos;ultimo in gioco vince il Premio. L&apos;estrazione è registrata integralmente e il video è reso disponibile sulla Piattaforma per 90 giorni successivi all&apos;evento.
        </p>
        <p>
          Il seed di randomizzazione viene generato combinando dati pubblici non prevedibili (ad es. hash di blocchi blockchain) immediatamente prima dell&apos;avvio dell&apos;estrazione, rendendolo impossibile da manipolare in anticipo da parte di chiunque, incluso il Gestore.
        </p>
      </>
    ),
  },
  {
    id: "premi",
    title: "5. Premi e Consegna",
    content: (
      <>
        <p>
          Il Vincitore viene notificato entro 24 ore dall&apos;estrazione tramite email all&apos;indirizzo associato al suo account e tramite notifica nella sua area personale della Piattaforma.
        </p>
        <p>
          Il Vincitore ha 30 giorni di tempo dalla notifica per accettare il Premio. In caso di mancata risposta entro tale termine, il Gestore potrà procedere con una nuova estrazione o trattenere il Premio.
        </p>
        <p>
          I Premi fisici vengono spediti a mezzo corriere assicurato all&apos;indirizzo indicato dal Vincitore. Le spese di spedizione sono a carico del Gestore. Per i Premi esperienziali (viaggi, eventi, ecc.), il Gestore contatterà il Vincitore per concordare i dettagli. Salvo diversamente specificato, i Premi esperienziali devono essere riscattati entro 12 mesi dall&apos;estrazione.
        </p>
        <p>
          I Premi non sono convertibili in denaro né trasferibili a terzi, salvo esplicita autorizzazione scritta del Gestore.
        </p>
      </>
    ),
  },
  {
    id: "responsabilita",
    title: "6. Limitazioni di Responsabilità",
    content: (
      <>
        <p>
          Il Gestore non è responsabile per:
        </p>
        <ul>
          <li>Interruzioni del servizio dovute a cause di forza maggiore o manutenzione programmata.</li>
          <li>Errori di connessione o problemi tecnici sul dispositivo del Partecipante.</li>
          <li>Ritardi nella consegna dei Premi imputabili a terzi (corrieri, dogane, ecc.).</li>
          <li>Danni indiretti o consequenziali derivanti dalla partecipazione ai Concorsi.</li>
        </ul>
        <p>
          La responsabilità massima del Gestore nei confronti di ciascun Partecipante è limitata al valore dei Ticket acquistati dallo stesso per il Concorso oggetto di contestazione.
        </p>
      </>
    ),
  },
  {
    id: "cancellazione",
    title: "7. Cancellazione e Rimborsi",
    content: (
      <>
        <p>
          Il Gestore si riserva il diritto di cancellare un Concorso qualora non venga raggiunta la soglia minima di Ticket venduti entro 48 ore dalla data di estrazione programmata, oppure per cause di forza maggiore debitamente documentate.
        </p>
        <p>
          In caso di cancellazione di un Concorso, tutti i Partecipanti riceveranno il rimborso integrale dell&apos;importo pagato per i Ticket entro 7 giorni lavorativi tramite il metodo di pagamento originale.
        </p>
        <p>
          Non è previsto alcun rimborso per Ticket acquistati in Concorsi regolarmente svolti, indipendentemente dall&apos;esito dell&apos;estrazione.
        </p>
      </>
    ),
  },
  {
    id: "modifiche",
    title: "8. Modifiche al Regolamento",
    content: (
      <>
        <p>
          Il Gestore si riserva il diritto di modificare il presente Regolamento in qualsiasi momento. Le modifiche vengono comunicate ai Partecipanti tramite email e pubblicate sulla Piattaforma con almeno 7 giorni di anticipo rispetto alla loro entrata in vigore.
        </p>
        <p>
          L&apos;utilizzo continuato della Piattaforma dopo la comunicazione delle modifiche costituisce accettazione delle stesse. Se non si accettano le modifiche, il Partecipante ha il diritto di chiudere il proprio account.
        </p>
        <p>
          Il presente Regolamento è disciplinato dalla legge italiana. Per qualsiasi controversia, le parti concordano di tentare una soluzione amichevole; in caso di esito negativo, sarà competente il Foro di Milano.
        </p>
        <p className="text-white/30 text-sm">
          Ultima revisione: Marzo 2025
        </p>
      </>
    ),
  },
];

export default function RegolamentoPage() {
  const [activeSection, setActiveSection] = useState<string>("definizioni");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documento legale
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              Regolamento
            </h1>
            <p className="text-white/50 font-[family-name:var(--font-inter)] max-w-2xl">
              Il regolamento completo della piattaforma Concorsi Premium. Si applica a tutti i concorsi
              organizzati e gestiti tramite questa piattaforma.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content with sidebar */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Sidebar TOC */}
            <aside className="lg:col-span-1">
              <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-5 sticky top-28"
                aria-label="Indice del regolamento"
              >
                <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
                  Indice
                </h2>
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

            {/* Document content */}
            <div className="lg:col-span-3 space-y-8">
              {sections.map(({ id, title, content }, i) => (
                <motion.article
                  key={id}
                  id={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="glass p-8 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-amber-400 mb-6">{title}</h2>
                  <div className="prose-legal text-white/60 font-[family-name:var(--font-inter)] leading-relaxed space-y-4 [&_p]:text-white/60 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-white/60 [&_strong]:text-white/80 [&_strong]:font-semibold">
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
