"use client";

import { motion } from "framer-motion";
import { adminTheme } from "@/app/_docs/doc";
import { useThemeContext } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TypographyH2, TypographyH3 } from "@/components/typography";
import { Palette, Sparkles, Eye } from "lucide-react";

// Types
type ThemeSchema = {
  ":root": Record<string, string>;
  ".dark"?: Record<string, string>;
};

type ThemeOption = {
  name: string;
  hex: string;
  schema: ThemeSchema;
};

const brandColors: ThemeOption[] = adminTheme.map((theme) => ({
  name: theme.title,
  hex: theme.hex,
  schema: theme.schema,
}));

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

export default function DesignSettings() {
  const [selectedBrand, setSelectedBrand] = useState<ThemeOption>(
    brandColors[0]
  );

  //   pass the onClose modal after button click to the useContext

  const { theme: colorScheme } = useTheme();
  const { applyTheme } = useThemeContext();

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("selectedTheme");
      if (saved) {
        const parsed: ThemeOption = JSON.parse(saved);
        const theme =
          brandColors.find((t) => t.hex === parsed.hex) || brandColors[0];
        setSelectedBrand(theme);
      }
    } catch (e) {
      console.error("Error loading theme from localStorage", e);
    }
  }, []);

  // Apply theme when color scheme changes
  useEffect(() => {
    if (selectedBrand.schema) {
      const isDark = colorScheme === "dark";
      applyThemeStyles(selectedBrand.schema, isDark);
    }
  }, [colorScheme, selectedBrand.schema]);

  const handleBrandSelect = (theme: ThemeOption) => {
    setSelectedBrand(theme);
  };

  const handleSave = () => {
    applyTheme(selectedBrand);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <TypographyH2 className="text-2xl mb-2">Design & Theme</TypographyH2>
          <p className="text-muted-foreground">
            Customize the visual appearance and branding of your store.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={handleSave}
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          Apply Theme
        </Button>
      </div>

      {/* Brand Color Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Brand Colors
          </TypographyH3>
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium mb-1">Select a Brand Color</h4>
                  <p className="text-xs text-muted-foreground">
                    Choose a color that represents your brand identity
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: selectedBrand.hex }}
                  />
                  <span className="text-sm font-medium">{selectedBrand.name}</span>
                </div>
              </div>

              {/* Color Grid */}
              <div className="flex justify-center">
                <div className="grid grid-cols-6 gap-3 p-4 bg-background rounded-lg border">
                  {brandColors.map((theme) => (
                    <motion.button
                      key={theme.hex}
                      title={theme.name}
                      aria-label={`Select ${theme.name}`}
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110",
                        selectedBrand.hex === theme.hex
                          ? "ring-2 ring-offset-2 ring-primary border-primary shadow-lg"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ backgroundColor: theme.hex }}
                      onClick={() => handleBrandSelect(theme)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Changes will be applied immediately. Click "Apply Theme" to save permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-6"
      >
        <div>
          <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Preview
          </TypographyH3>
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Sample Component</h4>
                  <p className="text-sm text-muted-foreground">This is how your theme will look</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
