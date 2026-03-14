"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ExtractionScene = dynamic(
  () => import("@/components/3d/ExtractionScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/30 text-lg">Caricamento scena 3D...</div>
      </div>
    ),
  }
);

const TOTAL_TICKETS = 50;
const USER_TICKETS = [7, 15, 23, 38, 42]; // simulated user tickets

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Phase = "idle" | "countdown" | "extracting" | "winner";

export default function ExtractionDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastDrawn, setLastDrawn] = useState<number | null>(null);
  const [winnerNumber, setWinnerNumber] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [speed, setSpeed] = useState<string>("veloce");
  const extractionOrder = useRef<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const remaining = TOTAL_TICKETS - drawnNumbers.length;
  const isUserTicketDrawn = lastDrawn !== null && USER_TICKETS.includes(lastDrawn);

  // Calculate interval based on remaining numbers
  const getInterval = useCallback((remaining: number): number => {
    if (remaining > 40) { setSpeed("veloce"); return 100; }    // fast batch
    if (remaining > 20) { setSpeed("normale"); return 300; }   // medium
    if (remaining > 10) { setSpeed("lento"); return 800; }     // slow
    if (remaining > 5) { setSpeed("suspense"); return 1500; }  // suspense
    setSpeed("FINALE"); return 3000;                            // final!
    return 3000;
  }, []);

  const drawNext = useCallback(() => {
    const order = extractionOrder.current;
    const idx = indexRef.current;

    if (idx >= order.length - 1) {
      // Last number = winner!
      const winner = order[order.length - 1];
      setWinnerNumber(winner);
      setLastDrawn(winner);
      setPhase("winner");
      setShowConfetti(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const num = order[idx];
    setDrawnNumbers((prev) => [...prev, num]);
    setLastDrawn(num);
    indexRef.current = idx + 1;
  }, []);

  // Adaptive speed extraction
  useEffect(() => {
    if (phase !== "extracting") return;

    const tick = () => {
      drawNext();
      const rem = TOTAL_TICKETS - indexRef.current;
      const interval = getInterval(rem);

      if (intervalRef.current) clearTimeout(intervalRef.current);
      intervalRef.current = setTimeout(tick, interval);
    };

    intervalRef.current = setTimeout(tick, 500);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [phase, drawNext, getInterval]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("extracting");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const startExtraction = () => {
    // Generate shuffled extraction order
    const allNumbers = Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1);
    extractionOrder.current = shuffleArray(allNumbers);
    indexRef.current = 0;
    setDrawnNumbers([]);
    setLastDrawn(null);
    setWinnerNumber(null);
    setShowConfetti(false);
    setCountdown(3);
    setPhase("countdown");
  };

  const reset = () => {
    setPhase("idle");
    setDrawnNumbers([]);
    setLastDrawn(null);
    setWinnerNumber(null);
    setShowConfetti(false);
    indexRef.current = 0;
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  const isUserWinner = winnerNumber !== null && USER_TICKETS.includes(winnerNumber);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[150px]" />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
            CP
          </div>
          <span className="text-lg font-bold text-gradient-gold">
            Concorsi Premium
          </span>
        </a>
        <div className="glass px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-white/70">
            {phase === "extracting" ? "LIVE" : phase === "winner" ? "COMPLETATA" : "DEMO"}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-72px)]">
        {/* 3D Scene */}
        <div className="flex-1 relative min-h-[400px]">
          <ExtractionScene
            totalTickets={TOTAL_TICKETS}
            drawnNumbers={drawnNumbers}
            userTickets={USER_TICKETS}
            winnerNumber={winnerNumber}
            showConfetti={showConfetti}
          />

          {/* Countdown overlay */}
          <AnimatePresence>
            {phase === "countdown" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-9xl font-bold text-gradient-gold"
                >
                  {countdown || "VIA!"}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Winner overlay */}
          <AnimatePresence>
            {phase === "winner" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                  className="glass p-8 sm:p-12 text-center glow-gold"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                    {isUserWinner ? "HAI VINTO!" : "VINCITORE!"}
                  </h2>
                  <div className="text-6xl sm:text-7xl font-bold text-gradient-gold my-4">
                    #{winnerNumber}
                  </div>
                  <p className="text-white/50 text-lg mb-6 font-[family-name:var(--font-inter)]">
                    {isUserWinner
                      ? "Congratulazioni! Il tuo ticket ha vinto il premio!"
                      : "Il ticket vincente è stato estratto!"}
                  </p>
                  <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all"
                  >
                    Riprova Estrazione
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 glass lg:rounded-none lg:rounded-l-2xl p-6 flex flex-col gap-6 overflow-y-auto max-h-[50vh] lg:max-h-full">
          {/* Contest info */}
          <div>
            <h2 className="text-xl font-bold mb-1">Viaggio alle Maldive</h2>
            <p className="text-sm text-white/40 font-[family-name:var(--font-inter)]">
              Demo Estrazione &bull; {TOTAL_TICKETS} ticket
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-3 text-center">
              <div className="text-2xl font-bold text-gradient-gold">{remaining}</div>
              <div className="text-xs text-white/40">Rimasti</div>
            </div>
            <div className="glass p-3 text-center">
              <div className="text-2xl font-bold text-white">{drawnNumbers.length}</div>
              <div className="text-xs text-white/40">Estratti</div>
            </div>
          </div>

          {/* Speed indicator */}
          {phase === "extracting" && (
            <div className="glass p-3 text-center">
              <div className="text-xs text-white/40 mb-1">Velocità</div>
              <div
                className={`text-sm font-bold ${
                  speed === "FINALE"
                    ? "text-red-400 animate-pulse"
                    : speed === "suspense"
                    ? "text-amber-400"
                    : "text-white/70"
                }`}
              >
                {speed.toUpperCase()}
              </div>
            </div>
          )}

          {/* Last drawn */}
          <AnimatePresence mode="wait">
            {lastDrawn !== null && phase !== "winner" && (
              <motion.div
                key={lastDrawn}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`glass p-4 text-center ${
                  isUserTicketDrawn ? "glow-purple border-purple-500/30" : ""
                }`}
              >
                <div className="text-xs text-white/40 mb-1">Ultimo Estratto</div>
                <div
                  className={`text-4xl font-bold ${
                    isUserTicketDrawn ? "text-purple-400" : "text-white"
                  }`}
                >
                  #{lastDrawn}
                </div>
                {isUserTicketDrawn && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1 font-bold"
                  >
                    Il tuo ticket è uscito!
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User tickets */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 mb-2">I Tuoi Ticket</h3>
            <div className="flex flex-wrap gap-2">
              {USER_TICKETS.map((t) => {
                const eliminated = drawnNumbers.includes(t);
                const isWin = winnerNumber === t;
                return (
                  <div
                    key={t}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isWin
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black glow-gold scale-110"
                        : eliminated
                        ? "bg-red-500/20 text-red-400 line-through opacity-50"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {t}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Progresso estrazione</span>
              <span>{Math.round((drawnNumbers.length / TOTAL_TICKETS) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                animate={{ width: `${(drawnNumbers.length / TOTAL_TICKETS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Drawn numbers log */}
          {drawnNumbers.length > 0 && phase !== "idle" && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-2">Numeri Estratti</h3>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {drawnNumbers.map((n, i) => (
                  <span
                    key={i}
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      USER_TICKETS.includes(n)
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="mt-auto">
            {phase === "idle" && (
              <button
                onClick={startExtraction}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold"
              >
                Avvia Estrazione Demo
              </button>
            )}
            {phase === "extracting" && (
              <div className="text-center text-white/30 text-sm font-[family-name:var(--font-inter)]">
                Estrazione in corso...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
