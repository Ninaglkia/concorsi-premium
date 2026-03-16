"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface CookieType {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: "tecnico" | "analitico" | "marketing";
}

const cookieTable: CookieType[] = [
  {
    name: "session_id",
    provider: "concorsipremium.it",
    purpose: "Mantiene la sessione utente attiva durante la navigazione",
    duration: "Sessione",
    type: "tecnico",
  },
  {
    name: "csrf_token",
    provider: "concorsipremium.it",
    purpose: "Protezione contro attacchi CSRF nelle richieste form",
    duration: "Sessione",
    type: "tecnico",
  },
  {
    name: "auth_token",
    provider: "concorsipremium.it",
    purpose: "Mantiene l&apos;utente autenticato tra le sessioni",
    duration: "30 giorni",
    type: "tecnico",
  },
  {
    name: "preferences",
    provider: "concorsipremium.it",
    purpose: "Salva le preferenze dell&apos;utente (lingua, tema)",
    duration: "1 anno",
    type: "tecnico",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distingue gli utenti unici per analisi del traffico",
    duration: "2 anni",
    type: "analitico",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    purpose: "Mantiene lo stato della sessione di Analytics",
    duration: "2 anni",
    type: "analitico",
  },
  {
    name: "__stripe_mid",
    provider: "Stripe",
    purpose: "Rilevamento frodi per i pagamenti",
    duration: "1 anno",
    type: "tecnico",
  },
  {
    name: "__stripe_sid",
    provider: "Stripe",
    purpose: "Sicurezza transazioni di pagamento",
    duration: "30 minuti",
    type: "tecnico",
  },
];

