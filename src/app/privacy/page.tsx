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
    id: "introduzione",
    title: "Introduzione",
    content: (
      <>
        <p>
          La presente Privacy Policy descrive come Concorsi Premium raccoglie, utilizza e protegge i dati personali degli utenti della piattaforma, in conformità con il Regolamento Europeo sulla Protezione dei Dati (GDPR — Regolamento UE 2016/679) e con la normativa italiana vigente in materia di protezione dei dati personali.
        </p>
        <p>
          Il Titolare del trattamento è la società che gestisce la piattaforma Concorsi Premium. Per qualsiasi domanda relativa al trattamento dei tuoi dati personali, puoi contattarci all&apos;indirizzo privacy@concorsipremium.it.
        </p>
        <p>
          Prima di utilizzare la nostra piattaforma, ti invitiamo a leggere attentamente questa informativa. L&apos;utilizzo dei nostri servizi implica l&apos;accettazione delle pratiche descritte nel presente documento.
        </p>
      </>
    ),
  },
  {
    id: "raccolta-dati",
    title: "1. Dati Raccolti",
    content: (
      <>
        <p>Raccogliamo le seguenti categorie di dati personali:</p>
        <ul>
          <li><strong>Dati di registrazione:</strong> nome, cognome, indirizzo email, data di nascita, numero di telefono (opzionale).</li>
          <li><strong>Dati di pagamento:</strong> informazioni sulla carta di credito/debito gestite in modo sicuro da Stripe (noi non conserviamo i dati della carta).</li>
          <li><strong>Dati di partecipazione:</strong> i concorsi a cui hai partecipato, i ticket acquistati, i numeri assegnati.</li>
          <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, durata della sessione.</li>
          <li><strong>Comunicazioni:</strong> messaggi inviati al nostro supporto, feedback e recensioni.</li>
        </ul>
        <p>
          Non raccogliamo dati sensibili (stato di salute, origine etnica, orientamento sessuale, dati biometrici) salvo che tu non ce li fornisca spontaneamente nelle comunicazioni con il supporto.
        </p>
      </>
    ),
  },
  {
    id: "utilizzo",
    title: "2. Finalità del Trattamento",
    content: (
      <>
        <p>Utilizziamo i tuoi dati personali per le seguenti finalità:</p>
        <ul>
          <li><strong>Erogazione del servizio:</strong> gestione dell&apos;account, elaborazione degli acquisti, partecipazione ai concorsi, comunicazione dei risultati.</li>
          <li><strong>Adempimenti legali:</strong> fatturazione, contabilità, adempimenti fiscali, risposta a richieste delle autorità.</li>
          <li><strong>Sicurezza:</strong> prevenzione di frodi, accessi non autorizzati, attività illecite.</li>
          <li><strong>Miglioramento del servizio:</strong> analisi dell&apos;utilizzo della piattaforma per migliorare la user experience (dati aggregati e anonimizzati).</li>
          <li><strong>Marketing diretto:</strong> invio di comunicazioni promozionali e newsletter, solo previo tuo consenso esplicito.</li>
          <li><strong>Assistenza clienti:</strong> risposta alle tue richieste di supporto.</li>
        </ul>
      </>
    ),
  },
  {
    id: "base-giuridica",
    title: "3. Base Giuridica",
    content: (
      <>
        <p>Il trattamento dei tuoi dati personali si basa sulle seguenti basi giuridiche:</p>
        <ul>
          <li><strong>Esecuzione del contratto:</strong> per le finalità strettamente necessarie all&apos;erogazione del servizio (art. 6 §1 lett. b GDPR).</li>
          <li><strong>Obbligo legale:</strong> per gli adempimenti previsti dalla normativa fiscale e contabile (art. 6 §1 lett. c GDPR).</li>
          <li><strong>Legittimo interesse:</strong> per la prevenzione di frodi e la sicurezza della piattaforma (art. 6 §1 lett. f GDPR).</li>
          <li><strong>Consenso:</strong> per l&apos;invio di comunicazioni di marketing, revocabile in qualsiasi momento (art. 6 §1 lett. a GDPR).</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookie",
    title: "4. Cookie e Tracciamento",
    content: (
      <>
        <p>
          Utilizziamo cookie e tecnologie simili per garantire il funzionamento della piattaforma e migliorare la tua esperienza. Per informazioni dettagliate, consulta la nostra{" "}
          <a href="/cookie" className="text-amber-400 hover:text-amber-300 transition-colors">Cookie Policy</a>.
        </p>
        <p>
          Utilizziamo strumenti di analisi (Google Analytics) in modalità anonimizzata per comprendere come gli utenti interagiscono con la piattaforma. Questi dati non sono mai collegati alla tua identità personale.
        </p>
      </>
    ),
  },
  {
    id: "condivisione",
    title: "5. Condivisione dei Dati",
    content: (
      <>
        <p>Non vendiamo i tuoi dati personali a terzi. Possiamo condividerli con:</p>
        <ul>
          <li><strong>Stripe:</strong> per la gestione sicura dei pagamenti (con adeguate garanzie contrattuali).</li>
          <li><strong>Provider di hosting:</strong> per l&apos;archiviazione sicura dei dati sui nostri server.</li>
          <li><strong>Provider email:</strong> per l&apos;invio di comunicazioni transazionali e di marketing.</li>
          <li><strong>Autorità competenti:</strong> in caso di obbligo legale o richiesta ufficiale.</li>
        </ul>
        <p>
          Tutti i nostri fornitori di servizi sono selezionati sulla base delle loro garanzie in materia di protezione dei dati e operano come Responsabili del Trattamento ai sensi dell&apos;art. 28 GDPR.
        </p>
      </>
    ),
  },
  {
    id: "diritti",
    title: "6. I Tuoi Diritti",
    content: (
      <>
        <p>Ai sensi del GDPR, hai i seguenti diritti riguardo ai tuoi dati personali:</p>
        <ul>
          <li><strong>Accesso:</strong> puoi richiedere una copia dei tuoi dati personali in nostro possesso.</li>
          <li><strong>Rettifica:</strong> puoi correggere dati inesatti o incompleti.</li>
          <li><strong>Cancellazione:</strong> puoi richiedere la cancellazione dei tuoi dati ("diritto all&apos;oblio").</li>
          <li><strong>Portabilità:</strong> puoi ricevere i tuoi dati in formato strutturato e leggibile da macchina.</li>
          <li><strong>Opposizione:</strong> puoi opporti al trattamento per finalità di marketing diretto in qualsiasi momento.</li>
          <li><strong>Limitazione:</strong> puoi richiedere la limitazione del trattamento in determinati casi.</li>
          <li><strong>Revoca del consenso:</strong> puoi revocare il consenso al marketing in qualsiasi momento senza pregiudizio.</li>
        </ul>
        <p>
          Per esercitare i tuoi diritti, contattaci a privacy@concorsipremium.it. Risponderemo entro 30 giorni. Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).
        </p>
      </>
    ),
  },
  {
    id: "conservazione",
    title: "7. Conservazione dei Dati",
    content: (
      <>
        <p>Conserviamo i tuoi dati personali per il tempo strettamente necessario alle finalità per cui sono stati raccolti:</p>
        <ul>
          <li><strong>Dati dell&apos;account:</strong> per tutta la durata del tuo account e per 2 anni successivi alla chiusura.</li>
          <li><strong>Dati di pagamento e transazioni:</strong> per 10 anni, in conformità agli obblighi fiscali italiani.</li>
          <li><strong>Dati di partecipazione ai concorsi:</strong> per 5 anni dall&apos;estrazione.</li>
          <li><strong>Comunicazioni di supporto:</strong> per 3 anni dalla data di invio.</li>
        </ul>
        <p>
          Al termine del periodo di conservazione, i dati vengono cancellati o anonimizzati in modo irreversibile.
        </p>
      </>
    ),
  },
  {
    id: "contatti",
    title: "8. Contatti e Reclami",
    content: (
      <>
        <p>Per qualsiasi questione relativa alla privacy puoi contattarci:</p>
        <ul>
          <li><strong>Email DPO:</strong> privacy@concorsipremium.it</li>
          <li><strong>Posta:</strong> [Indirizzo sede legale], Italia</li>
        </ul>
        <p>
          Se ritieni che il trattamento dei tuoi dati violi il GDPR, hai il diritto di presentare un reclamo al Garante per la Protezione dei Dati Personali, accessibile all&apos;indirizzo www.garanteprivacy.it.
        </p>
        <p className="text-white/30 text-sm">Ultima revisione: Marzo 2025</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>("introduzione");

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
      <div className="fixed top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-purple-400 font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              GDPR Compliant
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-white/50 font-[family-name:var(--font-inter)] max-w-2xl">
              Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)
              e della normativa italiana in materia di protezione dei dati.
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
                aria-label="Indice privacy policy"
              >
                <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Indice</h2>
                <ul className="space-y-1">
                  {sections.map(({ id, title }) => (
                    <li key={id}>
                      <button
                        onClick={() => scrollTo(id)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 font-[family-name:var(--font-inter)] ${
                          activeSection === id
                            ? "text-purple-400 bg-purple-500/10"
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
                  <h2 className="text-xl font-bold text-purple-400 mb-6">{title}</h2>
                  <div className="text-white/60 font-[family-name:var(--font-inter)] leading-relaxed space-y-4 [&_p]:text-white/60 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-white/60 [&_strong]:text-white/80 [&_strong]:font-semibold [&_a]:text-amber-400 [&_a:hover]:text-amber-300">
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
