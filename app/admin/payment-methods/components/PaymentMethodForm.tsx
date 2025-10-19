"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentGateway } from "@/types";

export default function PaymentMethodForm({
  open,
  onClose,
  onSave,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (gateway: PaymentGateway) => void;
  initialData?: PaymentGateway;
}) {
  const [form, setForm] = useState<PaymentGateway>(
    initialData || {
      id: String(Date.now()),
      name: "",
      platform: "",
      icon: "",
      description: "",
      publicKey: "",
      secretKey: "",
      webhookUrl: "",
      status: "inactive",
    }
  );

  const handleChange = (key: keyof PaymentGateway, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Gateway" : "Add Gateway"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {[
            "name",
            "platform",
            "icon",
            "description",
            "publicKey",
            "secretKey",
            "webhookUrl",
          ].map((field) => (
            <div key={field} className="grid gap-2">
              <Label className="capitalize">{field}</Label>
              <Input
                value={form[field as keyof PaymentGateway] as string}
                onChange={(e) =>
                  handleChange(field as keyof PaymentGateway, e.target.value)
                }
              />
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit}>
              {initialData ? "Save Changes" : "Add Gateway"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
