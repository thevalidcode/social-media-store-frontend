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
import { useGetStoreDesign, useUpdateStoreSettings } from "@/hooks/use-store";
import AssetPreview from "@/components/AssetPreview";
import { toast } from "sonner";

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

const getThemeStorageKey = (scope: string | number | null | undefined) =>
  scope ? `selectedTheme:${scope}` : "selectedTheme";

const themeByTitle = (title: string) =>
  adminTheme.find((theme) => theme.title === title) || adminTheme[0];

const extraBrandColors: ThemeOption[] = [
  { name: "Slate", hex: "#64748B", schema: themeByTitle("Neutral").schema },
  { name: "Stone", hex: "#78716C", schema: themeByTitle("Neutral").schema },
  { name: "Mint", hex: "#34D399", schema: themeByTitle("Teal").schema },
  { name: "Sky", hex: "#38BDF8", schema: themeByTitle("Blue").schema },
  { name: "Gold", hex: "#FACC15", schema: themeByTitle("Yellow").schema },
  { name: "Coral", hex: "#FB7185", schema: themeByTitle("Rose").schema },
  { name: "Sapphire", hex: "#0EA5E9", schema: themeByTitle("Cyan").schema },
  { name: "Plum", hex: "#A855F7", schema: themeByTitle("Violet").schema },
  { name: "Emerald", hex: "#10B981", schema: themeByTitle("Green").schema },
];

const allBrandColors = [...brandColors, ...extraBrandColors];

const themeSwatchClassMap: Record<string, string> = {
  "#000000": "bg-black",
  "#EF4444": "bg-red-500",
  "#F43F5E": "bg-rose-500",
  "#F97316": "bg-orange-500",
  "#22C55E": "bg-green-500",
  "#EAB308": "bg-yellow-500",
  "#8B5CF6": "bg-violet-500",
  "#14B8A6": "bg-teal-500",
  "#06B6D4": "bg-cyan-500",
  "#3B82F6": "bg-blue-500",
  "#6366F1": "bg-indigo-500",
  "#EC4899": "bg-pink-500",
  "#FF7043": "bg-orange-400",
  "#B4AEE8": "bg-violet-300",
  "#64748B": "bg-slate-500",
  "#78716C": "bg-stone-500",
  "#34D399": "bg-emerald-400",
  "#38BDF8": "bg-sky-400",
  "#FACC15": "bg-amber-400",
  "#FB7185": "bg-rose-400",
  "#0EA5E9": "bg-sky-500",
  "#A855F7": "bg-fuchsia-500",
  "#10B981": "bg-emerald-500",
};

const getThemeSwatchClass = (hex: string) =>
  themeSwatchClassMap[hex] ?? "bg-primary";

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
  const { generalSetting, storeInfo, storeId, domain } = useAppContext();
  const { applyTheme } = useThemeContext();
  const { theme: colorScheme } = useTheme();
  const { data: dbTheme } = useGetStoreDesign();
  const { mutateAsync: updateStoreSettings, isPending: isSavingBranding } =
    useUpdateStoreSettings();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";
  const storageKey = getThemeStorageKey(storeId ?? domain);

  const [selectedBrand, setSelectedBrand] = useState<ThemeOption>(
    brandColors[0]
  );
  const [logoUrl, setLogoUrl] = useState<string>(generalSetting?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState<string>(
    generalSetting?.faviconUrl || ""
  );

  const canUseCustomBranding = storeInfo?.features?.custom_branding ?? false;

  // Load saved theme on mount; prefer DB so the page never lags behind
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (dbTheme?.schema) {
        const theme =
          allBrandColors.find((t) => t.hex === dbTheme.hex) || {
            name: dbTheme.name || brandColors[0].name,
            hex: dbTheme.hex || brandColors[0].hex,
            schema: dbTheme.schema,
          };
        setSelectedBrand(theme);
        localStorage.setItem(storageKey, JSON.stringify(theme));
        return;
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: ThemeOption = JSON.parse(saved);
        const theme =
          allBrandColors.find((t) => t.hex === parsed.hex) || brandColors[0];
        setSelectedBrand(theme);
      }
    } catch (e) {
      console.error("Error loading theme from localStorage", e);
    }
  }, [dbTheme, storageKey]);

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

  const handleSaveTheme = async () => {
    await applyTheme(selectedBrand);
    localStorage.setItem(storageKey, JSON.stringify(selectedBrand));

    await updateStoreSettings({
      logoUrl,
      faviconUrl,
    });

    toast.success("Branding settings saved successfully!");
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
          <p className="text-xs text-muted-foreground">
            Changes go live after saving. Ideal sizes: logo (512x256), favicon
            (64x64).
          </p>
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
        <FeatureGate
          isAllowed={isSubscriptionActive}
          featureLabel="Branding Management"
          variant="tooltip"
          description="You need an active subscription to update branding. Please renew your subscription to continue."
        >
          <Button
            className="gap-2"
            onClick={handleSaveTheme}
            size="lg"
            disabled={isSavingBranding}
          >
            <Sparkles className="h-4 w-4" />
            {isSavingBranding ? "Saving..." : "Apply Branding"}
          </Button>
        </FeatureGate>
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
                        className={cn(
                          "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                          getThemeSwatchClass(selectedBrand.hex)
                        )}
                      />
                      <span className="text-sm font-medium">
                        {selectedBrand.name}
                      </span>
                    </div>
                  </div>

                  {/* Color Grid */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-4 bg-background rounded-lg border">
                      {allBrandColors.map((theme) => (
                        <motion.button
                          key={theme.hex}
                          title={theme.name}
                          aria-label={`Select ${theme.name}`}
                          className={cn(
                            "w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110",
                            selectedBrand.hex === theme.hex
                              ? "ring-2 ring-offset-2 ring-primary border-primary shadow-lg"
                              : "border-border hover:border-primary/50",
                            getThemeSwatchClass(theme.hex)
                          )}
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
