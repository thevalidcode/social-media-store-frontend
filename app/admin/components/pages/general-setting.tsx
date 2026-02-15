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
import { useEffect, useState } from "react";
import { useUpdateStoreSettings } from "@/hooks/use-store";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/appContext";
import { TypographyH2, TypographyH3 } from "@/components/typography";
import { FeatureGate } from "@/components/FeatureGate";
import {
  Settings2,
  DollarSign,
  Settings,
  Sparkles,
  Share2Icon,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

export default function GeneralSettingsForm() {
  const { generalSetting, userCurrency, setUserCurrency, storeInfo } =
    useAppContext();
  const [storeName, setStoreName] = useState(generalSetting?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    generalSetting?.storeDescription || "",
  );
  const [socialAccounts, setSocialAccounts] = useState({
    instagramUrl: generalSetting?.instagramUrl || "",
    xUrl: generalSetting?.xUrl || "",
    facebookUrl: generalSetting?.facebookUrl || "",
    youtubeUrl: generalSetting?.youtubeUrl || "",
    tiktokUrl: generalSetting?.tiktokUrl || "",
  });

  const [clientCurrency, setClientCurrency] = useState(
    generalSetting?.defaultClientCurrency || "USD",
  );
  const [showBanner, setShowBanner] = useState<boolean>(
    generalSetting?.showBanner ?? true,
  );
  const { mutateAsync: updateStoreSettings } = useUpdateStoreSettings();

  const canToggleBanner = storeInfo?.features?.hide_platform_banner ?? false;

  // Store Address Fields
  const [storeAddress, setStoreAddress] = useState({
    storeStreet: generalSetting?.storeStreet || "",
    storeCity: generalSetting?.storeCity || "",
    storeState: generalSetting?.storeState || "",
    storePostalCode: generalSetting?.storePostalCode || "",
    storeCountry: generalSetting?.storeCountry || "",
    storePhone: generalSetting?.storePhone || "",
  });

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (storeAddress.storeCountry) {
      const countryStates = State.getStatesOfCountry(storeAddress.storeCountry);
      setStates(countryStates);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [storeAddress.storeCountry]);

  useEffect(() => {
    if (storeAddress.storeCountry && storeAddress.storeState) {
      const stateCities = City.getCitiesOfState(
        storeAddress.storeCountry,
        storeAddress.storeState,
      );
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [storeAddress.storeCountry, storeAddress.storeState]);

  const handleSave = async () => {
    await updateStoreSettings({
      storeName: storeName,
      storeDescription,
      defaultClientCurrency: clientCurrency,
      showBanner,
      ...socialAccounts,

      ...storeAddress,
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

        {/* Social Accounts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Share2Icon className="h-5 w-5 text-primary" />
              Social Media Accounts
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="text-sm font-medium">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    placeholder="Enter your Instagram URL"
                    value={socialAccounts.instagramUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        instagramUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl" className="text-sm font-medium">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebookUrl"
                    type="url"
                    placeholder="Enter your Facebook URL"
                    value={socialAccounts.facebookUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        facebookUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xUrl" className="text-sm font-medium">
                    X URL
                  </Label>
                  <Input
                    id="xUrl"
                    type="url"
                    placeholder="Enter your X URL"
                    value={socialAccounts.xUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        xUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-sm font-medium">
                    Youtube URL
                  </Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    placeholder="Enter your Youtube URL"
                    value={socialAccounts.youtubeUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        youtubeUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktokUrl" className="text-sm font-medium">
                    TikTok URL
                  </Label>
                  <Input
                    id="tiktokUrl"
                    type="url"
                    placeholder="Enter your TikTok URL"
                    value={socialAccounts.tiktokUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        tiktokUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Store Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Store Address
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeStreet" className="text-sm font-medium">
                    Street Address
                  </Label>
                  <Input
                    id="storeStreet"
                    type="text"
                    placeholder="123 Main Street"
                    value={storeAddress.storeStreet}
                    onChange={(e) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storeStreet: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeCountry" className="text-sm font-medium">
                    Country
                  </Label>
                  <Select
                    value={storeAddress.storeCountry}
                    onValueChange={(val) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storeCountry: val,
                        storeState: "",
                        storeCity: "",
                      }))
                    }
                  >
                    <SelectTrigger id="storeCountry" className="h-11 w-full">
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeState" className="text-sm font-medium">
                    State/Province
                  </Label>
                  <Select
                    value={storeAddress.storeState}
                    onValueChange={(val) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storeState: val,
                        storeCity: "",
                      }))
                    }
                    disabled={!storeAddress.storeCountry || states.length === 0}
                  >
                    <SelectTrigger id="storeState" className="h-11 w-full">
                      <SelectValue placeholder="Select state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeCity" className="text-sm font-medium">
                    City
                  </Label>
                  <Select
                    value={storeAddress.storeCity}
                    onValueChange={(val) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storeCity: val,
                      }))
                    }
                    disabled={
                      !storeAddress.storeCountry ||
                      !storeAddress.storeState ||
                      cities.length === 0
                    }
                  >
                    <SelectTrigger id="storeCity" className="h-11 w-full">
                      <SelectValue placeholder="Select city..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="storePostalCode"
                    className="text-sm font-medium"
                  >
                    Postal Code
                  </Label>
                  <Input
                    id="storePostalCode"
                    type="text"
                    placeholder="10001"
                    value={storeAddress.storePostalCode}
                    onChange={(e) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storePostalCode: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <PhoneInput
                    id="storePhone"
                    international
                    defaultCountry={storeAddress.storeCountry as any}
                    value={storeAddress.storePhone}
                    onChange={(value) =>
                      setStoreAddress((prev) => ({
                        ...prev,
                        storePhone: value || "",
                      }))
                    }
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
