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
import { useGetAllOrders, useGetOrderByStatus } from "@/hooks/use-order";
import { OrderTable } from "./OrderTable";

export function OrdersTab() {
  const { data: allOrders, isLoading: allLoading } = useGetAllOrders();

  const { data: activeOrders, isLoading: activeLoading } =
    useGetOrderByStatus("ACTIVE");

  const { data: pendingOrders, isLoading: pendingLoading } =
    useGetOrderByStatus("PENDING");

  const { data: partialOrders, isLoading: partialLoading } =
    useGetOrderByStatus("PARTIAL");

  const { data: failedOrders, isLoading: failedLoading } =
    useGetOrderByStatus("FAILED");

  const { data: cancelledOrders, isLoading: cancelledLoading } =
    useGetOrderByStatus("CANCELED");

  const { data: completedOrders, isLoading: completedLoading } =
    useGetOrderByStatus("COMPLETED");

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
    <div className="w-full mx-auto flex flex-col gap-6 ">
      <Tabs defaultValue="all" className="w-full">
        <TabsList
          className="relative z-50 flex flex-wrap w-full grid-cols-2 gap-3 p-1 bg-muted/50
             sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 h-auto"
        >
          {Trigger.map((trigger, index) => {
            const Icon = trigger.icon;
            return (
              <TabsTrigger
                key={index}
                value={trigger.value}
                className="cursor-pointer px-3 py-2 text-xs sm:text-sm md:text-base 
                   flex items-center justify-center gap-2 rounded-lg
                   data-[state=active]:bg-background data-[state=active]:shadow-sm
                   transition-colors duration-200
                   hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <TypographySmall className="truncate max-w-[80px] sm:max-w-none">
                  {trigger.label}
                </TypographySmall>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-3">
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
