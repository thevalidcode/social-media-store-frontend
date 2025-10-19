"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentGateway } from "@/types";
import { motion } from "framer-motion";
import PaymentMethodActions from "./PaymentMethodActions";

type Props = {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
};

export default function PaymentMethodCard({ gateways, setGateways }: Props) {
  return (
    <div className="grid gap-4">
      {gateways.map((gateway) => (
        <motion.div
          key={gateway.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border p-4 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <img
                src={gateway.icon}
                alt={gateway.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold">
                  {gateway.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {gateway.platform}
                </p>
              </div>
              <Badge
                className="ml-auto"
                variant={gateway.status === "active" ? "default" : "secondary"}
              >
                {gateway.status === "active" ? "Active" : "Disabled"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {gateway.description}
              </p>

              <div className="text-xs bg-muted/30 p-2 rounded-md">
                <div>
                  <strong>Webhook:</strong> {gateway.webhookUrl}
                </div>
                <div className="mt-1">
                  <strong>Secret:</strong> {gateway.secretKey}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <PaymentMethodActions
                gateway={gateway}
                setGateways={setGateways}
              />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
