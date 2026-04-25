"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { adminTheme } from "@/app/_docs/doc";
import { useAppContext } from "@/context/appContext";
import { createContext, useContext, useEffect, useState } from "react";
import { useGetStoreDesign, useUpdateStoreDesign } from "@/hooks/use-store";

type ThemeSchema = {
  ":root": Record<string, string>;
  ".dark"?: Record<string, string>;
};

type ThemeOption = {
  name: string;
  hex: string;
  schema: ThemeSchema;
};

type ThemeContextType = {
  applyTheme: (schema: ThemeOption) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = adminTheme[0];

const getThemeStorageKey = (scope: string | number | null | undefined) =>
  scope ? `selectedTheme:${scope}` : "selectedTheme";

// Apply CSS variables
const applyThemeStyles = (schema: ThemeSchema, isDark: boolean) => {
  if (typeof window === "undefined") return;

  const styleElement = document.createElement("style");
  styleElement.id = "theme-styles";

  const existing = document.getElementById("theme-styles");
  if (existing) existing.remove();

  let css = `:root {\n`;
  Object.entries(schema[":root"]).forEach(([k, v]) => {
    css += `  ${k}: ${v};\n`;
  });
  css += `}\n`;

  if (schema[".dark"] && isDark) {
    css += `.dark {\n`;
    Object.entries(schema[".dark"]).forEach(([k, v]) => {
      css += `  ${k}: ${v};\n`;
    });
    css += `}\n`;
  }

  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};

const loadLocalTheme = (storageKey: string) => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const { storeId, domain } = useAppContext();
  const { data: dbTheme } = useGetStoreDesign();
  const updateThemeMutation = useUpdateStoreDesign();
  const storageKey = getThemeStorageKey(storeId ?? domain);

  // MAIN apply function
  const applyTheme = async (theme: ThemeOption) => {
    applyThemeStyles(theme.schema, isDark);

    const savedTheme = await updateThemeMutation.mutateAsync({ ...theme });
    localStorage.setItem(storageKey, JSON.stringify(savedTheme ?? theme));
  };

  // Watch dark/light changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);

      const saved = loadLocalTheme(storageKey);
      if (saved?.schema) {
        applyThemeStyles(saved.schema, darkMode);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Initial load: DB first, then scoped localStorage, then black fallback
  useEffect(() => {
    if (!storeId && !domain) return;

    const saved = loadLocalTheme(storageKey);
    const darkMode = document.documentElement.classList.contains("dark");

    setIsDark(darkMode);

    if (dbTheme?.schema) {
      applyThemeStyles(dbTheme.schema, darkMode);
      localStorage.setItem(storageKey, JSON.stringify({ ...dbTheme }));
      return;
    }

    if (saved?.schema) {
      applyThemeStyles(saved.schema, darkMode);
      localStorage.setItem(storageKey, JSON.stringify(saved));
      return;
    }

    applyThemeStyles(defaultTheme.schema, darkMode);
    localStorage.setItem(storageKey, JSON.stringify({ ...defaultTheme }));
  }, [dbTheme, domain, storageKey, storeId]);

  return (
    <ThemeContext.Provider value={{ applyTheme }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};
