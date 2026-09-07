"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ViewModeContextType {
  isSimpleMode: boolean;
  setIsSimpleMode: (simple: boolean) => void;
  toggleSimpleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  isSimpleMode: true,
  setIsSimpleMode: () => {},
  toggleSimpleMode: () => {},
});

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  // Default to Simple Mode for a calm, distraction-free experience
  const [isSimpleMode, setIsSimpleModeState] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("rankos_simple_mode");
      if (stored !== null) {
        setIsSimpleModeState(stored === "true");
      } else {
        // Simple mode by default
        setIsSimpleModeState(true);
      }
    } catch {
      setIsSimpleModeState(true);
    }
  }, []);

  const setIsSimpleMode = (simple: boolean) => {
    setIsSimpleModeState(simple);
    try {
      localStorage.setItem("rankos_simple_mode", String(simple));
    } catch {
      // ignore
    }
  };

  const toggleSimpleMode = () => {
    setIsSimpleMode(!isSimpleMode);
  };

  return (
    <ViewModeContext.Provider
      value={{
        isSimpleMode: mounted ? isSimpleMode : true,
        setIsSimpleMode,
        toggleSimpleMode,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
