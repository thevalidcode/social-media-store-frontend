"use client";

import React from "react";
import { CancelPublic } from "@/types/models/cancel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CancellationsClientTableProps {
  cancellations?: CancelPublic[];
  isLoading: boolean;
}

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100/80 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100",
  COMPLETED:
    "bg-green-100/80 text-green-900 dark:bg-green-900/40 dark:text-green-100",
  ERROR:
    "bg-destructive/20 text-destructive dark:bg-destructive/30 dark:text-destructive-foreground",
  REJECTED:
    "bg-destructive/20 text-destructive dark:bg-destructive/30 dark:text-destructive-foreground",
  CANCELED:
    "bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground",
  ACTIVE:
    "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground",
};

export function CancellationsClientTable({
  cancellations,
  isLoading,
}: CancellationsClientTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  const router = useRouter();

  if (!cancellations || cancellations.length === 0) {
    return (
      <EmptyState
        icon={Trash2}
        title="No Cancellation Found"
        description="No cancellations have been requested yet."
        actionLabel="View Orders"
        onAction={() => router.push("/admin/orders")}
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Error Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cancellations.map((cancel) => (
              <TableRow key={cancel.uid} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium">
                  {cancel.storeScopedId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[cancel.status] || ""}
                  >
                    {cancel.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(cancel.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="text-sm">
                  {cancel.providerError ? (
                    <span className="text-destructive text-xs">
                      {cancel.providerError.substring(0, 50)}
                      {cancel.providerError.length > 50 ? "..." : ""}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {cancellations.map((cancel) => (
          <div
            key={cancel.uid}
            className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Request ID
                </p>
                <p className="font-mono text-sm font-semibold">
                  {cancel.storeScopedId}...
                </p>
              </div>
              <Badge
                variant="secondary"
                className={statusColors[cancel.status] || ""}
              >
                {cancel.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Requested</p>
                <p className="font-medium">
                  {new Date(cancel.timestamp).toLocaleString()}
                </p>
              </div>

              {cancel.providerError && (
                <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    {cancel.providerError}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
