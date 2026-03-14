"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_TICKETS = 50;
const USER_TICKETS = [7, 15, 23, 38, 42];

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Phase = "idle" | "countdown" | "extracting" | "winner";

// Slot-machine style number spinner
function NumberSpinner({ target, spinning }: { target: number | null; spinning: boolean }) {
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!spinning || target === null) {
      setDisplay(target);
      return;
    }

    let frame = 0;
    const totalFrames = 15;
    const interval = setInterval(() => {
      if (frame < totalFrames) {
        setDisplay(Math.floor(Math.random() * TOTAL_TICKETS) + 1);
        frame++;
      } else {
        setDisplay(target);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [target, spinning]);

  return (
    <div className="relative">
      <div className="text-[120px] sm:text-[160px] font-bold leading-none tabular-nums text-gradient-gold">
        {display !== null ? String(display).padStart(2, "0") : "--"}
      </div>
    </div>
  );
}

export default function ExtractionDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winnerNumber, setWinnerNumber] = useState<number | null>(null);
  const extractionOrder = useRef<number[]>([]);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const remaining = TOTAL_TICKETS - drawnNumbers.length;
  const isCurrentUserTicket = currentNumber !== null && USER_TICKETS.includes(currentNumber);
  const userTicketsRemaining = USER_TICKETS.filter((t) => !drawnNumbers.includes(t));

  const getDelay = (rem: number): number => {
    if (rem > 40) return 3000;
    if (rem > 20) return 4000;
    if (rem > 10) return 5000;
    if (rem > 5) return 7000;
    return 10000;
  };

  const getPhaseLabel = (rem: number): string => {
    if (rem > 40) return "Estrazione Rapida";
    if (rem > 20) return "Rallentamento...";
    if (rem > 10) return "Suspense";
    if (rem > 5) return "Ultimi Numeri!";
    return "FINALE!";
  };

  const drawNext = useCallback(() => {
    const order = extractionOrder.current;
    const idx = indexRef.current;

    if (idx >= order.length - 1) {
      // Winner!
      const winner = order[order.length - 1];
      setSpinning(true);
      setTimeout(() => {
        setWinnerNumber(winner);
        setCurrentNumber(winner);
        setSpinning(false);
        setPhase("winner");
      }, 800);
      return;
    }

    const num = order[idx];
    setSpinning(true);

    setTimeout(() => {
      setCurrentNumber(num);
      setDrawnNumbers((prev) => [...prev, num]);
      setSpinning(false);
      indexRef.current = idx + 1;

      const rem = TOTAL_TICKETS - indexRef.current;
      timeoutRef.current = setTimeout(drawNext, getDelay(rem));
    }, 750);
  }, []);

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

  // Start extracting
  useEffect(() => {
    if (phase !== "extracting") return;
    timeoutRef.current = setTimeout(drawNext, 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, drawNext]);

  const startExtraction = () => {
    const allNumbers = Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1);
    extractionOrder.current = shuffleArray(allNumbers);
    indexRef.current = 0;
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setWinnerNumber(null);
    setSpinning(false);
    setCountdown(3);
    setPhase("countdown");
  };

  const reset = () => {
    setPhase("idle");
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setWinnerNumber(null);
    setSpinning(false);
    indexRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const isUserWinner = winnerNumber !== null && USER_TICKETS.includes(winnerNumber);
  const drawnSet = new Set(drawnNumbers);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />

      {/* Navbar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
            CP
          </div>
          <span className="text-lg font-bold text-gradient-gold hidden sm:block">
            Concorsi Premium
          </span>
        </a>
        <div className="glass px-4 py-2 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              phase === "extracting" ? "bg-red-500 animate-pulse" : "bg-white/30"
            }`}
          />
          <span className="text-sm text-white/70">
            {phase === "extracting"
              ? "LIVE"
              : phase === "winner"
              ? "COMPLETATA"
              : "DEMO"}
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {/* Contest title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Estrazione: <span className="text-gradient-gold">Viaggio alle Maldive</span>
          </h1>
          <p className="text-white/40 text-sm mt-1 font-[family-name:var(--font-inter)]">
            {TOTAL_TICKETS} ticket &bull; Demo
          </p>
        </div>

        {/* Main extraction display */}
        <div className="glass p-6 sm:p-8 mb-6 text-center relative overflow-hidden">
          {/* Phase label */}
          {phase === "extracting" && (
            <motion.div
              key={getPhaseLabel(remaining)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-bold mb-2 ${
                remaining <= 5 ? "text-red-400 animate-pulse" : "text-amber-400/70"
              }`}
            >
              {getPhaseLabel(remaining)}
            </motion.div>
          )}

          {/* Countdown */}
          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.div
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="py-8"
              >
                <div className="text-[120px] font-bold text-gradient-gold leading-none">
                  {countdown || "VIA!"}
                </div>
                <div className="text-white/40 mt-4 text-lg">
                  L&apos;estrazione sta per iniziare...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Number display */}
          {(phase === "extracting" || phase === "idle") && (
            <div className="py-4">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-2">
                {phase === "idle" ? "Pronto per l'estrazione" : "Numero Estratto"}
              </div>
              <NumberSpinner target={currentNumber} spinning={spinning} />
              <AnimatePresence>
                {isCurrentUserTicket && !spinning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30"
                  >
                    <span className="text-red-400 font-bold text-sm">
                      Il tuo ticket #{currentNumber} è stato eliminato!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Winner display */}
          <AnimatePresence>
            {phase === "winner" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="py-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-7xl mb-4"
                >
                  🏆
                </motion.div>
                <div className="text-sm text-amber-400/70 uppercase tracking-widest mb-2">
                  {isUserWinner ? "Hai Vinto!" : "Il Vincitore"}
                </div>
                <div className="text-[100px] sm:text-[140px] font-bold text-gradient-gold leading-none">
                  {String(winnerNumber).padStart(2, "0")}
                </div>
                <p className="text-white/50 mt-4 text-lg font-[family-name:var(--font-inter)]">
                  {isUserWinner
                    ? "Congratulazioni! Il tuo ticket ha vinto il viaggio alle Maldive!"
                    : `Il ticket #${winnerNumber} vince il viaggio alle Maldive!`}
                </p>
                <button
                  onClick={reset}
                  className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all glow-gold"
                >
                  Riprova Estrazione
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remaining counter */}
          {phase === "extracting" && (
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div>
                <span className="text-white/40">Rimasti: </span>
                <span
                  className={`font-bold ${
                    remaining <= 5 ? "text-red-400" : "text-white"
                  }`}
                >
                  {remaining}
                </span>
              </div>
              <div className="w-40 h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    remaining <= 5
                      ? "bg-gradient-to-r from-red-500 to-amber-500"
                      : "bg-gradient-to-r from-amber-600 to-amber-400"
                  }`}
                  animate={{
                    width: `${(drawnNumbers.length / TOTAL_TICKETS) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div>
                <span className="text-white/40">Estratti: </span>
                <span className="font-bold text-white">{drawnNumbers.length}</span>
              </div>
            </div>
          )}

          {/* Last 5 drawn numbers */}
          {phase === "extracting" && drawnNumbers.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-3">
                Ultimi Numeri Estratti
              </div>
              <div className="flex items-center justify-center gap-3">
                {drawnNumbers.slice(-5).reverse().map((num, i) => {
                  const isUser = USER_TICKETS.includes(num);
                  return (
                    <motion.div
                      key={`${num}-${drawnNumbers.length}`}
                      initial={i === 0 ? { scale: 1.4, opacity: 0 } : {}}
                      animate={{ scale: 1 - i * 0.08, opacity: 1 - i * 0.18 }}
                      transition={{ duration: 0.3 }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl ${
                        isUser
                          ? "bg-red-500/20 border-2 border-red-500/40 text-red-400"
                          : "bg-white/[0.06] border border-white/10 text-white/70"
                      } ${i === 0 ? "ring-2 ring-amber-400/50" : ""}`}
                    >
                      {num}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User tickets + Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User tickets panel */}
          <div className="lg:col-span-1 glass p-5">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              I Tuoi Ticket
            </h3>
            <div className="flex flex-row lg:flex-col gap-3">
              {USER_TICKETS.map((t) => {
                const eliminated = drawnSet.has(t);
                const isWin = winnerNumber === t;
                return (
                  <motion.div
                    key={t}
                    animate={
                      isWin
                        ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px #f59e0b", "0 0 30px #f59e0b", "0 0 15px #f59e0b"] }
                        : {}
                    }
                    transition={isWin ? { repeat: Infinity, duration: 1.5 } : {}}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                      isWin
                        ? "bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50"
                        : eliminated
                        ? "bg-red-500/10 border border-red-500/20 opacity-40"
                        : "bg-purple-500/10 border border-purple-500/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        isWin
                          ? "bg-amber-500 text-black"
                          : eliminated
                          ? "bg-red-500/20 text-red-400 line-through"
                          : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {t}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isWin
                          ? "text-amber-400"
                          : eliminated
                          ? "text-red-400/60"
                          : "text-purple-300/60"
                      }`}
                    >
                      {isWin ? "VINCENTE!" : eliminated ? "Eliminato" : "In gioco"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            {phase === "extracting" && (
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <div className="text-xs text-white/30">Tuoi ticket ancora in gioco</div>
                <div className="text-2xl font-bold text-purple-400">
                  {userTicketsRemaining.length}/{USER_TICKETS.length}
                </div>
              </div>
            )}
          </div>

          {/* Number grid */}
          <div className="lg:col-span-3 glass p-5">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              Tutti i Ticket
            </h3>
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1).map((num) => {
                const eliminated = drawnSet.has(num);
                const isUser = USER_TICKETS.includes(num);
                const isWin = winnerNumber === num;
                const justDrawn = currentNumber === num && !spinning;

                return (
                  <motion.div
                    key={num}
                    animate={
                      justDrawn && !isWin
                        ? { scale: [1, 1.3, 0.8], opacity: [1, 1, 0.3] }
                        : isWin
                        ? { scale: [1, 1.2, 1] }
                        : {}
                    }
                    transition={
                      isWin
                        ? { repeat: Infinity, duration: 1 }
                        : { duration: 0.5 }
                    }
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isWin
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black ring-2 ring-amber-400 glow-gold"
                        : eliminated && isUser
                        ? "bg-red-500/15 text-red-400/30 border border-red-500/10"
                        : eliminated
                        ? "bg-white/[0.02] text-white/10"
                        : isUser
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-purple"
                        : "bg-white/[0.06] text-white/60 border border-white/5"
                    }`}
                  >
                    {num}
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/[0.06] border border-white/5" />
                <span className="text-xs text-white/30">In gioco</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/40" />
                <span className="text-xs text-white/30">Tuo ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/[0.02]" />
                <span className="text-xs text-white/30">Eliminato</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-amber-600" />
                <span className="text-xs text-white/30">Vincitore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <button
              onClick={startExtraction}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold"
            >
              Avvia Estrazione Demo
            </button>
            <p className="text-white/30 text-sm mt-3 font-[family-name:var(--font-inter)]">
              50 ticket &bull; 5 sono tuoi &bull; l&apos;ultimo numero rimasto vince
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