const typeColors: Record<CookieType["type"], string> = {
  tecnico: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  analitico: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  marketing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const typeLabels: Record<CookieType["type"], string> = {
  tecnico: "Tecnico",
  analitico: "Analitico",
  marketing: "Marketing",
};

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "cosa-sono",
    title: "1. Cosa Sono i Cookie",
    content: (
      <>
        <p>
          I cookie sono piccoli file di testo che i siti web inviano al browser dell&apos;utente durante la navigazione. Vengono memorizzati sul dispositivo dell&apos;utente e restituiti al sito ad ogni visita successiva. I cookie permettono al sito di &quot;ricordare&quot; le azioni e le preferenze dell&apos;utente nel corso del tempo.
        </p>
        <p>
          I cookie non possono accedere ad altri dati presenti sul dispositivo dell&apos;utente, né trasmettere virus o malware. Sono uno strumento tecnico standard ampiamente utilizzato nel web moderno.
        </p>
      </>
    ),
  },
  {
    id: "tipi",
    title: "2. Tipi di Cookie Utilizzati",
    content: (
      <>
        <p>Utilizziamo tre categorie di cookie:</p>

        <div className="space-y-4 mt-4">
          <div className="glass p-5 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                Tecnici
              </span>
              <span className="text-sm font-semibold text-white/70">Obbligatori — Non disattivabili</span>
            </div>
            <p className="text-sm text-white/50">
              Strettamente necessari al funzionamento del sito. Includono cookie di sessione, autenticazione, sicurezza e preferenze. Senza questi cookie il sito non può funzionare correttamente. Non richiedono consenso.
            </p>
          </div>

          <div className="glass p-5 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                Analitici
              </span>
              <span className="text-sm font-semibold text-white/70">Opzionali — Consenso richiesto</span>
            </div>
            <p className="text-sm text-white/50">
              Raccolgono informazioni aggregate sull&apos;utilizzo del sito per migliorare la user experience. Utilizziamo Google Analytics con anonimizzazione dell&apos;IP. I dati sono aggregati e non permettono di identificare l&apos;utente individualmente.
            </p>
          </div>

          <div className="glass p-5 border border-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                Marketing
              </span>
              <span className="text-sm font-semibold text-white/70">Opzionali — Consenso richiesto</span>
            </div>
            <p className="text-sm text-white/50">
              Attualmente non utilizziamo cookie di marketing o profilazione di terze parti. Ci impegniamo ad aggiornare questa sezione in caso di futura introduzione.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "elenco",
    title: "3. Elenco Cookie",
    content: (
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 text-white/40 font-semibold">Nome</th>
              <th className="text-left py-3 px-2 text-white/40 font-semibold">Provider</th>
              <th className="text-left py-3 px-2 text-white/40 font-semibold">Scopo</th>
              <th className="text-left py-3 px-2 text-white/40 font-semibold">Durata</th>
              <th className="text-left py-3 px-2 text-white/40 font-semibold">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {cookieTable.map((cookie, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-2 font-mono text-amber-400/70 text-xs">{cookie.name}</td>
                <td className="py-3 px-2 text-white/50">{cookie.provider}</td>
                <td className="py-3 px-2 text-white/40 max-w-xs"
                  dangerouslySetInnerHTML={{ __html: cookie.purpose }}
                />
                <td className="py-3 px-2 text-white/50 whitespace-nowrap">{cookie.duration}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${typeColors[cookie.type]}`}>
                    {typeLabels[cookie.type]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "gestione",
    title: "4. Come Gestire i Cookie",
    content: (
      <>
        <p>
          Puoi gestire le preferenze sui cookie in qualsiasi momento tramite il banner presente sul sito. Per i cookie analitici e di marketing puoi revocare il consenso senza effetti retroattivi.
        </p>
        <p>
          Puoi anche gestire i cookie direttamente dalle impostazioni del tuo browser. Di seguito le istruzioni per i browser più diffusi:
        </p>
        <ul>
          <li><strong>Google Chrome:</strong> Impostazioni &rarr; Privacy e sicurezza &rarr; Cookie e altri dati dei siti</li>
          <li><strong>Mozilla Firefox:</strong> Opzioni &rarr; Privacy e sicurezza &rarr; Cookie e dati del sito web</li>
          <li><strong>Safari:</strong> Preferenze &rarr; Privacy &rarr; Gestisci dati sito</li>
          <li><strong>Microsoft Edge:</strong> Impostazioni &rarr; Privacy, ricerca e servizi &rarr; Cookie</li>
        </ul>
        <p>
          Tieni presente che disabilitare i cookie tecnici potrebbe compromettere il corretto funzionamento del sito, inclusa la possibilità di accedere al tuo account e completare gli acquisti.
        </p>
        <p>
          Per disabilitare Google Analytics specificatamente, puoi installare il{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">
            plugin ufficiale di opt-out di Google Analytics
          </a>.
        </p>
      </>
    ),
  },
  {
    id: "aggiornamenti",
    title: "5. Aggiornamenti alla Cookie Policy",
    content: (
      <>
        <p>
          La presente Cookie Policy può essere aggiornata periodicamente per riflettere cambiamenti nei cookie utilizzati o modifiche normative. Ti invitiamo a verificare questa pagina periodicamente.
        </p>
        <p>
          In caso di modifiche sostanziali, sarà mostrato un nuovo banner di consenso e, ove applicabile, riceverai una notifica via email.
        </p>
        <p>
          Per qualsiasi domanda sui cookie, contattaci a privacy@concorsipremium.it.
        </p>
        <p className="text-white/30 text-sm">Ultima revisione: Marzo 2025</p>
      </>
    ),
  },
];

export default function CookiePage() {
  const [activeSection, setActiveSection] = useState<string>("cosa-sono");

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
      <div className="fixed top-1/4 right-1/3 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-blue-400 font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informativa Cookie
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-white/50 font-[family-name:var(--font-inter)] max-w-2xl">
              Informativa sull&apos;utilizzo dei cookie e delle tecnologie di tracciamento sulla piattaforma
              Concorsi Premium, ai sensi dell&apos;art. 122 del Codice Privacy e delle linee guida del Garante.
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
                aria-label="Indice cookie policy"
              >
                <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Indice</h2>
                <ul className="space-y-1">
                  {sections.map(({ id, title }) => (
                    <li key={id}>
                      <button
                        onClick={() => scrollTo(id)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 font-[family-name:var(--font-inter)] ${
                          activeSection === id
                            ? "text-blue-400 bg-blue-500/10"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                        }`}
                      >
                        {title}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-xs text-white/30 font-[family-name:var(--font-inter)] mb-3">
                    Gestisci le tue preferenze
                  </p>
                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold hover:from-amber-400 hover:to-amber-500 transition-all">
                    Preferenze Cookie
                  </button>
                </div>
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
                  <h2 className="text-xl font-bold text-blue-400 mb-6">{title}</h2>
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
