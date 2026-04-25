"use client";

import { Card } from "@/components/ui/card";
import { PaymentGateway } from "@/types";
import { CheckCircle2, CreditCard, Gauge, XCircle } from "lucide-react";

export function PaymentMethodStats({ gateways }: { gateways: PaymentGateway[] }) {
  const total = gateways.length;
  const active = gateways.filter((gateway) => gateway.status === "ACTIVE").length;
  const disabled = gateways.filter((gateway) => gateway.status === "DISABLED").length;
  const withFee = gateways.filter((gateway) => Number(gateway.feePercent || 0) > 0).length;

  const cards = [
    { label: "Total", value: total, icon: CreditCard },
    { label: "Active", value: active, icon: CheckCircle2 },
    { label: "Disabled", value: disabled, icon: XCircle },
    { label: "With fee", value: withFee, icon: Gauge },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold">{card.value}</p>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
