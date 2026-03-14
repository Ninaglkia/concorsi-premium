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

type Phase = "idle" | "countdown" | "batch" | "slow" | "suspense" | "finale" | "showdown" | "winner";

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

// Heartbeat CSS animation via style tag
function HeartbeatStyle() {
  return (
    <style jsx global>{`
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.08); }
        30% { transform: scale(1); }
        45% { transform: scale(1.05); }
        60% { transform: scale(1); }
      }
      @keyframes heartbeat-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2), 0 0 60px rgba(245, 158, 11, 0.05); }
        15% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.5), 0 0 80px rgba(245, 158, 11, 0.15); }
        30% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2), 0 0 60px rgba(245, 158, 11, 0.05); }
        45% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.4), 0 0 70px rgba(245, 158, 11, 0.1); }
        60% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2), 0 0 60px rgba(245, 158, 11, 0.05); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-3px) rotate(-0.5deg); }
        20% { transform: translateX(3px) rotate(0.5deg); }
        30% { transform: translateX(-3px) rotate(-0.5deg); }
        40% { transform: translateX(3px) rotate(0.5deg); }
        50% { transform: translateX(-2px); }
        60% { transform: translateX(2px); }
        70% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
        90% { transform: translateX(-1px); }
      }
      @keyframes dots {
        0% { content: ''; }
        25% { content: '.'; }
        50% { content: '..'; }
        75% { content: '...'; }
        100% { content: '......'; }
      }
      .heartbeat { animation: heartbeat 1s ease-in-out infinite; }
      .heartbeat-glow { animation: heartbeat-glow 1s ease-in-out infinite; }
      .shake { animation: shake 0.6s ease-in-out infinite; }
    `}</style>
  );
}

