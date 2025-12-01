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
  const router = useRouter();

  const { mutate } = useCreatePayment();
  const { data: PAYMENT_METHODS, isLoading } = useGetAllPaymentGateways();

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

  const selectedMethod = PAYMENT_METHODS.find((m) => m.platform === method)!;

  // Convert min/max requirement from USD to user's currency
  const minAmount = convert(
    "USD",
    userCurrency,
    selectedMethod?.min,
    false,
    false
  ).amount;
  const maxAmount = convert(
    "USD",
    userCurrency,
    selectedMethod?.max,
    false,
    false
  ).amount;

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

          <CardContent className="space-y-10">
            {/* Balance Summary */}
            <div className="flex items-center justify-between p-4 rounded-xl border">
              <p className="text-sm">Available Balance</p>
              <p className="text-xl font-semibold text-primary">
                {
                  convert("USD", userCurrency, userInfo?.balance!, true, false)
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
                    key={m.storeScopedId}
                    htmlFor={String(m.storeScopedId)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      method === m.platform ? "border-primary" : "border-accent"
                    }`}
                  >
                    <RadioGroupItem
                      id={String(m.storeScopedId)}
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
                      Fee {m.feePercent}%
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Amount Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="amount">
                  Amount ({getCurrencySymbol(userCurrency)})
                </Label>

                <Input
                  id="amount"
                  type="text"
                  placeholder={`Min ${minAmount.toLocaleString()} / Max ${maxAmount.toLocaleString()}`}
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Minimum {getCurrencySymbol(userCurrency)}
                  {minAmount.toLocaleString()} • Maximum{" "}
                  {getCurrencySymbol(userCurrency)}
                  {maxAmount.toLocaleString()}
                </p>
              </div>

              <Separator />

              {/* Summary */}
              <div className="p-4 rounded-xl border space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {amt.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Fee ({percent}%)</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {fee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-semibold mt-2">
                  <span>Total</span>
                  <span>
                    {getCurrencySymbol(userCurrency)}
                    {total}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={amt <= 0}>
                  Add {getCurrencySymbol(userCurrency)}
                  {total}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
