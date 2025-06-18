"use client";

import { adminTheme } from "@/app/_docs/doc";
import { useThemeContext } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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

// Data
const brandColors: ThemeOption[] = adminTheme.map((theme) => ({
  name: theme.title,
  hex: theme.hex,
  schema: theme.schema,
}));

// const customColorLabels = [
//   "Primary",
//   "Secondary",
//   "Accent",
//   "Background",
//   "Text",
// ];

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
        const parsed = JSON.parse(saved);
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
    applyTheme(theme.schema);
  };

  const handleSave = () => {
    localStorage.setItem(
      "selectedTheme",
      JSON.stringify({
        hex: selectedBrand.hex,
        schema: selectedBrand.schema,
      })
    );
    applyTheme(selectedBrand.schema);
    console.log("Theme saved:", selectedBrand);
  };

  return (
    <Card className="border-none shadow-none h-full flex flex-col bg-background">
      <CardHeader className="flex justify-between items-start px-0 pt-0">
        <CardDescription>
          Customize the look and feel of your application.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10 px-0 flex-grow overflow-y-auto">
        {/* Brand Color Section */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>
              Choose a brand color to customize your theme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="text-md font-medium">Select a Brand Color</h4>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 ">
                {brandColors.map((theme) => (
                  <Button
                    key={theme.hex}
                    title={theme.name}
                    aria-label={`Select ${theme.name}`}
                    className={cn(
                      "w-full h-14 aspect-square rounded-md border-2 transition-all",
                      selectedBrand.hex === theme.hex
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    )}
                    style={{ backgroundColor: theme.hex }}
                    onClick={() => handleBrandSelect(theme)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter className="border-t pt-6 px-0">
        <Button className="ml-auto" onClick={handleSave}>
          Save Theme
        </Button>
      </CardFooter>
    </Card>
  );
}
