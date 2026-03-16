"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Concorsi", href: "/concorsi" },
  { label: "Come Funziona", href: "#come-funziona" },
  { label: "Estrazioni Live", href: "/estrazioni" },
];

function getInitials(user: User): string {
  const fullName: string | undefined =
    user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (fullName) {
    return fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (user.email?.[0] ?? "U").toUpperCase();
}

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLogoutLoading(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass mt-4 px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
              CP
            </div>
            <span className="text-lg font-bold text-gradient-gold hidden sm:block">
              Concorsi Premium
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA — auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : user ? (
              <>
                <a
                  href="/profilo"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-xs">
                    {getInitials(user)}
                  </div>
                  Il Mio Profilo
                </a>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:text-white hover:border-white/25 transition-all duration-200 disabled:opacity-40"
                >
                  {logoutLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  ) : (
                    "Esci"
                  )}
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Accedi
                </a>
                <a
                  href="/auth/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold"
                >
                  Registrati
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass mt-2 p-4 md:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-white/70 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-white/10 flex gap-3 items-center">
                {authLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                ) : user ? (
                  <>
                    <a
                      href="/profilo"
                      className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-xs">
                        {getInitials(user)}
                      </div>
                      Il Mio Profilo
                    </a>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="ml-auto text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-40"
                    >
                      Esci
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/auth/login" className="text-sm text-white/70 hover:text-white" onClick={() => setMobileOpen(false)}>
                      Accedi
                    </a>
                    <a
                      href="/auth/login"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Registrati
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
