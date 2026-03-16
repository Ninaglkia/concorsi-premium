"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface Contest {
  id: string;
  title: string;
  description: string;
  image: string;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  category: string;
  extractionDate: string;
  rules: string[];
  prizeDetails: string;
}

const mockContests: Contest[] = [
  {
    id: "1",
    title: "Viaggio alle Maldive per 2",
    description:
      "Un'esperienza indimenticabile alle Maldive. Volo diretto da Milano, 7 notti in resort 5 stelle con bungalow sull'acqua, colazione e cena incluse, escursioni private, snorkeling e spa. Un sogno che diventa realtà.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85",
    prizeValue: 15000,
    ticketPrice: 10,
    totalTickets: 2000,
    ticketsSold: 1247,
    category: "Viaggi",
    extractionDate: "2025-04-15T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 50 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Il premio deve essere riscattato entro 12 mesi",
    ],
    prizeDetails:
      "Volo A/R da Milano Malpensa, 7 notti presso Four Seasons Resort Maldives, trattamento di mezza pensione, trasferimento in idrovolante, escursioni incluse.",
  },
  {
    id: "2",
    title: "MacBook Pro M4 Max",
    description:
      "Il MacBook Pro con chip M4 Max è la macchina definitiva per creativi e professionisti. 16 pollici di display Liquid Retina XDR, 48GB di RAM unificata, 1TB SSD. Potenza senza compromessi.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85",
    prizeValue: 4500,
    ticketPrice: 5,
    totalTickets: 1500,
    ticketsSold: 892,
    category: "Tech",
    extractionDate: "2025-04-20T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 100 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Spedizione gratuita in tutta Italia entro 7 giorni lavorativi",
    ],
    prizeDetails:
      "MacBook Pro 16 pollici M4 Max, 48GB RAM unificata, 1TB SSD, Space Black. Inclusa garanzia Apple Care+ 3 anni.",
  },
  {
    id: "3",
    title: "Rolex Submariner",
    description:
      "Un'icona senza tempo. Il Rolex Submariner in acciaio inossidabile Oystersteel con quadrante nero. Il simbolo per eccellenza dell'orologeria di lusso, indossato da generazioni.",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1200&q=85",
    prizeValue: 12000,
    ticketPrice: 15,
    totalTickets: 1200,
    ticketsSold: 1198,
    category: "Lusso",
    extractionDate: "2025-04-10T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 20 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "L'orologio viene consegnato con scatola e certificato di autenticità Rolex",
    ],
    prizeDetails:
      "Rolex Submariner ref. 124060, cassa 41mm Oystersteel, quadrante nero, bracciale Oyster. Completo di scatola originale e certificato.",
  },
  {
    id: "4",
    title: "Safari in Kenya 10 Giorni",
    description:
      "Un'avventura autentica nella savana africana. 10 giorni di safari privato nel Masai Mara con lodge di lusso, guide esperte e la possibilità di assistere alla Grande Migrazione degli gnu.",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=85",
    prizeValue: 8000,
    ticketPrice: 8,
    totalTickets: 1800,
    ticketsSold: 420,
    category: "Viaggi",
    extractionDate: "2025-05-05T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 50 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Il premio è valido per 2 persone, prenotazione da concordare con l'organizzatore",
    ],
    prizeDetails:
      "10 notti in lodge 5 stelle nel Masai Mara, volo A/R da Roma, safari privato mattutino e serale, tutti i pasti inclusi, transfer aeroportuali.",
  },
  {
    id: "5",
    title: "PlayStation 5 + 10 Giochi",
    description:
      "La console di nuova generazione Sony PlayStation 5 con lettore Blu-ray, accompagnata da una selezione di 10 giochi top del momento. Gaming al massimo livello.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=85",
    prizeValue: 1200,
    ticketPrice: 3,
    totalTickets: 1000,
    ticketsSold: 670,
    category: "Tech",
    extractionDate: "2025-04-25T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 100 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Spedizione gratuita in tutta Italia",
    ],
    prizeDetails:
      "PlayStation 5 con lettore disc, 1 DualSense controller, 10 giochi a scelta tra la selezione disponibile. Spedizione assicurata.",
  },
  {
    id: "6",
    title: "Cena per 2 a Parigi + Volo",
    description:
      "Un weekend romantico a Parigi: volo A/R da Milano, 2 notti in hotel 4 stelle nel cuore della città, cena gastronomica con chef stellato. La Ville Lumière ti aspetta.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85",
    prizeValue: 3500,
    ticketPrice: 6,
    totalTickets: 900,
    ticketsSold: 540,
    category: "Esperienze",
    extractionDate: "2025-04-30T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 50 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Prenotazione da concordare entro 6 mesi dall'estrazione",
    ],
    prizeDetails:
      "Volo A/R da Milano a Parigi, 2 notti in hotel 4 stelle vicino agli Champs-Élysées, cena per 2 in ristorante con stella Michelin.",
  },
  {
    id: "7",
    title: "Lamborghini Huracán Weekend",
    description:
      "Vivi l'emozione di guidare una Lamborghini Huracán per un intero weekend. Pick-up in concessionaria a Milano, assicurazione inclusa, 500 km di guida pura adrenalina.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85",
    prizeValue: 5000,
    ticketPrice: 12,
    totalTickets: 800,
    ticketsSold: 155,
    category: "Esperienze",
    extractionDate: "2025-05-12T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni con patente B da almeno 3 anni",
      "Ogni account può acquistare fino a 30 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Disponibile solo per ritiro a Milano, cauzione obbligatoria €2.000",
    ],
    prizeDetails:
      "Lamborghini Huracán EVO per il fine settimana (venerdì pomeriggio - lunedì mattina), assicurazione kasko inclusa, 500 km inclusi.",
  },
  {
    id: "8",
    title: "Borsa Hermès Birkin",
    description:
      "La borsa più iconica e desiderata al mondo. Una Hermès Birkin 30 in pelle Togo con hardware placcato oro. Un investimento di stile senza pari, di valore crescente nel tempo.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=85",
    prizeValue: 18000,
    ticketPrice: 20,
    totalTickets: 1500,
    ticketsSold: 1050,
    category: "Lusso",
    extractionDate: "2025-05-01T20:00:00",
    rules: [
      "Partecipazione aperta a maggiorenni residenti in Italia",
      "Ogni account può acquistare fino a 20 ticket per concorso",
      "I ticket non sono rimborsabili dopo l'acquisto",
      "Il vincitore verrà contattato entro 24 ore dall'estrazione",
      "Consegna con certificato di autenticità e scatola originale Hermès",
    ],
    prizeDetails:
      "Hermès Birkin 30 in pelle Togo Noir, hardware placcato oro 18k. Consegnata in scatola originale con certificato di autenticità.",
  },
];

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);

  const contest = mockContests.find((c) => c.id === id) ?? mockContests[0];
  const timeLeft = useCountdown(contest.extractionDate);
  const progress = (contest.ticketsSold / contest.totalTickets) * 100;
  const ticketsRemaining = contest.totalTickets - contest.ticketsSold;
  const totalPrice = quantity * contest.ticketPrice;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed top-1/3 left-1/4 w-[700px] h-[700px] bg-amber-500/3 rounded-full blur-[250px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/4 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      {/* Hero image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={contest.image}
          alt={contest.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />

        {/* Breadcrumb */}
        <div className="absolute top-28 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40 font-[family-name:var(--font-inter)]">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <a href="/concorsi" className="hover:text-white transition-colors">Concorsi</a>
              <span>/</span>
              <span className="text-white/70">{contest.title}</span>
            </nav>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8">
          <div className="mx-auto max-w-7xl">
            <span className="glass px-4 py-2 text-sm text-amber-400 font-semibold rounded-full">
              {contest.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 -mt-12 relative z-10">

            {/* Left: Main info */}
            <div className="lg:col-span-2 space-y-8">

              {/* Title & description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl sm:text-4xl font-bold">{contest.title}</h1>
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-bold text-gradient-gold">
                      &euro;{contest.prizeValue.toLocaleString("it-IT")}
                    </div>
                    <div className="text-xs text-white/30 font-[family-name:var(--font-inter)]">valore premio</div>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed font-[family-name:var(--font-inter)] text-lg">
                  {contest.description}
                </p>
              </motion.div>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass p-8"
              >
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">
                  Tempo all&apos;Estrazione
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: timeLeft.days, label: "Giorni" },
                    { value: timeLeft.hours, label: "Ore" },
                    { value: timeLeft.minutes, label: "Min" },
                    { value: timeLeft.seconds, label: "Sec" },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-4xl sm:text-5xl font-bold text-gradient-gold tabular-nums">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-white/30 mt-1 font-[family-name:var(--font-inter)] uppercase tracking-wider">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="glass p-8"
              >
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">
                  Ticket Venduti
                </h2>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-3xl font-bold text-white">{contest.ticketsSold.toLocaleString("it-IT")}</span>
                    <span className="text-white/40 ml-2 font-[family-name:var(--font-inter)]">
                      su {contest.totalTickets.toLocaleString("it-IT")} totali
                    </span>
                  </div>
                  <span className="text-amber-400 font-bold text-xl">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                  />
                </div>
                <p className="mt-3 text-sm text-white/40 font-[family-name:var(--font-inter)]">
                  <span className="text-white font-semibold">{ticketsRemaining.toLocaleString("it-IT")}</span> ticket ancora disponibili
                </p>
              </motion.div>

              {/* Prize details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass p-8"
              >
                <h2 className="text-lg font-bold mb-4">Dettagli del Premio</h2>
                <p className="text-white/60 font-[family-name:var(--font-inter)] leading-relaxed">
                  {contest.prizeDetails}
                </p>
              </motion.div>

              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="glass p-8"
              >
                <h2 className="text-lg font-bold mb-6">Regole di Partecipazione</h2>
                <ul className="space-y-3">
                  {contest.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-white/60 font-[family-name:var(--font-inter)]">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* How it works mini section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass p-8"
              >
                <h2 className="text-lg font-bold mb-6">Come Funziona</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { step: "01", title: "Acquista il Ticket", desc: "Scegli la quantità e completa il pagamento sicuro con Stripe." },
                    { step: "02", title: "Attendi l'Estrazione", desc: "Alla data prestabilita inizia l'estrazione live in diretta su questa piattaforma." },
                    { step: "03", title: "Ritira il Premio", desc: "Se vinci, ti contatteremo entro 24 ore con le istruzioni per ritirare il premio." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="relative">
                      <div className="text-5xl font-bold text-white/5 mb-2 leading-none">{step}</div>
                      <h3 className="font-bold text-white/80 mb-1">{title}</h3>
                      <p className="text-sm text-white/40 font-[family-name:var(--font-inter)]">{desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Purchase sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass p-8 sticky top-28"
              >
                <h2 className="text-lg font-bold mb-1">Acquista Ticket</h2>
                <p className="text-sm text-white/40 font-[family-name:var(--font-inter)] mb-6">
                  Ogni ticket costa{" "}
                  <span className="text-amber-400 font-semibold">&euro;{contest.ticketPrice}</span>
                </p>

                {/* Quantity selector */}
                <div className="mb-6">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-[family-name:var(--font-inter)] mb-3 block">
                    Quantità
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Riduci quantità"
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xl font-bold text-white flex items-center justify-center border border-white/10"
                    >
                      &minus;
                    </button>
                    <div className="flex-1 text-center text-3xl font-bold text-white tabular-nums">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                      aria-label="Aumenta quantità"
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xl font-bold text-white flex items-center justify-center border border-white/10"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick select */}
                  <div className="flex gap-2 mt-3">
                    {[1, 5, 10, 25].map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuantity(n)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          quantity === n
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-white/5 text-white/40 hover:text-white/70 border border-transparent"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price summary */}
                <div className="border border-white/5 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm font-[family-name:var(--font-inter)]">
                    <span className="text-white/40">{quantity} ticket &times; &euro;{contest.ticketPrice}</span>
                    <span className="text-white">&euro;{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-[family-name:var(--font-inter)]">
                    <span className="text-white/40">Commissione piattaforma</span>
                    <span className="text-white">&euro;0,00</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between font-bold">
                    <span className="text-white">Totale</span>
                    <span className="text-gradient-gold text-lg">&euro;{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold mb-4">
                  Acquista {quantity} Ticket
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-white/30 font-[family-name:var(--font-inter)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento sicuro con Stripe
                </div>

                {/* Info */}
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  {[
                    { label: "Data estrazione", value: new Date(contest.extractionDate).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Ticket disponibili", value: ticketsRemaining.toLocaleString("it-IT") },
                    { label: "Ticket totali", value: contest.totalTickets.toLocaleString("it-IT") },
                    { label: "Prezzo ticket", value: `€${contest.ticketPrice}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm font-[family-name:var(--font-inter)]">
                      <span className="text-white/30">{label}</span>
                      <span className="text-white/70 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