// Showdown component - the dramatic 3-number finale
function Showdown({
  finalThree,
  winnerNumber,
  showdownStep,
  userTickets,
}: {
  finalThree: number[];
  winnerNumber: number;
  showdownStep: "shake" | "reveal-text" | "eliminate" | "winner";
  userTickets: number[];
}) {
  const losers = finalThree.filter((n) => n !== winnerNumber);
  const isUserWinner = userTickets.includes(winnerNumber);

  return (
    <div className="py-8 sm:py-12">
      {/* "Il vincitore è......" text */}
      {(showdownStep === "reveal-text" || showdownStep === "eliminate" || showdownStep === "winner") && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/80">
            Il vincitore è
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: showdownStep === "winner" ? 0 : Infinity, duration: 1.5 }}
              className="text-amber-400"
            >
              ......
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* The three numbers */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
        {finalThree.map((num) => {
          const isWin = num === winnerNumber;
          const isLoser = losers.includes(num);
          const isUser = userTickets.includes(num);
          const eliminated = showdownStep === "eliminate" || showdownStep === "winner";

          return (
            <AnimatePresence key={num} mode="wait">
              {/* Hide losers in eliminate/winner step */}
              {!(isLoser && showdownStep === "winner") && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    showdownStep === "shake"
                      ? { scale: 1, opacity: 1 }
                      : isLoser && eliminated
                      ? { scale: 0.3, opacity: 0, y: 50, filter: "blur(10px)" }
                      : isWin && showdownStep === "winner"
                      ? { scale: 1.3, opacity: 1 }
                      : { scale: 1, opacity: 1 }
                  }
                  exit={{ scale: 0, opacity: 0, y: 80, filter: "blur(20px)" }}
                  transition={
                    isLoser && eliminated
                      ? { duration: 1.5, ease: "easeInOut" }
                      : isWin && showdownStep === "winner"
                      ? { type: "spring", damping: 8, stiffness: 80 }
                      : { type: "spring", damping: 12, stiffness: 100 }
                  }
                  className={`relative flex flex-col items-center ${
                    showdownStep === "shake" || showdownStep === "reveal-text" ? "shake" : ""
                  }`}
                >
                  <div
                    className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center font-bold text-3xl sm:text-4xl md:text-5xl transition-all duration-500 ${
                      isWin && showdownStep === "winner"
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black heartbeat-glow"
                        : isWin
                        ? "heartbeat-glow"
                        : ""
                    } ${
                      isUser
                        ? "bg-purple-500/20 text-purple-300 border-2 border-purple-500/50"
                        : "bg-white/[0.08] text-white border-2 border-white/20"
                    } ${
                      showdownStep === "shake" || showdownStep === "reveal-text"
                        ? "heartbeat"
                        : ""
                    }`}
                    style={
                      isWin && showdownStep === "winner"
                        ? { animation: "none", transform: "scale(1)" }
                        : {}
                    }
                  >
                    {num}
                  </div>
                  {isUser && (
                    <span className="mt-2 text-xs text-purple-400 font-bold">TUO</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Winner reveal */}
      <AnimatePresence>
        {showdownStep === "winner" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-6xl sm:text-7xl mb-4"
            >
              🏆
            </motion.div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-gold mb-3">
              #{winnerNumber}
            </div>
            <p className="text-white/50 text-lg font-[family-name:var(--font-inter)]">
              {isUserWinner
                ? "Congratulazioni! Il tuo ticket ha vinto il viaggio alle Maldive!"
                : `Il ticket #${winnerNumber} vince il viaggio alle Maldive!`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [showdownStep, setShowdownStep] = useState<"shake" | "reveal-text" | "eliminate" | "winner">("shake");
  const [finalThree, setFinalThree] = useState<number[]>([]);

  const remaining = TOTAL_TICKETS - drawnNumbers.length;
  const userTicketsRemaining = USER_TICKETS.filter((t) => !drawnNumbers.includes(t));
  const drawnSet = new Set(drawnNumbers);

  const BATCH_THRESHOLD = 200;
  const SLOW_THRESHOLD = 50;
  const SUSPENSE_THRESHOLD = 10;
  const FINALE_THRESHOLD = 3; // trigger showdown at 3
  const BATCH_SIZE = 50;
  const BATCH_INTERVAL = 3000;

  const getPhaseForRemaining = (rem: number): Phase => {
    if (rem > BATCH_THRESHOLD) return "batch";
    if (rem > SLOW_THRESHOLD) return "slow";
    if (rem > SUSPENSE_THRESHOLD) return "suspense";
    if (rem > FINALE_THRESHOLD) return "finale";
    return "showdown";
  };

  const getPhaseLabel = (p: Phase): string => {
    switch (p) {
      case "batch": return "Estrazione Rapida";
      case "slow": return "Rallentamento...";
      case "suspense": return "Suspense!";
      case "finale": return "FINALE!";
      case "showdown": return "SHOWDOWN!";
      default: return "";
    }
  };

  // Draw a batch of numbers (fast phase)
  const drawBatch = useCallback(() => {
    const order = extractionOrder.current;
    const idx = indexRef.current;
    const rem = TOTAL_TICKETS - idx;

    if (rem <= BATCH_THRESHOLD) {
      setPhase("slow");
      return;
    }

    const batchEnd = Math.min(idx + BATCH_SIZE, order.length - BATCH_THRESHOLD - 1);
    const batch = order.slice(idx, batchEnd);

    setSpinning(true);
    setTimeout(() => {
      setBatchNumbers(batch);
      setDrawnNumbers((prev) => [...prev, ...batch]);
      setCurrentNumber(batch[batch.length - 1]);
      setSpinning(false);
      indexRef.current = batchEnd;

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

  // Draw individual number
  const drawSingle = useCallback(() => {
    const order = extractionOrder.current;
    const idx = indexRef.current;
    const rem = TOTAL_TICKETS - idx;

    // When 3 remain, switch to showdown
    if (rem <= FINALE_THRESHOLD) {
      const remainingNums = order.slice(idx);
      const winner = remainingNums[remainingNums.length - 1];
      setFinalThree(remainingNums);
      setWinnerNumber(winner);
      setPhase("showdown");
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
      if (newPhase !== phase && newPhase !== "showdown") setPhase(newPhase);

      let delay: number;
      if (newRem > SLOW_THRESHOLD) delay = 2000;
      else if (newRem > SUSPENSE_THRESHOLD) delay = 4000;
      else delay = 8000;

      timeoutRef.current = setTimeout(drawSingle, delay);
    }, 800);
  }, [phase]);

  // Showdown sequence
  useEffect(() => {
    if (phase !== "showdown") return;

    setShowdownStep("shake");

    // Step 1: Shake for 3 seconds
    const t1 = setTimeout(() => {
      setShowdownStep("reveal-text");
    }, 3000);

    // Step 2: "Il vincitore è......" for 4 seconds
    const t2 = setTimeout(() => {
      setShowdownStep("eliminate");
    }, 7000);

    // Step 3: Losers fade away for 2 seconds, then winner
    const t3 = setTimeout(() => {
      setShowdownStep("winner");
      setPhase("winner");
    }, 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
    setFinalThree([]);
    setShowdownStep("shake");
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
    setFinalThree([]);
    setShowdownStep("shake");
    indexRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const isUserWinner = winnerNumber !== null && USER_TICKETS.includes(winnerNumber);
  const isExtracting = phase === "batch" || phase === "slow" || phase === "suspense" || phase === "finale";
  const isShowdownOrWinner = phase === "showdown" || phase === "winner";

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <HeartbeatStyle />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />

      {/* Extra glow during showdown */}
      {isShowdownOrWinner && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-purple-500/5"
          />
          <motion.div
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/10 rounded-full blur-[200px]"
          />
        </>
      )}

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
          {(isExtracting || isShowdownOrWinner) && (
            <div className="glass px-3 py-1.5 text-xs">
              <span className="text-white/40">Fase: </span>
              <span className={`font-bold ${
                isShowdownOrWinner ? "text-red-400 animate-pulse" :
                phase === "finale" ? "text-red-400 animate-pulse" :
                phase === "suspense" ? "text-amber-400" :
                "text-white/70"
              }`}>
                {isShowdownOrWinner ? "SHOWDOWN!" : getPhaseLabel(phase)}
              </span>
            </div>
          )}
          <div className="glass px-4 py-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isExtracting || isShowdownOrWinner ? "bg-red-500 animate-pulse" : "bg-white/30"
            }`} />
            <span className="text-sm text-white/70">
              {isExtracting || phase === "showdown"
                ? "LIVE"
                : phase === "winner"
                ? "COMPLETATA"
                : "DEMO"}
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
        <div className={`glass p-6 sm:p-8 mb-6 text-center relative overflow-hidden ${
          isShowdownOrWinner ? "border-amber-500/20" : ""
        }`}>
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

          {/* Normal number display */}
          {(isExtracting || phase === "idle") && (
            <div className="py-2">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-1">
                {phase === "idle" ? "Pronto per l'estrazione" :
                 phase === "batch" ? "Ultimo numero del blocco" :
                 "Numero Eliminato"}
              </div>
              <NumberSpinner target={currentNumber} spinning={spinning} total={TOTAL_TICKETS} />

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

          {/* SHOWDOWN — dramatic 3-number finale */}
          {isShowdownOrWinner && finalThree.length > 0 && winnerNumber !== null && (
            <Showdown
              finalThree={finalThree}
              winnerNumber={winnerNumber}
              showdownStep={showdownStep}
              userTickets={USER_TICKETS}
            />
          )}

          {/* Replay button (winner phase) */}
          {phase === "winner" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <button
                onClick={reset}
                className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all glow-gold"
              >
                Riprova Estrazione
              </button>
            </motion.div>
          )}

          {/* Stats bar */}
          {isExtracting && (
            <div className="mt-4 space-y-3">
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

              {/* Last drawn numbers */}
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

              {/* Batch numbers */}
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

        {/* User tickets + grid (hide during showdown for focus) */}
        {!isShowdownOrWinner && (
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
                className="grid gap-[3px] sm:gap-1 max-h-[400px] overflow-y-auto pr-1"
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
        )}

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
