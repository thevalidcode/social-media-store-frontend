"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, Eye, Image as ImageIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { adminTheme } from "@/app/_docs/doc";
import { useThemeContext } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyH3 } from "@/components/typography";
import { cn } from "@/lib/utils";
import ImagePicker from "../ImagePicker";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";
import { useUpdateStoreSettings } from "@/hooks/use-store";
import AssetPreview from "@/components/AssetPreview";

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

// Apply theme CSS variables to override global styles on the fly
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

export default function BrandingThemeSettings() {
  const { generalSetting, storeInfo } = useAppContext();
  const { applyTheme } = useThemeContext();
  const { theme: colorScheme } = useTheme();
  const { mutate: updateStoreSettings, isPending: isSavingBranding } =
    useUpdateStoreSettings();

  const [selectedBrand, setSelectedBrand] = useState<ThemeOption>(
    brandColors[0]
  );
  const [logoUrl, setLogoUrl] = useState<string>(generalSetting?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState<string>(
    generalSetting?.faviconUrl || ""
  );

  const canUseCustomBranding = storeInfo?.features?.custom_branding ?? false;

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

  // Keep local branding state in sync when store data changes
  useEffect(() => {
    if (generalSetting?.logoUrl) setLogoUrl(generalSetting.logoUrl);
    if (generalSetting?.faviconUrl) setFaviconUrl(generalSetting.faviconUrl);
  }, [generalSetting?.faviconUrl, generalSetting?.logoUrl]);

  // Apply theme when color scheme or selection changes
  useEffect(() => {
    if (selectedBrand.schema) {
      const isDark = colorScheme === "dark";
      applyThemeStyles(selectedBrand.schema, isDark);
    }
  }, [colorScheme, selectedBrand]);

  const handleBrandSelect = (theme: ThemeOption) => {
    setSelectedBrand(theme);
  };

  const handleSaveTheme = () => {
    applyTheme(selectedBrand);
    localStorage.setItem("selectedTheme", JSON.stringify(selectedBrand));
  };

  const handleSaveBranding = () => {
    updateStoreSettings({ logoUrl, faviconUrl });
  };

  const brandingControls = (
    <div className="bg-muted/30 rounded-xl p-6 sm:p-8 space-y-6">
      <div className="space-y-4">
        <TypographyH3 className="text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Brand Assets
        </TypographyH3>
        <p className="text-sm text-muted-foreground">
          Upload bespoke assets to give your storefront a polished, on-brand
          experience.
        </p>
      </div>

      <div className="flex flex-col gap-6 xl:gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImagePicker
              label="Store Logo"
              collection="store"
              className="2xl:flex-nowrap"
              value={logoUrl}
              onChange={(data) => setLogoUrl(data.url)}
            />
            <ImagePicker
              label="Favicon"
              collection="store"
              className="2xl:flex-nowrap"
              value={faviconUrl}
              onChange={(data) => setFaviconUrl(data.url)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Changes go live after saving. Ideal sizes: logo (512x256), favicon
              (64x64).
            </p>
            <Button
              onClick={handleSaveBranding}
              size="lg"
              className="gap-2 ml-auto"
              disabled={isSavingBranding}
            >
              <Sparkles className="h-4 w-4" />
              Save Branding
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AssetPreview
            title="Logo preview"
            url={logoUrl}
            size="logo"
            hint="Displayed in navigation, invoices, and transactional emails."
          />
          <AssetPreview
            title="Favicon preview"
            url={faviconUrl}
            size="favicon"
            hint="Shown in browser tabs and bookmarks for instant brand recall."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <TypographyH2 className="text-2xl mb-2">
            Branding & Theme
          </TypographyH2>
          <p className="text-muted-foreground">
            Curate your visual identity with premium branding controls and live
            previews.
          </p>
        </div>
        <Button className="gap-2" onClick={handleSaveTheme} size="lg">
          <Sparkles className="h-4 w-4" />
          Apply Theme
        </Button>
      </div>

      <FeatureGate
        isAllowed={canUseCustomBranding}
        featureLabel="Custom branding"
        description="Upload your own logo, favicon, and palette to fully white-label the experience."
        variant="overlay"
      >
        <div className="space-y-8">
          {/* Branding & Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {brandingControls}
          </motion.div>

          {/* Brand Color Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="space-y-6"
          >
            <div>
              <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Brand Colors
              </TypographyH3>
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Select a Brand Color
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Choose the palette that best reflects your brand
                        personality.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedBrand.hex }}
                      />
                      <span className="text-sm font-medium">
                        {selectedBrand.name}
                      </span>
                    </div>
                  </div>

                  {/* Color Grid */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-4 bg-background rounded-lg border">
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
                      Colors update instantly for preview. Click "Apply Theme"
                      to persist.
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
                Live Preview
              </TypographyH3>
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="w-12 h-12 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Sample Component</h4>
                      <p className="text-sm text-muted-foreground">
                        Your palette cascades through buttons, cards, and
                        typography.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </FeatureGate>
    </div>
  );
}
