"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Mock data
const mockUser = {
  name: "Marco Rossi",
  email: "marco.rossi@gmail.com",
  avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  joinedAt: "Gennaio 2026",
  totalSpent: 280,
  totalTickets: 34,
  wins: 1,
};

const mockActiveTickets = [
  {
    contestId: "1",
    contestTitle: "Viaggio alle Maldive per 2",
    contestImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=200&q=80",
    prizeValue: 15000,
    ticketPrice: 10,
    totalTickets: 2000,
    ticketsSold: 1247,
    myTickets: [42, 156, 387, 891],
  },
  {
    contestId: "2",
    contestTitle: "MacBook Pro M4 Max",
    contestImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80",
    prizeValue: 4500,
    ticketPrice: 5,
    totalTickets: 1500,
    ticketsSold: 892,
    myTickets: [234, 567],
  },
];

const mockHistory = [
  {
    contestId: "10",
    contestTitle: "iPhone 15 Pro Max",
    prizeValue: 1500,
    myTickets: [12, 45, 78],
    winningNumber: 1203,
    won: false,
    date: "2 Marzo 2026",
  },
  {
    contestId: "11",
    contestTitle: "Weekend a Parigi per 2",
    prizeValue: 3000,
    myTickets: [501, 502, 503, 504, 505],
    winningNumber: 503,
    won: true,
    date: "15 Febbraio 2026",
  },
  {
    contestId: "12",
    contestTitle: "PlayStation 5 + 10 Giochi",
    prizeValue: 800,
    myTickets: [77],
    winningNumber: 412,
    won: false,
    date: "28 Gennaio 2026",
  },
];

type Tab = "tickets" | "history" | "settings";

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="glass p-5 text-center">
      <div className="text-amber-400 mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{value}</div>
      <div className="text-xs text-white/40 mt-1 font-[family-name:var(--font-inter)]">{label}</div>
    </div>
  );
}

