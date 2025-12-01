"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import Cookies from "js-cookie";
import { get, set } from "idb-keyval";
import { CurrencyCode } from "@/lib/currencyConverter";
import { Admin, User } from "@/types";

interface GeneralSettingProps {
  storeName: string;
  logoUrl: string;
  storeDescription: string;
  showBanner: boolean;
  storeId: number;
  faviconUrl: string;
  defaultClientCurrency: string;
}

interface CurrencyRates {
  [key: string]: number;
}

interface AppContextType {
  api: AxiosInstance;
  generalSetting: GeneralSettingProps | null;
  isStoreGeneralSettingsLoading: boolean;
  domain: string;
  userInfo: User | null;
  adminInfo: Admin | null;
  setUserInfo: (user: User | null) => void; // Allow setting to null for logout
  setAdminInfo: (user: Admin | null) => void; // Allow setting to null for logout
  storeId: number | null;
  setStoreId: (storeId: number) => void;
  isLoading: boolean;
  isRatesLoading: boolean;
  isAuthLoading: boolean;
  rates?: CurrencyRates;
  userCurrency: CurrencyCode;
  setUserCurrency: (currency: string) => void;
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
    ? "/api" // ← local proxy path
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

  const handleSetStoreId = (storeId: number) => {
    setStoreId(storeId);
    if (typeof window !== "undefined") {
      localStorage.setItem("storeId", storeId.toString());
    }
  };

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [rates, setRates] = useState<CurrencyRates | {}>();
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userCurrency, setUserCurrencyState] = useState<CurrencyCode>("USD");
  const [generalSetting, setGeneralSetting] =
    useState<GeneralSettingProps | null>(null);

  // Load user from IndexedDB on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await get<User | null>("userInfo");
        if (storedUser) setUserInfo(storedUser);
        const storedAdmin = await get<Admin | null>("adminInfo");
        if (storedAdmin) setAdminInfo(storedAdmin);
      } catch (err) {
        console.error("Failed to load user info from IndexedDB:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    const saveAuthInfo = async () => {
      try {
        if (userInfo !== null) await set("userInfo", userInfo);
        if (adminInfo !== null) await set("adminInfo", adminInfo);
      } catch (err) {
        console.error("Failed to save auth info:", err);
      }
    };
    saveAuthInfo();
  }, [userInfo, adminInfo]);

  // Ensure it syncs with localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency) {
      const upperCurrency = savedCurrency.toUpperCase() as CurrencyCode;
      setUserCurrencyState(upperCurrency);
    } else {
      localStorage.setItem("userCurrency", "USD");
      setUserCurrencyState("USD");
    }
  }, []);

  // Wrap setter to automatically persist and normalize to uppercase
  const setUserCurrency = (currency: string) => {
    const upper = currency.toUpperCase();
    setUserCurrencyState(upper as CurrencyCode);
    localStorage.setItem("userCurrency", upper);
  };

  const handleSetUserInfo = async (user: User | null) => {
    // Update state
    setUserInfo(user);
  };

  const handleSetAdminInfo = async (admin: Admin | null) => {
    // Update state
    setAdminInfo(admin);
  };

  // Memoize the api instance to avoid re-creating it on every render.
  const api = useMemo(() => {
    const newAxios = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor → attach CSRF token
    newAxios.interceptors.request.use((config) => {
      const csrfToken = Cookies.get("csrf_token");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
      return config;
    });

    // Response interceptor → refresh CSRF token if server sends a new one
    newAxios.interceptors.response.use((response) => {
      const newToken = response.headers["x-csrf-token"];
      if (newToken) {
        Cookies.set("csrf_token", newToken);
      }
      return response;
    });

    return newAxios; // ✅ return it so api is usable
  }, [API_URL]);

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

  const { isLoading: isStoreGeneralSettingsLoading } = useQuery({
    queryKey: ["storeSettings", storeId],
    queryFn: async () => {
      const res = await api.get(`/stores/${storeId}/general-data`);
      if (!res.data) {
        throw new Error("No General Settings found for this store");
      }
      setGeneralSetting(res.data);
      return res.data;
    },
  });

  const { isLoading: isRatesLoading } = useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await api.get(`/rates`);
      if (!res.data) {
        throw new Error("No rates data found");
      }
      setRates(res.data.rates as CurrencyRates);
      return res.data;
    },
  });

  return (
    <AppContext.Provider
      value={{
        userInfo,
        adminInfo,
        storeId,
        api,
        setUserInfo: handleSetUserInfo,
        setAdminInfo: handleSetAdminInfo,
        setStoreId: handleSetStoreId,
        isRatesLoading,
        rates,
        domain,
        isLoading,
        generalSetting,
        isStoreGeneralSettingsLoading,
        userCurrency,
        setUserCurrency,
        isAuthLoading,
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
