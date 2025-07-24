"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

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
  store_id?: number;
  uid?: string;
}

interface AppContextType {
  api: AxiosInstance;
  domain: string;
  userInfo: UserProps | null;
  setUserInfo: (user: UserProps | null) => void; // Allow setting to null for logout
  store_id: number | null;
  setStoreId: (panelId: number) => void;
  isLoading: boolean;
  isCsrfLoading: boolean;
  error: Error | null;
  csrfError: Error | null;
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
    ? "https://validpanel.com:6060"
    : `https://${domain}/sys/api`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [store_id, setStoreId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const storedStoreId = localStorage.getItem("store_id");
    const parsedId =
      storedStoreId && !isNaN(parseInt(storedStoreId, 10))
        ? parseInt(storedStoreId, 10)
        : null;
    if (storedStoreId && !parsedId) {
      localStorage.removeItem("store_id");
    }
    return parsedId;
  });

  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);

  const handleSetStoreId = (storeId: number) => {
    setStoreId(storeId);
    if (typeof window !== "undefined") {
      localStorage.setItem("store_id", storeId.toString());
    }
  };

  const handleSetCsrfToken = (token: string) => {
    setCsrfToken(token);
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
    [],
  );

  useEffect(() => {
    // Dynamically set the CSRF token on the API instance after it's fetched.
    if (csrfToken) {
      api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }
  }, [csrfToken, api]);

  const { error, isLoading } = useQuery({
    queryKey: ["store_id", domain],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/store/data?domain=${domain}`);
      if (!res.data || !res.data.store_id) {
        throw new Error("No store_id found for this domain");
      }
      const { store_id } = res.data;
      handleSetStoreId(store_id);
      return store_id;
    },
    enabled: typeof window !== "undefined" && store_id === null,
    retry: false,
  });

  const { error: csrfError, isLoading: isCsrfLoading } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/store/csrf-token?domain=${domain}`,
        {
          withCredentials: true,
        },
      );
      if (!res.data || !res.data.csrfToken) {
        throw new Error("No CSRF token found");
      }
      const { csrfToken } = res.data;
      handleSetCsrfToken(csrfToken);
      return csrfToken;
    },
    retry: 3,
  });

  return (
    <AppContext.Provider
      value={{
        userInfo,
        store_id,
        api,
        setUserInfo: handleSetUserInfo,
        setStoreId: handleSetStoreId,
        domain,
        isLoading,
        isCsrfLoading,
        error,
        csrfError,
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
