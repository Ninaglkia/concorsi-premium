"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    category: "Piattaforma",
    question: "Come funziona Concorsi Premium?",
    answer:
      "Concorsi Premium è una piattaforma di concorsi a premi con estrazione live. Scegli un concorso, acquista uno o più ticket numerati, e partecipa all'estrazione in diretta. L'ultimo ticket rimasto in gioco vince il premio. Ogni estrazione avviene in diretta sulla piattaforma, registrata e verificata per garantire la massima trasparenza.",
  },
  {
    id: "faq-2",
    category: "Piattaforma",
    question: "La piattaforma è legale in Italia?",
    answer:
      "Sì, Concorsi Premium opera in conformità con la normativa italiana sui concorsi a premi. Tutti i concorsi sono regolarmente registrati e rispettano le disposizioni del D.P.R. 430/2001 in materia di manifestazioni a premio. Il regolamento completo è disponibile nella pagina dedicata.",
  },
  {
    id: "faq-3",
    category: "Ticket",
    question: "Come acquisto un ticket?",
    answer:
      "È semplice: registra un account, naviga tra i concorsi disponibili, seleziona il numero di ticket che vuoi acquistare e completa il pagamento tramite Stripe. I ticket vengono assegnati casualmente e riceverai la conferma via email con i numeri dei tuoi ticket.",
  },
  {
    id: "faq-4",
    category: "Ticket",
    question: "Posso acquistare più ticket per lo stesso concorso?",
    answer:
      "Sì, puoi acquistare fino a 50 ticket per concorso (il limite può variare a seconda del concorso). Acquistare più ticket aumenta le tue probabilità di vincita in modo proporzionale al numero di ticket acquistati.",
  },
  {
    id: "faq-5",
    category: "Estrazione",
    question: "Come funziona l'estrazione?",
    answer:
      "L'estrazione avviene in diretta sulla piattaforma alla data e ora prestabilite. Il sistema elimina progressivamente i numeri di ticket finché ne rimane uno solo: quello è il vincitore. L'estrazione avviene in fasi: prima rapida (batch), poi più lenta, poi drammatica finale con gli ultimi 3 ticket. Tutto è verificabile in tempo reale.",
  },
  {
    id: "faq-6",
    category: "Estrazione",
    question: "Il sistema di randomizzazione è davvero casuale?",
    answer:
      "Assolutamente sì. Utilizziamo un algoritmo crittograficamente sicuro (CSPRNG) per determinare l'ordine di eliminazione dei ticket. Il seed dell'estrazione viene generato combinando dati pubblici imprevedibili al momento dell'avvio, rendendolo impossibile da manipolare in anticipo. Il codice sorgente dell'algoritmo è pubblico e auditabile.",
  },
  {
    id: "faq-7",
    category: "Pagamenti",
    question: "Quali metodi di pagamento accettate?",
    answer:
      "Accettiamo tutte le principali carte di credito e debito (Visa, Mastercard, American Express), Apple Pay, Google Pay e bonifico bancario per importi elevati. I pagamenti sono gestiti da Stripe, uno dei provider più sicuri al mondo con certificazione PCI DSS Level 1.",
  },
  {
    id: "faq-8",
    category: "Pagamenti",
    question: "I ticket sono rimborsabili?",
    answer:
      "I ticket non sono rimborsabili una volta acquistati, eccetto nel caso in cui un concorso venga annullato per cause di forza maggiore o per mancato raggiungimento del numero minimo di ticket venduti. In quel caso, tutti i partecipanti ricevono il rimborso completo entro 7 giorni lavorativi.",
  },
  {
    id: "faq-9",
    category: "Premi",
    question: "Come ritiro il premio se vinco?",
    answer:
      "Se il tuo ticket vince, riceverai una notifica via email e nella tua area personale entro 24 ore dall'estrazione. Per i premi fisici organizziamo la spedizione assicurata; per le esperienze (viaggi, weekend) ti contatteremo per coordinare i dettagli. Hai 30 giorni per confermare l'accettazione del premio.",
  },
  {
    id: "faq-10",
    category: "Account",
    question: "Come posso eliminare il mio account?",
    answer:
      "Puoi richiedere la cancellazione del tuo account dalla sezione Impostazioni del profilo, oppure inviando una richiesta a privacy@concorsipremium.it. In conformità al GDPR, procederemo alla cancellazione entro 30 giorni. I dati necessari per obblighi legali (transazioni, estrazioni) vengono conservati per il periodo previsto dalla legge.",
  },
];

const categories = ["Tutti", "Piattaforma", "Ticket", "Estrazione", "Pagamenti", "Premi", "Account"] as const;
type Category = (typeof categories)[number];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`glass overflow-hidden transition-all duration-300 ${isOpen ? "border-amber-500/20" : ""}`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full p-6 flex items-start justify-between gap-4 text-left group"
      >
        <div className="flex items-start gap-4">
          <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            ?
          </span>
          <span className={`font-semibold text-base transition-colors ${isOpen ? "text-amber-400" : "text-white/80 group-hover:text-white"}`}>
            {item.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
            isOpen ? "border-amber-500/30 text-amber-400" : "border-white/10 text-white/30"
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              <div className="ml-10 border-t border-white/5 pt-4">
                <p className="text-white/60 leading-relaxed font-[family-name:var(--font-inter)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [activeCategory, setActiveCategory] = useState<Category>("Tutti");
  const [searchValue, setSearchValue] = useState("");

  const filtered = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "Tutti" || faq.category === activeCategory;
    const matchesSearch =
      searchValue === "" ||
      faq.question.toLowerCase().includes(searchValue.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/4 rounded-full blur-[180px] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Domande{" "}
              <span className="text-gradient-gold">Frequenti</span>
            </h1>
            <p className="text-xl text-white/50 font-[family-name:var(--font-inter)] mb-10">
              Tutto quello che devi sapere su Concorsi Premium
            </p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cerca tra le domande..."
                aria-label="Cerca nelle FAQ"
                className="w-full glass pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/30 font-[family-name:var(--font-inter)] text-lg"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category filters */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black"
                    : "glass text-white/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-4xl space-y-3">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-white/40 mb-2">Nessun risultato trovato</h3>
              <p className="text-white/20 font-[family-name:var(--font-inter)]">
                Prova con parole chiave diverse o contattaci direttamente.
              </p>
            </motion.div>
          ) : (
            filtered.map((faq) => (
              <FAQAccordion
                key={faq.id}
                item={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl mt-12"
        >
          <div className="glass p-8 text-center border border-amber-500/10">
            <p className="text-white/50 font-[family-name:var(--font-inter)] mb-2">Non hai trovato risposta?</p>
            <p className="text-lg font-semibold mb-6">Contatta il nostro supporto</p>
            <a
              href="/contatti"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all glow-gold"
            >
              Vai ai Contatti
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
