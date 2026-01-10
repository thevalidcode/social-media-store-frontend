"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { getCurrencySymbol } from "@/app/_docs/doc";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Check,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useCreatePayment } from "@/hooks/use-payment";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AddFunds() {
  const { userCurrency, userInfo } = useAppContext();
  const router = useRouter();
  const convert = useCurrencyConverter();

  const { mutate } = useCreatePayment();
  const { data: PAYMENT_METHODS, isLoading } = useGetAllPaymentGateways();

  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("");

  // Set initial method when payment methods are loaded
  React.useEffect(() => {
    if (PAYMENT_METHODS && PAYMENT_METHODS.length > 0 && !method) {
      setMethod(PAYMENT_METHODS[0].platform);
    }
  }, [PAYMENT_METHODS]);

  if (isLoading) return <Loading />;

  if (!PAYMENT_METHODS?.length) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No Payment Method Found"
        description="You have not created any payment method for this store."
      />
    );
  }

  const selectedMethod = PAYMENT_METHODS.find((m) => m.platform === method);

  if (!selectedMethod) {
    return <Loading />;
  }

  // Convert min/max requirement from USD to user's currency
  const minAmount = parseInt(
    convert("USD", userCurrency, selectedMethod?.min, false, false).amount
  );
  const maxAmount = parseInt(
    convert("USD", userCurrency, selectedMethod?.max, false, false).amount
  );

  const amt = parseFloat(String(amount)) || 0;
  const percent = selectedMethod?.feePercent ?? 0;

  const fee = (amt * percent) / 100;
  const totalValue = amt + fee;

  const total = totalValue.toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amt < minAmount) {
      toast.error(
        `Minimum amount is ${getCurrencySymbol(
          userCurrency
        )}${minAmount.toLocaleString()}`
      );
      return;
    }

    if (amt > maxAmount) {
      toast.error(
        `Maximum amount is ${getCurrencySymbol(
          userCurrency
        )}${maxAmount.toLocaleString()}`
      );
      return;
    }

    mutate(
      {
        platform: selectedMethod?.platform,
        currency: userCurrency,
        amount: String(totalValue),
        redirect_url: `${window.location.origin}/client/add-funds`,
      },
      {
        onSuccess: (data) => router.push(data.url),
        onError: (error: any) =>
          toast.error(error.message || "Failed to create payment"),
      }
    );
  };

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Add Funds
          </h1>
          <p className="text-muted-foreground">
            Top up your account balance securely and instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 bg-gradient-to-br from-primary/5 via-primary/3 to-background">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Available Balance
                      </p>
                      <p className="text-3xl md:text-4xl font-bold">
                        {
                          convert(
                            "USD",
                            userCurrency,
                            userInfo?.balance!,
                            true,
                            false
                          ).formatted
                        }
                      </p>
                    </div>
                    <div className="p-4 rounded-full bg-primary/10">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Methods */}
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
                    {PAYMENT_METHODS.map((m, index) => (
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
                            method === m.platform
                              ? "ring-2 ring-primary bg-primary/5 border-primary"
                              : "hover:border-primary/50 hover:shadow-md"
                          }`}
                          onClick={() => setMethod(m.platform)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                  <img
                                    src={m.image}
                                    alt={m.name}
                                    className="w-10 h-10 object-contain"
                                  />
                                </div>
                                {method === m.platform && (
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
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                    method === m.platform
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/30"
                                  }`}
                                >
                                  {method === m.platform && (
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
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Amount & Summary */}
          <div className="lg:col-span-1">
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
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                            setAmount(parseFloat(e.target.value) || 0)
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
                            <span className="text-muted-foreground">
                              Amount
                            </span>
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
                          disabled={
                            amt <= 0 || amt < minAmount || amt > maxAmount
                          }
                          className="w-full group"
                        >
                          <span className="flex items-center gap-2">
                            Continue to Payment
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>

                        {(amt < minAmount || amt > maxAmount) && amt > 0 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-destructive text-center"
                          >
                            Amount must be between{" "}
                            {getCurrencySymbol(userCurrency)}
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
          </div>
        </div>
      </motion.div>
    </main>
  );
}
