"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PaymentGateway, PaymentGatewayStatus } from "@/types";
import PaymentMethodActions from "./PaymentMethodActions";
import { Badge } from "@/components/ui/badge";
import { useUpdatePaymentGatewayStatus } from "@/hooks/use-paymentGateway";

export default function PaymentMethodsTable({
  gateways,
  setGateways,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  const { mutateAsync: updateGatewayStatus } = useUpdatePaymentGatewayStatus();

  const toggleStatus = async (storeScopedId: number) => {
    const updatedGateways = gateways.map((g) =>
      g.storeScopedId === storeScopedId
        ? {
            ...g,
            status:
              g.status === "ACTIVE"
                ? "DISABLED"
                : ("ACTIVE" as PaymentGatewayStatus),
          }
        : g
    );

    setGateways(updatedGateways);

    const updatedGateway = updatedGateways.find(
      (g) => g.storeScopedId === storeScopedId
    )!;

    await updateGatewayStatus(updatedGateway);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Webhook</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gateways.map((g) => (
            <TableRow key={g.id}>
              <TableCell className="flex items-center gap-3">
                <img src={g.image} alt={g.name} className="w-6 h-6 rounded" />
                <span className="font-medium">{g.name}</span>
              </TableCell>
              <TableCell>{g.platform}</TableCell>
              <TableCell className="truncate max-w-xs text-muted-foreground">
                {g.webhookUrl || "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={g.status === "ACTIVE"}
                    onCheckedChange={() => toggleStatus(g.storeScopedId)}
                  />
                  <Badge
                    variant="outline"
                    className={
                      g.status === "ACTIVE"
                        ? "text-green-600 border-green-600"
                        : "text-red-600 border-red-600"
                    }
                  >
                    {g.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <PaymentMethodActions gateway={g} setGateways={setGateways} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
