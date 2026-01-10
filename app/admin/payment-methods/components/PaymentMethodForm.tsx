"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { PaymentGateway, PaymentGatewayPlatform } from "@/types";
import {
  Pencil,
  Plus,
  Settings,
  CheckCircle,
  CreditCard,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/context/appContext";
import { PaymentGatewayFormResponse } from "@/hooks/use-paymentGateway";
import PaymentMethodFormFields from "./PaymentMethodFormFields";
import { useCurrencyConverter } from "@/lib/currencyConverter";

interface NewPaymentGateway extends PaymentGateway {
  secretKey?: string;
}

type DialogMode = "select" | "manual";

export interface PlatformOption {
  value: PaymentGatewayPlatform;
  label: string;
  image: string;
  webhook: string | null;
  description: string;
}

export default function PaymentMethodForm({
  open,
  onClose,
  onSave,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (gateway: PaymentGateway) => Promise<PaymentGatewayFormResponse>;
  initialData?: PaymentGateway;
}) {
  const { domain, userCurrency } = useAppContext();
  const [mode, setMode] = useState<DialogMode>("select");
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState<NewPaymentGateway>(
    initialData || {
      id: Date.now(),
      position: Date.now(),
      uid: "",
      storeScopedId: Date.now(),
      createdAt: new Date(),
      name: "",
      platform: "MANUAL",
      image: "",
      min: "",
      max: "",
      description: "",
      webhookUrl: "",
      status: "ACTIVE",
      feePercent: 0,
      secretKey: "",
    }
  );
  const [showSignaturePopup, setShowSignaturePopup] = useState(false);
  const [signature, setSignature] = useState("");
  const convert = useCurrencyConverter();

  const platforms: PlatformOption[] = [
    {
      value: "MANUAL",
      label: "Manual Payment",
      image: "/images/manual-payment.webp",
      webhook: null,
      description: "Accept manual payments via bank transfer or other methods",
    },
    {
      value: "PAYSTACK",
      label: "Paystack",
      image: "/images/paystack.png",
      webhook: "paystack",
      description: "Modern payment gateway for African businesses",
    },
    {
      value: "FLUTTERWAVE",
      label: "Flutterwave",
      image: "/images/flutterwave.jpeg",
      webhook: "flutterwave",
      description: "Process payments across Africa and beyond",
    },
  ];

  // Filter platforms based on search
  const filteredPlatforms = platforms.filter(
    (platform) =>
      platform.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        min: convert("USD", userCurrency, initialData.min).amount,
        max: convert("USD", userCurrency, initialData.max).amount,
      });
    }
  }, [initialData]);

  // Reset form on open/close
  useEffect(() => {
    if (open && initialData) {
      // Edit mode - always manual
      setMode("manual");
      setSelectedPlatform(
        platforms.find((p) => p.value === initialData.platform) || null
      );
    } else if (open && !initialData) {
      // Create mode - start with select
      setMode("select");
      setSelectedPlatform(null);
      setSearchQuery("");
    }
  }, [open, initialData]);

  const handlePlatformSelect = (platform: PlatformOption) => {
    setSelectedPlatform(platform);
    setForm((prev) => ({
      ...prev,
      platform: platform.value as PaymentGatewayPlatform,
      name: platform.label,
      image: `https://${domain}${platform.image}`,
      webhookUrl: platform.webhook
        ? `https://${domain}/webhooks/${platform.webhook}`
        : "",
    }));
    setMode("manual");
  };

  const handleModeChange = (newMode: DialogMode) => {
    setMode(newMode);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const fieldParsers: Record<string, (v: string) => any> = {
    feePercent: (v) => Number(v),
    min: (v) => Number(v),
    max: (v) => Number(v),
    name: (v) => v,
    description: (v) => v,
    secretKey: (v) => v,
    image: (v) => v,
    webhookUrl: (v) => v,
    platform: (v) => v,
    status: (v) => v,
  };

  const handleChange = (key: keyof NewPaymentGateway, rawValue: string) => {
    const parser = fieldParsers[key];
    const parsed = parser ? parser(rawValue) : rawValue;

    setForm((prev) => ({
      ...prev,
      [key]: parsed,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await onSave(form);

    if (response.success && response.signature) {
      setSignature(response.signature);
      setShowSignaturePopup(true);
    }

    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              {initialData ? (
                <>
                  <Pencil className="h-5 w-5 text-blue-500" />
                  Edit Payment Method
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-green-500" />
                  Create New Payment Method
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {initialData
                ? "Make changes to your payment method here."
                : "Choose from available payment gateways or create a custom one."}
            </DialogDescription>
          </DialogHeader>

          {!initialData && (
            <Tabs
              value={mode}
              onValueChange={(value) => handleModeChange(value as DialogMode)}
              className="w-full"
            >
              <div className="px-6 py-2 border-b bg-muted/30">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="select"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Select Gateway
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="select" className="mt-0">
                <div className="px-6 py-4 max-h-[500px] overflow-y-auto">
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payment gateways..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Gateway List */}
                  {filteredPlatforms.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-2">
                        No gateways found
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or switch to manual entry.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredPlatforms.map((platform) => (
                        <motion.div
                          key={platform.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedPlatform?.value === platform.value
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => handlePlatformSelect(platform)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg">
                                  <AvatarImage
                                    src={platform.image}
                                    alt={platform.label}
                                  />
                                  <AvatarFallback className="rounded-lg">
                                    <CreditCard className="h-6 w-6" />
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm truncate">
                                      {platform.label}
                                    </h3>
                                    {selectedPlatform?.value ===
                                      platform.value && (
                                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {platform.description}
                                  </p>
                                </div>

                                <Badge variant="secondary" className="text-xs">
                                  Available
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {selectedPlatform && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarImage
                            src={selectedPlatform.image}
                            alt={selectedPlatform.label}
                          />
                          <AvatarFallback className="rounded-lg">
                            <CreditCard className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {selectedPlatform.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedPlatform.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-0">
                <div className="max-h-[500px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <PaymentMethodFormFields
                      form={form}
                      isEdit={false}
                      onSubmit={handleSubmit}
                      onFieldChange={handleChange}
                    />
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Edit Mode - Always Manual */}
          {initialData && (
            <div className="max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="wait">
                <PaymentMethodFormFields
                  form={form}
                  isEdit={true}
                  onSubmit={handleSubmit}
                  onFieldChange={handleChange}
                />
              </AnimatePresence>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSignaturePopup} onOpenChange={setShowSignaturePopup}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {initialData ? "Gateway Updated" : "Gateway Created"}
            </DialogTitle>
            <DialogDescription>
              Your gateway has been {initialData ? "updated" : "created"}{" "}
              successfully. This signature will only be shown once, copy and
              store it safely.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-5">
            <div className="mt-4">
              <Label>Signature</Label>
              <Input value={signature} readOnly className="mt-2" />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button onClick={() => setShowSignaturePopup(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
