"use client";

import { useMemo, useState, useEffect } from "react";
import { useLeads } from "@/app/context/LeadContext";
import { motion } from "framer-motion";
import { Inbox, LayoutDashboard, Reply, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "vizualio2025";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { leads } = useLeads();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const selected = useMemo(() => leads.find((l) => l.id === selectedId), [leads, selectedId]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_remember");
      if (saved === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem("admin_remember", "true");
      }
    } else {
      alert("Nesprávné přihlašovací údaje");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-carbon">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-charcoal/80 p-8 backdrop-blur-lg"
        >
          <h1 className="mb-6 text-2xl font-semibold text-offwhite">Vizualio Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-offwhite/90">Uživatelské jméno</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-offwhite/90">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-offwhite placeholder:text-stone focus:border-champagne/60 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-obsidian/60 text-champagne focus:ring-champagne"
              />
              <label htmlFor="remember" className="text-sm text-stone">
                Zapamatovat si mě
              </label>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-full bg-champagne px-5 py-3 text-sm font-semibold text-carbon shadow-glow transition hover:bg-amber"
            >
              Přihlásit se
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-[260px,1fr] bg-carbon">
      <aside className="border-r border-white/10 bg-charcoal/80 backdrop-blur-lg">
        <div className="p-6">
          <h1 className="text-lg font-semibold text-offwhite">Vizualio Admin</h1>
          <p className="text-sm text-stone mt-1">Přehled poptávek</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {[
            { icon: LayoutDashboard, label: "Přehled" },
            { icon: Inbox, label: "Poptávky" }
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-offwhite/80 transition hover:bg-white/5"
            >
              <item.icon className="h-4 w-4 text-champagne" />
              {item.label}
            </div>
          ))}
        </nav>
      </aside>
      <main className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-offwhite">Poptávky</h2>
            <p className="text-sm text-stone">Seznam odeslaných formulářů</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone">
            {leads.length} záznamů
          </span>
        </div>

        <div className="mt-6">
          <div className="rounded-2xl border border-white/10 bg-charcoal/70 backdrop-blur-lg">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone">
              <span>Poptávky</span>
              <Clock3 className="h-4 w-4 text-champagne" />
            </div>
            <div className="divide-y divide-white/5">
              {leads.length === 0 && (
                <p className="p-6 text-sm text-stone">
                  Zatím žádné poptávky. Vyplňte formulář na webu a data se uloží sem.
                </p>
              )}
              {leads.map((lead) => {
                const isExpanded = expandedIds.has(lead.id);
                return (
                  <div key={lead.id}>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      onClick={() => toggleExpand(lead.id)}
                      className="w-full text-left px-4 py-3 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-offwhite">{lead.name}</p>
                          <p className="text-xs text-stone">{lead.email}</p>
                        </div>
                        <p className="text-xs text-stone">
                          {new Date(lead.createdAt).toLocaleDateString("cs-CZ")}
                        </p>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-offwhite/80">{lead.idea}</p>
                    </motion.button>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-obsidian/40"
                      >
                        <div className="space-y-3 p-5 text-sm text-offwhite/90">
                          <div>
                            <p className="text-stone text-xs uppercase tracking-[0.2em]">Klient</p>
                            <p className="text-offwhite font-semibold">{lead.name}</p>
                            <p className="text-stone">{lead.email}</p>
                            {lead.phone && <p className="text-stone">{lead.phone}</p>}
                          </div>
                          <div>
                            <p className="text-stone text-xs uppercase tracking-[0.2em]">Projekt</p>
                            <p className="text-offwhite/90">{lead.projectType || "Neuvedeno"}</p>
                          </div>
                          <div>
                            <p className="text-stone text-xs uppercase tracking-[0.2em]">Myšlenka</p>
                            <p className="text-offwhite/90 whitespace-pre-line">{lead.idea}</p>
                          </div>
                          {lead.message && (
                            <div>
                              <p className="text-stone text-xs uppercase tracking-[0.2em]">Detaily</p>
                              <p className="text-offwhite/90 whitespace-pre-line">{lead.message}</p>
                            </div>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-xs font-semibold text-carbon shadow-glow transition hover:bg-amber"
                          >
                            <Reply className="h-4 w-4" />
                            Odpovědět (mock)
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


