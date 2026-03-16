"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

interface FormState {
  nome: string;
  email: string;
  oggetto: string;
  messaggio: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  oggetto?: string;
  messaggio?: string;
}

const contactCards = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email",
    value: "supporto@concorsipremium.it",
    description: "Risposta entro 24 ore lavorative",
    href: "mailto:supporto@concorsipremium.it",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Chat Live",
    value: "Chat disponibile in app",
    description: "Supporto in tempo reale",
    href: "#",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Orari di Supporto",
    value: "Lun – Ven: 9:00 – 18:00",
    description: "Sabato: 10:00 – 14:00",
    href: null,
  },
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.nome.trim()) errors.nome = "Il nome è obbligatorio";
  if (!form.email.trim()) {
    errors.email = "L'email è obbligatoria";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Inserisci un indirizzo email valido";
  }
  if (!form.oggetto.trim()) errors.oggetto = "L'oggetto è obbligatorio";
  if (!form.messaggio.trim()) {
    errors.messaggio = "Il messaggio è obbligatorio";
  } else if (form.messaggio.trim().length < 20) {
    errors.messaggio = "Il messaggio deve contenere almeno 20 caratteri";
  }
  return errors;
}

export default function ContattiPage() {
  const [form, setForm] = useState<FormState>({ nome: "", email: "", oggetto: "", messaggio: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-[500px] h-[500px] bg-purple-500/4 rounded-full blur-[180px] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Contatta il{" "}
              <span className="text-gradient-gold">Supporto</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
              Il nostro team è a disposizione per rispondere a ogni tua domanda.
              Siamo qui per aiutarti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="font-bold text-white/80 mb-1">{card.title}</h3>
                {card.href ? (
                  <a
                    href={card.href}
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors font-[family-name:var(--font-inter)] block"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-white/60 font-[family-name:var(--font-inter)]">{card.value}</p>
                )}
                <p className="text-sm text-white/30 mt-1 font-[family-name:var(--font-inter)]">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass p-8 md:p-10"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Messaggio Inviato!</h2>
                <p className="text-white/50 font-[family-name:var(--font-inter)] mb-8">
                  Grazie per averci contattato. Ti risponderemo entro 24 ore lavorative all&apos;indirizzo <span className="text-amber-400">{form.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ nome: "", email: "", oggetto: "", messaggio: "" });
                  }}
                  className="px-6 py-3 rounded-xl glass text-white/70 hover:text-white transition-colors font-semibold"
                >
                  Invia un altro messaggio
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Invia un Messaggio</h2>
                <p className="text-white/40 font-[family-name:var(--font-inter)] mb-8">
                  Compila il modulo e ti risponderemo al più presto.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div>
                      <label htmlFor="nome" className="block text-sm font-semibold text-white/60 mb-2">
                        Nome e Cognome <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="nome"
                        type="text"
                        value={form.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        placeholder="Mario Rossi"
                        aria-describedby={errors.nome ? "nome-error" : undefined}
                        aria-invalid={!!errors.nome}
                        className={`w-full glass px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-colors font-[family-name:var(--font-inter)] ${
                          errors.nome ? "border-red-500/50" : "focus:border-amber-500/30"
                        }`}
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      />
                      {errors.nome && (
                        <p id="nome-error" role="alert" className="mt-1.5 text-xs text-red-400 font-[family-name:var(--font-inter)]">
                          {errors.nome}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white/60 mb-2">
                        Email <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="mario@esempio.it"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        aria-invalid={!!errors.email}
                        className={`w-full glass px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-colors font-[family-name:var(--font-inter)] ${
                          errors.email ? "border-red-500/50" : "focus:border-amber-500/30"
                        }`}
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400 font-[family-name:var(--font-inter)]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Oggetto */}
                  <div>
                    <label htmlFor="oggetto" className="block text-sm font-semibold text-white/60 mb-2">
                      Oggetto <span className="text-amber-500">*</span>
                    </label>
                    <input
                      id="oggetto"
                      type="text"
                      value={form.oggetto}
                      onChange={(e) => handleChange("oggetto", e.target.value)}
                      placeholder="Di cosa hai bisogno?"
                      aria-describedby={errors.oggetto ? "oggetto-error" : undefined}
                      aria-invalid={!!errors.oggetto}
                      className={`w-full glass px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-colors font-[family-name:var(--font-inter)] ${
                        errors.oggetto ? "border-red-500/50" : "focus:border-amber-500/30"
                      }`}
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                    {errors.oggetto && (
                      <p id="oggetto-error" role="alert" className="mt-1.5 text-xs text-red-400 font-[family-name:var(--font-inter)]">
                        {errors.oggetto}
                      </p>
                    )}
                  </div>

                  {/* Messaggio */}
                  <div>
                    <label htmlFor="messaggio" className="block text-sm font-semibold text-white/60 mb-2">
                      Messaggio <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="messaggio"
                      value={form.messaggio}
                      onChange={(e) => handleChange("messaggio", e.target.value)}
                      placeholder="Descrivi la tua richiesta nel dettaglio..."
                      rows={6}
                      aria-describedby={errors.messaggio ? "messaggio-error" : undefined}
                      aria-invalid={!!errors.messaggio}
                      className={`w-full glass px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-colors font-[family-name:var(--font-inter)] resize-none ${
                        errors.messaggio ? "border-red-500/50" : "focus:border-amber-500/30"
                      }`}
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                    <div className="flex items-start justify-between mt-1.5">
                      {errors.messaggio ? (
                        <p id="messaggio-error" role="alert" className="text-xs text-red-400 font-[family-name:var(--font-inter)]">
                          {errors.messaggio}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-white/20 font-[family-name:var(--font-inter)]">
                        {form.messaggio.length} / 1000
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    aria-label={submitting ? "Invio in corso..." : "Invia messaggio"}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200 glow-gold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 0116 0" />
                        </svg>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        Invia Messaggio
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
