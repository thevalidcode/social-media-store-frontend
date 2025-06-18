"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeSchema = {
  ":root": Record<string, string>;
  ".dark"?: Record<string, string>;
};

type ThemeContextType = {
  applyTheme: (schema: ThemeSchema) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme CSS variables to override global.css
const applyThemeStyles = (schema: ThemeSchema, isDark: boolean) => {
  if (typeof window === "undefined") return;

  const styleElement = document.createElement("style");
  styleElement.id = "theme-styles";

  // Remove existing theme styles
  const existingStyle = document.getElementById("theme-styles");
  if (existingStyle) existingStyle.remove();

  // Generate CSS for light and dark modes
  let css = `:root {\n`;
  Object.entries(schema[":root"]).forEach(([key, value]) => {
    css += `  ${key}: ${value};\n`;
  });
  css += `}\n`;

  if (schema[".dark"] && isDark) {
    css += `.dark {\n`;
    Object.entries(schema[".dark"]).forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
    css += `}\n`;
  }

  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};

// Load saved theme from localStorage
const loadSavedTheme = () => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("selectedTheme");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading theme from localStorage", e);
  }
  return null;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (schema: ThemeSchema) => {
    applyThemeStyles(schema, isDark);
  };

  // Handle dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkMode =
            document.documentElement.classList.contains("dark");
          setIsDark(isDarkMode);
          const savedTheme = loadSavedTheme();
          if (savedTheme?.schema) {
            applyThemeStyles(savedTheme.schema, isDarkMode);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Load initial theme
  useEffect(() => {
    const savedTheme = loadSavedTheme();
    if (savedTheme?.schema) {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
      applyThemeStyles(savedTheme.schema, isDarkMode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ applyTheme }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
