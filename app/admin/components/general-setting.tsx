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
import { UploadCloud } from "lucide-react";
import { useState } from "react";

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
          <input
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
      <Button variant="outline" size="sm" className="md:justify-self-end">
        <UploadCloud className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </div>
  );
}

export default function GeneralSettingsForm() {
  const [siteTitle, setSiteTitle] = useState("My Awesome Site");
  const [clientCurrency, setClientCurrency] = useState("usd");
  const [adminCurrency, setAdminCurrency] = useState("usd");
  const [showBanner, setShowBanner] = useState(true);

  const handleFaviconChange = (file: File | null) => {
    console.log("Favicon changed:", file);
  };

  const handleLogoChange = (file: File | null) => {
    console.log("Logo changed:", file);
  };

  const handleSave = () => {
    console.log("Saving settings:", {
      siteTitle,
      clientCurrency,
      adminCurrency,
      showBanner,
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">General Settings</h1>
        <Button onClick={handleSave} className="mt-4 sm:mt-0">
          Save
        </Button>
      </div>

      <div className="space-y-8">
        {/* Site Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Site</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
              <Label htmlFor="siteTitle" className="text-sm font-medium">
                Site Title
              </Label>
              <Input
                id="siteTitle"
                type="text"
                placeholder="Site Title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>
            <FileInputRow
              id="siteFavicon"
              label="Site Favicon"
              onFileChange={handleFaviconChange}
            />
            <FileInputRow
              id="siteLogo"
              label="Site Logo"
              onFileChange={handleLogoChange}
            />
          </div>
        </section>

        <Separator />

        {/* Currency Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Currency</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
              <Label htmlFor="clientCurrency" className="text-sm font-medium">
                Client Default Currency
              </Label>
              <Select value={clientCurrency} onValueChange={setClientCurrency}>
                <SelectTrigger id="clientCurrency">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">
                    USD - United States Dollar
                  </SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-3 md:gap-4">
              <Label htmlFor="adminCurrency" className="text-sm font-medium">
                Admin Currency
              </Label>
              <Select
                value={adminCurrency}
                onValueChange={setAdminCurrency}
                defaultValue="USD"
              >
                <SelectTrigger id="adminCurrency">
                  <SelectValue placeholder="Select..." />
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
