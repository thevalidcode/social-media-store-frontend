"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminTheme } from "@/app/_docs/doc";

// Theme schema definition
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
  schema: theme.schema as ThemeSchema,
}));

export function DesignSettings() {
  const [selectedBrandColor, setSelectedBrandColor] =
    React.useState<ThemeOption>(brandColors[0]);

  // Load saved theme on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("selectedTheme");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.schema && parsed?.hex) {
          const theme =
            brandColors.find((t) => t.hex === parsed.hex) || brandColors[0];
          setSelectedBrandColor(theme);
        }
      }
    } catch (error) {
      console.error("Failed to load saved theme:", error);
    }
  }, []);

  const handleBrandColorSelect = (theme: ThemeOption) => {
    setSelectedBrandColor(theme);

    // Save to localStorage
    const themeData = { hex: theme.hex, schema: theme.schema };
    localStorage.setItem("selectedTheme", JSON.stringify(themeData));
  };

  return (
    <Card className="border-none shadow-none h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-start px-0 pt-0 shrink-0">
        <div>
          <CardDescription>
            Customize the look and feel of your application.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 px-0 flex-grow overflow-y-auto">
        <div>
          <h3 className="text-lg font-medium mb-1">Colors</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a brand color to customize your application theme.
          </p>
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-2">Select a Brand Color</h4>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {brandColors.map((theme) => (
                  <button
                    key={theme.hex}
                    title={theme.name}
                    onClick={() => handleBrandColorSelect(theme)}
                    className={`w-full aspect-square rounded-md border-2 transition-all ${
                      selectedBrandColor.hex === theme.hex
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                    style={{ backgroundColor: theme.hex }}
                    aria-label={`Select ${theme.name} color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 px-0 shrink-0">
        <Button
          className="ml-auto"
          onClick={() => {
            const themeData = {
              hex: selectedBrandColor.hex,
              schema: selectedBrandColor.schema,
            };
            localStorage.setItem("selectedTheme", JSON.stringify(themeData));
          }}
        >
          Save Theme
        </Button>
      </CardFooter>
    </Card>
  );
}
