"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cancel } from "@/types/models/cancel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditCancellationModal } from "./EditCancellationModal";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface CancellationsTableProps {
  cancellations?: Cancel[];
  isLoading: boolean;
  rowClassName?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-secondary/30 text-secondary-foreground/80",
  COMPLETED: "bg-primary/20 text-primary-foreground/80",
  ERROR: "bg-destructive/20 text-destructive-foreground",
  REJECTED: "bg-destructive/20 text-destructive-foreground",
  CANCELED: "bg-muted text-muted-foreground",
  ACTIVE: "bg-primary/20 text-primary-foreground/80",
};

export function CancellationsTable({
  cancellations,
  isLoading,
  rowClassName,
}: CancellationsTableProps) {
  const [selectedCancellation, setSelectedCancellation] =
    useState<Cancel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

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
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order UID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cancellations.map((cancellation) => (
              <TableRow
                key={cancellation.uid}
                className={rowClassName}
                onClick={() => {
                  setSelectedCancellation(cancellation);
                  setIsEditDialogOpen(true);
                }}
              >
                <TableCell className="font-mono text-sm">
                  {cancellation.orderUid.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${statusColors[cancellation.status] || ""}`}
                  >
                    {cancellation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {cancellation.providerUid.substring(0, 12)}...
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(cancellation.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="text-sm text-primary hover:underline">
                        Edit
                      </button>
                    </DialogTrigger>
                    {selectedCancellation && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Cancellation</DialogTitle>
                        </DialogHeader>
                        <EditCancellationModal
                          cancellation={selectedCancellation}
                          onClose={() => setIsEditDialogOpen(false)}
                        />
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {cancellations.map((cancellation) => (
          <div
            key={cancellation.uid}
            className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {cancellation.orderUid.substring(0, 12)}...
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${statusColors[cancellation.status] || ""}`}
                >
                  {cancellation.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Provider</p>
                  <p className="font-mono text-xs truncate">
                    {cancellation.providerUid}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(cancellation.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {cancellation.providerError && (
                <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    Error: {cancellation.providerError}
                  </p>
                </div>
              )}

              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <button
                    onClick={() => setSelectedCancellation(cancellation)}
                    className="w-full mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    Edit Status
                  </button>
                </DialogTrigger>
                {selectedCancellation && (
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Cancellation</DialogTitle>
                    </DialogHeader>
                    <EditCancellationModal
                      cancellation={selectedCancellation}
                      onClose={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
