"use client";

import type React from "react";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useUpdateStoreSettings } from "@/hooks/use-store";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUploadImage } from "@/hooks/use-file";
import { useAppContext } from "@/context/appContext";
import ImagePicker from "./ImagePicker";

export default function GeneralSettingsForm() {
  const { generalSetting, userCurrency, setUserCurrency } = useAppContext();
  const [storeName, setStoreName] = useState(generalSetting?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    generalSetting?.storeDescription || ""
  );
  const [clientCurrency, setClientCurrency] = useState(
    generalSetting?.defaultClientCurrency || "USD"
  );
  const [showBanner, setShowBanner] = useState<boolean>(
    generalSetting?.showBanner || true
  );
  const [logoUrl, setLogoUrl] = useState(generalSetting?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(
    generalSetting?.faviconUrl || ""
  );
  const { mutate: updateStoreSettings } = useUpdateStoreSettings();
  const { mutateAsync: uploadImage } = useUploadImage();

  const handleFaviconChange = async (file: File | null) => {
    const response = await uploadImage({ file: file!, collection: "store" });
    setFaviconUrl(response.url);
    toast.info(
      "Image uploaded successfully... Please save the settings to apply the new favicon."
    );
  };

  const handleLogoChange = async (file: File | null) => {
    const response = await uploadImage({ file: file!, collection: "store" });
    setLogoUrl(response.url);
    toast.info(
      "Image uploaded successfully... Please save the settings to apply the new logo."
    );
  };

  const handleSave = () => {
    updateStoreSettings({
      storeName: storeName,
      storeDescription,
      logoUrl,
      faviconUrl,
      defaultClientCurrency: clientCurrency,
      showBanner,
    });
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="p-2 md:p-8 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">General Settings</h1>
        <Button onClick={handleSave} className="mt-4 sm:mt-0">
          Save
        </Button>
      </div>

      <div className="space-y-8">
        {/* Store Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Store</h2>
          <div className="space-y-6">
            <div className="flex flex-col lg:gap-2 gap-l">
              <Label htmlFor="storeName" className="text-sm font-medium">
                Store Name
              </Label>
              <Input
                id="storeName"
                type="text"
                placeholder="Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="flex flex-col lg:gap-2 gap-l">
              <Label htmlFor="storeDescription" className="text-sm font-medium">
                Store Description
              </Label>
              <Textarea
                id="storeDescription"
                placeholder="Store Description"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
              />
            </div>
            <ImagePicker
              label="Store Favicon"
              collection="store"
              value={faviconUrl}
              onChange={(data) => {
                setFaviconUrl(data.url);
              }}
            />
            <ImagePicker
              label="Store Logo"
              collection="store"
              value={logoUrl}
              onChange={(data) => {
                setLogoUrl(data.url);
              }}
            />
          </div>
        </section>

        <Separator />

        {/* Currency Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Currency</h2>
          <div className="space-y-6">
            {/* Client Currency */}
            <div className="flex flex-col lg:gap-2 gap-l">
              <Label htmlFor="clientCurrency" className="text-sm font-medium">
                Client Default Currency
              </Label>

              <Select value={clientCurrency} onValueChange={setClientCurrency}>
                <SelectTrigger id="clientCurrency" className="w-full">
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
            <div className="flex flex-col lg:gap-2 gap-l">
              <Label htmlFor="adminCurrency" className="text-sm font-medium">
                Admin Currency
              </Label>

              <Select value={userCurrency} onValueChange={setUserCurrency}>
                <SelectTrigger id="adminCurrency" className="w-full">
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
        </section>

        <Separator />

        {/* Other Settings Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="showBanner" className="text-sm font-medium">
              Show Banner
            </Label>
            <Switch
              id="showBanner"
              checked={showBanner}
              onCheckedChange={setShowBanner}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
