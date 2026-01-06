"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LeadInput = {
  idea: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message?: string;
};

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
};

type LeadContextValue = {
  leads: Lead[];
  addLead: (lead: LeadInput) => Lead;
  getLeadById: (id: string) => Lead | undefined;
};

const LeadContext = createContext<LeadContextValue | undefined>(undefined);

const STORAGE_KEY = "vizualio_leads";

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Lead[];
        setLeads(parsed);
      } catch (error) {
        console.error("Chyba při čtení uložených poptávek", error);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads, hydrated]);

  const addLead = (input: LeadInput): Lead => {
    const lead: Lead = {
      ...input,
      id: crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLeads((prev) => [lead, ...prev]);
    return lead;
  };

  const getLeadById = (id: string) => leads.find((lead) => lead.id === id);

  const value = useMemo(() => ({ leads, addLead, getLeadById }), [leads]);

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads musí být použit uvnitř LeadProvideru");
  }
  return context;
};




