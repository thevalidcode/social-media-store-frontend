"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  CreditCard,
  History,
  TrendingUp,
  Wallet,
} from "lucide-react";
import parse from "html-react-parser";
import { toast } from "sonner";

import Loading from "@/app/loading";
import { currency as currencyMap } from "@/app/_docs/doc";
import { EmptyState } from "@/components/empty-state";
import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import { useCreatePayment, useGetPayments } from "@/hooks/use-payment";

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AddFundsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo");
  const { userCurrency, userInfo } = useAppContext();
  const convert = useCurrencyConverter();

  const { data: gateways = [], isLoading: gatewaysLoading } =
    useGetAllPaymentGateways();
  const createPayment = useCreatePayment();

  const [amount, setAmount] = useState("");
  const [selectedGatewayUid, setSelectedGatewayUid] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPageSize, setActivityPageSize] = useState(6);

  const { data: paymentsResponse, isLoading: paymentsLoading } = useGetPayments(
    activityPage,
    activityPageSize,
  );

  useEffect(() => {
    const presetAmount = searchParams.get("amount");
    const presetCurrency = searchParams.get("currency");

    if (presetAmount && Number(presetAmount) > 0) {
      setAmount(Number(presetAmount).toFixed(2));
    }

    if (
      presetCurrency &&
      currencyMap[presetCurrency as keyof typeof currencyMap]
    ) {
      setSelectedCurrency(presetCurrency as keyof typeof currencyMap);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedGatewayUid && gateways.length > 0) {
      const firstGateway = gateways.find(
        (gateway) => gateway.platform !== "CREDIT",
      );
      if (firstGateway) {
        setSelectedGatewayUid(firstGateway.uid);
      }
    }
  }, [gateways, selectedGatewayUid]);

  const selectedGateway = useMemo(
    () => gateways.find((gateway) => gateway.uid === selectedGatewayUid),
    [gateways, selectedGatewayUid],
  );

  const currentBalance = Number(userInfo?.balance || 0);
  const walletCurrency = userInfo?.currency || userCurrency;
  const amountValue = Number(amount || 0);
  const gatewayCurrency = (selectedGateway?.currency ||
    selectedCurrency) as keyof typeof currencyMap;

  const minTopup = useMemo(() => {
    const value = Number(selectedGateway?.min || 0);
    if (!selectedGateway || !value) return value;
    if (gatewayCurrency === selectedCurrency) return value;
    return Number(
      convert(
        gatewayCurrency as any,
        selectedCurrency as any,
        value,
        false,
        false,
      ).amount,
    );
  }, [selectedGateway, gatewayCurrency, selectedCurrency, convert]);

  const maxTopup = useMemo(() => {
    const value = Number(selectedGateway?.max || 0);
    if (!selectedGateway || !value) return value;
    if (gatewayCurrency === selectedCurrency) return value;
    return Number(
      convert(
        gatewayCurrency as any,
        selectedCurrency as any,
        value,
        false,
        false,
      ).amount,
    );
  }, [selectedGateway, gatewayCurrency, selectedCurrency, convert]);

  const allowedRangeText = `${minTopup > 0 ? minTopup.toFixed(2) : "0.00"} - ${maxTopup > 0 ? maxTopup.toFixed(2) : "No max"} ${selectedCurrency}`;

  const quickAmounts = useMemo(() => {
    const presets = [10, 25, 50, 100, 250, 500];
    return presets.filter((value) => {
      if (minTopup > 0 && value < minTopup) return false;
      if (maxTopup > 0 && value > maxTopup) return false;
      return true;
    });
  }, [minTopup, maxTopup]);

  if (gatewaysLoading || paymentsLoading) {
    return <Loading />;
  }

  if (!gateways.length) {
    return (
      <EmptyState
        icon={Wallet}
        title="No payment gateway available"
        description="Add-funds is available once your store has an active payment gateway configured."
      />
    );
  }

  const canSubmit =
    Boolean(selectedGateway) &&
    amountValue > 0 &&
    (minTopup <= 0 || amountValue >= minTopup) &&
    (maxTopup <= 0 || amountValue <= maxTopup);

  const handleTopup = async () => {
    if (!selectedGateway) {
      toast.error("Select a payment method");
      return;
    }

    if (!amountValue || amountValue <= 0) {
      toast.error("Enter a valid top-up amount");
      return;
    }

    if (minTopup > 0 && amountValue < minTopup) {
      toast.error(
        `Minimum top-up for this gateway is ${minTopup.toFixed(2)} ${selectedCurrency}`,
      );
      return;
    }

    if (maxTopup > 0 && amountValue > maxTopup) {
      toast.error(
        `Maximum top-up for this gateway is ${maxTopup.toFixed(2)} ${selectedCurrency}`,
      );
      return;
    }

    try {
      const amountInGatewayCurrency =
        selectedCurrency === gatewayCurrency
          ? amountValue
          : Number(
              convert(
                selectedCurrency as any,
                gatewayCurrency as any,
                amountValue,
                false,
                false,
              ).amount,
            );

      const result = await createPayment.mutateAsync({
        platform: selectedGateway.platform,
        amount: amountInGatewayCurrency.toFixed(2),
        currency: gatewayCurrency,
        redirect_url: `${window.location.origin}/client/add-funds`,
      });

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      toast.success(result?.message || "Top-up request created successfully");
      if (returnTo) {
        router.push(returnTo);
      }
      setAmount("");
    } catch {
      // Error handled by hook
    }
  };

  const isManualGateway = selectedGateway?.platform === "MANUAL";

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-muted/30 p-6 shadow-sm sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(var(--primary-rgb),0.08),transparent_30%)] pointer-events-none" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit px-3 py-1">
                Wallet Top-up
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Add funds to your wallet
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Use an active gateway to create a top-up payment and credit
                  your balance once the payment is approved.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current balance
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {Number(currentBalance.toFixed(2)).toLocaleString()}{" "}
                    {walletCurrency}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Available gateways
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {
                      gateways.filter(
                        (gateway) => gateway.platform !== "CREDIT",
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/70 bg-background shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  Wallet snapshot
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Wallet currency: {walletCurrency}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="mt-1 text-xl font-semibold">
                      {amountValue > 0 ? amountValue.toFixed(2) : "0.00"}{" "}
                      {selectedCurrency}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="text-xs text-muted-foreground">
                      Gateway currency
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {gatewayCurrency}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  If you pay in a different currency than your wallet currency,
                  the final credited amount is converted at settlement time.
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  Allowed range for this gateway: {allowedRangeText}
                </div>
                {isManualGateway && (
                  <div className="rounded-2xl border border-amber-300/50 dark:bg-amber-50/10 bg-amber-50/40 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
                    Manual mode selected. Your request will be created without
                    redirecting to an external checkout.
                  </div>
                )}
                {gatewayCurrency !== selectedCurrency ? (
                  <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                    Gateway limits are configured in {gatewayCurrency}. We
                    convert them to {selectedCurrency} for display.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" />
                Top-up details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Gateway
                  </div>
                  <Select
                    value={selectedGatewayUid}
                    onValueChange={setSelectedGatewayUid}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways
                        .filter((gateway) => gateway.platform !== "CREDIT")
                        .map((gateway) => (
                          <SelectItem key={gateway.uid} value={gateway.uid}>
                            {gateway.name} ({formatEnumLabel(gateway.platform)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Payment currency
                  </div>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) =>
                      setSelectedCurrency(value as typeof userCurrency)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(currencyMap).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {code} - {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Amount
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={minTopup > 0 ? String(minTopup) : "0"}
                    max={maxTopup > 0 ? String(maxTopup) : undefined}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    className="h-12 pr-20 text-base"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    {selectedCurrency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Allowed range: {allowedRangeText}
                </p>
              </div>

              {quickAmounts.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Quick amounts
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(String(quickAmount))}
                      >
                        {quickAmount.toFixed(2)} {selectedCurrency}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Settlement preview
                </div>
                <p className="mt-1 text-muted-foreground">
                  You pay {amountValue > 0 ? amountValue.toFixed(2) : "0.00"}{" "}
                  {selectedCurrency}. Wallet credits settle in {walletCurrency}{" "}
                  based on live conversion at payment confirmation.
                </p>
              </div>

              <Button
                className="h-12 w-full text-base font-semibold"
                onClick={handleTopup}
                disabled={createPayment.isPending || !canSubmit}
              >
                {createPayment.isPending
                  ? "Preparing payment..."
                  : "Create top-up payment"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Selected gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedGateway ? (
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold">
                        {selectedGateway.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatEnumLabel(selectedGateway.platform)}
                      </div>
                    </div>
                    <Badge
                      variant={
                        selectedGateway.platform === "MANUAL"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {selectedGateway.platform === "MANUAL"
                        ? "Manual"
                        : "Direct"}
                    </Badge>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div>Fee: {Number(selectedGateway.feePercent || 0)}%</div>
                    <div>Currency: {selectedGateway.currency || "USD"}</div>
                    <div>Min: {selectedGateway.min}</div>
                    <div>Max: {selectedGateway.max}</div>
                  </div>

                  {selectedGateway.description ? (
                    <div className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {selectedGateway.description}
                    </div>
                  ) : null}

                  {selectedGateway.content ? (
                    <div className="prose prose-sm mt-3 max-w-none text-sm text-muted-foreground">
                      {parse(selectedGateway.content)}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Select a gateway to see its details.
                </div>
              )}

              <Separator />

              <div>
                <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <History className="h-5 w-5 text-primary" />
                  Recent wallet activity
                </div>

                <div className="space-y-2">
                  {(paymentsResponse?.payments || []).length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      No recent payments yet.
                    </div>
                  ) : (
                    paymentsResponse?.payments.map((payment) => (
                      <div
                        key={payment.uid}
                        className="rounded-xl border border-border bg-muted/20 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-medium">
                            {payment.amount} {payment.currency}
                          </span>
                          <Badge
                            variant={
                              payment.status === "SUCCESS"
                                ? "default"
                                : payment.status === "FAILED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatEnumLabel(payment.method)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Pagination
                  page={activityPage}
                  pageSize={activityPageSize}
                  totalItems={paymentsResponse?.total || 0}
                  onPageChange={setActivityPage}
                  onPageSizeChange={(size) => {
                    setActivityPageSize(size);
                    setActivityPage(1);
                  }}
                  pageSizeOptions={[6, 10, 20]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
