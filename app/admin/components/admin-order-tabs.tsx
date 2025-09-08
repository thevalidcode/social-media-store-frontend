"use client";

import { TypographySmall } from "@/components/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAppContext } from "@/context/appContext";
import { AxiosInstance } from "axios";

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
  startCount: number;
  remains: number;
  currency: string;
}

// Fetch orders based on status
async function fetchOrders(
  api: AxiosInstance,
  status: OrderStatus
): Promise<Order[]> {
  const response = await api.get(`/orders?status=${status}`);
  const data = (await response.data) as Record<string, Order>;
  return Object.values(data).filter((order): order is Order =>
    status === "all" ? true : order.status.toLowerCase() === status
  );
}

export function OrdersTab() {
  const { api } = useAppContext();
  // Query for each tab
  const { data: allOrders, isLoading: allLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => fetchOrders(api, "all"),
  });

  const { data: activeOrders, isLoading: activeLoading } = useQuery({
    queryKey: ["orders", "active"],
    queryFn: () => fetchOrders(api, "active"),
  });

  const { data: pendingOrders, isLoading: pendingLoading } = useQuery({
    queryKey: ["orders", "pending"],
    queryFn: () => fetchOrders(api, "pending"),
  });

  const { data: partialOrders, isLoading: partialLoading } = useQuery({
    queryKey: ["orders", "partial"],
    queryFn: () => fetchOrders(api, "partial"),
  });

  const { data: failedOrders, isLoading: failedLoading } = useQuery({
    queryKey: ["orders", "failed"],
    queryFn: () => fetchOrders(api, "failed"),
  });

  const { data: cancelledOrders, isLoading: cancelledLoading } = useQuery({
    queryKey: ["orders", "cancelled"],
    queryFn: () => fetchOrders(api, "cancelled"),
  });

  const { data: completedOrders, isLoading: completedLoading } = useQuery({
    queryKey: ["orders", "completed"],
    queryFn: () => fetchOrders(api, "completed"),
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
  }: {
    orders?: Order[];
    isLoading: boolean;
    rowClassName?: string;
  }) => {
    if (isLoading) return <LoadingState />;
    if (!orders?.length)
      return (
        <div className="flex items-center justify-center min-h-[50dvh] w-full">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      );

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order} className={rowClassName}>
              <TableCell>{order.order}</TableCell>
              <TableCell>{order.service}</TableCell>
              <TableCell>{order.category}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                {order.price} {order.currency}
              </TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
