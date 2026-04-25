"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PaymentGateway,
  PaymentGatewayStatus,
  PaymentGatewayPlatform,
  PaymentGatewayPublic,
} from "@/types";

export interface CreatePaymentGatewayProps {
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string;
  content?: string;
  feePercent?: number;
  secretKey?: string;
  status?: PaymentGatewayStatus;
  min: string;
  max: string;
  currency: string;
}

export interface UpdatePaymentGatewayProps {
  uid: string;
  platform?: PaymentGatewayPlatform;
  name?: string;
  description?: string;
  content?: string;
  feePercent?: number;
  secretKey?: string;
  status?: PaymentGatewayStatus;
  min?: string;
  max?: string;
  currency?: string;
}

export interface UpdatePaymentGatewayStatusProps {
  uid: string;
  status: PaymentGatewayStatus;
}

export interface PaymentGatewayFormResponse {
  success: string;
  signature: string;
}

/* ---------------------------------------------------------
    GET PAYMENT GATEWAYS BY STATUS (PUBLIC)
--------------------------------------------------------- */
export const useGetPaymentGatewaysByStatus = (status: PaymentGatewayStatus) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewaysByStatus", storeId, status],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(
        `/payment-gateways/status/${status}`,
      );
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
    enabled: !!api && !!storeId,
  });
};

/* ---------------------------------------------------------
    GET ALL PAYMENT GATEWAYS (PUBLIC)
--------------------------------------------------------- */
export const useGetAllPaymentGateways = () => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["allPaymentGatewaysPublic", storeId],
    queryFn: async () => {
      const res = await api.get<PaymentGatewayPublic[]>(`/payment-gateways`);
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
    enabled: !!api && !!storeId,
  });
};

/* ---------------------------------------------------------
    GET ALL PAYMENT GATEWAYS (ADMIN)
--------------------------------------------------------- */
export const useGetAllPaymentGatewaysForAdmins = () => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["allPaymentGatewaysAdmin", storeId],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(`/payment-gateways/admin`);
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
    enabled: !!api && !!storeId,
  });
};

/* ---------------------------------------------------------
    GET SINGLE PAYMENT GATEWAY (PUBLIC)
--------------------------------------------------------- */
export const useGetSinglePaymentGateway = (uid: string) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewayPublic", storeId, uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(`/payment-gateways/${uid}`);
      if (!res.data) throw new Error("Failed to fetch gateway details");
      return res.data;
    },
    enabled: !!api && !!uid,
  });
};

/* ---------------------------------------------------------
    GET SINGLE PAYMENT GATEWAY (ADMIN)
--------------------------------------------------------- */
export const useGetSinglePaymentGatewayForAdmins = (uid: string) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewayAdmin", storeId, uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(
        `/payment-gateways/admin/${uid}`,
      );
      if (!res.data) throw new Error("Failed to fetch gateway details");
      return res.data;
    },
    enabled: !!api && !!uid,
  });
};

/* ---------------------------------------------------------
    CREATE PAYMENT GATEWAY (ADMIN)
--------------------------------------------------------- */
export const useCreatePaymentGateway = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createPaymentGateway", storeId],
    mutationFn: async (data: CreatePaymentGatewayProps) => {
      const res = await api.post<PaymentGatewayFormResponse>(
        "/payment-gateways",
        data,
      );
      if (!res.data) throw new Error("Failed to create payment gateway");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allPaymentGatewaysAdmin", storeId],
      });
    },
  });
};

/* ---------------------------------------------------------
    UPDATE PAYMENT GATEWAY (ADMIN)
--------------------------------------------------------- */
export const useUpdatePaymentGateway = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePaymentGateway", storeId],
    mutationFn: async (data: UpdatePaymentGatewayProps) => {
      const res = await api.patch<PaymentGatewayFormResponse>(
        `/payment-gateways`,
        data,
      );
      if (!res.data) throw new Error("Failed to update payment gateway");
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["allPaymentGatewaysAdmin", storeId],
      });

      // Refresh single gateway if it is open in a page
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewayAdmin", storeId, variables.uid],
      });
    },
  });
};

/* ---------------------------------------------------------
    UPDATE PAYMENT GATEWAY STATUS (ADMIN)
--------------------------------------------------------- */
export const useUpdatePaymentGatewayStatus = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePaymentGatewayStatus", storeId],
    mutationFn: async (data: UpdatePaymentGatewayStatusProps) => {
      const res = await api.patch(`/payment-gateways/status`, data);
      if (!res.data) throw new Error("Failed to update payment gateway status");
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["allPaymentGatewaysAdmin", storeId],
      });

      // Refresh single gateway if it is open in a page
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewayAdmin", storeId, variables.uid],
      });
    },
  });
};

/* ---------------------------------------------------------
    DELETE PAYMENT GATEWAY (ADMIN)
--------------------------------------------------------- */
export const useDeletePaymentGateway = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePaymentGateway", storeId],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/payment-gateways/${uid}`);
      if (!res.data) throw new Error("Failed to delete payment gateway");
      return res.data;
    },

    onSuccess: (_res, uid) => {
      queryClient.invalidateQueries({
        queryKey: ["allPaymentGatewaysAdmin", storeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["paymentGatewayAdmin", storeId, uid],
      });
    },
  });
};
