"use client";

export default function Footer() {
  return (
    <footer className="relative py-16 bg-[#0a0a0f] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
                CP
              </div>
              <span className="text-lg font-bold text-gradient-gold">
                Concorsi Premium
              </span>
            </div>
            <p className="text-sm text-white/40 font-[family-name:var(--font-inter)]">
              La piattaforma di concorsi a premi con estrazione live in 3D.
              Trasparenza e divertimento garantiti.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white/80 mb-4">Piattaforma</h4>
            <ul className="space-y-2 text-sm text-white/40 font-[family-name:var(--font-inter)]">
              <li><a href="/concorsi" className="hover:text-white transition-colors">Concorsi</a></li>
              <li><a href="/estrazioni" className="hover:text-white transition-colors">Estrazioni Live</a></li>
              <li><a href="#come-funziona" className="hover:text-white transition-colors">Come Funziona</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm text-white/40 font-[family-name:var(--font-inter)]">
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contatti" className="hover:text-white transition-colors">Contatti</a></li>
              <li><a href="/regolamento" className="hover:text-white transition-colors">Regolamento</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-4">Legale</h4>
            <ul className="space-y-2 text-sm text-white/40 font-[family-name:var(--font-inter)]">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/termini" className="hover:text-white transition-colors">Termini di Servizio</a></li>
              <li><a href="/cookie" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30 font-[family-name:var(--font-inter)]">
            &copy; {new Date().getFullYear()} Concorsi Premium. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/20">Pagamenti sicuri con</span>
            <span className="text-xs font-bold text-white/40">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
