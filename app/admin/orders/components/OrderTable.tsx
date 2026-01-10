"use client";

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
import { useState, useMemo } from "react";
import { OrderEditDialog } from "./OrderEditDialog";
import { Button } from "@/components/ui/button";
import { useUpdateOrder } from "@/hooks/use-order";
import Image from "next/image";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import Pagination from "@/components/pagination";

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
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const updateOrder = useUpdateOrder();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedOrders = useMemo(() => {
    if (!orders) return [];
    const startIndex = (page - 1) * pageSize;
    return orders.slice(startIndex, startIndex + pageSize);
  }, [orders, page, pageSize]);

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
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <Table className="w-full lg:min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedOrders.map((order, idx) => (
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
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      {order.service.icon ? (
                        <Image
                          src={order.service.icon}
                          alt={order.service.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs">🧩</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[700px]">
                        {order.service.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[700px]">
                        {order.service.category}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm">{order.user.username}</TableCell>
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
                  <OrderStatusBadge status={order.status} />
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
        {paginatedOrders.map((order, idx) => (
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
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {orders && orders.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={orders.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )}

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
