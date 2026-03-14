"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_TICKETS = 2000;
const USER_TICKETS = [42, 156, 387, 891, 1234, 1567, 1823, 1999];

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Phase = "idle" | "countdown" | "batch" | "slow" | "suspense" | "finale" | "winner";

// Slot-machine style number spinner
function NumberSpinner({ target, spinning, total }: { target: number | null; spinning: boolean; total: number }) {
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!spinning || target === null) {
      setDisplay(target);
      return;
    }

    let frame = 0;
    const totalFrames = 12;
    const interval = setInterval(() => {
      if (frame < totalFrames) {
        setDisplay(Math.floor(Math.random() * total) + 1);
        frame++;
      } else {
        setDisplay(target);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [target, spinning, total]);

  const padLen = String(total).length;

  return (
    <div className="text-[80px] sm:text-[120px] md:text-[150px] font-bold leading-none tabular-nums text-gradient-gold">
      {display !== null ? String(display).padStart(padLen, "0") : "----"}
    </div>
  );
}

// Batch progress indicator (for the fast phase)
function BatchProgress({ current, total, batchSize }: { current: number; total: number; batchSize: number }) {
  const batchNum = Math.floor(current / batchSize) + 1;
  const totalBatches = Math.ceil(total / batchSize);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-white/40">Blocco</span>
      <span className="font-bold text-amber-400">{batchNum}/{totalBatches}</span>
      <span className="text-white/40">({batchSize} numeri per blocco)</span>
    </div>
  );
}

