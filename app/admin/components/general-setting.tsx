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

interface FileInputProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
}

function FileInputRow({ id, label, onFileChange }: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : "No file chosen");
    onFileChange(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center gap-3 md:gap-4">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="relative">
          <Input
            type="file"
            id={id}
            name={id}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          Choose File
        </Button>
        <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-[200px]">
          {fileName || "No file chosen"}
        </span>
      </div>
    </div>
  );
}

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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
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
            <FileInputRow
              id="siteFavicon"
              label="Store Favicon"
              onFileChange={handleFaviconChange}
            />
            <FileInputRow
              id="siteLogo"
              label="Store Logo"
              onFileChange={handleLogoChange}
            />
          </div>
        </section>

        <Separator />

        {/* Currency Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Currency</h2>
          <div className="space-y-6">
            {/* Client Currency */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
              <Label htmlFor="clientCurrency" className="text-sm font-medium">
                Client Default Currency
              </Label>

              <Select value={clientCurrency} onValueChange={setClientCurrency}>
                <SelectTrigger id="clientCurrency">
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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
              <Label htmlFor="adminCurrency" className="text-sm font-medium">
                Admin Currency
              </Label>

              <Select value={userCurrency} onValueChange={setUserCurrency}>
                <SelectTrigger id="adminCurrency">
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
