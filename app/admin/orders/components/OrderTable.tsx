"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { EmptyState } from "@/components/empty-state";
import { Order } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { OrderEditDialog } from "./OrderEditDialog";
import { Button } from "@/components/ui/button";
import { useUpdateOrder } from "@/hooks/use-order";
import Image from "next/image";

interface OrderTableProps {
  orders?: Order[];
  isLoading: boolean;
  rowClassName?: string;
}

export const OrderTable = ({
  orders,
  isLoading,
  rowClassName = "",
}: OrderTableProps) => {
  const { userCurrency, userInfo } = useAppContext();
  const convert = useCurrencyConverter();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
const updateOrder = useUpdateOrder();

const handleSaveOrder = (updated: Partial<Order>) => {
  if (!editingOrder?.uid) return;

  updateOrder.mutate({
    uid: editingOrder.uid,
    update: updated,
  });

  setEditingOrder(null);
};


  if (isLoading) return <Loading />;
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No Order Found"
        description="No orders have been placed yet."
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* --- Desktop Table --- */}
      <div className="hidden md:block">
        <Table className="border border-border bg-card rounded-lg overflow-hidden shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order, idx) => (
              <TableRow
                key={order.storeScopedId}
                className={cn(
                  "hover:bg-muted/40 transition-colors",
                  rowClassName
                )}
              >
                <TableCell className="font-mono text-sm">
                  {order.storeScopedId}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    {order.service.icon ? (
                      <Image
                        src={order.service.icon}
                        alt={order.service.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground text-3xl">🧩</div>
                    )}
                    <span className="font-medium truncate">
                      {order.service.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-sm">
                  {order.service.category}
                </TableCell>

                <TableCell className="text-sm">{userInfo?.username}</TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {order.quantity.toLocaleString()}
                </TableCell>

                <TableCell className="text-center text-sm font-medium">
                  {
                    convert(
                      order.currency,
                      userCurrency,
                      order.price,
                      true,
                      false
                    ).formatted
                  }
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      order.status.toLowerCase().includes("completed")
                        ? "default"
                        : order.status.toLowerCase().includes("pending")
                        ? "secondary"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingOrder(order)}>
                        Edit Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden space-y-4">
        {orders.map((order, idx) => (
          <motion.div
            key={order.storeScopedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.02 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {order.service.icon ? (
                <Image
                  src={order.service.icon}
                  alt={order.service.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground text-6xl">🧩</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {order.service.name}
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingOrder(order)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {order.service.category}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <span className="font-medium">
                    {order.quantity.toLocaleString()} units
                  </span>
                  <span className="ml-auto font-medium">
                    {
                      convert(
                        order.currency,
                        userCurrency,
                        order.price,
                        true,
                        false
                      ).formatted
                    }
                  </span>
                </div>

                <div className="mt-3">
                  <Badge
                    variant={
                      order.status.toLowerCase().includes("completed")
                        ? "default"
                        : order.status.toLowerCase().includes("pending")
                        ? "secondary"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {editingOrder && (
        <OrderEditDialog
          order={editingOrder}
          open={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};
