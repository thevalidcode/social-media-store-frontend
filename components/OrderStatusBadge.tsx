"use client";

import { OrderStatus } from "@/types";
import React from "react";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    { label: string; classes: string; dot: string }
  > = {
    COMPLETED: {
      label: "Completed",
      classes:
        "text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
      dot: "#16a34a",
    },
    ACTIVE: {
      label: "Active",
      classes:
        "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
      dot: "#2563eb",
    },
    PROCESSING: {
      label: "Processing",
      classes:
        "text-cyan-700 bg-cyan-100 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-950 dark:border-cyan-800",
      dot: "#06b6d4",
    },
    PENDING: {
      label: "Pending",
      classes:
        "text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
      dot: "#f59e0b",
    },
    PARTIAL: {
      label: "Partial",
      classes:
        "text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800",
      dot: "#ea580c",
    },
    CANCELED: {
      label: "Canceled",
      classes:
        "text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
      dot: "#dc2626",
    },
    FAILED: {
      label: "Failed",
      classes:
        "text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-800",
      dot: "#e11d48",
    },
  };

  const { label, classes, dot } = config[status] ?? {
    label: status,
    classes: "text-muted-foreground bg-muted border-border",
    dot: "#6b7280",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: dot }}
      />
      {label}
    </span>
  );
}
