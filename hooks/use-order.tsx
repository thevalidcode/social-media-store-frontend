"use client";

import { useAppContext } from "@/context/appContext";
import { Order, OrderPublic, OrderStatus } from "@/types/models/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------- TYPES ----------

export interface CreateOrderProps {
  serviceUid: string;
  quantity: number;
  url: string;
  comments?: string;
  dripFeed?: boolean;
  interval?: number;
  runs?: number;
  userUid: string;
}

export interface CreateBulkOrderProps {
  orders: CreateOrderProps[];
}

export interface UpdateOrderProps {
  status?: OrderStatus;
  remains?: number;
  start?: number;
  syncOrder?: boolean;
  comments?: string;
  url?: string;
}

// ---------- CREATE ORDERS ----------

export const useCreateOrder = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async (data: CreateOrderProps) => {
      const res = await api.post("/orders", data);
      if (!res.data) throw new Error("Failed to create an order");
      return res.data;
    },
  });
};

export const useCreateBulkOrder = () => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createBulkOrder"],
    mutationFn: async (data: CreateBulkOrderProps) => {
      const res = await api.post("/orders/bulk", data);
      if (!res.data) throw new Error("Failed to create bulk orders");
      return res.data;
    },
  });
};

// ---------- GET ORDERS ----------

export const useUserGetOrderByStatus = (status: OrderStatus) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", userInfo?.uid, status],
    queryFn: async () => {
      const res = await api.get<OrderPublic[]>(`/orders/status/${status}`);
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
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
    enabled: !!api && !!adminInfo?.uid,
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
    enabled: !!api && !!userInfo?.uid,
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
    enabled: !!api && !!storeId,
  });
};

// ---------- UPDATE ORDER ----------

export const useUpdateOrder = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: async ({
      uid,
      update,
    }: {
      uid: string;
      update: UpdateOrderProps;
    }) => {
      if (!uid) throw new Error("Missing order UID");

      const res = await api.patch(`/orders/${uid}`, { update });
      if (!res.data) throw new Error("Failed to update order");

      return res.data;
    },
    onSuccess: (data, variables) => {
      // variables.update.status might have changed the order status
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });

      if (variables.update.status) {
        queryClient.invalidateQueries({
          queryKey: ["userOrders", variables.update.status],
        });
        queryClient.invalidateQueries({
          queryKey: ["allOrders", variables.update.status],
        });
      }
    },
  });
};
