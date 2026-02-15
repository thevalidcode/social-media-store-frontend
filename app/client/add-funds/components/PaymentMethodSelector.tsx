"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Info } from "lucide-react";
import { PaymentGatewayPublic } from "@/types";
import { platformLogos } from "@/app/_docs/doc";

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
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
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedMethod === m.platform
                      ? "ring-2 ring-primary bg-primary/5 border-primary"
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                  onClick={() => onMethodChange(m.platform)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          <img
                            src={platformLogos[m.platform]}
                            alt={m.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        {selectedMethod === m.platform && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {m.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0"
                          >
                            {m.feePercent}% fee
                          </Badge>
                          {m.platform === "MANUAL" && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              Manual
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-colors ${
                            selectedMethod === m.platform
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {selectedMethod === m.platform && (
                            <Check className="h-full w-full text-primary-foreground p-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Payment Gateway Description */}
          {selectedGateway && selectedGateway.description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Card className="border-l-4 border-l-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        Payment Instructions
                      </h4>
                      <div
                        className="text-sm text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: selectedGateway.description,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
