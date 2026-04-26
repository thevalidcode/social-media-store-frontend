"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Package, Save } from "lucide-react";
import { toast } from "sonner";

import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
import { useGetOrderByUidForAdmin, useUpdateOrder } from "@/hooks/use-order";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Order, OrderStatus } from "@/types";

const fieldClass = "rounded-xl border border-border bg-muted/40 p-3";

const statusOptions: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "ACTIVE",
  "COMPLETED",
  "PARTIAL",
  "FAILED",
  "CANCELED",
];

export function AdminOrderDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userCurrency } = useAppContext();

  const orderUid = searchParams?.get("uid") || "";
  const { data: order, isLoading } = useGetOrderByUidForAdmin(orderUid);
  const updateOrder = useUpdateOrder();

  const [form, setForm] = useState({
    status: "PENDING" as OrderStatus,
    url: "",
    remains: 0,
    start: 0,
    comments: "",
    syncOrder: false,
  });

  useEffect(() => {
    if (!order) return;

    const normalizedOrder = order as Order;
    setForm({
      status: normalizedOrder.status,
      url: normalizedOrder.url,
      remains: normalizedOrder.remains,
      start: normalizedOrder.start,
      comments: normalizedOrder.comments || "",
      syncOrder: normalizedOrder.syncOrder ?? false,
    });
  }, [order]);

  const summaryRows = useMemo(() => {
    if (!order) return [];

    return [
      { label: "Quantity", value: order.quantity.toLocaleString() },
      {
        label: "Price",
        value: `${order.currency} ${Number(order.price).toFixed(2)}`,
      },
      { label: "Status", value: order.status },
      { label: "User", value: order.user?.username || "Unknown user" },
    ];
  }, [order]);

  const handleSave = () => {
    if (!order?.uid) return;

    updateOrder.mutate(
      {
        uid: order.uid,
        update: {
          status: form.status,
          url: form.url,
          remains: form.remains,
          start: form.start,
          comments: form.comments,
          syncOrder: form.syncOrder,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order updated successfully");
        },
      },
    );
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
              onClick={() => router.push("/admin/orders")}
            >
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Order unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This order may not exist or you may not have access to it.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => router.push("/admin/orders")}
            >
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 md:p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/orders")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Order #{order.storeScopedId}
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                Manage Order
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Review order details and update status, URL, quantity progress,
                and sync behavior from this page.
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
                  <p className="text-xs text-muted-foreground">Order UID</p>
                  <p className="mt-2 break-all text-sm font-medium">
                    {order.uid}
                  </p>
                </div>
                <div className={fieldClass}>
                  <p className="text-xs text-muted-foreground">Service UID</p>
                  <p className="mt-2 break-all text-sm font-medium">
                    {order.serviceUid}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Edit Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.service?.type !== "MANUAL" && (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="syncOrder">Sync order with provider</Label>
                    <p className="text-xs text-muted-foreground">
                      Keep order fields synchronized by provider updates.
                    </p>
                  </div>
                  <Switch
                    id="syncOrder"
                    checked={form.syncOrder}
                    onCheckedChange={(value) =>
                      setForm((prev) => ({ ...prev, syncOrder: value }))
                    }
                    disabled={order.status === "FAILED"}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: OrderStatus) =>
                      setForm((prev) => ({ ...prev, status: value }))
                    }
                    disabled={form.syncOrder}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target URL</Label>
                  <Input
                    type="text"
                    value={form.url}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, url: event.target.value }))
                    }
                    disabled={form.syncOrder}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Remains</Label>
                  <Input
                    type="number"
                    value={form.remains}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        remains: Number(event.target.value || 0),
                      }))
                    }
                    disabled={form.syncOrder}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    type="number"
                    value={form.start}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        start: Number(event.target.value || 0),
                      }))
                    }
                    disabled={form.syncOrder}
                  />
                </div>
              </div>

              {order.service?.type === "CUSTOMCOMMENTS" && (
                <div className="space-y-2">
                  <Label>Comments</Label>
                  <Textarea
                    value={form.comments}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        comments: event.target.value,
                      }))
                    }
                    disabled={form.syncOrder}
                    className="min-h-24"
                  />
                </div>
              )}

              {order.providerError && order.status === "FAILED" && (
                <div className="space-y-2">
                  <Label>Provider Error</Label>
                  <Textarea
                    value={order.providerError}
                    disabled
                    className="min-h-20"
                  />
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={updateOrder.isPending}
                  className="w-full md:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateOrder.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
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
              <CardTitle className="text-base md:text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-center">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
