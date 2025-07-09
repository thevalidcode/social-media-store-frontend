"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface ServiceProps {
  name: string;
  category: string;
  type: string;
  min: number;
  max: number;
  price: number;
  provider_price: number;
  provider_id: number;
  description: string;
  position: number;
  refill_days: number;
  sync_quantity: boolean;
  sync_cat_and_name: boolean;
  drip_feed: boolean;
  network: string;
  refill: boolean;
  cancel: boolean;
}

interface UpdateServiceProps {
  uid: string;
  name: string;
  type: string;
  status: string;
  min: number;
  max: number;
  refill_days: number;
  sync_quantity: boolean;
  sync_cat_and_name: boolean;
  drip_feed: boolean;
  category: string;
  description: string;
  price: number;
  position: number;
}

// get services by the public
export const useGetServicesByPublic = (service_id: string) => {
  const { panel_id, apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["servicesByPublic", service_id],
    queryFn: async () => {
      const res = await axios.get(
        `${apiUrl}/service/${service_id}?panel_id=${panel_id}`,
      );
      return res.data;
    },
    enabled: !!service_id,
  });
};

// get services by admin
export const useGetServicesByAdmin = (service_id: string) => {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["servicesByAdmin", service_id],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/service/${service_id}`);
      return res.data;
    },
    enabled: !!service_id,
  });
};

// get service by provider_id
export const useGetServicesByProviderId = (provider_id: string) => {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["servicesByProvider", provider_id],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/service/${provider_id}`);
      return res.data;
    },
    enabled: !!provider_id,
  });
};

// get all services for the admin
export const useGetAllServices = () => {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/service/admin`);
      if (!res.data) {
        throw new Error("Failed to fetch services");
      }
      return res.data;
    },
  });
};

//  creating a new service
export const useCreateService = () => {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationFn: async (service: ServiceProps) => {
      const res = await axios.post(`${apiUrl}/services`, service);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service created successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to create service");
      } else {
        toast.error("An unexpected error occurred while creating the service");
      }
    },
  });
};

// updating a service
export const useUpdateService = () => {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationFn: async (service: UpdateServiceProps) => {
      const res = await axios.patch(`${apiUrl}/services`, service);
      if (!res.data) {
        throw new Error(res.data.message || "Failed to update service");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service updated successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to update service");
      } else {
        toast.error("An unexpected error occurred while updating the service");
      }
    },
  });
};

// delete a single service
interface ServiceDeleteProps {
  uid: string;
}
export const useDeleteService = () => {
  const { apiUrl } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteService"],
    mutationFn: async (uid: ServiceDeleteProps) => {
      const res = await axios.delete(`${apiUrl}/services`, {
        params: { uid: uid.uid },
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete service");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

// delete multiple services
interface DeleteMultipleServicesProps {
  uids: string[];
}
export const useDeleteMultipleServices = () => {
  const { apiUrl } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMultipleServices"],
    mutationFn: async (uids: DeleteMultipleServicesProps) => {
      const res = await axios.delete(`${apiUrl}/service/multiple`, {
        params: { uiods: uids.uids },
        withCredentials: true,
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete services");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Services deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
