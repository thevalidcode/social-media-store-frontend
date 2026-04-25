"use client";

import { InputField, TextareaField, SelectField } from "./FormFields";
import { Button } from "@/components/ui/button";
import ImagePicker from "../../components/ImagePicker";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useEffect, useState } from "react";
import ImportServicesDialog from "./ImportServicesDialog";
import { FeatureGate } from "@/components/FeatureGate";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  PackageSearch,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

interface ServiceFormProps {
  service: any;
  setService: (val: any) => void;
  setOpen?: (val: boolean) => void;
  categoryOptions: any[];
  providerOptions: any[];
  isEditing?: boolean;
  isSubscriptionActive?: boolean;
}

export default function ServiceForm({
  service,
  setService,
  categoryOptions,
  providerOptions,
  setOpen,
  isEditing,
  isSubscriptionActive = true,
}: ServiceFormProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const [localPrice, setLocalPrice] = useState("");
  const [showImportServices, setShowImportServices] = useState(false);
  const [localProviderPrice, setLocalProviderPrice] = useState("");

  // Convert once on mount to user's currency
  useEffect(() => {
    if (service && service.price != null) {
      const converted = convert(
        service.currency || "USD",
        userCurrency,
        Number(service.price),
        true,
        false,
      ).amount;
      setLocalPrice(String(converted));
    } else {
      setLocalPrice("");
    }

    if (service && service.providerPrice != null) {
      const convertedProv = convert(
        service.providerCurrency || "USD",
        userCurrency,
        Number(service.providerPrice),
        true,
        false,
      ).amount;
      setLocalProviderPrice(String(convertedProv));
    } else {
      setLocalProviderPrice("");
    }
  }, [userCurrency]);

  const handleChange = (key: string, value: any) =>
    setService((prev: any) => ({ ...prev, [key]: value }));

  const showProviderFields = service.type !== "MANUAL";
  const syncOptions = [
    {
      key: "syncQuantity",
      label: "Sync Quantity",
      description: "Keep the service's available quantity aligned with the provider.",
    },
    {
      key: "syncCatAndName",
      label: "Sync Category & Name",
      description: "Automatically mirror the provider's category and service name.",
    },
    {
      key: "dripFeed",
      label: "Drip Feed",
      description: "Allow the service to deliver gradually instead of all at once.",
    },
    {
      key: "refill",
      label: "Refill",
      description: "Enable refill support when the provider offers it.",
    },
    {
      key: "cancel",
      label: "Cancel",
      description: "Allow cancellations if the provider supports canceling orders.",
    },
    {
      key: "syncWithProvider",
      label: "Sync With Provider",
      description: "Use the provider as the source of truth for live updates.",
    },
  ];

  const handleImportClick = (isOpen: boolean) => {
    setShowImportServices(isOpen);
    if (!isOpen && setOpen) setOpen(false);
  };

  const serviceSteps = [
    {
      icon: PackageSearch,
      title: "Identity",
      description: "Name, category, and type.",
    },
    {
      icon: Sparkles,
      title: "Presentation",
      description: "Description and icon.",
    },
    {
      icon: SlidersHorizontal,
      title: "Pricing",
      description: "Limits and your retail price.",
    },
    {
      icon: BadgeCheck,
      title: "Provider sync",
      description: "Provider link and automation.",
    },
  ];

  return (
    <div className="space-y-5 text-sm">
      {!isEditing && (
        <Card className="border-dashed bg-muted/20 shadow-none">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    Create flow
                  </Badge>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Guided service setup
                  </span>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Import a service from a provider or build it manually in clear
                  steps so the form stays readable on every screen size.
                </p>
              </div>

              <FeatureGate
                isAllowed={isSubscriptionActive}
                featureLabel="Import Services"
                variant="tooltip"
                description="You need an active subscription to import services. Please renew your subscription to continue."
              >
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowImportServices(true);
                  }}
                  className="shrink-0"
                >
                  Import from Provider
                </Button>
              </FeatureGate>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {serviceSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border bg-background/80 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            0{index + 1}
                          </span>
                          <p className="font-medium leading-none">
                            {step.title}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="gap-0 py-0 shadow-sm">
          <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                01
              </Badge>
              <CardTitle className="text-base">Service identity</CardTitle>
            </div>
            <CardDescription>
              Name, category, and type should be easy to scan even on mobile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
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
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="gap-0 py-0 shadow-sm">
            <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  02
                </Badge>
                <CardTitle className="text-base">Presentation</CardTitle>
              </div>
              <CardDescription>
                Add a description and icon so the service feels polished.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
              <TextareaField
                label="Description"
                value={service.description}
                placeholder="Enter a brief description for this service"
                onChange={(v) => handleChange("description", v)}
              />

              <ImagePicker
                label="Icon"
                collection="services"
                value={service.icon}
                onChange={(data) => handleChange("icon", data.url)}
              />
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-sm">
            <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  03
                </Badge>
                <CardTitle className="text-base">Pricing and limits</CardTitle>
              </div>
              <CardDescription>
                Keep the retail pricing easy to understand and edit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-2">
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

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Price per 1000
                </p>
                <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 transition hover:border-primary/60 focus-within:border-primary">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {userCurrency}
                  </span>
                  <Input
                    type="text"
                    value={localPrice}
                    required
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalPrice(val);
                      handleChange("price", val);
                      handleChange("currency", userCurrency);
                    }}
                    className="h-11 border-0 bg-transparent pl-3 text-base shadow-none focus-visible:ring-0"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showProviderFields && (
        <Card className="gap-0 py-0 shadow-sm">
          <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                04
              </Badge>
              <CardTitle className="text-base">Provider sync</CardTitle>
            </div>
            <CardDescription>
              Connect the upstream provider and keep advanced sync options easy
              to scan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-5 sm:px-6">
            <SelectField
              label="Provider"
              options={providerOptions}
              value={service.providerUid}
              onChange={(v) => handleChange("providerUid", v)}
              showImage
              required
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Provider price per 1000
              </p>
              <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 transition hover:border-primary/60 focus-within:border-primary">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {userCurrency}
                </span>
                <Input
                  type="text"
                  value={localProviderPrice}
                  required
                  disabled
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalProviderPrice(val);
                    handleChange("providerPrice", val);
                  }}
                  className="h-11 border-0 bg-transparent pl-3 text-base shadow-none focus-visible:ring-0"
                  placeholder="0.00"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {syncOptions.map((opt) => (
                <div
                  key={opt.key}
                  className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                  <Switch
                    checked={service[opt.key]}
                    onCheckedChange={(v) => handleChange(opt.key, v)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <ImportServicesDialog
        open={showImportServices}
        onOpenChange={(open) => handleImportClick(open)}
      />
    </div>
  );
}
