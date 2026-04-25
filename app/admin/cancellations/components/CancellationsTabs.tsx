"use client";

import { TypographySmall } from "@/components/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, ListTodo, XCircle, Ban } from "lucide-react";
import {
  useGetAllCancellations,
  useGetCancellationsByStatus,
} from "@/hooks/use-cancellations";
import { CancellationsTable } from "./CancellationsTable";

export function CancellationsTabs() {
  const { data: allCancellations, isLoading: allLoading } =
    useGetAllCancellations();

  const { data: pendingCancellations, isLoading: pendingLoading } =
    useGetCancellationsByStatus("PENDING");

  const { data: completedCancellations, isLoading: completedLoading } =
    useGetCancellationsByStatus("COMPLETED");

  const { data: errorCancellations, isLoading: errorLoading } =
    useGetCancellationsByStatus("ERROR");

  const { data: rejectedCancellations, isLoading: rejectedLoading } =
    useGetCancellationsByStatus("REJECTED");

  const Trigger = [
    { value: "all", label: "All Cancellations", icon: ListTodo },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "completed", label: "Completed", icon: CheckCircle2 },
    { value: "error", label: "Errors", icon: XCircle },
    { value: "rejected", label: "Rejected", icon: Ban },
  ];

  const Content = [
    {
      value: "all",
      component: (
        <CancellationsTable
          cancellations={allCancellations}
          isLoading={allLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "pending",
      component: (
        <CancellationsTable
          cancellations={pendingCancellations}
          isLoading={pendingLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "completed",
      component: (
        <CancellationsTable
          cancellations={completedCancellations}
          isLoading={completedLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "error",
      component: (
        <CancellationsTable
          cancellations={errorCancellations}
          isLoading={errorLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
    {
      value: "rejected",
      component: (
        <CancellationsTable
          cancellations={rejectedCancellations}
          isLoading={rejectedLoading}
          rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full rounded-lg">
        <TabsList className="flex w-full justify-start overflow-x-auto bg-transparent p-0 h-auto gap-1">
          {Trigger.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-muted"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Content.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
