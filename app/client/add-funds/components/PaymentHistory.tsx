"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, Filter, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useGetPayments } from "@/hooks/use-payment";
import { PaymentFilters } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/empty-state";
import Pagination from "@/components/pagination";
import { useCurrencyConverter } from "@/lib/currencyConverter";

export function PaymentHistory() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const convert = useCurrencyConverter();
  const { data: paymentsData, isLoading } = useGetPayments(
    page,
    pageSize,
    filters
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Payment History</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track all your payment transactions
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value === "all" ? undefined : (value as any),
                  }))
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.method || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    method: value === "all" ? undefined : (value as any),
                  }))
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="FLUTTERWAVE">Flutterwave</SelectItem>
                  <SelectItem value="PAYSTACK">Paystack</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                </SelectContent>
              </Select>

              {(filters.status || filters.method) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : !paymentsData?.payments?.length ? (
            <EmptyState
              icon={Wallet}
              title="No Payments Yet"
              description="Your payment history will appear here once you make your first transaction."
            />
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Charged</TableHead>
                      <TableHead className="font-semibold">Method</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentsData.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          #{payment.storeScopedId}
                        </TableCell>
                        <TableCell>
                          {
                            convert(
                              payment.currency as any,
                              payment.currency as any,
                              payment.amount,
                              true,
                              false
                            ).formatted
                          }
                        </TableCell>
                        <TableCell>
                          {
                            convert(
                              payment.currency as any,
                              payment.currency as any,
                              payment.chargedAmount,
                              true,
                              false
                            ).formatted
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "SUCCESS"
                                ? "default"
                                : payment.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {payment.status === "SUCCESS" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {payment.status === "PENDING" && (
                              <Clock className="h-3 w-3" />
                            )}
                            {payment.status === "FAILED" && (
                              <XCircle className="h-3 w-3" />
                            )}
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDistanceToNow(new Date(payment.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paymentsData.payments.map((payment) => (
                  <Card key={payment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Payment #{payment.storeScopedId}
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {
                              convert(
                                payment.currency as any,
                                payment.currency as any,
                                payment.chargedAmount,
                                true,
                                false
                              ).formatted
                            }
                          </p>
                        </div>
                        <Badge
                          variant={
                            payment.status === "SUCCESS"
                              ? "default"
                              : payment.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className="gap-1"
                        >
                          {payment.status === "SUCCESS" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {payment.status === "PENDING" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {payment.status === "FAILED" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {payment.status}
                        </Badge>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">
                            {
                              convert(
                                payment.currency as any,
                                payment.currency as any,
                                payment.amount,
                                true,
                                false
                              ).formatted
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Method</p>
                          <Badge variant="outline" className="font-normal">
                            {payment.method}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {formatDistanceToNow(new Date(payment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={paymentsData?.total || 0}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
