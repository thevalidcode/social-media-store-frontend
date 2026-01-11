"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowRight } from "lucide-react";
import { getCurrencySymbol } from "@/app/_docs/doc";
import { CurrencyCode } from "@/lib/currencyConverter";

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
  onSubmit: (e: React.FormEvent) => void;
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
  onSubmit,
  isDisabled,
}: PaymentFormProps) {
  const amt = parseFloat(String(amount)) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-6"
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-medium">
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
                  onChange={(e) =>
                    onAmountChange(parseFloat(e.target.value) || 0)
                  }
                  className="pl-8 text-lg h-12 font-semibold"
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

            {/* Summary */}
            <AnimatePresence mode="wait">
              <motion.div
                key={amt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {getCurrencySymbol(userCurrency)}
                      {amt.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Processing Fee ({percent}%)
                    </span>
                    <span className="font-medium">
                      {getCurrencySymbol(userCurrency)}
                      {fee.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {getCurrencySymbol(userCurrency)}
                      {total}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isDisabled}
                  className="w-full group"
                >
                  {isManualPayment ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Manual Payment - Contact Support
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue to Payment
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                {isManualPayment && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground text-center"
                  >
                    Please follow the instructions above to complete your manual
                    payment
                  </motion.p>
                )}

                {(amt < minAmount || amt > maxAmount) && amt > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-destructive text-center"
                  >
                    Amount must be between {getCurrencySymbol(userCurrency)}
                    {minAmount.toLocaleString()} and{" "}
                    {getCurrencySymbol(userCurrency)}
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
