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
import {
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import Loading from "@/app/loading";
import { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import Pagination from "@/components/pagination";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentTableProps {
  payments?: Payment[];
  isLoading: boolean;
  rowClassName?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  isUpdatingStatus?: boolean;
  onStatusUpdate?: (
    paymentUid: string,
    status: "PENDING" | "SUCCESS" | "FAILED",
  ) => Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const PaymentTable = ({
  payments,
  isLoading,
  rowClassName = "",
  page,
  pageSize,
  totalItems,
  isUpdatingStatus,
  onStatusUpdate,
  onPageChange,
  onPageSizeChange,
}: PaymentTableProps) => {
  const statusLabel = {
    PENDING: "Pending",
    SUCCESS: "Success",
    FAILED: "Failed",
  } as const;

  const statusIcon = {
    PENDING: Clock3,
    SUCCESS: CheckCircle2,
    FAILED: XCircle,
  } as const;

  const isHybridPayment = (payment: Payment) =>
    Number(payment.amount || 0) !== Number(payment.chargedAmount || 0);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* --- Desktop Table --- */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <Table className="w-full lg:min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Charged</TableHead>
              <TableHead className="text-center">Currency</TableHead>
              <TableHead className="text-center">Method</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments?.map((payment) => (
              <TableRow
                key={payment.id}
                className={cn(
                  "hover:bg-muted/40 transition-colors",
                  rowClassName
                )}
              >
                <TableCell className="font-mono text-sm">
                  #{payment.storeScopedId}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {payment.user?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {payment.user?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {Number(payment.amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {Number(payment.chargedAmount).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{payment.currency}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="font-normal">
                      {payment.method}
                    </Badge>
                    {isHybridPayment(payment) && (
                      <Badge variant="secondary" className="font-normal">
                        Hybrid
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(payment.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        disabled={!onStatusUpdate || isUpdatingStatus}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(
                        Object.keys(statusLabel) as Array<
                          "PENDING" | "SUCCESS" | "FAILED"
                        >
                      ).map((status) => {
                        const Icon = statusIcon[status];
                        const isCurrent = payment.status === status;
                        return (
                          <DropdownMenuItem
                            key={status}
                            disabled={
                              isCurrent || !onStatusUpdate || isUpdatingStatus
                            }
                            onClick={async () => {
                              if (!onStatusUpdate || isCurrent || isUpdatingStatus)
                                return;
                              await onStatusUpdate(payment.uid, status);
                            }}
                          >
                            <Icon className="h-4 w-4" />
                            Set {statusLabel[status]}
                            {isCurrent ? " (Current)" : ""}
                          </DropdownMenuItem>
                        );
                      })}
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
        {payments?.map((payment, idx) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.02 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Payment #{payment.storeScopedId}
                </p>
                <p className="text-xl font-bold mt-1">
                  {Number(payment.chargedAmount).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PaymentStatusBadge status={payment.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={!onStatusUpdate || isUpdatingStatus}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(
                      Object.keys(statusLabel) as Array<
                        "PENDING" | "SUCCESS" | "FAILED"
                      >
                    ).map((status) => {
                      const Icon = statusIcon[status];
                      const isCurrent = payment.status === status;
                      return (
                        <DropdownMenuItem
                          key={status}
                          disabled={
                            isCurrent || !onStatusUpdate || isUpdatingStatus
                          }
                          onClick={async () => {
                            if (!onStatusUpdate || isCurrent || isUpdatingStatus)
                              return;
                            await onStatusUpdate(payment.uid, status);
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          Set {statusLabel[status]}
                          {isCurrent ? " (Current)" : ""}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <div className="text-right">
                  <p className="font-medium">{payment.user?.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {Number(payment.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Method</span>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="font-normal">
                    {payment.method}
                  </Badge>
                  {isHybridPayment(payment) && (
                    <Badge variant="secondary" className="font-normal">
                      Hybrid
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(payment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </div>
  );
};
