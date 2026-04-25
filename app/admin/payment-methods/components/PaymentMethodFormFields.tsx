"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FormEvent } from "react";
import { PaymentGateway } from "@/types";
import { motion } from "framer-motion";
import { FeatureGate } from "@/components/FeatureGate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currency as currencyMap } from "@/app/_docs/doc";
import WysiwygEditor from "@/components/WysiwygEditor";

interface NewPaymentGateway extends PaymentGateway {
  secretKey?: string;
}

interface PaymentMethodFormFieldsProps {
  form: NewPaymentGateway;
  isEdit: boolean;
  onSubmit: (e: FormEvent) => void;
  onFieldChange: (key: keyof NewPaymentGateway, value: string) => void;
  isSubscriptionActive?: boolean;
}

export default function PaymentMethodFormFields({
  form,
  isEdit,
  onSubmit,
  onFieldChange,
  isSubscriptionActive = true,
}: PaymentMethodFormFieldsProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="px-6 py-4 space-y-5"
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
          placeholder="e.g. Pay with Paystack"
          value={form.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          required
        />
      </div>

      {/* Description Field */}
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Short note shown to users (supports line breaks)"
          rows={3}
        />
      </div>

      {/* Content Field */}
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label htmlFor="content">Content</Label>
        <WysiwygEditor
          collection="payment-gateways"
          initialContent={form.content ?? ""}
          placeholder="Optional rich content shown to users on add funds page"
          onChange={(html) => onFieldChange("content", html)}
          showToolbar
          enable={{
            bold: true,
            italic: true,
            underline: false,
            headings: true,
            lists: true,
            align: true,
            image: true,
            link: true,
            highlight: true,
            color: true,
            fontFamily: false,
            fontSize: false,
            code: false,
          }}
        />
      </div>

      {/* Min and Max Amount */}
      <div className="flex lg:gap-2 gap-1">
        <div className="flex flex-col lg:gap-2 gap-1 w-full">
          <Label htmlFor="min">Min Amount ({form.currency || "USD"})</Label>
          <Input
            id="min"
            type="text"
            placeholder="e.g. 10"
            value={form.min}
            onChange={(e) => onFieldChange("min", e.target.value)}
          />
        </div>
        <div className="flex flex-col lg:gap-2 gap-1 w-full">
          <Label htmlFor="max">Max Amount ({form.currency || "USD"})</Label>
          <Input
            id="max"
            type="text"
            placeholder="e.g. 10000"
            value={form.max}
            onChange={(e) => onFieldChange("max", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:gap-2 gap-1">
        <Label htmlFor="currency">Gateway Currency</Label>
        <Select
          value={form.currency || "USD"}
          onValueChange={(value) => onFieldChange("currency", value)}
        >
          <SelectTrigger id="currency" className="w-full">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {Object.entries(currencyMap).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {code} - {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Secret Key - Only for non-manual platforms */}
      {form.platform !== "MANUAL" && form.platform !== "CREDIT" && (
        <div className="flex flex-col lg:gap-2 gap-1">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input
            id="secretKey"
            type="password"
            placeholder="e.g. sk_live******"
            value={form.secretKey}
            onChange={(e) => onFieldChange("secretKey", e.target.value)}
            required
          />
        </div>
      )}

      {/* Fee Percent */}
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label htmlFor="feePercent">Fee Percent</Label>
        <Input
          type="number"
          id="feePercent"
          placeholder="e.g. 10"
          value={form.feePercent}
          onChange={(e) => onFieldChange("feePercent", e.target.value)}
        />
      </div>

      {/* Webhook URL - Only for non-manual platforms */}
      {form.platform !== "MANUAL" && form.platform !== "CREDIT" && (
        <div className="flex flex-col lg:gap-2 gap-1">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
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
        <FeatureGate
          isAllowed={isSubscriptionActive}
          featureLabel="Payment Gateway Management"
          variant="tooltip"
          description="You need an active subscription to manage payment gateways. Please renew your subscription to continue."
        >
          <Button type="submit" className="w-full sm:w-auto">
            {isEdit ? "Update Gateway" : "Create Gateway"}
          </Button>
        </FeatureGate>
      </DialogFooter>
    </motion.form>
  );
}
