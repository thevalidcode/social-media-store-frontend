"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PaymentGateway,
  PaymentGatewayStatus,
  PaymentGatewayPlatform,
} from "@/types";

export interface CreatePaymentGatewayProps {
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string;
  signature?: string;
  feePercent?: number;
  secretKey?: Record<string, any>;
  image: string;
  status?: PaymentGatewayStatus;
  min: number;
  max: number;
  storeId: number;
}

export interface CreateBulkPaymentGatewayProps {
  gateways: CreatePaymentGatewayProps[];
}

export const useCreatePaymentGateway = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createPaymentGateway"],
    mutationFn: async (data: CreatePaymentGatewayProps) => {
      const res = await api.post("/payment-gateways", data);
      if (!res.data) throw new Error("Failed to create payment gateway");
      return res.data;
    },
  });
};

export const useCreateBulkPaymentGateways = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createBulkPaymentGateways"],
    mutationFn: async (data: CreateBulkPaymentGatewayProps) => {
      const res = await api.post("/payment-gateways/bulk", data);
      if (!res.data) throw new Error("Failed to create bulk gateways");
      return res.data;
    },
  });
};

export const useGetPaymentGatewaysByStatus = (status: PaymentGatewayStatus) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGateways", storeId, status],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(
        `/payment-gateways/status/${status}`
      );
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
  });
};

export const useGetAllPaymentGateways = () => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["allPaymentGateways", storeId],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(`/payment-gateways`);
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
  });
};

export const useGetSinglePaymentGateway = (uid: string) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["paymentGateway", uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(`/payment-gateways/${uid}`);
      if (!res.data) throw new Error("Failed to fetch gateway details");
      return res.data;
    },
    enabled: !!uid,
  });
};

export const useUpdatePaymentGateway = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["updatePaymentGateway"],
    mutationFn: async (data: {
      uid: string;
      updates: Partial<CreatePaymentGatewayProps>;
    }) => {
      const res = await api.patch(
        `/payment-gateways/${data.uid}`,
        data.updates
      );
      if (!res.data) throw new Error("Failed to update payment gateway");
      return res.data;
    },
  });
};

export const useDeletePaymentGateway = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["deletePaymentGateway"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/payment-gateways/${uid}`);
      if (!res.data) throw new Error("Failed to delete payment gateway");
      return res.data;
    },
  });
};
