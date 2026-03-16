"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockUser = {
  name: "Marco Rossi",
  email: "marco.rossi@gmail.com",
  joinedAt: "Gennaio 2026",
  totalSpent: 280,
  totalTickets: 34,
  wins: 1,
  luckyScore: 73, // 0–100
  potentialWinnings: 19500,
};

const mockActiveTickets = [
  {
    contestId: "1",
    contestTitle: "Viaggio alle Maldive per 2",
    contestImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80",
    prizeValue: 15000,
    ticketPrice: 10,
    totalTickets: 2000,
    ticketsSold: 1247,
    myTickets: [42, 156, 387, 891],
    extractionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 2 days
    isLive: false,
  },
  {
    contestId: "2",
    contestTitle: "MacBook Pro M4 Max",
    contestImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    prizeValue: 4500,
    ticketPrice: 5,
    totalTickets: 1500,
    ticketsSold: 1451,
    myTickets: [234, 567],
    extractionDate: new Date(Date.now() + 4 * 60 * 60 * 1000 + 22 * 60 * 1000), // 4 hours
    isLive: true,
  },
];

const mockHistory = [
  {
    contestId: "10",
    contestTitle: "iPhone 15 Pro Max",
    contestImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&q=80",
    prizeValue: 1500,
    myTickets: [12, 45, 78],
    winningNumber: 1203,
    won: false,
    date: "2 Marzo 2026",
  },
  {
    contestId: "11",
    contestTitle: "Weekend a Parigi per 2",
    contestImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80",
    prizeValue: 3000,
    myTickets: [501, 502, 503, 504, 505],
    winningNumber: 503,
    won: true,
    date: "15 Febbraio 2026",
  },
  {
    contestId: "12",
    contestTitle: "PlayStation 5 + 10 Giochi",
    contestImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&q=80",
    prizeValue: 800,
    myTickets: [77],
    winningNumber: 412,
    won: false,
    date: "28 Gennaio 2026",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "tickets" | "history" | "settings";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1.4, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        onUpdate: (v) => setValue(Math.round(v)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return value;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function tick() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? "rgba(245,158,11,0.6)"
              : i % 3 === 1
              ? "rgba(139,92,246,0.5)"
              : "rgba(255,255,255,0.3)",
          }}
          animate={{
            y: [0, -(Math.random() * 120 + 40)],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useCountUp(value, 1.6, 0.3);
  return (
    <span>
      {prefix}{count.toLocaleString("it-IT")}{suffix}
    </span>
  );
}

function LuckyScoreMeter({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const getLabel = (s: number) =>
    s >= 80 ? "Eccellente" : s >= 60 ? "Ottimo" : s >= 40 ? "Buono" : "Normale";
  const getColor = (s: number) =>
    s >= 80 ? "#f59e0b" : s >= 60 ? "#a78bfa" : s >= 40 ? "#34d399" : "#6b7280";

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (animated ? (score / 100) * circumference : circumference);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="44"
            cy="44"
            r="38"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ filter: `drop-shadow(0 0 6px ${getColor(score)}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gradient-gold">{score}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider leading-tight">score</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold" style={{ color: getColor(score) }}>
          {getLabel(score)}
        </div>
        <div className="text-[10px] text-white/30 mt-0.5">Fortuna attuale</div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-sm font-bold text-amber-400 tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] text-white/30 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function NearestCountdown({ tickets }: { tickets: typeof mockActiveTickets }) {
  const nearest = [...tickets].sort(
    (a, b) => a.extractionDate.getTime() - b.extractionDate.getTime()
  )[0];
  const time = useCountdown(nearest.extractionDate);
  const isVeryClose = time.days === 0 && time.hours < 6;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-amber-400"
          animate={{ opacity: isVeryClose ? [1, 0.2] : 1, scale: isVeryClose ? [1, 1.4] : 1 }}
          transition={{ duration: 0.8, repeat: isVeryClose ? Infinity : 0, repeatType: "reverse" }}
        />
        <span className="text-[10px] text-white/40 uppercase tracking-wider">Prossima estrazione</span>
      </div>
      <div className="flex items-end gap-1.5">
        {time.days > 0 && <CountdownUnit value={time.days} label="gg" />}
        <CountdownUnit value={time.hours} label="ore" />
        <CountdownUnit value={time.minutes} label="min" />
        <CountdownUnit value={time.seconds} label="sec" />
      </div>
      <div className="text-[10px] text-white/25 text-center leading-snug max-w-[100px]">
        {nearest.contestTitle}
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  prefix = "",
  suffix = "",
  icon,
  delay = 0,
  highlight = false,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-amber-500/20 transition-colors duration-300 ${highlight ? "border-amber-500/15" : ""}`}
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/[0.03] to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
          {icon}
        </div>
        {highlight && (
          <div className="w-2 h-2 rounded-full bg-amber-400" style={{ boxShadow: "0 0 6px #f59e0b" }} />
        )}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-bold text-gradient-gold leading-none">
          {prefix}<AnimatedCounter value={value} />{suffix}
        </div>
        <div className="text-xs text-white/35 mt-1.5 font-[family-name:var(--font-inter)] leading-snug">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function WinProbabilityBadge({ myTickets, totalTickets }: { myTickets: number[]; totalTickets: number }) {
  const probability = ((myTickets.length / totalTickets) * 100).toFixed(2);
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
      <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-bold text-purple-300">{probability}%</span>
      <span className="text-[10px] text-white/30 hidden sm:inline">prob.</span>
    </div>
  );
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30">
      <motion.div
        className="w-2 h-2 rounded-full bg-red-400"
        animate={{ opacity: [1, 0.3], scale: [1, 1.5] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
      />
      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">LIVE</span>
    </div>
  );
}

function ActiveTicketCard({
  contest,
  index,
}: {
  contest: (typeof mockActiveTickets)[0];
  index: number;
}) {
  const fill = (contest.ticketsSold / contest.totalTickets) * 100;
  const time = useCountdown(contest.extractionDate);
  const remaining = contest.totalTickets - contest.ticketsSold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300 ${
        contest.isLive ? "border-red-500/25" : ""
      }`}
    >
      {/* Ambient top glow for live contests */}
      {contest.isLive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image */}
          <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
            <img
              src={contest.contestImage}
              alt={contest.contestTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* Ticket count badge on image */}
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold text-white">
              {contest.myTickets.length} ticket
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg leading-snug truncate">
                  {contest.contestTitle}
                </h3>
                <p className="text-sm font-bold mt-0.5">
                  <span className="text-white/35 font-normal font-[family-name:var(--font-inter)]">Premio: </span>
                  <span className="text-gradient-gold">€{contest.prizeValue.toLocaleString("it-IT")}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {contest.isLive && <LiveBadge />}
                <WinProbabilityBadge
                  myTickets={contest.myTickets}
                  totalTickets={contest.totalTickets}
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/35 font-[family-name:var(--font-inter)]">
                  {remaining.toLocaleString("it-IT")} ticket rimasti
                </span>
                <span className="font-bold text-amber-400">{Math.round(fill)}% venduto</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${fill}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ boxShadow: fill > 90 ? "0 0 8px rgba(245,158,11,0.5)" : "none" }}
                />
              </div>
            </div>

            {/* Countdown + Tickets row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Countdown compact */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-white/40 font-[family-name:var(--font-inter)]">
                  Estrazione tra:
                </span>
                <span className={`text-xs font-bold tabular-nums ${contest.isLive ? "text-red-400" : "text-amber-400"}`}>
                  {time.days > 0
                    ? `${time.days}g ${String(time.hours).padStart(2, "0")}h`
                    : `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`}
                </span>
              </div>

              {/* My ticket numbers */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/25 uppercase tracking-wider">N°:</span>
                <div className="flex flex-wrap gap-1.5">
                  {contest.myTickets.map((num) => (
                    <motion.div
                      key={num}
                      whileHover={{ scale: 1.1, y: -1 }}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold cursor-default"
                    >
                      #{num}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom detail link */}
      <div className="px-5 sm:px-6 pb-4">
        <div className="h-px bg-white/[0.04] mb-3" />
        <a
          href={`/concorsi/${contest.contestId}`}
          className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1 w-fit"
        >
          Vai al concorso
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

function HistoryEntry({ entry, index }: { entry: (typeof mockHistory)[0]; index: number }) {
  const isFirst = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 ${
            entry.won
              ? "bg-gradient-to-br from-amber-500 to-amber-600 glow-gold"
              : "bg-white/5 border border-white/10"
          }`}
        >
          {entry.won ? (
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        {/* Vertical line */}
        {index < mockHistory.length - 1 && (
          <div className="w-px flex-1 mt-1 bg-gradient-to-b from-white/10 to-transparent min-h-[24px]" />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 glass mb-4 overflow-hidden ${
          entry.won ? "border-amber-500/25" : ""
        }`}
      >
        {entry.won && (
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        )}

        {/* Win celebration header */}
        {entry.won && (
          <div className="px-4 pt-3 pb-2 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="text-lg"
            >
              🏆
            </motion.span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Hai vinto questo concorso!
            </span>
          </div>
        )}

        <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Image thumb */}
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
            <img src={entry.contestImage} alt={entry.contestTitle} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm truncate">{entry.contestTitle}</h3>
              {entry.won && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  VINTO
                </span>
              )}
            </div>
            <p className="text-xs text-white/35 mt-0.5 font-[family-name:var(--font-inter)]">
              {entry.date} · Premio: €{entry.prizeValue.toLocaleString("it-IT")}
            </p>
          </div>

          {/* Tickets + result */}
          <div className="shrink-0 text-right">
            <div className="flex flex-wrap gap-1.5 justify-end mb-1">
              {entry.myTickets.map((num) => (
                <span
                  key={num}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    num === entry.winningNumber
                      ? "bg-amber-500 text-black glow-gold"
                      : "bg-white/5 text-white/25"
                  }`}
                >
                  #{num}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-white/20 font-[family-name:var(--font-inter)]">
              Vincente: #{entry.winningNumber}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Toggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
        on ? "bg-amber-500" : "bg-white/10"
      }`}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${on ? "bg-black" : "bg-white/50"}`}
        animate={{ left: on ? "calc(100% - 22px)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfiloPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tickets");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "tickets", label: "I Miei Ticket", count: mockActiveTickets.length },
    { id: "history", label: "Storico", count: mockHistory.length },
    { id: "settings", label: "Impostazioni" },
  ];

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f]" />
      <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-amber-500/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/4 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/3 rounded-full blur-[200px] pointer-events-none" />
      <FloatingParticles />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm group-hover:glow-gold transition-all duration-300">
            CP
          </div>
          <span className="text-base font-bold text-gradient-gold hidden sm:block">
            Concorsi Premium
          </span>
        </a>
        <a
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </a>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">

        {/* ── Profile Hero ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass relative overflow-hidden mb-5"
        >
          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-2xl bg-[#12121f] flex items-center justify-center text-3xl sm:text-4xl font-bold text-gradient-gold">
                    {initials}
                  </div>
                </div>
                {mockUser.wins > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm glow-gold"
                  >
                    🏆
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                >
                  {mockUser.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-white/40 mt-1 font-[family-name:var(--font-inter)]"
                >
                  {mockUser.email}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 justify-center sm:justify-start mt-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px #34d399" }} />
                  <span className="text-xs text-white/30 font-[family-name:var(--font-inter)]">
                    Membro dal {mockUser.joinedAt}
                  </span>
                </motion.div>
              </div>

              {/* Right panel: luck meter + countdown + logout */}
              <div className="flex flex-row sm:flex-col items-center justify-center gap-6 sm:gap-4">
                <LuckyScoreMeter score={mockUser.luckyScore} />
                {mockActiveTickets.length > 0 && (
                  <div className="hidden sm:block">
                    <NearestCountdown tickets={mockActiveTickets} />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile countdown */}
            {mockActiveTickets.length > 0 && (
              <div className="mt-5 pt-5 border-t border-white/5 flex justify-center sm:hidden">
                <NearestCountdown tickets={mockActiveTickets} />
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Stats Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard
            value={mockUser.totalTickets}
            label="Ticket acquistati"
            delay={0.1}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            }
          />
          <StatCard
            value={mockUser.totalSpent}
            label="Totale investito"
            prefix="€"
            delay={0.15}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            value={mockActiveTickets.length}
            label="Concorsi attivi"
            delay={0.2}
            highlight
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            }
          />
          <StatCard
            value={mockUser.potentialWinnings}
            label="Vincita potenziale"
            prefix="€"
            delay={0.25}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            }
          />
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          {/* Tab bar */}
          <div className="flex gap-1 p-1 glass mb-5 w-fit relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                {/* Active pill */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    style={{ boxShadow: "0 0 16px rgba(245,158,11,0.35)" }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`relative z-10 px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === tab.id
                        ? "bg-black/20 text-black/80"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <AnimatePresence mode="wait">
            {/* ── Tickets Tab ── */}
            {activeTab === "tickets" && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {mockActiveTickets.length > 0 ? (
                  mockActiveTickets.map((contest, i) => (
                    <ActiveTicketCard key={contest.contestId} contest={contest} index={i} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-16 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-5xl mb-5"
                    >
                      🎫
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">Nessun ticket attivo</h3>
                    <p className="text-white/35 text-sm mb-6 font-[family-name:var(--font-inter)] max-w-xs mx-auto">
                      Non hai ancora partecipato a nessun concorso. Inizia ora e tenta la fortuna!
                    </p>
                    <motion.a
                      href="/concorsi"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm glow-gold hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                      Esplora i Concorsi
                    </motion.a>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── History Tab ── */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {mockHistory.length > 0 ? (
                  <div className="mt-1">
                    {mockHistory.map((entry, i) => (
                      <HistoryEntry key={entry.contestId} entry={entry} index={i} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-16 text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-5xl mb-5"
                    >
                      ⏳
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">Nessuna estrazione completata</h3>
                    <p className="text-white/35 text-sm font-[family-name:var(--font-inter)] max-w-xs mx-auto">
                      Le estrazioni dei concorsi a cui partecipi appariranno qui.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Settings Tab ── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Profile section */}
                <div className="glass p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-base">Profilo</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-white/35 uppercase tracking-wider mb-2">Nome</label>
                      <input
                        type="text"
                        defaultValue={mockUser.name}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all duration-200 font-[family-name:var(--font-inter)] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/35 uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={mockUser.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/25 cursor-not-allowed font-[family-name:var(--font-inter)] text-sm"
                      />
                      <p className="text-xs text-white/20 mt-1.5 font-[family-name:var(--font-inter)]">
                        Gestita tramite Google. Non modificabile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notifications section */}
                <div className="glass p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-base">Notifiche</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Estrazione in partenza",
                        desc: "Email quando un concorso a cui partecipi sta per estrarre",
                        default: true,
                      },
                      {
                        label: "Risultati estrazione",
                        desc: "Ricevi il risultato dell'estrazione via email",
                        default: true,
                      },
                      {
                        label: "Nuovi concorsi",
                        desc: "Notifica quando vengono pubblicati nuovi concorsi",
                        default: false,
                      },
                    ].map((pref) => (
                      <div
                        key={pref.label}
                        className="flex items-start justify-between gap-4 p-3.5 rounded-xl hover:bg-white/[0.025] transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-medium group-hover:text-white/90 transition-colors">
                            {pref.label}
                          </div>
                          <div className="text-xs text-white/25 mt-0.5 font-[family-name:var(--font-inter)] leading-snug">
                            {pref.desc}
                          </div>
                        </div>
                        <Toggle defaultChecked={pref.default} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save + danger zone */}
                <div className="glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-red-400/80 mb-1">Zona pericolosa</h3>
                    <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors underline underline-offset-2 font-[family-name:var(--font-inter)]">
                      Elimina account
                    </button>
                    <p className="text-[11px] text-white/15 mt-1 font-[family-name:var(--font-inter)]">
                      Azione irreversibile.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm glow-gold hover:from-amber-400 hover:to-amber-500 transition-all whitespace-nowrap"
                  >
                    Salva modifiche
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
