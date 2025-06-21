"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  apiUrl: string;
  domain: string;
  panel_id: string | null;
  setPanelId: (panelId: string) => void;
}

// get domain from window location and make it clean
const currentUrl = window.location.href.replace(/^https?:\/\//, "");

let domain = currentUrl.split("/")[0];
if (domain.startsWith("www.")) {
  domain = domain.slice(4);
}

const API_URL =
  process.env.NODE_ENV === "development"
    ? "https://validpanel.com:6060"
    : `"https://${domain}/sys/api"`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [panel_id, setPanelId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("panel_id") : null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPanelId = localStorage.getItem("panel_id");
      if (storedPanelId) {
        setPanelId(storedPanelId);
      }
    }
  }, []);
  return (
    <AppContext.Provider
      value={{ apiUrl: API_URL, panel_id, setPanelId, domain }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
