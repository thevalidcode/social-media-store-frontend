"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Clock,
  Package,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import Loading from "@/app/loading";
import { PageContent } from "@/app/(root)/components/page-content";
import { useAppContext } from "@/context/appContext";
import { useCancelOrder, useGetOrderByUid } from "@/hooks/use-order";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const fieldClass = "rounded-xl border border-border bg-muted/40 p-3";

export function OrderDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userCurrency } = useAppContext();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const orderUid = searchParams?.get("uid") || "";
  const { data: order, isLoading } = useGetOrderByUid(orderUid);
  const { mutateAsync: cancelOrder, isPending: isCanceling } = useCancelOrder();

  const summaryRows = useMemo(() => {
    if (!order) return [];

    return [
      { label: "Quantity", value: order.quantity.toLocaleString() },
      {
        label: "Price",
        value: `${order.currency} ${Number(order.price).toFixed(2)}`,
      },
      { label: "Status", value: order.status },
      { label: "Created", value: new Date(order.timestamp).toLocaleString() },
    ];
  }, [order]);

  const handleCancel = async () => {
    if (!orderUid) return;

    try {
      await cancelOrder(orderUid);
      toast.success("Order cancelled successfully");
      setShowCancelDialog(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel order";
      toast.error(message);
    }
  };

  if (!orderUid) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Order not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Missing order reference in the URL.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Order not available</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This order may not exist or you may not have access to it.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancel =
    Boolean(order.service?.cancel) && order.status !== "CANCELED";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 md:p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <PageContent pageType="ORDER" />
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Order #{order.storeScopedId}
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                Order Details
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Review the service, payment impact, delivery progress, and
                request cancellation if the service supports it.
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                    {order.service?.icon ? (
                      <Image
                        src={order.service.icon}
                        alt={order.service.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Service
                    </p>
                    <h2 className="truncate text-xl font-semibold md:text-2xl">
                      {order.service?.name || "Unknown service"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {order.service?.category || "Category unavailable"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:min-w-[280px] md:grid-cols-2">
                  {summaryRows.map((row) => (
                    <div key={row.label} className={fieldClass}>
                      <p className="text-xs text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="mt-1 break-words text-sm font-medium">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Target Link</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate text-sm">
                      {order.url}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        await navigator.clipboard.writeText(order.url);
                        toast.success("Link copied");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Service UID</p>
                  <p className="mt-2 break-all text-sm font-medium">
                    {order.serviceUid}
                  </p>
                </div>
              </div>

              {order.comments && (
                <div className="mt-3 rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {order.comments}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Delivery Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="mt-2 text-lg font-semibold">{order.start}</p>
                </div>
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Remains</p>
                  <p className="mt-2 text-lg font-semibold">{order.remains}</p>
                </div>
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Processed</p>
                  <p className="mt-2 text-lg font-semibold">
                    {(order.processedRuns || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {order.dripFeed && (
                <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Drip-feed enabled
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Interval</p>
                      <p className="mt-1 font-medium">
                        {order.interval} minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Runs</p>
                      <p className="mt-1 font-medium">{order.runs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Current Price
                      </p>
                      <p className="mt-1 font-medium">
                        {order.currency} {Number(order.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/20">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Balance Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={fieldClass}>
                <p className="text-xs text-muted-foreground">Before Order</p>
                <p className="mt-1 text-lg font-semibold">
                  {userCurrency} {Number(order.userInitialBalance).toFixed(2)}
                </p>
              </div>
              <div className={fieldClass}>
                <p className="text-xs text-muted-foreground">After Order</p>
                <p className="mt-1 text-lg font-semibold">
                  {userCurrency} {Number(order.userFinalBalance).toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Amount Charged</p>
                <p className="mt-1 text-lg font-semibold">
                  {userCurrency} {Number(order.price).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order UID</span>
                <code className="max-w-[180px] truncate text-right font-mono text-xs">
                  {order.uid}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">{order.storeScopedId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
            </CardContent>
          </Card>

          {canCancel && (
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              disabled={isCanceling}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isCanceling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel order?</DialogTitle>
            <DialogDescription>
              This will request cancellation for the current order. The action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <DialogCancel>Keep Order</DialogCancel>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling}
            >
              {isCanceling ? "Cancelling..." : "Cancel Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
