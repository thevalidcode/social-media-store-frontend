"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Info, BadgeCheck, Clock3 } from "lucide-react";
import { PaymentGatewayPublic } from "@/types";
import { platformLogos } from "@/app/_docs/doc";
import parse from "html-react-parser";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentGatewayPublic[];
  selectedMethod: string;
  onMethodChange: (platform: string) => void;
  selectedGateway?: PaymentGatewayPublic;
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedMethod,
  onMethodChange,
  selectedGateway,
}: PaymentMethodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Select a payment gateway
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the gateway you want to use for wallet top-ups and payment processing.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {paymentMethods.map((m, index) => (
              <motion.div
                key={m.storeScopedId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`group h-full cursor-pointer overflow-hidden border transition-all duration-200 ${
                    selectedMethod === m.platform
                      ? "border-primary bg-primary/5 ring-2 ring-primary/25"
                      : "hover:border-primary/40 hover:shadow-md"
                  }`}
                  onClick={() => onMethodChange(m.platform)}
                >
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
                          <img
                            src={platformLogos[m.platform]}
                            alt={m.name}
                            className="h-9 w-9 object-contain"
                          />
                        </div>
                        {selectedMethod === m.platform && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {m.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-0 text-xs"
                          >
                            <Clock3 className="h-3 w-3" />
                            {m.feePercent}% fee
                          </Badge>
                          <Badge variant="outline" className="px-2 py-0 text-xs">
                            {m.platform}
                          </Badge>
                          {m.platform === "MANUAL" && (
                            <Badge
                              variant="destructive"
                              className="px-2 py-0 text-xs"
                            >
                              Manual
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Min {Number(m.min).toLocaleString()} · Max {Number(m.max).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedGateway &&
            (selectedGateway.description || selectedGateway.content) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-border bg-muted/20 p-4"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      Gateway details
                    </h4>
                    <Badge variant="outline" className="gap-1 text-[10px] uppercase tracking-[0.18em]">
                      <BadgeCheck className="h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                  {selectedGateway.description ? (
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                      {selectedGateway.description}
                    </div>
                  ) : null}
                  {selectedGateway.content ? (
                    <div className="richtext-content richtext-render prose prose-sm max-w-none text-sm text-muted-foreground">
                      {parse(selectedGateway.content)}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
