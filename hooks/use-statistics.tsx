"use client";

import { useAppContext } from "@/context/appContext";
import { Service } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Custom hook for user-related queries and mutations
// Naming follows the convention: useStatistics for fetching, useCreateStatistics/useUpdateStatistics for mutations

// get statistics for user dashboard
type PaymentsData = {
  month: string;
  successful: number;
  failed: number;
};

type OrdersData = {
  month: string;
  completed: number;
  orders: number;
};

type UserDashboardStats = {
  yourOrders: number;
  yourSpent: number;
  failedOrders: number;
  storeOrders: number;
  recentlyAddedServices: Service[];
  ordersData: OrdersData[];
  paymentsData: PaymentsData[];
};

export function useGetUserDashboardStatistics() {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userDashboardData", userInfo?.uid],
    queryFn: async () => {
      if (!userInfo?.uid) {
        throw new Error("User ID is required");
      }

      const res = await api.get<UserDashboardStats>(
        `/statistics/user/dashboard`,
        {}
      );
      if (!res.data) throw new Error("Failed to fetch dashboard statistics");
      return res.data;
    },
    enabled: !!userInfo?.uid, // Query will only run if userInfo.uid exists
  });
}
