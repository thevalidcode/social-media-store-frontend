"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
import {
  BalanceCard,
  PaymentMethodSelector,
  PaymentForm,
  PaymentHistory,
} from "./components";

export default function AddFunds() {
  const { userCurrency } = useAppContext();
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
  }, [PAYMENT_METHODS, method]);

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
    convert("USD", userCurrency, selectedMethod.min, false, false).amount
  );
  const maxAmount = parseInt(
    convert("USD", userCurrency, selectedMethod.max, false, false).amount
  );

  const amt = parseFloat(String(amount)) || 0;
  const percent = selectedMethod.feePercent ?? 0;
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
        platform: selectedMethod.platform,
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

  const isDisabled =
    amt <= 0 ||
    amt < minAmount ||
    amt > maxAmount ||
    selectedMethod.platform === "MANUAL";

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
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
            <BalanceCard />
            <PaymentMethodSelector
              paymentMethods={PAYMENT_METHODS}
              selectedMethod={method}
              onMethodChange={setMethod}
              selectedGateway={selectedMethod}
            />
          </div>

          {/* Right Column - Amount & Summary */}
          <div className="lg:col-span-1">
            <PaymentForm
              amount={amount}
              onAmountChange={setAmount}
              minAmount={minAmount}
              maxAmount={maxAmount}
              fee={fee}
              total={total}
              percent={percent}
              userCurrency={userCurrency}
              isManualPayment={selectedMethod.platform === "MANUAL"}
              onSubmit={handleSubmit}
              isDisabled={isDisabled}
            />
          </div>
        </div>

        {/* Payment History Section */}
        <PaymentHistory />
      </motion.div>
    </main>
  );
}
