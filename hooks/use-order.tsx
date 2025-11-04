"use client";

import { useAppContext } from "@/context/appContext";
import { Order, OrderPublic, OrderStatus } from "@/types/models/order";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface CreateOrdeProps {
  serviceUid: string;
  quantity: number;
  url: string;
  comments?: string;
  dripFeed?: boolean;
  interval?: number;
  runs?: number;
  userUid: string;
}

export interface CreateBulkOrdeProps {
  orders: CreateOrdeProps[];
}

export interface UpdateOrdeProps {
  ststua?: OrderStatus;
  remains?: number;
  start?: number;
  syncOrder?: boolean;
  comments?: string;
  url?: string;
}

export const useCreateOrder = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async (data: CreateOrdeProps) => {
      const res = await api.post("/orders", data);
      if (!res.data) {
        throw new Error("failed to create an order");
      }
      return res.data;
    },
  });
};

export const useCreateBulkOrder = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createBulkOrder"],
    mutationFn: async (data: CreateBulkOrdeProps) => {
      const res = await api.post("/orders/bulk", data);
      if (!res.data) {
        throw new Error("failed to create an order");
      }
      return res.data;
    },
  });
};

export const useUserGetOrderByStatus = (status: OrderStatus) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", userInfo?.uid, status],
    queryFn: async () => {
      const res = await api.get<OrderPublic[]>(`/orders/status/${status}`);

      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
  });
};

export const useGetOrderByStatus = (status: OrderStatus) => {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["allOrders", adminInfo?.uid, status],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders/admin/status/${status}`);

      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
  });
};

export const useUserGetAllOrders = () => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<OrderPublic[]>(`/orders`);

      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
  });
};

export const useGetAllOrders = () => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["allOrders", storeId],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders/admin`);

      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
  });
};

export const useUpdateOrder = (orderUid: string) => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: async (data: UpdateOrdeProps) => {
      const res = await api.post(`/orders/${orderUid}`, { update: data });
      if (!res.data) {
        throw new Error("failed to update order");
      }
      return res.data;
    },
  });
};
