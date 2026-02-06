"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { submitInquiry } from "@/app/actions/inquiries";

const CATEGORIES = [
  { id: "interier", label: "Vizualizace interiéru" },
  { id: "exterier", label: "Vizualizace exteriéru" },
  { id: "pudorysy", label: "Půdorysy 2D/3D" }
] as const;

type Step = 1 | 2 | 3 | 4;

export default function ContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<string>("");
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nextStep = () => setStep((prev) => (Math.min(prev + 1, 4) as Step));
  const prevStep = () => setStep((prev) => (Math.max(prev - 1, 1) as Step));

  const handleStepOne = (e: FormEvent) => {
    e.preventDefault();
    if (!category) return;
    nextStep();
  };

  const handleStepTwo = (e: FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await submitInquiry({
        category: category || null,
        idea: idea.trim() || undefined,
        name,
        email,
        phone: phone.trim(),
        message
      });
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Nepodařilo se odeslat poptávku.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone">
        <span className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className={`h-2 w-2 rounded-full ${step >= 4 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className="ml-2">Krok {step}/4</span>
      </div>

      {/* Krok 1: Kategorie */}
      {step === 1 && (
        <motion.form
          onSubmit={handleStepOne}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <label className="text-sm text-offwhite/90">O jakou službu máte zájem?</label>
          <div className="grid gap-3 sm:grid-cols-1">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCategory(cat.id)}
                className={`rounded-xl border p-4 text-left text-sm font-medium transition ${
                  category === cat.id
                    ? "border-champagne bg-champagne/15 text-offwhite"
                    : "border-white/10 bg-obsidian/60 text-offwhite/90 hover:border-champagne/40"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!category}
            className="w-full rounded-full bg-champagne px-5 py-3 text-center text-sm font-semibold text-carbon shadow-glow transition hover:bg-amber disabled:opacity-50 disabled:hover:bg-champagne"
          >
            Pokračovat →
          </motion.button>
        </motion.form>
      )}

      {/* Krok 2: Co si představujete (popis, volitelné) */}
      {step === 2 && (
        <motion.form
          onSubmit={handleStepTwo}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <label className="text-sm text-offwhite/90">Co si představujete?</label>
          <p className="text-xs text-stone">
            Např. kuchyně, obývák, celý byt… Detaily můžete doplnit později, nebo nic – my se ozveme.
          </p>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-obsidian/60 p-4 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
            rows={4}
            placeholder="Např. chci vizualizaci kuchyně do bytu 2+1, světlý styl…"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={prevStep}
              className="text-sm text-stone underline-offset-4 hover:text-offwhite hover:underline"
            >
              ← Zpět
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-full bg-champagne px-5 py-3 text-sm font-semibold text-carbon shadow-glow transition hover:bg-amber"
            >
              Pokračovat →
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Krok 3: Kontaktní údaje a dodatečné informace */}
      {step === 3 && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <label className="text-sm text-offwhite/90">Kontaktní údaje a dodatečné informace</label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-offwhite/90">Jméno a příjmení</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="Jana Nováková"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-offwhite/90">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="jane@studio.cz"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-offwhite/90">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
              placeholder="+420 777 000 000"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-offwhite/90">Dodatečné informace (volitelné)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-obsidian/60 p-4 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
              rows={3}
              placeholder="Termín, rozpočet, počet pohledů…"
            />
          </div>
          {submitError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </div>
          )}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="text-sm text-stone underline-offset-4 hover:text-offwhite hover:underline"
            >
              ← Zpět na popis
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="rounded-full bg-champagne px-6 py-3 text-sm font-semibold text-carbon shadow-glow transition hover:bg-amber disabled:opacity-70"
            >
              {submitting ? "Odesílám…" : "Odeslat poptávku"}
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Krok 4: Úspěch */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-2xl border border-champagne/40 bg-obsidian/70 p-5 text-sm"
        >
          <p className="text-lg font-semibold text-champagne">Děkujeme! Váš nápad právě míří do 3D.</p>
          <p className="text-offwhite/90">
            Ozveme se co nejdříve s návrhem řešení. Mezitím můžete popřemýšlet, jaký styl židle by vás
            nejvíc vystihoval.
          </p>
          <button
            onClick={() => {
              setCategory("");
              setIdea("");
              setName("");
              setEmail("");
              setPhone("");
              setMessage("");
              setSubmitError(null);
              setStep(1);
            }}
            className="text-champagne underline-offset-4 hover:underline"
          >
            Odeslat další poptávku
          </button>
        </motion.div>
      )}
    </div>
  );
}
