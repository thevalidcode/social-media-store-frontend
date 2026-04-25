"use client";

import { TypographySmall } from "@/components/typography";
import { useGetUserCancellations } from "@/hooks/use-cancellations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, XCircle, Ban, ListTodo } from "lucide-react";
import { CancellationsClientTable } from "./CancellationsClientTable";

export function CancellationsList() {
  const { data: allCancellations, isLoading } = useGetUserCancellations();

  const pending = allCancellations?.filter((c) => c.status === "PENDING") || [];
  const completed =
    allCancellations?.filter((c) => c.status === "COMPLETED") || [];
  const errors = allCancellations?.filter((c) => c.status === "ERROR") || [];
  const rejected =
    allCancellations?.filter((c) => c.status === "REJECTED") || [];

  const triggerTabs = [
    {
      value: "all",
      label: "All",
      icon: ListTodo,
      count: allCancellations?.length || 0,
    },
    { value: "pending", label: "Pending", icon: Clock, count: pending.length },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: completed.length,
    },
    { value: "error", label: "Errors", icon: XCircle, count: errors.length },
    { value: "rejected", label: "Rejected", icon: Ban, count: rejected.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          My Cancellation Requests
        </h1>
        <TypographySmall className="mt-2 text-muted-foreground">
          Track the status of your order cancellation requests
        </TypographySmall>
      </div>

      {!allCancellations || allCancellations.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20">
          <p className="text-center text-muted-foreground">
            No cancellation requests yet
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
            {triggerTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs sm:text-sm"
              >
                <tab.icon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.count}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 space-y-4">
            <TabsContent value="all">
              <CancellationsClientTable
                cancellations={allCancellations}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="pending">
              <CancellationsClientTable
                cancellations={pending}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="completed">
              <CancellationsClientTable
                cancellations={completed}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="error">
              <CancellationsClientTable
                cancellations={errors}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <CancellationsClientTable
                cancellations={rejected}
                isLoading={isLoading}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