export default function ProfiloPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tickets");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "tickets", label: "I Miei Ticket", count: mockActiveTickets.length },
    { id: "history", label: "Storico Estrazioni", count: mockHistory.length },
    { id: "settings", label: "Impostazioni" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[180px]" />

      {/* Navbar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
            CP
          </div>
          <span className="text-lg font-bold text-gradient-gold hidden sm:block">
            Concorsi Premium
          </span>
        </a>
        <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">
          &larr; Torna alla Home
        </a>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#1a1a2e] flex items-center justify-center text-3xl sm:text-4xl font-bold text-gradient-gold">
                  {mockUser.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              {mockUser.wins > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm">
                  🏆
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{mockUser.name}</h1>
              <p className="text-white/40 text-sm mt-1 font-[family-name:var(--font-inter)]">
                {mockUser.email}
              </p>
              <p className="text-white/20 text-xs mt-1 font-[family-name:var(--font-inter)]">
                Membro dal {mockUser.joinedAt}
              </p>
            </div>

            {/* Logout */}
            <button className="px-4 py-2 rounded-xl glass text-white/50 hover:text-white text-sm transition-colors hover:bg-white/5">
              Esci
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <StatCard
            value={`${mockUser.totalTickets}`}
            label="Ticket Acquistati"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            }
          />
          <StatCard
            value={`€${mockUser.totalSpent}`}
            label="Totale Speso"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            }
          />
          <StatCard
            value={`${mockActiveTickets.length}`}
            label="Concorsi Attivi"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            }
          />
          <StatCard
            value={`${mockUser.wins}`}
            label={mockUser.wins === 1 ? "Vittoria" : "Vittorie"}
            icon={<span className="text-lg">🏆</span>}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-1 p-1 glass mb-6 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === tab.id
                        ? "bg-black/20 text-black"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              {mockActiveTickets.map((contest, i) => (
                <motion.div
                  key={contest.contestId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Contest image */}
                    <img
                      src={contest.contestImage}
                      alt={contest.contestTitle}
                      className="w-full sm:w-32 h-32 sm:h-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      {/* Contest info */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{contest.contestTitle}</h3>
                          <p className="text-sm text-white/40 font-[family-name:var(--font-inter)]">
                            Valore: <span className="text-gradient-gold font-bold">&euro;{contest.prizeValue.toLocaleString("it-IT")}</span>
                          </p>
                        </div>
                        <a
                          href={`/concorsi/${contest.contestId}`}
                          className="px-3 py-1.5 rounded-lg glass text-xs text-white/50 hover:text-white transition-colors"
                        >
                          Dettagli &rarr;
                        </a>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40 font-[family-name:var(--font-inter)]">
                            {contest.totalTickets - contest.ticketsSold} ticket rimasti
                          </span>
                          <span className="text-amber-400 font-bold">
                            {Math.round((contest.ticketsSold / contest.totalTickets) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                            style={{ width: `${(contest.ticketsSold / contest.totalTickets) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* My tickets */}
                      <div>
                        <span className="text-xs text-white/30 uppercase tracking-wider">
                          I tuoi {contest.myTickets.length} ticket
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {contest.myTickets.map((num) => (
                            <div
                              key={num}
                              className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-bold"
                            >
                              #{num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {mockActiveTickets.length === 0 && (
                <div className="glass p-12 text-center">
                  <div className="text-4xl mb-4">🎫</div>
                  <h3 className="text-lg font-bold mb-2">Nessun ticket attivo</h3>
                  <p className="text-white/40 text-sm mb-4 font-[family-name:var(--font-inter)]">
                    Non hai ancora acquistato ticket per nessun concorso.
                  </p>
                  <a
                    href="/concorsi"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all glow-gold"
                  >
                    Esplora i Concorsi
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {mockHistory.map((entry, i) => (
                <motion.div
                  key={entry.contestId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                    entry.won ? "border border-amber-500/20" : ""
                  }`}
                >
                  {/* Win/Loss indicator */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      entry.won
                        ? "bg-amber-500/20"
                        : "bg-white/5"
                    }`}
                  >
                    {entry.won ? "🏆" : "❌"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate">{entry.contestTitle}</h3>
                      {entry.won && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold shrink-0">
                          VINTO!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/40 font-[family-name:var(--font-inter)]">
                      {entry.date} &bull; Valore: &euro;{entry.prizeValue.toLocaleString("it-IT")}
                    </p>
                  </div>

                  {/* Tickets + result */}
                  <div className="text-right shrink-0">
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {entry.myTickets.map((num) => (
                        <span
                          key={num}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            num === entry.winningNumber
                              ? "bg-amber-500 text-black"
                              : "bg-white/5 text-white/30"
                          }`}
                        >
                          #{num}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-white/20 mt-1 font-[family-name:var(--font-inter)]">
                      Vincente: #{entry.winningNumber}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="glass p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Profilo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Nome</label>
                    <input
                      type="text"
                      defaultValue={mockUser.name}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-colors font-[family-name:var(--font-inter)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      type="email"
                      defaultValue={mockUser.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 cursor-not-allowed font-[family-name:var(--font-inter)]"
                    />
                    <p className="text-xs text-white/20 mt-1">Gestita da Google. Non modificabile.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-bold text-lg mb-4">Notifiche</h3>
                <div className="space-y-3">
                  {[
                    { label: "Estrazione in partenza", desc: "Ricevi un'email quando un concorso a cui partecipi sta per estrarre", default: true },
                    { label: "Risultati estrazione", desc: "Ricevi il risultato dell'estrazione via email", default: true },
                    { label: "Nuovi concorsi", desc: "Ricevi una notifica quando vengono pubblicati nuovi concorsi", default: false },
                  ].map((pref) => (
                    <div key={pref.label} className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                      <div>
                        <div className="text-sm font-medium">{pref.label}</div>
                        <div className="text-xs text-white/30 font-[family-name:var(--font-inter)]">{pref.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                        <div className="w-10 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-bold text-lg mb-4 text-red-400">Zona Pericolosa</h3>
                <button className="px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                  Elimina Account
                </button>
                <p className="text-xs text-white/20 mt-2 font-[family-name:var(--font-inter)]">
                  Questa azione è irreversibile. Tutti i tuoi dati verranno eliminati.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all glow-gold">
                  Salva Modifiche
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
