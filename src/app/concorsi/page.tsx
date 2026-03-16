"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface Contest {
  id: string;
  title: string;
  image: string;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  category: "viaggi" | "tech" | "lusso" | "esperienze";
  extractionDate: string;
  badge?: "nuovo" | "hot" | "quasi-esaurito";
}

const allContests: Contest[] = [
  {
    id: "1",
    title: "Viaggio alle Maldive per 2",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    prizeValue: 15000,
    ticketPrice: 10,
    totalTickets: 2000,
    ticketsSold: 1247,
    category: "viaggi",
    extractionDate: "15 Apr 2025",
    badge: "hot",
  },
  {
    id: "2",
    title: "MacBook Pro M4 Max",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    prizeValue: 4500,
    ticketPrice: 5,
    totalTickets: 1500,
    ticketsSold: 892,
    category: "tech",
    extractionDate: "20 Apr 2025",
  },
  {
    id: "3",
    title: "Rolex Submariner",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
    prizeValue: 12000,
    ticketPrice: 15,
    totalTickets: 1200,
    ticketsSold: 1198,
    category: "lusso",
    extractionDate: "10 Apr 2025",
    badge: "quasi-esaurito",
  },
  {
    id: "4",
    title: "Safari in Kenya 10 Giorni",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80",
    prizeValue: 8000,
    ticketPrice: 8,
    totalTickets: 1800,
    ticketsSold: 420,
    category: "viaggi",
    extractionDate: "5 Mag 2025",
    badge: "nuovo",
  },
  {
    id: "5",
    title: "PlayStation 5 + 10 Giochi",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    prizeValue: 1200,
    ticketPrice: 3,
    totalTickets: 1000,
    ticketsSold: 670,
    category: "tech",
    extractionDate: "25 Apr 2025",
  },
  {
    id: "6",
    title: "Cena per 2 a Parigi + Volo",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    prizeValue: 3500,
    ticketPrice: 6,
    totalTickets: 900,
    ticketsSold: 540,
    category: "esperienze",
    extractionDate: "30 Apr 2025",
    badge: "hot",
  },
  {
    id: "7",
    title: "Lamborghini Huracán Weekend",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    prizeValue: 5000,
    ticketPrice: 12,
    totalTickets: 800,
    ticketsSold: 155,
    category: "esperienze",
    extractionDate: "12 Mag 2025",
    badge: "nuovo",
  },
  {
    id: "8",
    title: "Borsa Hermès Birkin",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    prizeValue: 18000,
    ticketPrice: 20,
    totalTickets: 1500,
    ticketsSold: 1050,
    category: "lusso",
    extractionDate: "1 Mag 2025",
    badge: "hot",
  },
];

type Category = "tutti" | "viaggi" | "tech" | "lusso" | "esperienze";
type SortOption = "popolarita" | "prezzo" | "scadenza";

const categoryLabels: Record<Category, string> = {
  tutti: "Tutti",
  viaggi: "Viaggi",
  tech: "Tech",
  lusso: "Lusso",
  esperienze: "Esperienze",
};

const sortLabels: Record<SortOption, string> = {
  popolarita: "Popolarità",
  prezzo: "Prezzo",
  scadenza: "Scadenza",
};

const badgeConfig = {
  "quasi-esaurito": { label: "Quasi Esaurito!", className: "bg-red-500/90 text-white animate-pulse" },
  hot: { label: "🔥 Hot", className: "bg-amber-500/90 text-black" },
  nuovo: { label: "Nuovo", className: "bg-purple-500/90 text-white" },
};

function ContestCard({ contest, index }: { contest: Contest; index: number }) {
  const ticketsRemaining = contest.totalTickets - contest.ticketsSold;
  const progress = (contest.ticketsSold / contest.totalTickets) * 100;
  const almostSoldOut = progress > 90;

  return (
    <motion.a
      href={`/concorsi/${contest.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass group overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={contest.image}
          alt={contest.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {contest.badge && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${badgeConfig[contest.badge].className}`}>
            {badgeConfig[contest.badge].label}
          </div>
        )}

        <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-white/70 text-xs capitalize">
          {contest.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
          {contest.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gradient-gold">
            &euro;{contest.prizeValue.toLocaleString("it-IT")}
          </span>
          <span className="text-sm text-white/40">valore premio</span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white/50 font-[family-name:var(--font-inter)]">
              <span className={`font-semibold ${almostSoldOut ? "text-red-400" : "text-white"}`}>
                {ticketsRemaining}
              </span>{" "}
              rimasti su {contest.totalTickets.toLocaleString("it-IT")}
            </span>
            <span className={`font-semibold ${almostSoldOut ? "text-red-400" : "text-amber-400"}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: "easeOut" }}
              className={`h-full rounded-full ${
                almostSoldOut
                  ? "bg-gradient-to-r from-red-500 to-amber-500"
                  : "bg-gradient-to-r from-amber-600 to-amber-400"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/30 font-[family-name:var(--font-inter)] mb-4">
          <span>Estrazione: {contest.extractionDate}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="text-sm">
            <span className="text-white/40">Ticket da </span>
            <span className="text-white font-bold">&euro;{contest.ticketPrice}</span>
          </div>
          <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold">
            Acquista
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function ConcorsiPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("tutti");
  const [activeSort, setActiveSort] = useState<SortOption>("popolarita");

  const filtered = allContests
    .filter((c) => activeCategory === "tutti" || c.category === activeCategory)
    .sort((a, b) => {
      if (activeSort === "prezzo") return a.ticketPrice - b.ticketPrice;
      if (activeSort === "scadenza") return a.extractionDate.localeCompare(b.extractionDate);
      // popolarita: by % sold
      return (b.ticketsSold / b.totalTickets) - (a.ticketsSold / a.totalTickets);
    });

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />

      {/* Blur blobs */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/4 rounded-full blur-[180px] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {allContests.length} concorsi attivi
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              Tutti i{" "}
              <span className="text-gradient-gold">Concorsi</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
              Scegli il tuo premio, acquista il ticket e partecipa all&apos;estrazione live in 3D.
              Trasparenza totale garantita.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/30 font-[family-name:var(--font-inter)]">Ordina:</span>
              <div className="flex gap-1">
                {(Object.keys(sortLabels) as SortOption[]).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setActiveSort(sort)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeSort === sort
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {sortLabels[sort]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contest Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white/60 mb-2">Nessun concorso trovato</h3>
                <p className="text-white/30 font-[family-name:var(--font-inter)]">
                  Prova a selezionare una categoria diversa.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + activeSort}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filtered.map((contest, i) => (
                  <ContestCard key={contest.id} contest={contest} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center text-sm text-white/20 font-[family-name:var(--font-inter)]"
          >
            Nuovi concorsi ogni settimana &bull; Estrazioni live verificate
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
