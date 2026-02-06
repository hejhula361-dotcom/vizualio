"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const DEFAULT_COLOR = "#C6A67C";

type SectionColorContextValue = {
  activeColor: string | null;
  setActiveColor: (color: string | null) => void;
  displayColor: string;
};

const SectionColorContext = createContext<SectionColorContextValue | null>(null);

export function SectionColorProvider({ children }: { children: ReactNode }) {
  const [activeColor, setActiveColorState] = useState<string | null>(null);
  const setActiveColor = useCallback((color: string | null) => {
    setActiveColorState(color);
  }, []);
  const displayColor = activeColor ?? DEFAULT_COLOR;

  return (
    <SectionColorContext.Provider value={{ activeColor, setActiveColor, displayColor }}>
      {children}
    </SectionColorContext.Provider>
  );
}

export function useSectionColor() {
  const ctx = useContext(SectionColorContext);
  return ctx ?? { activeColor: null, setActiveColor: () => {}, displayColor: DEFAULT_COLOR };
}
