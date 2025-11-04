"use client";

import { TypographySmall } from "@/components/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  CheckSquare,
  Clock,
  ListTodo,
  XCircle,
} from "lucide-react";
import {
  useUserGetAllOrders,
  useUserGetOrderByStatus,
} from "@/hooks/use-order";
import { OrderTable } from "../components/OrderTable";

export function OrdersTab() {
  // Query for each tab
  const { data: allOrders, isLoading: allLoading } = useUserGetAllOrders();

  const { data: activeOrders, isLoading: activeLoading } =
    useUserGetOrderByStatus("ACTIVE");

  const { data: pendingOrders, isLoading: pendingLoading } =
    useUserGetOrderByStatus("PENDING");

  const { data: partialOrders, isLoading: partialLoading } =
    useUserGetOrderByStatus("PARTIAL");

  const { data: failedOrders, isLoading: failedLoading } =
    useUserGetOrderByStatus("FAILED");

  const { data: cancelledOrders, isLoading: cancelledLoading } =
    useUserGetOrderByStatus("CANCELED");

  const { data: completedOrders, isLoading: completedLoading } =
    useUserGetOrderByStatus("COMPLETED");

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
