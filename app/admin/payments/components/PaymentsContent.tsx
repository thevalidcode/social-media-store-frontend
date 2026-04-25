"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllPaymentsForAdmin,
  useUpdatePaymentStatusByAdmin,
} from "@/hooks/use-payment";
import { PaymentFilters } from "@/types";
import { PaymentStats } from "./PaymentStats";
import { PaymentFiltersBar } from "./PaymentFiltersBar";
import { PaymentTable } from "./PaymentTable";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";

export function PaymentsContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PaymentFilters & { search?: string }>(
    {}
  );

  const { data: paymentsData, isLoading } = useGetAllPaymentsForAdmin(
    page,
    100, // Fetch max 100 items per request
    filters
  );
  const updatePaymentStatus = useUpdatePaymentStatusByAdmin();

  const payments = paymentsData?.payments || [];

  if (!isLoading && (!payments || payments.length === 0)) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No Payments Found"
        description="No payment transactions match your search criteria."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {payments.length > 0 && <PaymentStats payments={payments} />}

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">All Payments</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and monitor all payment transactions
                </p>
              </div>

              <PaymentFiltersBar onFiltersChange={setFilters} />
            </div>
          </CardHeader>
          <CardContent>
            <PaymentTable
              payments={payments}
              isLoading={isLoading}
              isUpdatingStatus={updatePaymentStatus.isPending}
              onStatusUpdate={async (paymentUid, status) => {
                await updatePaymentStatus.mutateAsync({ paymentUid, status });
              }}
              rowClassName="transition-colors duration-150 hover:bg-muted/60 hover:shadow-sm cursor-pointer focus-within:bg-primary/10 focus-within:text-primary"
              page={page}
              pageSize={pageSize}
              totalItems={paymentsData?.total || 0}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
