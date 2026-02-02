"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ClientLoginClient({ from }: { from: string }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl: from
      });
      if (!res || res.error) {
        setError("Nesprávné přihlašovací údaje.");
        return;
      }
      router.push(res.url ?? from);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-charcoal/80 p-8 backdrop-blur-lg"
      >
        <h1 className="mb-2 text-2xl font-semibold text-offwhite">Klientský portál</h1>
        <p className="mb-6 text-sm text-stone">Přihlaste se údaji, které vám přišly od Vizualio.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-offwhite/90">Uživatelské jméno</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="např. klient-123"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-offwhite/90">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "Přihlašuji…" : "Přihlásit se"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

