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
import { CreditCard } from "lucide-react";
import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { EmptyState } from "@/components/empty-state";
import { Payment } from "@/types";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import Pagination from "@/components/pagination";
import { formatDistanceToNow } from "date-fns";

interface PaymentTableProps {
  payments?: Payment[];
  isLoading: boolean;
  rowClassName?: string;
}

export const PaymentTable = ({
  payments,
  isLoading,
  rowClassName = "",
}: PaymentTableProps) => {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedPayments = useMemo(() => {
    if (!payments) return [];
    const startIndex = (page - 1) * pageSize;
    return payments.slice(startIndex, startIndex + pageSize);
  }, [payments, page, pageSize]);

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
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPayments.map((payment) => (
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
                  {
                    convert(
                      payment.currency as any,
                      userCurrency,
                      payment.amount,
                      true,
                      false
                    ).formatted
                  }
                </TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {
                    convert(
                      payment.currency as any,
                      userCurrency,
                      payment.chargedAmount,
                      true,
                      false
                    ).formatted
                  }
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{payment.currency}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-normal">
                    {payment.method}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(payment.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden space-y-4">
        {paginatedPayments.map((payment, idx) => (
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
                  {
                    convert(
                      payment.currency as any,
                      userCurrency,
                      payment.chargedAmount,
                      true,
                      false
                    ).formatted
                  }
                </p>
              </div>
              <PaymentStatusBadge status={payment.status} />
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
                  {
                    convert(
                      payment.currency as any,
                      userCurrency,
                      payment.amount,
                      true,
                      false
                    ).formatted
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Method</span>
                <Badge variant="outline" className="font-normal">
                  {payment.method}
                </Badge>
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
      {payments && payments.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={payments.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </div>
  );
};
