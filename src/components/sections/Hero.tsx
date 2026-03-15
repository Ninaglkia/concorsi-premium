"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const FloatingScene = dynamic(() => import("@/components/3d/FloatingScene"), {
  ssr: false,
});

export default function Hero() {
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => {
    // Small delay to ensure first frame is painted
    requestAnimationFrame(() => {
      setReady(true);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient — always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]" />

      {/* Loading spinner while 3D loads */}
      {!ready && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-white/30 text-sm font-[family-name:var(--font-inter)]">
              Caricamento...
            </span>
          </div>
        </div>
      )}

      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />

      {/* 3D Scene */}
      <FloatingScene onReady={handleReady} />

      {/* Content — fades in together with 3D */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/70">3 concorsi attivi ora</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
          Vinci{" "}
          <span className="text-gradient-gold">Premi</span>
          <br />
          Straordinari
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
          Acquista ticket numerati, segui l&apos;estrazione live in 3D e scopri
          se sei il vincitore. Viaggi, prodotti e esperienze da sogno.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
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
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
    </section>
  );
}
