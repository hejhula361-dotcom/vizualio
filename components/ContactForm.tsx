"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useLeads } from "@/app/context/LeadContext";

type Step = 1 | 2 | 3;

export default function ContactForm() {
  const { addLead } = useLeads();
  const [step, setStep] = useState<Step>(1);
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => (Math.min(prev + 1, 3) as Step));

  const handleStepOne = (e: FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    nextStep();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    addLead({ idea, name, email, phone, projectType, message });
    setSubmitting(false);
    setStep(3);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone">
        <span className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-champagne" : "bg-stone/40"}`} />
        <span className="ml-2">Krok {step}/3</span>
      </div>

      {step === 1 && (
        <motion.form
          onSubmit={handleStepOne}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <label className="text-sm text-offwhite/90">Co máte na mysli?</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-obsidian/60 p-4 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
            rows={4}
            placeholder={`Popište prostor, účel, rozměry, styl…\nNebo napište: "Chci aby to vypadalo hustě."`}
            required
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-full bg-champagne px-5 py-3 text-center text-sm font-semibold text-carbon shadow-glow transition hover:bg-amber"
          >
            Pokračovat →
          </motion.button>
        </motion.form>
      )}

      {step === 2 && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-offwhite/90">Telefon (volitelné)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="+420 777 000 000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-offwhite/90">Typ projektu</label>
              <input
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="Interiér / kuchyně / homestaging / exteriér / produkt…"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-offwhite/90">Detaily (volitelné)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-obsidian/60 p-4 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
              rows={3}
              placeholder="Počet úhlů, termín, rozpočet…"
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-stone underline-offset-4 hover:text-offwhite hover:underline"
            >
              ← Zpět na myšlenku
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

      {step === 3 && (
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
              setIdea("");
              setName("");
              setEmail("");
              setPhone("");
              setProjectType("");
              setMessage("");
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




