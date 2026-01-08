"use client";

import { useAppContext } from "@/context/appContext";
import { Provider, ProviderService, ServiceProvider } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ProviderProps {
  name?: string;
  url?: string;
  uid?: string;
  image?: string;
  apiKey?: string;
  percentage?: number;
  sync?: boolean;
}

export interface ImportServicesProps {
  providerServicesId: number[];
  importPercent: number;
  category: { value: string; label: string };
  provider: string;
}

// create a new provider
export const useCreateProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["createProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await api.post(`/providers`, providerData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create provider");
      }
      return res.data;
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};

// get all providers
export const useGetProviders = () => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["providers", storeId],
    queryFn: async () => {
      const res = await api.get<{ providers: Provider[] }>(`/providers`);
      if (!res.data) {
        throw new Error("Failed to fetch providers");
      }
      return res.data.providers;
    },
    enabled: !!api && !!storeId,
  });
};

// get all providers
export const useGetAllServiceProviders = (
  page = 1,
  limit = 20,
  search: string
) => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["serviceProviders", storeId, page, limit, search],
    queryFn: async () => {
      const res = await api.get<{ providers: ServiceProvider[] }>(
        `/providers/all?page=${page}&limit=${limit}&search=${search}`
      );
      if (!res.data) {
        throw new Error("Failed to fetch providers");
      }
      return res.data.providers;
    },
    enabled: !!api && !!storeId,
  });
};

// update a provider
export const useUpdateProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["updateProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await api.patch(`/providers`, providerData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update provider");
      }
      return res.data;
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};

// delete multiple providers
export const useDeleteMultipleProviders = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["deleteMultipleProviders"],
    mutationFn: async (uids: string[]) => {
      const res = await api.delete(`/providers/multiple`, { data: { uids } });
      if (!res.data.success) {
        throw new Error(res?.data?.message || "Failed to delete providers");
      }
      return res.data;
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};

// delete a single provider
export const useDeleteProvider = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["deleteSingleProvider"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/providers`, { data: { uid } });
      if (!res.data.success) {
        throw new Error(res?.data?.message || "Failed to delete provider");
      }
      return res.data;
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};

// get provider's services
export const useGetProviderServices = (provider?: string) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["providerServices", storeId],
    queryFn: async () => {
      const res = await api.get<ProviderService[]>(
        `/providers/services?provider=${provider}`
      );
      return res.data;
    },
    enabled: !!api && !!provider,
  });
};

// import provider services
export const useImportProviderServices = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["importServices"],
    mutationFn: async (providerData: ImportServicesProps) => {
      const res = await api.post(`/providers/services/import`, providerData);
      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to import provider's services"
        );
      }
      return res.data;
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};
