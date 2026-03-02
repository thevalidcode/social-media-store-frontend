"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FormEvent } from "react";
import { PaymentGateway } from "@/types";
import { motion } from "framer-motion";
import WysiwygEditor from "@/components/WysiwygEditor";
import { FeatureGate } from "@/components/FeatureGate";

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
        <WysiwygEditor
          key={form.uid || (isEdit ? "edit" : "new")}
          initialContent={form.description}
          onChange={(e) => onFieldChange("description", e)}
          collection="payment-gateways"
          className="min-h-[200px]"
          placeholder="e.g. Pay with card, transfer e.t.c"
        />
      </div>

      {/* Min and Max Amount */}
      <div className="flex lg:gap-2 gap-1">
        <div className="flex flex-col lg:gap-2 gap-1 w-full">
          <Label htmlFor="min">Min Amount</Label>
          <Input
            id="min"
            type="text"
            placeholder="e.g. 10"
            value={form.min}
            onChange={(e) => onFieldChange("min", e.target.value)}
          />
        </div>
        <div className="flex flex-col lg:gap-2 gap-1 w-full">
          <Label htmlFor="max">Max Amount</Label>
          <Input
            id="max"
            type="text"
            placeholder="e.g. 10000"
            value={form.max}
            onChange={(e) => onFieldChange("max", e.target.value)}
          />
        </div>
      </div>

      {/* Secret Key - Only for non-manual platforms */}
      {form.platform !== "MANUAL" && form.platform !== "REFERRAL" && (
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
      {form.platform !== "MANUAL" && form.platform !== "REFERRAL" && (
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
