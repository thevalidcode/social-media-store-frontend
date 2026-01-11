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
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCreatePayment, useGetPayments } from "@/hooks/use-payment";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PaymentFilters } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export default function AddFunds() {
  const { userCurrency, userInfo } = useAppContext();
  const router = useRouter();
  const convert = useCurrencyConverter();

  const { mutate } = useCreatePayment();
  const { data: PAYMENT_METHODS, isLoading } = useGetAllPaymentGateways();

  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("");
  
  // Payment history state
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPayments(
    page,
    10,
    filters
  );

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
                  
                  {/* Payment Gateway Description */}
                  {selectedMethod && selectedMethod.description && (
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
                                  __html: selectedMethod.description,
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
                            amt <= 0 ||
                            amt < minAmount ||
                            amt > maxAmount ||
                            selectedMethod?.platform === "MANUAL"
                          }
                          className="w-full group"
                        >
                          {selectedMethod?.platform === "MANUAL" ? (
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

                        {selectedMethod?.platform === "MANUAL" && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground text-center"
                          >
                            Please follow the instructions above to complete your
                            manual payment
                          </motion.p>
                        )}

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

        {/* Payment History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Payment History</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track all your payment transactions
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: value === "all" ? undefined : (value as any),
                      }))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.method || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        method: value === "all" ? undefined : (value as any),
                      }))
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="FLUTTERWAVE">Flutterwave</SelectItem>
                      <SelectItem value="PAYSTACK">Paystack</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                    </SelectContent>
                  </Select>

                  {(filters.status || filters.method) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({})}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : !paymentsData?.payments?.length ? (
                <EmptyState
                  icon={Wallet}
                  title="No Payments Yet"
                  description="Your payment history will appear here once you make your first transaction."
                />
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden md:block rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">ID</TableHead>
                          <TableHead className="font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold">
                            Charged
                          </TableHead>
                          <TableHead className="font-semibold">
                            Method
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentsData.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              #{payment.storeScopedId}
                            </TableCell>
                            <TableCell>
                              {getCurrencySymbol(payment.currency)}
                              {parseFloat(String(payment.amount)).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getCurrencySymbol(payment.currency)}
                              {parseFloat(
                                String(payment.chargedAmount)
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {payment.method}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  payment.status === "SUCCESS"
                                    ? "default"
                                    : payment.status === "PENDING"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="gap-1"
                              >
                                {payment.status === "SUCCESS" && (
                                  <CheckCircle2 className="h-3 w-3" />
                                )}
                                {payment.status === "PENDING" && (
                                  <Clock className="h-3 w-3" />
                                )}
                                {payment.status === "FAILED" && (
                                  <XCircle className="h-3 w-3" />
                                )}
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDistanceToNow(
                                new Date(payment.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {paymentsData.payments.map((payment) => (
                      <Card key={payment.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Payment #{payment.storeScopedId}
                              </p>
                              <p className="text-2xl font-bold mt-1">
                                {getCurrencySymbol(payment.currency)}
                                {parseFloat(
                                  String(payment.chargedAmount)
                                ).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                payment.status === "SUCCESS"
                                  ? "default"
                                  : payment.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="gap-1"
                            >
                              {payment.status === "SUCCESS" && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              {payment.status === "PENDING" && (
                                <Clock className="h-3 w-3" />
                              )}
                              {payment.status === "FAILED" && (
                                <XCircle className="h-3 w-3" />
                              )}
                              {payment.status}
                            </Badge>
                          </div>

                          <Separator className="my-3" />

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-medium">
                                {getCurrencySymbol(payment.currency)}
                                {parseFloat(
                                  String(payment.amount)
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Method</p>
                              <Badge variant="outline" className="font-normal">
                                {payment.method}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {formatDistanceToNow(
                                  new Date(payment.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {paymentsData.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {paymentsData.page} of {paymentsData.totalPages} (
                        {paymentsData.total} total)
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: paymentsData.totalPages },
                            (_, i) => i + 1
                          )
                            .filter((p) => {
                              // Show first page, last page, current page, and pages around current
                              return (
                                p === 1 ||
                                p === paymentsData.totalPages ||
                                Math.abs(p - page) <= 1
                              );
                            })
                            .map((p, idx, arr) => (
                              <React.Fragment key={p}>
                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                  <span className="px-2 text-muted-foreground">
                                    ...
                                  </span>
                                )}
                                <Button
                                  variant={page === p ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPage(p)}
                                  className="w-8 h-8 p-0"
                                >
                                  {p}
                                </Button>
                              </React.Fragment>
                            ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(paymentsData.totalPages, p + 1)
                            )
                          }
                          disabled={page === paymentsData.totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
