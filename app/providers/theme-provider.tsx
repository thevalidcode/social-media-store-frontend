"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
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

const loadLocalTheme = () => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("selectedTheme");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const { data: dbTheme } = useGetStoreDesign();
  const updateThemeMutation = useUpdateStoreDesign();

  // MAIN apply function
  const applyTheme = (theme: ThemeOption) => {
    applyThemeStyles(theme.schema, isDark);

    localStorage.setItem("selectedTheme", JSON.stringify({ ...theme }));

    updateThemeMutation.mutate({ ...theme });
  };

  // Watch dark/light changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);

      const saved = loadLocalTheme();
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

  // Initial load: localStorage first, then DB
  useEffect(() => {
    const saved = loadLocalTheme();
    const darkMode = document.documentElement.classList.contains("dark");

    setIsDark(darkMode);

    if (saved?.schema) {
      applyThemeStyles(saved.schema, darkMode);
      return;
    }

    if (dbTheme?.schema) {
      applyThemeStyles(dbTheme.schema, darkMode);
      localStorage.setItem("selectedTheme", JSON.stringify({ ...dbTheme }));
    }
  }, [dbTheme]);

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
