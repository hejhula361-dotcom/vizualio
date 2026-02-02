"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Inbox, Reply } from "lucide-react";

import { PageHeader } from "@/app/admin/_components/PageHeader";
import { GlassCard, GlassCardHeader, GlassCardBody } from "@/app/admin/_components/GlassCard";
import { EmptyState } from "@/app/admin/_components/EmptyState";

export type InquiryRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  idea: string;
  message: string | null;
};

export function InquiriesClient({ inquiries }: { inquiries: InquiryRow[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Poptávky"
        description="Seznam odeslaných formulářů"
        badge={<>{inquiries.length} záznamů</>}
      />

      <div className="mt-6">
        <GlassCard>
          <GlassCardHeader icon={<Clock3 className="h-4 w-4 text-champagne" />}>Poptávky</GlassCardHeader>
          <GlassCardBody>
            {inquiries.length === 0 && (
              <EmptyState
                icon={Inbox}
                title="Zatím žádné poptávky"
                description="Vyplňte formulář na webu a poptávka se uloží do systému."
              />
            )}

            {inquiries.map((lead) => {
              const isExpanded = expandedIds.has(lead.id);
              return (
                <div key={lead.id} className={isExpanded ? "table-row-expandable" : "table-row"}>
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
                        {new Date(lead.created_at).toLocaleDateString("cs-CZ")}
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
                          <p className="text-offwhite/90">{lead.project_type || "Neuvedeno"}</p>
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

                        <motion.a
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          href={`mailto:${lead.email}`}
                          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs"
                        >
                          <Reply className="h-4 w-4" />
                          Odpovědět e-mailem
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </GlassCardBody>
        </GlassCard>
      </div>
    </div>
  );
}

