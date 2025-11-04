"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { getCurrencySymbol } from "@/app/_docs/doc";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { useCreatePayment } from "@/hooks/use-payment";
import { toast } from "sonner";

export default function AddFunds() {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("manual");
  const convert = useCurrencyConverter();
  const { userCurrency, userInfo } = useAppContext();

  const { mutate } = useCreatePayment();
  const router = useRouter();

  const { data: PAYMENT_METHODS, isLoading } = useGetAllPaymentGateways();

  if (isLoading) {
    return <Loading />;
  }

  if (!PAYMENT_METHODS || PAYMENT_METHODS.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No Payment Method Found"
        description="No payment method has been created for this store yet."
      />
    );
  }

  const selectedMethod = PAYMENT_METHODS?.find((m) => m.platform === method)!;
  const fee = (amount * selectedMethod?.feePercent!) / 100;
  const total = amount + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Enter a valid amount");

    mutate(
      {
        storeId: userInfo?.storeId!,
        platform: selectedMethod.platform,
        currency: userCurrency,
        amount: total,
        redirect_url: `${window.location.origin}/client/add-funds`,
      },
      {
        onSuccess: (data) => {
          router.push(data.url);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create payment");
        },
      }
    );
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <motion.section
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold">Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Balance Summary */}
            <div className="flex items-center justify-between p-4 rounded-xl border">
              <p className="text-sm">Available Balance</p>
              <p className="text-xl font-semibold text-primary">
                {
                  convert("USD", userCurrency, userInfo?.balance!, true, true)
                    .formatted
                }
              </p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup
                value={method}
                onValueChange={setMethod}
                className="grid sm:grid-cols-3 gap-4"
              >
                {PAYMENT_METHODS.map((m) => (
                  <Label
                    key={m.id}
                    htmlFor={String(m.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      method === m.platform ? "border-primary" : "border-accent"
                    }`}
                  >
                    <RadioGroupItem
                      id={String(m.id)}
                      value={m.platform}
                      className="sr-only"
                    />
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="font-medium text-sm text-center">
                      {m.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Fee: {m.feePercent}%
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Amount Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="amount">
                  Enter Amount ({getCurrencySymbol(userCurrency)})
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min={
                    convert("USD", userCurrency, selectedMethod.min, true, true)
                      .amount
                  }
                  max={
                    convert("USD", userCurrency, selectedMethod.max, true, true)
                      .amount
                  }
                  placeholder={`e.g. ${
                    convert("USD", userCurrency, selectedMethod.min, true, true)
                      .formatted
                  }`}
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <Separator />

              <Separator />

              {/* Summary */}
              <div className="p-4 rounded-xl border space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fee ({selectedMethod.feePercent}%)</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {fee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Total</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={amount <= 0}>
                  Add {getCurrencySymbol(userCurrency)}
                  {total.toLocaleString()}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
