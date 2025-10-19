"use client";

import { TypographySmall } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  CheckSquare,
  Clock,
  ListTodo,
  XCircle,
} from "lucide-react";

// Order status types
type OrderStatus =
  | "all"
  | "active"
  | "pending"
  | "partial"
  | "failed"
  | "cancelled"
  | "completed";

// Order interface based on API response
interface Order {
  order: number;
  category: string;
  service: string;
  link: string;
  quantity: number;
  price: string;
  status: string;
  start_count: number;
  remains: number;
  currency: string;
}

interface OrderTableProps {
  orders?: Order[];
  isLoading: boolean;
  rowClassName?: string;
}

// Fetch orders based on status
async function fetchOrders(status: OrderStatus): Promise<Order[]> {
  const response = await fetch(
    `/api/v2?action=status&key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const data = (await response.json()) as Record<string, Order>;
  return Object.values(data).filter((order): order is Order =>
    status === "all" ? true : order.status.toLowerCase() === status
  );
}

export function OrdersTab() {
  // Query for each tab
  const { data: allOrders, isLoading: allLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => fetchOrders("all"),
  });

  const { data: activeOrders, isLoading: activeLoading } = useQuery({
    queryKey: ["orders", "active"],
    queryFn: () => fetchOrders("active"),
  });

  const { data: pendingOrders, isLoading: pendingLoading } = useQuery({
    queryKey: ["orders", "pending"],
    queryFn: () => fetchOrders("pending"),
  });

  const { data: partialOrders, isLoading: partialLoading } = useQuery({
    queryKey: ["orders", "partial"],
    queryFn: () => fetchOrders("partial"),
  });

  const { data: failedOrders, isLoading: failedLoading } = useQuery({
    queryKey: ["orders", "failed"],
    queryFn: () => fetchOrders("failed"),
  });

  const { data: cancelledOrders, isLoading: cancelledLoading } = useQuery({
    queryKey: ["orders", "cancelled"],
    queryFn: () => fetchOrders("cancelled"),
  });

  const { data: completedOrders, isLoading: completedLoading } = useQuery({
    queryKey: ["orders", "completed"],
    queryFn: () => fetchOrders("completed"),
  });

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Order table component

  const OrderTable = ({
    orders,
    isLoading,
    rowClassName = "",
  }: OrderTableProps) => {
    if (isLoading) return <LoadingState />;

    if (!orders?.length)
      return (
        <div className="flex items-center justify-center min-h-[50dvh] w-full">
          <p className="text-muted-foreground text-sm">No orders found</p>
        </div>
      );

    return (
      <div className="space-y-6">
        {/* --- Desktop Table --- */}
        <div className="hidden md:block">
          <Table className="border border-border bg-card rounded-lg overflow-hidden shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Order ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={order.order}
                  className={cn(
                    "hover:bg-muted/40 transition-colors",
                    rowClassName
                  )}
                >
                  <TableCell className="font-mono text-sm">
                    {order.order}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/service-${idx}/64`}
                        alt={order.service}
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <span className="font-medium truncate">
                        {order.service}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">{order.category}</TableCell>

                  <TableCell className="text-center text-sm font-medium">
                    {order.quantity.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center text-sm font-medium">
                    {order.price} {order.currency}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- Mobile View --- */}
        <div className="md:hidden space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.order}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img
                  src={`https://picsum.photos/seed/order-${idx}/100`}
                  alt={order.service}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{order.service}</h3>
                    <span className="text-xs text-muted-foreground">
                      #{order.order}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {order.category}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <span className="font-medium">
                      {order.quantity.toLocaleString()} units
                    </span>
                    <span className="ml-auto font-medium">
                      {order.price} {order.currency}
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
      </div>
    );
  };

  const Trigger = [
    { value: "all", label: "All Orders", icon: ListTodo },
    { value: "active", label: "Active Orders", icon: Clock },
    { value: "pending", label: "Pending Orders", icon: AlertCircle },
    { value: "partial", label: "Partial Orders", icon: CheckCircle2 },
    { value: "failed", label: "Failed Orders", icon: XCircle },
    { value: "cancelled", label: "Cancelled Orders", icon: Ban },
    { value: "completed", label: "Completed Orders", icon: CheckSquare },
  ];

  const Content = [
    {
      value: "all",
      component: (
        <OrderTable
          orders={allOrders}
          isLoading={allLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "active",
      component: (
        <OrderTable
          orders={activeOrders}
          isLoading={activeLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "pending",
      component: (
        <OrderTable
          orders={pendingOrders}
          isLoading={pendingLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "partial",
      component: (
        <OrderTable
          orders={partialOrders}
          isLoading={partialLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "failed",
      component: (
        <OrderTable
          orders={failedOrders}
          isLoading={failedLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "cancelled",
      component: (
        <OrderTable
          orders={cancelledOrders}
          isLoading={cancelledLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "completed",
      component: (
        <OrderTable
          orders={completedOrders}
          isLoading={completedLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-[90rem] mx-auto flex flex-col gap-6 ">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 p-1 bg-muted/50">
          {Trigger.map((trigger, index) => {
            const Icon = trigger.icon;
            return (
              <TabsTrigger
                key={index}
                value={trigger.value}
                className="cursor-pointer px-4 text-sm sm:text-base flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
              >
                <Icon className="w-5 h-5 transition-colors duration-200 group-hover:text-primary" />
                <TypographySmall>{trigger.label}</TypographySmall>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">
          {Content.map((content, index) => (
            <TabsContent key={index} value={content.value} className="mt-0">
              {content.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
