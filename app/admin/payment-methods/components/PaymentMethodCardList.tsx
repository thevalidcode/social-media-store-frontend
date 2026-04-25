"use client";

import { useState } from "react";
import { PaymentGateway } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { platformLogos } from "@/app/_docs/doc";
import { useUpdatePaymentGatewayStatus } from "@/hooks/use-paymentGateway";
import PaymentMethodActions from "./PaymentMethodActions";
import { Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

export function PaymentMethodCardList({
  gateways,
  setGateways,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  return (
    <div className="grid gap-4">
      {gateways.map((gateway) => (
        <PaymentMethodCard
          key={gateway.uid}
          gateway={gateway}
          setGateways={setGateways}
        />
      ))}
    </div>
  );
}

function PaymentMethodCard({
  gateway,
  setGateways,
}: {
  gateway: PaymentGateway;
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  const { mutateAsync: updateGatewayStatus } = useUpdatePaymentGatewayStatus();
  const [showWebhook, setShowWebhook] = useState(false);

  const toggleStatus = async () => {
    const nextStatus = gateway.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await updateGatewayStatus({ uid: gateway.uid, status: nextStatus });
    setGateways((prev) =>
      prev.map((current) =>
        current.uid === gateway.uid
          ? { ...current, status: nextStatus }
          : current,
      ),
    );
  };

  const copyWebhook = async () => {
    if (!gateway.webhookUrl) return;
    await navigator.clipboard.writeText(gateway.webhookUrl);
    toast.success("Webhook URL copied");
  };

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <img
          src={platformLogos[gateway.platform]}
          alt={gateway.platform}
          className="h-11 w-11 rounded-lg border bg-background p-1"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{gateway.name}</h3>
            <Badge
              variant={gateway.status === "ACTIVE" ? "default" : "secondary"}
            >
              {gateway.status}
            </Badge>
            <Badge variant="outline">{gateway.platform}</Badge>
          </div>

          {gateway.description ? (
            <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">
              {gateway.description}
            </p>
          ) : null}

          {gateway.content ? (
            <p className="text-xs text-muted-foreground/90">
              HTML content is configured for this gateway.
            </p>
          ) : null}

          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <p>
              Min:{" "}
              <span className="font-medium text-foreground">{gateway.min}</span>
            </p>
            <p>
              Max:{" "}
              <span className="font-medium text-foreground">{gateway.max}</span>
            </p>
            <p>
              Currency:{" "}
              <span className="font-medium text-foreground">
                {gateway.currency || "USD"}
              </span>
            </p>
          </div>

          {gateway.webhookUrl ? (
            <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
              <span className="flex-1 truncate text-xs text-muted-foreground">
                {showWebhook
                  ? gateway.webhookUrl
                  : "••••••••••••••••••••••••••"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowWebhook((prev) => !prev)}
              >
                {showWebhook ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={copyWebhook}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Switch
            checked={gateway.status === "ACTIVE"}
            onCheckedChange={toggleStatus}
          />
          <PaymentMethodActions gateway={gateway} setGateways={setGateways} />
        </div>
      </div>
    </Card>
  );
}
