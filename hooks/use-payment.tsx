"use client";

import { useAppContext } from "@/context/appContext";
import { CurrencyCode } from "@/lib/currencyConverter";
import {
  PaymentGatewayPlatform,
  Payment,
  PaymentsResponse,
  PaymentFilters,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreatePaymentProps {
  platform: PaymentGatewayPlatform;
  currency: CurrencyCode;
  amount: string;
  redirect_url: string;
}

export interface CreatePaymentResponse {
  url: string;
  message?: string;
}

interface UpdatePaymentStatusByAdminProps {
  paymentUid: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export const useCreatePayment = () => {
  const { api, storeId, userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createPayment", storeId, userInfo?.uid],
    mutationFn: async (data: CreatePaymentProps) => {
      const res = await api.post<CreatePaymentResponse>(
        "/payments/create",
        data,
      );

      if (!res.data) throw new Error("Failed to create payment");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", storeId, userInfo?.uid],
      });
      queryClient.invalidateQueries({ queryKey: ["user", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create payment");
      toast.error(errorMsg);
    },
  });
};

export const useGetPayments = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters,
) => {
  const { api, userInfo, storeId } = useAppContext();

  return useQuery({
    queryKey: ["payments", storeId, userInfo?.uid, page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
      });

      const res = await api.get<PaymentsResponse>(
        `/payments?${params.toString()}`,
      );
      return res.data;
    },
    enabled: !!api && !!storeId && !!userInfo?.uid,
  });
};

export const useGetAllPaymentsForAdmin = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters,
) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["admin-payments", storeId, page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
        ...(filters?.search && { search: filters.search }),
      });

      const res = await api.get<PaymentsResponse>(
        `/payments/admin?${params.toString()}`,
      );
      return res.data;
    },
    enabled: !!api && !!storeId,
  });
};

export const useUpdatePaymentStatusByAdmin = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePaymentStatusByAdmin", storeId],
    mutationFn: async ({ paymentUid, status }: UpdatePaymentStatusByAdminProps) => {
      const res = await api.patch(`/payments/admin/${paymentUid}/status`, {
        status,
      });

      if (!res.data) {
        throw new Error("Failed to update payment status");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-payments", storeId] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update payment status");
      toast.error(errorMsg);
    },
  });
};
