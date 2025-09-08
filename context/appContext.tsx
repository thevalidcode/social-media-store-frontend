"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useState, useMemo } from "react";

interface UserProps {
  id?: number;
  role?: string;
  username?: string;
  email?: string;
  status?: string;
  timeStamp: string;
  api_key?: string;
  last_seen?: string;
  image?: string;
  storeId?: number;
  uid?: string;
}

interface AppContextType {
  api: AxiosInstance;
  domain: string;
  userInfo: UserProps | null;
  setUserInfo: (user: UserProps | null) => void; // Allow setting to null for logout
  storeId: number | null;
  setStoreId: (storeId: number) => void;
  isLoading: boolean;
  error: Error | null;
}

const getDomain = () => {
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
    ? "https://validpanel.com/social-media-store/backend/api/v1"
    : `https://${domain}/social-media-store/backend/api/v1`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [storeId, setStoreId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const storedStoreId = localStorage.getItem("storeId");
    const parsedId =
      storedStoreId && !isNaN(parseInt(storedStoreId, 10))
        ? parseInt(storedStoreId, 10)
        : null;
    if (storedStoreId && !parsedId) {
      localStorage.removeItem("storeId");
    }
    return parsedId;
  });

  const [userInfo, setUserInfo] = useState<UserProps | null>(null);

  const handleSetStoreId = (storeId: number) => {
    setStoreId(storeId);
    if (typeof window !== "undefined") {
      localStorage.setItem("storeId", storeId.toString());
    }
  };

  const handleSetUserInfo = (user: UserProps | null) => {
    // Update user info in both state and localStorage.
    setUserInfo(user);
  };

  // Memoize the api instance to avoid re-creating it on every render.
  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }),
    []
  );

  const { error, isLoading } = useQuery({
    queryKey: ["storeId", domain],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/stores/data?domain=${domain}`);
      if (!res.data || !res.data.storeId) {
        throw new Error("No storeId found for this domain");
      }
      const { storeId } = res.data;
      handleSetStoreId(storeId);
      return storeId;
    },
    enabled: typeof window !== "undefined" && storeId === null,
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        userInfo,
        storeId,
        api,
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
