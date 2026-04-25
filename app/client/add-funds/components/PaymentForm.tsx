"use client";

import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrencySymbol } from "@/app/_docs/doc";
import { CurrencyCode } from "@/lib/currencyConverter";
import { Badge } from "@/components/ui/badge";
import { PaymentGatewayPublic } from "@/types";
import parse from "html-react-parser";

interface PaymentFormProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  minAmount: number;
  maxAmount: number;
  fee: number;
  total: string;
  percent: number;
  userCurrency: CurrencyCode;
  isManualPayment: boolean;
  selectedGateway?: PaymentGatewayPublic;
  onSubmit: (e: FormEvent) => void;
  isDisabled: boolean;
}

export function PaymentForm({
  amount,
  onAmountChange,
  minAmount,
  maxAmount,
  fee,
  total,
  percent,
  userCurrency,
  isManualPayment,
  selectedGateway,
  onSubmit,
  isDisabled,
}: PaymentFormProps) {
  const amt = Number(amount) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-6"
    >
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Top-up details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Confirm the amount, review the gateway fee, and continue to secure checkout.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Enter Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                  {getCurrencySymbol(userCurrency)}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount || ""}
                  onChange={(e) => onAmountChange(Number.parseFloat(e.target.value) || 0)}
                  className="h-12 pl-8 text-lg font-semibold"
                  required
                  min={minAmount}
                  max={maxAmount}
                  step="0.01"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Min: {getCurrencySymbol(userCurrency)}
                  {minAmount.toLocaleString()}
                </span>
                <span>
                  Max: {getCurrencySymbol(userCurrency)}
                  {maxAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Separator />

            <AnimatePresence mode="wait">
              <motion.div
                key={amt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">
                      {getCurrencySymbol(userCurrency)}
                      {amt.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Processing Fee ({percent}%)
                    </span>
                    <span className="font-medium text-foreground">
                      {getCurrencySymbol(userCurrency)}
                      {fee.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      {getCurrencySymbol(userCurrency)}
                      {total}
                    </span>
                  </div>
                </div>

                {selectedGateway && (
                  <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          {selectedGateway.name}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Min {Number(selectedGateway.min).toLocaleString()} · Max {Number(selectedGateway.max).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={isManualPayment ? "destructive" : "outline"}>
                        {isManualPayment ? "Manual" : "Direct"}
                      </Badge>
                    </div>

                    {selectedGateway.description ? (
                      <div className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {selectedGateway.description}
                      </div>
                    ) : null}

                    {selectedGateway.content ? (
                      <div className="prose prose-sm mt-3 max-w-none text-sm text-muted-foreground">
                        {parse(selectedGateway.content)}
                      </div>
                    ) : null}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isDisabled}
                  className="group h-12 w-full"
                >
                  {isManualPayment ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Manual Payment - Contact Support
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue to Payment
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Your wallet will be credited automatically after a successful payment.
                </p>

                {isManualPayment && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-muted-foreground"
                  >
                    Please follow the instructions above to complete your manual payment.
                  </motion.p>
                )}

                {(amt < minAmount || amt > maxAmount) && amt > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-destructive"
                  >
                    Amount must be between {getCurrencySymbol(userCurrency)}
                    {minAmount.toLocaleString()} and {getCurrencySymbol(userCurrency)}
                    {maxAmount.toLocaleString()}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
