"use client";

import { createContext, useContext } from "react";

interface AppContextType {
  apiUrl: string;
}

const domain = "localhost:3000";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "https://validpanel.com:6060"
    : `https://${domain}:6060`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppContext.Provider value={{ apiUrl: API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

// custom hook to access the hook safely
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
