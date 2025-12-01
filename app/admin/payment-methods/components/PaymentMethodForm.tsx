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
import { Pencil, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WysiwygEditor from "@/components/WysiwygEditor";
import { useAppContext } from "@/context/appContext";
import { PaymentGatewayFormResponse } from "@/hooks/use-paymentGateway";

interface NewPaymentGateway extends PaymentGateway {
  secretKey?: string;
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
  const { domain } = useAppContext();
  const [form, setForm] = useState<NewPaymentGateway>(
    initialData || {
      id: Date.now(),
      position: Date.now(),
      uid: "",
      storeScopedId: Date.now(),
      createdAt: new Date().toLocaleDateString(),
      name: "",
      platform: "MANUAL",
      image: "",
      min: "",
      max: "",
      description: "",
      webhookUrl: "",
      status: "INACTIVE",
      feePercent: 0,
      secretKey: "",
    }
  );
  const [showSignaturePopup, setShowSignaturePopup] = useState(false);
  const [signature, setSignature] = useState("");

  const platforms = [
    {
      value: "MANUAL",
      label: "Manual",
      image: "/images/manual-payment.webp",
      webhook: null,
    },
    {
      value: "PAYSTACK",
      label: "Paystack",
      image: "/images/paystack.png",
      webhook: "paystack",
    },
    {
      value: "FLUTTERWAVE",
      label: "Flutterwave",
      image: "/images/flutterwave.jpeg",
      webhook: "flutterwave",
    },
  ];
  const handlePlatformChange = (value: string) => {
    const selected = platforms.find((p) => p.value === value);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      platform: value as PaymentGatewayPlatform,
      image: `https://${domain}${selected.image}`,
      webhookUrl: selected.webhook
        ? `https://${domain}/webhooks/${selected.webhook}`
        : "",
    }));
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-6 overflow-y-scroll">
          <DialogHeader>
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
                : "Add a new payment method to your list."}
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Name Field */}
              <div className="flex flex-col lg:gap-2 gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Pay with method"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col lg:gap-2 gap-1 w-full">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={form.platform}
                  onValueChange={handlePlatformChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.label}
                            className="w-5 h-5 rounded"
                          />
                          <span>{p.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col lg:gap-2 gap-1">
                <Label htmlFor="description">Description</Label>
                <WysiwygEditor
                  key={form.uid || "new"}
                  initialContent={form.description}
                  onChange={(e) => handleChange("description", e)}
                  collection="payment-gateways"
                  className="min-h-[420px]"
                  placeholder="e.g. Pay with card, transfer e.t.c"
                />
              </div>

              <div className="flex lg:gap-2 gap-1">
                <div className="flex flex-col lg:gap-2 gap-1 w-full">
                  <Label htmlFor="min">Min</Label>
                  <Input
                    id="min"
                    type="text"
                    placeholder="e.g. 10"
                    value={form.min}
                    onChange={(e) => handleChange("min", e.target.value)}
                  />
                </div>
                <div className="flex flex-col lg:gap-2 gap-1 w-full">
                  <Label htmlFor="max">Max</Label>
                  <Input
                    id="max"
                    type="text"
                    placeholder="e.g. 10000"
                    value={form.max}
                    onChange={(e) => handleChange("max", e.target.value)}
                  />
                </div>
              </div>

              {form.platform !== "MANUAL" && form.platform !== "REFERRAL" && (
                <div className="flex flex-col lg:gap-2 gap-1">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="text"
                    placeholder="e.g. sk_live******"
                    value={form.secretKey}
                    onChange={(e) => handleChange("secretKey", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex flex-col lg:gap-2 gap-1">
                <Label htmlFor="feePercent">Fee Percent</Label>
                <Input
                  type="number"
                  id="feePercent"
                  placeholder="e.g. 10"
                  value={form.feePercent}
                  onChange={(e) => handleChange("feePercent", e.target.value)}
                />
              </div>

              {form.platform !== "MANUAL" && form.platform !== "REFERRAL" && (
                <div className="flex flex-col lg:gap-2 gap-1">
                  <Label htmlFor="webhookUrl">Webhook Url</Label>
                  <Input
                    type="text"
                    id="webhookUrl"
                    placeholder="e.g. https://store.com/webhooks/platform"
                    value={form.webhookUrl}
                    disabled
                  />
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full sm:w-auto">
                  {initialData ? "Save Changes" : "Add Gateway"}
                </Button>
              </DialogFooter>
            </motion.form>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      <Dialog open={showSignaturePopup} onOpenChange={setShowSignaturePopup}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Gateway Updated" : "Gateway Created"}
            </DialogTitle>
            <DialogDescription>
              Your gateway has been {initialData ? "updated" : "created"}{" "}
              successfully. This signature will only be shown once, copy and
              store it safely.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Label>Signature</Label>
            <Input value={signature} readOnly className="mt-2" />
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={() => setShowSignaturePopup(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
