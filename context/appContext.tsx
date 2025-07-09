"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

interface UserProps {
  id?: number;
  role?: string;
  username?: string;
  email?: string;
  api_key?: string;
}
interface AppContextType {
  apiUrl: string;
  domain: string;
  userInfo: UserProps | null;
  store_id: number | null;
  setStoreId: (panelId: number) => void;
  isLoading: boolean;
  setUserInfo: (user: UserProps) => void;
  error: Error | null;
}

// Safely get domain on client-side
const getDomain = () => {
  if (typeof window === "undefined") return "";
  const currentUrl = window.location.href.replace(/^https?:\/\//, "");
  let domain = currentUrl.split("/")[0];
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  return domain;
};

const domain = getDomain();
const API_URL =
  process.env.NODE_ENV === "development"
    ? "https://validpanel.com:6060"
    : `https://${domain}/sys/api`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [store_id, setStoreId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const storedStoreId = localStorage.getItem("store_id");
    return storedStoreId && !isNaN(parseInt(storedStoreId, 10))
      ? parseInt(storedStoreId, 10)
      : null;
  });

  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  // Update localStorage when store_id changes
  const handleSetStoreId = (storeId: number) => {
    setStoreId(storeId);
    if (typeof window !== "undefined") {
      localStorage.setItem("store_id", storeId.toString());
    }
  };

  const handleSetUserInfo = (user: UserProps) => {
    setUserInfo(user);
  };
  const { error, isLoading } = useQuery({
    queryKey: ["store_id", domain],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/store/data?domain=${domain}`);
      if (!res.data || !res.data.store_id) {
        throw new Error("No store_id found for this domain");
      }
      const { store_id } = res.data;
      setStoreId(store_id);
      return store_id;
    },
    enabled: typeof window !== "undefined" && store_id === null,
    retry: false,
  });

  // get the role of the user in the AppProvider
  // Always provide the context, even during loading or error states
  return (
    <AppContext.Provider
      value={{
        userInfo,
        apiUrl: API_URL,
        store_id,
        setUserInfo: handleSetUserInfo,
        setStoreId: handleSetStoreId,
        domain,
        isLoading,
        error,
      }}
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
