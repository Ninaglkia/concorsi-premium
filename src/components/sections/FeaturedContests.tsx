"use client";

import { motion } from "framer-motion";

const mockContests = [
  {
    id: "1",
    title: "Viaggio alle Maldive per 2",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    prizeValue: 15000,
    ticketPrice: 10,
    totalTickets: 2000,
    ticketsSold: 1247,
    prizeType: "viaggio",
  },
  {
    id: "2",
    title: "MacBook Pro M4 Max",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    prizeValue: 4500,
    ticketPrice: 5,
    totalTickets: 1500,
    ticketsSold: 892,
    prizeType: "prodotto",
  },
  {
    id: "3",
    title: "Rolex Submariner",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80",
    prizeValue: 12000,
    ticketPrice: 15,
    totalTickets: 1200,
    ticketsSold: 1198,
    prizeType: "prodotto",
  },
];

function ContestCard({ contest, index }: { contest: typeof mockContests[0]; index: number }) {
  const ticketsRemaining = contest.totalTickets - contest.ticketsSold;
  const progress = (contest.ticketsSold / contest.totalTickets) * 100;
  const almostSoldOut = progress > 95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="glass group overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300"
      style={{ perspective: "1000px" }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={contest.image}
          alt={contest.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Badge */}
        {almostSoldOut && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold animate-pulse">
            Quasi Esaurito!
          </div>
        )}

        {/* Prize type */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-white/70 text-xs">
          {contest.prizeType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
          {contest.title}
        </h3>

        {/* Prize value */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gradient-gold">
            &euro;{contest.prizeValue.toLocaleString("it-IT")}
          </span>
          <span className="text-sm text-white/40">valore premio</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white/50 font-[family-name:var(--font-inter)]">
              <span className="text-white font-semibold">{ticketsRemaining}</span> ticket rimasti su{" "}
              {contest.totalTickets.toLocaleString("it-IT")}
            </span>
            <span className="text-amber-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className={`h-full rounded-full ${
                almostSoldOut
                  ? "bg-gradient-to-r from-red-500 to-amber-500"
                  : "bg-gradient-to-r from-amber-600 to-amber-400"
              }`}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="text-sm">
            <span className="text-white/40">Ticket da </span>
            <span className="text-white font-bold">&euro;{contest.ticketPrice}</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold">
            Acquista
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedContests() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#1a1a2e]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Concorsi <span className="text-gradient-gold">in Evidenza</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg font-[family-name:var(--font-inter)]">
              Scegli il tuo prossimo premio
            </p>
          </div>
          <a
            href="/concorsi"
            className="hidden sm:inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
          >
            Vedi tutti
            <span>&rarr;</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContests.map((contest, i) => (
            <ContestCard key={contest.id} contest={contest} index={i} />
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 text-center sm:hidden">
          <a
            href="/concorsi"
            className="text-amber-400 hover:text-amber-300 font-semibold"
          >
            Vedi tutti i concorsi &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
