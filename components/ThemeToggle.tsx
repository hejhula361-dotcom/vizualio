"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-charcoal/70 backdrop-blur-lg transition hover:border-champagne/60 dark:border-white/10 dark:bg-charcoal/70 dark:hover:border-champagne/60 border-light-border bg-light-card hover:border-light-accent"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-champagne" />
        ) : (
          <Sun className="h-5 w-5 text-light-accent" />
        )}
      </motion.div>
    </motion.button>
  );
}