export default function ExtractionDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(5);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [batchNumbers, setBatchNumbers] = useState<number[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winnerNumber, setWinnerNumber] = useState<number | null>(null);
  const extractionOrder = useRef<number[]>([]);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [userEliminated, setUserEliminated] = useState<number | null>(null);

  const remaining = TOTAL_TICKETS - drawnNumbers.length;
  const isCurrentUserTicket = currentNumber !== null && USER_TICKETS.includes(currentNumber);
  const userTicketsRemaining = USER_TICKETS.filter((t) => !drawnNumbers.includes(t));
  const drawnSet = new Set(drawnNumbers);

  // --- PHASE CONFIG ---
  // Batch phase: first 1800 numbers in batches of 50 every 3s (~108s = ~2 min)
  // Slow phase: next 150 numbers, one every 2s (~5 min)
  // Suspense phase: next 40 numbers, one every 4s (~2.5 min)
  // Finale phase: last 10 numbers, one every 8s (~1.3 min)
  // Total: ~11 minutes

  const BATCH_THRESHOLD = 200; // switch to individual at 200 remaining
  const SLOW_THRESHOLD = 50;
  const SUSPENSE_THRESHOLD = 10;
  const BATCH_SIZE = 50;
  const BATCH_INTERVAL = 3000;

  const getPhaseForRemaining = (rem: number): Phase => {
    if (rem > BATCH_THRESHOLD) return "batch";
    if (rem > SLOW_THRESHOLD) return "slow";
    if (rem > SUSPENSE_THRESHOLD) return "suspense";
    return "finale";
  };

  const getPhaseLabel = (p: Phase): string => {
    switch (p) {
      case "batch": return "Estrazione Rapida";
      case "slow": return "Rallentamento...";
      case "suspense": return "Suspense!";
      case "finale": return "FINALE!";
      default: return "";
    }
  };

  // Draw a batch of numbers (fast phase)
  const drawBatch = useCallback(() => {
    const order = extractionOrder.current;
    const idx = indexRef.current;
    const rem = TOTAL_TICKETS - idx;

    if (rem <= BATCH_THRESHOLD) {
      // Switch to individual mode
      setPhase("slow");
      return;
    }

    const batchEnd = Math.min(idx + BATCH_SIZE, order.length - BATCH_THRESHOLD - 1);
    const batch = order.slice(idx, batchEnd);

    // Show last number of batch in spinner
    setSpinning(true);
    setTimeout(() => {
      setBatchNumbers(batch);
      setDrawnNumbers((prev) => [...prev, ...batch]);
      setCurrentNumber(batch[batch.length - 1]);
      setSpinning(false);
      indexRef.current = batchEnd;

      // Check if any user ticket was in this batch
      const userHit = batch.find((n) => USER_TICKETS.includes(n));
      if (userHit) {
        setUserEliminated(userHit);
        setTimeout(() => setUserEliminated(null), 2500);
      }

      const newRem = TOTAL_TICKETS - batchEnd;
      if (newRem <= BATCH_THRESHOLD) {
        setPhase("slow");
      } else {
        timeoutRef.current = setTimeout(drawBatch, BATCH_INTERVAL);
      }
    }, 600);
  }, []);

  // Draw individual number (slow/suspense/finale phases)
  const drawSingle = useCallback(() => {
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
      }, 1200);
      return;
    }

    const num = order[idx];
    setSpinning(true);

    setTimeout(() => {
      setCurrentNumber(num);
      setDrawnNumbers((prev) => [...prev, num]);
      setSpinning(false);
      indexRef.current = idx + 1;

      if (USER_TICKETS.includes(num)) {
        setUserEliminated(num);
        setTimeout(() => setUserEliminated(null), 3000);
      }

      const newRem = TOTAL_TICKETS - indexRef.current;
      const newPhase = getPhaseForRemaining(newRem);
      if (newPhase !== phase) setPhase(newPhase);

      let delay: number;
      if (newRem > SLOW_THRESHOLD) delay = 2000;
      else if (newRem > SUSPENSE_THRESHOLD) delay = 4000;
      else delay = 8000;

      timeoutRef.current = setTimeout(drawSingle, delay);
    }, 800);
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    if (phase === "batch") {
      timeoutRef.current = setTimeout(drawBatch, 1500);
    } else if (phase === "slow" || phase === "suspense" || phase === "finale") {
      timeoutRef.current = setTimeout(drawSingle, 1000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, drawBatch, drawSingle]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("batch");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const startExtraction = () => {
    const allNumbers = Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1);
    extractionOrder.current = shuffleArray(allNumbers);
    indexRef.current = 0;
    setDrawnNumbers([]);
    setBatchNumbers([]);
    setCurrentNumber(null);
    setWinnerNumber(null);
    setSpinning(false);
    setUserEliminated(null);
    setCountdown(5);
    setPhase("countdown");
  };

  const reset = () => {
    setPhase("idle");
    setDrawnNumbers([]);
    setBatchNumbers([]);
    setCurrentNumber(null);
    setWinnerNumber(null);
    setSpinning(false);
    setUserEliminated(null);
    indexRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const isUserWinner = winnerNumber !== null && USER_TICKETS.includes(winnerNumber);
  const isExtracting = phase === "batch" || phase === "slow" || phase === "suspense" || phase === "finale";

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
        <div className="flex items-center gap-3">
          {isExtracting && (
            <div className="glass px-3 py-1.5 text-xs">
              <span className="text-white/40">Fase: </span>
              <span className={`font-bold ${
                phase === "finale" ? "text-red-400 animate-pulse" :
                phase === "suspense" ? "text-amber-400" :
                "text-white/70"
              }`}>
                {getPhaseLabel(phase)}
              </span>
            </div>
          )}
          <div className="glass px-4 py-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isExtracting ? "bg-red-500 animate-pulse" : "bg-white/30"
            }`} />
            <span className="text-sm text-white/70">
              {isExtracting ? "LIVE" : phase === "winner" ? "COMPLETATA" : "DEMO"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* Contest title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Estrazione: <span className="text-gradient-gold">Viaggio alle Maldive per 2</span>
          </h1>
          <p className="text-white/40 text-sm mt-1 font-[family-name:var(--font-inter)]">
            {TOTAL_TICKETS.toLocaleString("it-IT")} ticket &bull; Valore premio: &euro;15.000 &bull; Demo
          </p>
        </div>

        {/* Main extraction display */}
        <div className="glass p-6 sm:p-8 mb-6 text-center relative overflow-hidden">
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
                <div className="text-[100px] sm:text-[140px] font-bold text-gradient-gold leading-none">
                  {countdown || "VIA!"}
                </div>
                <div className="text-white/40 mt-4 text-lg">
                  L&apos;estrazione sta per iniziare...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Number display */}
          {(isExtracting || phase === "idle") && (
            <div className="py-2">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-1">
                {phase === "idle" ? "Pronto per l'estrazione" :
                 phase === "batch" ? "Ultimo numero del blocco" :
                 "Numero Eliminato"}
              </div>
              <NumberSpinner target={currentNumber} spinning={spinning} total={TOTAL_TICKETS} />

              {/* User ticket eliminated alert */}
              <AnimatePresence>
                {userEliminated !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 border border-red-500/30"
                  >
                    <span className="text-2xl">💔</span>
                    <span className="text-red-400 font-bold">
                      Il tuo ticket #{userEliminated} è stato eliminato!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Batch info */}
              {phase === "batch" && (
                <div className="mt-4 flex items-center justify-center">
                  <BatchProgress
                    current={drawnNumbers.length}
                    total={TOTAL_TICKETS - BATCH_THRESHOLD}
                    batchSize={BATCH_SIZE}
                  />
                </div>
              )}
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
                  className="text-7xl sm:text-8xl mb-4"
                >
                  🏆
                </motion.div>
                <div className="text-sm text-amber-400/70 uppercase tracking-widest mb-2">
                  {isUserWinner ? "Hai Vinto!" : "Il Vincitore"}
                </div>
                <div className="text-[80px] sm:text-[120px] font-bold text-gradient-gold leading-none">
                  #{winnerNumber}
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

          {/* Stats bar */}
          {isExtracting && (
            <div className="mt-4 space-y-3">
              {/* Counter + progress */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div>
                  <span className="text-white/40">Rimasti: </span>
                  <span className={`font-bold text-lg ${
                    remaining <= 10 ? "text-red-400 animate-pulse" :
                    remaining <= 50 ? "text-amber-400" :
                    "text-white"
                  }`}>
                    {remaining.toLocaleString("it-IT")}
                  </span>
                </div>
                <div className="w-48 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      remaining <= 10
                        ? "bg-gradient-to-r from-red-500 to-amber-500"
                        : "bg-gradient-to-r from-amber-600 to-amber-400"
                    }`}
                    animate={{ width: `${(drawnNumbers.length / TOTAL_TICKETS) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div>
                  <span className="text-white/40">Estratti: </span>
                  <span className="font-bold text-lg text-white">
                    {drawnNumbers.length.toLocaleString("it-IT")}
                  </span>
                </div>
              </div>

              {/* Last drawn numbers (individual phases only) */}
              {phase !== "batch" && drawnNumbers.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Ultimi Numeri Eliminati
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {drawnNumbers.slice(-8).reverse().map((num, i) => {
                      const isUser = USER_TICKETS.includes(num);
                      return (
                        <motion.div
                          key={`${num}-${drawnNumbers.length}`}
                          initial={i === 0 ? { scale: 1.5, opacity: 0 } : {}}
                          animate={{ scale: 1 - i * 0.04, opacity: 1 - i * 0.1 }}
                          transition={{ duration: 0.3 }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base ${
                            isUser
                              ? "bg-red-500/20 border-2 border-red-500/40 text-red-400"
                              : "bg-white/[0.06] border border-white/10 text-white/60"
                          } ${i === 0 ? "ring-2 ring-amber-400/40" : ""}`}
                        >
                          {num}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Last batch numbers (batch phase) */}
              {phase === "batch" && batchNumbers.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Ultimo Blocco Estratto ({batchNumbers.length} numeri)
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-20 overflow-hidden">
                    {batchNumbers.map((num) => {
                      const isUser = USER_TICKETS.includes(num);
                      return (
                        <span
                          key={num}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            isUser
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-white/[0.04] text-white/40"
                          }`}
                        >
                          {num}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User tickets + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* User tickets panel */}
          <div className="lg:col-span-1 glass p-5">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              I Tuoi Ticket ({USER_TICKETS.length})
            </h3>
            <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-3">
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
                    className={`flex items-center gap-3 p-2.5 lg:p-3 rounded-xl transition-all duration-500 ${
                      isWin
                        ? "bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50"
                        : eliminated
                        ? "bg-red-500/10 border border-red-500/20 opacity-40"
                        : "bg-purple-500/10 border border-purple-500/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
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
                      className={`text-xs font-medium hidden lg:block ${
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
            {isExtracting && (
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <div className="text-xs text-white/30">Ancora in gioco</div>
                <div className={`text-3xl font-bold ${
                  userTicketsRemaining.length === 0 ? "text-red-400" : "text-purple-400"
                }`}>
                  {userTicketsRemaining.length}/{USER_TICKETS.length}
                </div>
              </div>
            )}
          </div>

          {/* Number grid */}
          <div className="lg:col-span-4 glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
                Tutti i {TOTAL_TICKETS.toLocaleString("it-IT")} Ticket
              </h3>
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white/[0.06] border border-white/5" />
                  <span className="text-[10px] text-white/30">In gioco</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/40" />
                  <span className="text-[10px] text-white/30">Tuo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white/[0.02]" />
                  <span className="text-[10px] text-white/30">Eliminato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-400 to-amber-600" />
                  <span className="text-[10px] text-white/30">Vincitore</span>
                </div>
              </div>
            </div>
            <div
              ref={gridRef}
              className="grid grid-cols-20 gap-[3px] sm:gap-1 max-h-[400px] overflow-y-auto pr-1"
              style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
            >
              {Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1).map((num) => {
                const eliminated = drawnSet.has(num);
                const isUser = USER_TICKETS.includes(num);
                const isWin = winnerNumber === num;

                return (
                  <div
                    key={num}
                    className={`aspect-square rounded flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-all duration-300 ${
                      isWin
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black ring-1 ring-amber-400"
                        : eliminated && isUser
                        ? "bg-red-500/10 text-red-400/20"
                        : eliminated
                        ? "bg-transparent text-white/[0.05]"
                        : isUser
                        ? "bg-purple-500/25 text-purple-300 border border-purple-500/40"
                        : "bg-white/[0.04] text-white/40"
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
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
              {TOTAL_TICKETS.toLocaleString("it-IT")} ticket &bull; {USER_TICKETS.length} sono tuoi &bull; l&apos;ultimo numero rimasto vince &bull; ~15 min
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
