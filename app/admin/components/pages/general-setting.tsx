"use client";

import { motion } from "framer-motion";

import { currency } from "@/app/_docs/doc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useUpdateStoreSettings } from "@/hooks/use-store";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/appContext";
import { TypographyH2, TypographyH3 } from "@/components/typography";
import { FeatureGate } from "@/components/FeatureGate";
import { Settings2, DollarSign, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function GeneralSettingsForm() {
  const { generalSetting, userCurrency, setUserCurrency, storeInfo } =
    useAppContext();
  const [storeName, setStoreName] = useState(generalSetting?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    generalSetting?.storeDescription || ""
  );
  const [clientCurrency, setClientCurrency] = useState(
    generalSetting?.defaultClientCurrency || "USD"
  );
  const [showBanner, setShowBanner] = useState<boolean>(
    generalSetting?.showBanner ?? true
  );
  const { mutateAsync: updateStoreSettings } = useUpdateStoreSettings();

  const canToggleBanner = storeInfo?.features?.hide_platform_banner ?? false;

  const handleSave = async () => {
    await updateStoreSettings({
      storeName: storeName,
      storeDescription,
      defaultClientCurrency: clientCurrency,
      showBanner,
    });
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <TypographyH2 className="text-2xl mb-2">
            General Settings
          </TypographyH2>
          <p className="text-muted-foreground">
            Configure your store's basic information and preferences.
          </p>
        </div>
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Store Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Store Information
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-sm font-medium">
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Enter your store name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="storeDescription"
                    className="text-sm font-medium"
                  >
                    Store Description
                  </Label>
                  <Textarea
                    id="storeDescription"
                    placeholder="Describe your store and services"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Currency Settings
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="w-full flex flex-wrap gap-6">
                {/* Client Currency */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="clientCurrency"
                    className="text-sm font-medium"
                  >
                    Client Default Currency
                  </Label>
                  <Select
                    value={clientCurrency}
                    onValueChange={setClientCurrency}
                  >
                    <SelectTrigger id="clientCurrency" className="h-11 w-full">
                      <SelectValue placeholder="Select currency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currency).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key} - {value.split("|")[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Currency */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="adminCurrency"
                    className="text-sm font-medium"
                  >
                    Admin Currency
                  </Label>
                  <Select value={userCurrency} onValueChange={setUserCurrency}>
                    <SelectTrigger id="adminCurrency" className="h-11 w-full">
                      <SelectValue placeholder="Select currency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currency).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key} - {value.split("|")[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Preferences
            </TypographyH3>
            <FeatureGate
              isAllowed={canToggleBanner}
              featureLabel="Hide banner"
              variant="overlay"
              description="This plan does not include hiding the promotional banner. Upgrade to remove the banner from your store."
            >
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="showBanner" className="text-sm font-medium">
                      Show Banner
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display promotional banner on your store
                    </p>
                  </div>
                  <Switch
                    id="showBanner"
                    checked={showBanner}
                    onCheckedChange={setShowBanner}
                  />
                </div>
              </div>
            </FeatureGate>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
