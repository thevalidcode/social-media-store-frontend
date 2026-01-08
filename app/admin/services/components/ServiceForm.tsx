"use client";

import { InputField, TextareaField, SelectField } from "./FormFields";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImagePicker from "../../components/ImagePicker";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useEffect, useState } from "react";
import ImportServicesDialog from "./ImportServicesDialog";

interface ServiceFormProps {
  service: any;
  setService: (val: any) => void;
  categoryOptions: any[];
  providerOptions: any[];
  isEditing?: boolean;
}

export default function ServiceForm({
  service,
  setService,
  categoryOptions,
  providerOptions,
  isEditing,
}: ServiceFormProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const [localPrice, setLocalPrice] = useState("");
  const [showImportServices, setShowImportServices] = useState(false);
  const [localProviderPrice, setLocalProviderPrice] = useState("");

  // Convert once on mount to user's currency
  useEffect(() => {
    if (service.price) {
      const converted = convert(
        service.currency || "USD",
        userCurrency,
        Number(service.price),
        true,
        false
      ).amount;
      setLocalPrice(converted.toString());
    }
    if (service.providerPrice) {
      const converted = convert(
        service.providerCurrency || "USD",
        userCurrency,
        Number(service.providerPrice),
        true,
        false
      ).amount;
      setLocalProviderPrice(converted.toString());
    }
  }, [userCurrency]);

  const handleChange = (key: string, value: any) =>
    setService((prev: any) => ({ ...prev, [key]: value }));

  const showProviderFields = service.type !== "MANUAL";
  const syncOptions = [
    { key: "syncQuantity", label: "Sync Quantity" },
    { key: "syncCatAndName", label: "Sync Category & Name" },
    { key: "dripFeed", label: "Drip Feed" },
    { key: "refill", label: "Refill" },
    { key: "cancel", label: "Cancel" },
  ];

  return (
    <div className="space-y-3 text-sm mt-2">
      {!isEditing && (
        <div className="flex justify-between items-center">
          <Label>Add Service Details</Label>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setShowImportServices(true)}
          >
            Import from Provider
          </Button>
        </div>
      )}

      <InputField
        label="Name"
        value={service.name}
        required
        placeholder="e.g. Instagram Followers"
        onChange={(v) => handleChange("name", v)}
      />

      <SelectField
        label="Category"
        options={categoryOptions}
        value={service.category}
        onChange={(v) => handleChange("category", v)}
        showImage
        required
      />

      <ImagePicker
        label="Icon"
        collection="services"
        value={service.icon}
        onChange={(data) => handleChange("icon", data.url)}
      />

      <TextareaField
        label="Description"
        value={service.description}
        onChange={(v) => handleChange("description", v)}
      />

      <SelectField
        label="Type"
        options={[
          "MANUAL",
          "DEFAULT",
          "PACKAGE",
          "SEO",
          "CUSTOM_COMMENTS",
          "MENTIONS",
          "MENTIONS_WITH_HASHTAGS",
          "MENTIONS_CUSTOM_LIST",
          "MENTIONS_HASHTAG",
          "MENTIONS_USER_FOLLOWERS",
          "MENTIONS_MEDIA_LIKERS",
          "CUSTOM_COMMENTS_PACKAGE",
          "COMMENT_LIKES",
          "POLL",
          "COMMENT_REPLIES",
          "SUBSCRIPTIONS",
          "INVITES_FROM_GROUPS",
        ].map((t) => ({ value: t, label: t.replace(/_/g, " ") }))}
        value={service.type}
        required
        onChange={(v) => handleChange("type", v)}
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Min"
          type="number"
          required
          value={service.min}
          onChange={(v) => handleChange("min", Number(v))}
          disabled={service.type === "PACKAGE"}
        />
        <InputField
          label="Max"
          type="number"
          required
          value={service.max}
          onChange={(v) => handleChange("max", Number(v))}
          disabled={service.type === "PACKAGE"}
        />
      </div>

      <div className="flex flex-col lg:gap-2 gap-1 w-full">
        <Label>Price Per 1000</Label>
        <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:border-primary transition">
          <span className="text-sm font-medium">{userCurrency}</span>
          <Input
            type="text"
            value={localPrice}
            required
            onChange={(e) => {
              const val = e.target.value;
              setLocalPrice(val);
              handleChange("price", val);
            }}
            className="w-full text-sm focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      {showProviderFields && (
        <>
          <SelectField
            label="Provider"
            options={providerOptions}
            value={service.providerUid}
            onChange={(v) => handleChange("providerUid", v)}
            showImage
            required
          />
          <div className="flex flex-col lg:gap-2 gap-1 w-full">
            <Label>Provider Price Per 1000</Label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:border-primary transition">
              <span className="text-sm font-medium">{userCurrency}</span>
              <Input
                type="text"
                value={localProviderPrice}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalProviderPrice(val);
                  handleChange("providerPrice", val);
                }}
                className="w-full text-sm focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Provider Service ID"
              type="number"
              value={service.providerId}
              onChange={(v) => handleChange("providerId", Number(v))}
              required
            />
            <InputField
              label="Network"
              value={service.network}
              onChange={(v) => handleChange("network", v)}
            />
            <InputField
              label="Refill Days"
              type="number"
              value={service.refillDays}
              onChange={(v) => handleChange("refillDays", Number(v))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {syncOptions.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <Label>{opt.label}</Label>
                <Switch
                  checked={service[opt.key]}
                  onCheckedChange={(v) => handleChange(opt.key, v)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <ImportServicesDialog
        open={showImportServices}
        onOpenChange={(open) => setShowImportServices(open)}
      />
    </div>
  );
}
