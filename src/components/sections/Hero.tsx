"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const FloatingScene = dynamic(() => import("@/components/3d/FloatingScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]" />
  ),
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />

      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />

      {/* 3D Scene */}
      <FloatingScene />

      {/* Content — pointer-events-none so 3D objects are grabbable through text */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/70">3 concorsi attivi ora</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
        >
          Vinci{" "}
          <span className="text-gradient-gold">Premi</span>
          <br />
          Straordinari
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-[family-name:var(--font-inter)]"
        >
          Acquista ticket numerati, segui l&apos;estrazione live in 3D e scopri
          se sei il vincitore. Viaggi, prodotti e esperienze da sogno.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/concorsi"
            className="pointer-events-auto group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 glow-gold"
          >
            Scopri i Concorsi
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </a>
          <a
            href="#come-funziona"
            className="pointer-events-auto px-8 py-4 rounded-2xl glass text-white/80 hover:text-white font-semibold text-lg transition-all duration-300 hover:bg-white/10"
          >
            Come Funziona
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
        >
          {[
            { value: "50K+", label: "Premi Assegnati" },
            { value: "12K+", label: "Partecipanti" },
            { value: "100%", label: "Trasparente" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/40 mt-1 font-[family-name:var(--font-inter)]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
    </section>
  );
}
