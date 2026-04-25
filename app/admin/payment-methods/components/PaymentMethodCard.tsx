"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentGateway } from "@/types";
import { motion } from "framer-motion";
import PaymentMethodActions from "./PaymentMethodActions";
import parse from "html-react-parser";
import { platformLogos } from "@/app/_docs/doc";

type Props = {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
};

export default function PaymentMethodCard({ gateways, setGateways }: Props) {
  return (
    <div className="grid gap-6">
      {gateways.map((gateway) => (
        <motion.div
          key={gateway.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border p-5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center gap-4 pb-3">
              <img
                src={platformLogos[gateway.platform]}
                alt={gateway.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">
                  {gateway.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {gateway.platform}
                </p>
              </div>
              <Badge
                className="ml-auto px-3 py-1 text-sm"
                variant={gateway.status === "ACTIVE" ? "default" : "secondary"}
              >
                {gateway.status === "ACTIVE" ? "Active" : "Disabled"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              {gateway.description ? (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                  {gateway.description}
                </div>
              ) : null}

              {gateway.content ? (
                <div className="prose prose-sm max-w-none text-sm text-muted-foreground">
                  {parse(gateway.content)}
                </div>
              ) : null}

              {gateway.webhookUrl && (
                <div className="text-xs bg-muted/20 p-2 rounded-md flex justify-between items-center">
                  <span>
                    <strong>Webhook:</strong> {gateway.webhookUrl}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(gateway.webhookUrl)
                    }
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Copy
                  </button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
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
