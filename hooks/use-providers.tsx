"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface ProviderProps {
  uid?: string;
  uids?: string[];
  name?: string;
  url?: string;
  api_key?: string;
  percentage?: number;
  sync?: boolean;
}

// create a new provider
export const useCreateProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["createProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await api.post(`/provider`, providerData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create provider");
      }
      return res.data;
    },
  });
};

// get all providers
export const useGetProviders = () => {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await api.get(`/provider`);
      if (!res.data) {
        throw new Error("Failed to fetch providers");
      }
      return res.data;
    },
  });
};

// update a provider
export const useUpdateProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["updateProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await api.patch(`/provider`, providerData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update provider");
      }
      return res.data;
    },
  });
};

// delete multiple providers
export const useDeleteMultipleProviders = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["deleteMultipleProviders"],
    mutationFn: async (uids: string[]) => {
      const res = await api.delete(`/provider/multiple`, { data: { uids } });
      if (!res.data.success) {
        throw new Error(res?.data?.message || "Failed to delete providers");
      }
      return res.data;
    },
  });
};

// delete a single provider
export const useDeleteProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["deleteSingleProvider"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/provider`, { data: { uid } });
      if (!res.data.success) {
        throw new Error(res?.data?.message || "Failed to delete provider");
      }
      return res.data;
    },
  });
};
