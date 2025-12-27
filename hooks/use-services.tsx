"use client";

import { useAppContext } from "@/context/appContext";
import { CurrencyCode } from "@/lib/currencyConverter";
import { Service, ServicePublic } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateServiceProps {
  name: string;
  type: string;
  min: number;
  max: number;
  refillDays?: number;
  syncQuantity?: boolean;
  network?: string | null;
  synCatAndName?: boolean;
  dripFeed?: boolean;
  icon?: string;
  providerUid?: string;
  category: string;
  currency: CurrencyCode;
  description?: string;
  price: string;
}

interface UpdateServiceProps {
  uid: string;
  name?: string;
  type?: string;
  status?: string;
  min?: number;
  max?: number;
  icon?: string;
  refillDays?: number;
  syncQuantity?: boolean;
  synCatAndName?: boolean;
  currency: CurrencyCode;
  dripFeed?: boolean;
  category?: string;
  description?: string;
  price?: string;
  position?: number;
}

// get services by the public
export const useGetServicesByPublic = () => {
  const { storeId, api } = useAppContext();
  return useQuery({
    queryKey: ["servicesByPublic", storeId],
    queryFn: async () => {
      const res = await api.get<ServicePublic[]>(
        `/services?storeId=${storeId}`
      );
      return res.data;
    },
    enabled: !!storeId,
  });
};

// get services by admin
export const useGetServicesByAdmin = () => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["servicesByAdmin", storeId],
    queryFn: async () => {
      const res = await api.get<Service[]>(`/services/admin`);
      return res.data;
    },
    enabled: !!storeId,
  });
};

// get service by provider_id
export const useGetServicesByProviderId = (provider_id: string) => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["servicesByProvider", storeId, provider_id],
    queryFn: async () => {
      const res = await api.get(`/services/${provider_id}`);
      return res.data;
    },
    enabled: !!provider_id,
  });
};

//  creating a new service
export const useCreateService = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: CreateServiceProps) => {
      const res = await api.post(`/services`, service);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service created successfully");
      queryClient.invalidateQueries({ queryKey: ["servicesByAdmin", storeId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create service"
      );
      toast.error(errorMsg);
    },
  });
};

// updating a service
export const useUpdateService = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: UpdateServiceProps) => {
      const res = await api.patch(`/services`, service);
      if (!res.data) {
        throw new Error(res.data.message || "Failed to update service");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["servicesByAdmin", storeId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update service"
      );
      toast.error(errorMsg);
    },
  });
};

// delete a single service
interface ServiceDeleteProps {
  uid: string;
}
interface DeleteMultipleServicesProps {
  uids: string[];
}

// Delete a single service
export const useDeleteService = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteService"],
    mutationFn: async ({ uid }: ServiceDeleteProps) => {
      const res = await api.delete(`/services`, { data: { uid } });

      if (!res.data || res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete service");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["servicesByAdmin", storeId] });
    },
  });
};

// Delete multiple services
export const useDeleteMultipleServices = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMultipleServices"],
    mutationFn: async ({ uids }: DeleteMultipleServicesProps) => {
      const res = await api.delete(`/services/multiple`, { data: { uids } });

      if (!res.data || res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete services");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Services deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["servicesByAdmin", storeId] });
    },
  });
};
