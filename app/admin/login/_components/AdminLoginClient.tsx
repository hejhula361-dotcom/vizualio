"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export function AdminLoginClient({ from }: { from: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-charcoal/80 p-8 backdrop-blur-lg"
      >
        <h1 className="mb-2 text-2xl font-semibold text-offwhite">Vizualio Admin</h1>
        <p className="mb-6 text-sm text-stone">Přihlášení přes GitHub (pouze povolené e-maily).</p>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => signIn("github", { callbackUrl: from })}
          className="btn-primary w-full"
        >
          Přihlásit se přes GitHub
        </motion.button>

        <p className="mt-6 text-xs text-stone">
          Nemáte přístup? Napište na{" "}
          <a className="text-champagne hover:text-amber" href="mailto:info@vizualio.cz">
            info@vizualio.cz
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}

