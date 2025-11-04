"use client";

import { useAppContext } from "@/context/appContext";
import { CurrencyCode } from "@/lib/currencyConverter";
import { PaymentGatewayPlatform } from "@/types";
import { useMutation } from "@tanstack/react-query";

export interface CreatePaymentProps {
  storeId: number;
  platform: PaymentGatewayPlatform;
  currency: CurrencyCode;
  amount: number;
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
