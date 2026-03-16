"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface Extraction {
  id: string;
  contestTitle: string;
  prize: string;
  prizeValue: number;
  image: string;
  date: string;
  status: "live" | "upcoming" | "completed";
  winner?: string;
  winnerTicket?: number;
  totalTickets: number;
  ticketsSold: number;
}

const extractions: Extraction[] = [
  {
    id: "demo",
    contestTitle: "Viaggio alle Maldive per 2",
    prize: "Maldive 7 notti luxury resort",
    prizeValue: 15000,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    date: "2025-04-15T20:00:00",
    status: "upcoming",
    totalTickets: 2000,
    ticketsSold: 1247,
  },
  {
    id: "ext-2",
    contestTitle: "Rolex Submariner",
    prize: "Rolex Submariner ref. 124060",
    prizeValue: 12000,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80",
    date: "2025-04-10T20:00:00",
    status: "upcoming",
    totalTickets: 1200,
    ticketsSold: 1198,
  },
  {
    id: "ext-3",
    contestTitle: "MacBook Pro M4 Max",
    prize: "MacBook Pro 16\" M4 Max",
    prizeValue: 4500,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    date: "2025-04-20T20:00:00",
    status: "upcoming",
    totalTickets: 1500,
    ticketsSold: 892,
  },
  {
    id: "past-1",
    contestTitle: "Ferrari Roma Weekend",
    prize: "Ferrari Roma Weekend Drive",
    prizeValue: 8000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
    date: "2025-03-20T20:00:00",
    status: "completed",
    winner: "Marco R.",
    winnerTicket: 1847,
    totalTickets: 2000,
    ticketsSold: 2000,
  },
  {
    id: "past-2",
    contestTitle: "iPhone 16 Pro Max",
    prize: "iPhone 16 Pro Max 1TB",
    prizeValue: 1800,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80",
    date: "2025-03-10T20:00:00",
    status: "completed",
    winner: "Giulia M.",
    winnerTicket: 673,
    totalTickets: 1000,
    ticketsSold: 1000,
  },
  {
    id: "past-3",
    contestTitle: "Weekend SPA di Lusso",
    prize: "Weekend spa 4 stelle con partner",
    prizeValue: 2500,
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80",
    date: "2025-02-28T20:00:00",
    status: "completed",
    winner: "Luca B.",
    winnerTicket: 412,
    totalTickets: 800,
    ticketsSold: 800,
  },
  {
    id: "past-4",
    contestTitle: "Crociera Mediterraneo",
    prize: "Crociera 7 giorni MSC per 2",
    prizeValue: 6000,
    image: "https://images.unsplash.com/photo-1548679847-1d4ff48016c5?w=600&q=80",
    date: "2025-02-14T20:00:00",
    status: "completed",
    winner: "Sara F.",
    winnerTicket: 2234,
    totalTickets: 3000,
    ticketsSold: 3000,
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

function UpcomingCard({ extraction, index }: { extraction: Extraction; index: number }) {
  const timeLeft = useCountdown(extraction.date);
  const progress = (extraction.ticketsSold / extraction.totalTickets) * 100;
  const isDemo = extraction.id === "demo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass overflow-hidden group"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={extraction.image}
          alt={extraction.contestTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="glass px-3 py-1 text-xs text-amber-400 font-semibold rounded-full border border-amber-500/20">
            In arrivo
          </span>
          {isDemo && (
            <span className="glass px-3 py-1 text-xs text-purple-400 font-semibold rounded-full border border-purple-500/20">
              Demo disponibile
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold mb-1 group-hover:text-amber-400 transition-colors">
          {extraction.contestTitle}
        </h3>
        <p className="text-sm text-white/40 font-[family-name:var(--font-inter)] mb-4">
          {extraction.prize} &bull; Valore:{" "}
          <span className="text-amber-400 font-semibold">
            &euro;{extraction.prizeValue.toLocaleString("it-IT")}
          </span>
        </p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { value: timeLeft.days, label: "GG" },
            { value: timeLeft.hours, label: "HH" },
            { value: timeLeft.minutes, label: "MM" },
            { value: timeLeft.seconds, label: "SS" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-white/5 rounded-lg py-2">
              <div className="text-xl font-bold text-gradient-gold tabular-nums">
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-[10px] text-white/30 font-[family-name:var(--font-inter)]">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 font-[family-name:var(--font-inter)]">
            <span className="text-white/40">Ticket venduti</span>
            <span className="text-amber-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`/concorsi/${extraction.id}`}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold text-center hover:from-amber-400 hover:to-amber-500 transition-all glow-gold"
          >
            Acquista Ticket
          </a>
          {isDemo && (
            <a
              href="/estrazione/demo"
              className="px-4 py-2.5 rounded-xl glass text-purple-400 text-sm font-bold hover:bg-purple-500/10 transition-all border border-purple-500/20"
            >
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CompletedCard({ extraction, index }: { extraction: Extraction; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass p-5 flex gap-5 group hover:bg-white/[0.03] transition-colors"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={extraction.image}
          alt={extraction.contestTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white/80 group-hover:text-white transition-colors text-sm leading-tight truncate">
            {extraction.contestTitle}
          </h3>
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
            Completata
          </span>
        </div>
        <p className="text-xs text-white/30 font-[family-name:var(--font-inter)] mt-1 truncate">
          {extraction.prize}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs font-[family-name:var(--font-inter)]">
            <span className="text-white/30">Vincitore: </span>
            <span className="text-amber-400 font-semibold">{extraction.winner}</span>
            <span className="text-white/30"> &bull; Ticket #{extraction.winnerTicket}</span>
          </div>
          <span className="text-xs text-white/20 font-[family-name:var(--font-inter)]">
            {new Date(extraction.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function EstrazioniPage() {
  const upcoming = extractions.filter((e) => e.status === "upcoming" || e.status === "live");
  const completed = extractions.filter((e) => e.status === "completed");

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-500/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/4 rounded-full blur-[180px] pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-red-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Estrazioni in diretta verificate
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              Estrazioni{" "}
              <span className="text-gradient-gold">Live</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
              Ogni estrazione avviene in diretta, registrata e verificata. Il sistema di randomizzazione
              è trasparente e non manipolabile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 md:p-10 text-center border border-purple-500/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-amber-500/5 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Prova la Demo
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Scopri come funziona l&apos;Estrazione Live
              </h2>
              <p className="text-white/50 font-[family-name:var(--font-inter)] mb-6 max-w-xl mx-auto">
                Guarda una simulazione completa del nostro sistema di estrazione in tempo reale.
                2.000 ticket, numeri randomici verificati, showdown finale emozionante.
              </p>
              <a
                href="/estrazione/demo"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg hover:from-purple-500 hover:to-purple-600 transition-all glow-purple"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Avvia Demo Estrazione
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prossime Estrazioni */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Prossime <span className="text-gradient-gold">Estrazioni</span>
            </h2>
            <p className="mt-3 text-white/40 font-[family-name:var(--font-inter)]">
              Acquista i ticket prima che sia troppo tardi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((ext, i) => (
              <UpcomingCard key={ext.id} extraction={ext} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Estrazioni Passate */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Estrazioni <span className="text-white/40">Passate</span>
            </h2>
            <p className="mt-3 text-white/40 font-[family-name:var(--font-inter)]">
              Tutte le estrazioni completate con i vincitori verificati
            </p>
          </motion.div>

          <div className="space-y-3">
            {completed.map((ext, i) => (
              <CompletedCard key={ext.id} extraction={ext} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass p-6 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">Tutte le estrazioni sono certificate e verificabili</p>
              <p className="text-xs text-white/30 font-[family-name:var(--font-inter)] mt-0.5">
                Ogni estrazione viene registrata su video e l&apos;algoritmo di randomizzazione è open source e auditabile da chiunque.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
