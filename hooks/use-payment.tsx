"use client";

import { useAppContext } from "@/context/appContext";
import { CurrencyCode } from "@/lib/currencyConverter";
import {
  PaymentGatewayPlatform,
  Payment,
  PaymentsResponse,
  PaymentFilters,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface CreatePaymentProps {
  platform: PaymentGatewayPlatform;
  currency: CurrencyCode;
  amount: string;
  redirect_url: string;
}
export interface CreatePaymentResponse {
  url: string;
}

export const useCreatePayment = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createPayment"],
    mutationFn: async (data: CreatePaymentProps) => {
      const res = await api.post<CreatePaymentResponse>(
        "/payments/create",
        data
      );
      if (!res.data) throw new Error("Failed to create payment");
      return res.data;
    },
  });
};

// Get user payment history
export const useGetPayments = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters
) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["payments", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
      });

      const res = await api.get<PaymentsResponse>(
        `/payments?${params.toString()}`
      );
      return res.data;
    },
  });
};

// Get all payments for admin
export const useGetAllPaymentsForAdmin = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters
) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["admin-payments", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
        ...(filters?.search && { search: filters.search }),
      });

      const res = await api.get<PaymentsResponse>(
        `/payments/admin?${params.toString()}`
      );
      return res.data;
    },
  });
};
