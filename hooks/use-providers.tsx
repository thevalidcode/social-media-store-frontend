import { useAppContext } from "@/context/appContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProviderProps {
  uid?: string;
  name?: string;
  url?: string;
  api_key?: string;
  percentage?: number;
  sync?: boolean;
}

// create a new provider
export const useCreateProvider = () => {
  const { apiUrl } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await axios.post(`${apiUrl}/provider`, providerData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create provider");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};

// get all providers
export const useGetProviders = () => {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/provider`);
      if (!res.data) {
        throw new Error("Failed to fetch providers");
      }
      return res.data;
    },
  });
};

// update a provider
export const useUpdateProvider = () => {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationKey: ["updateProvider"],
    mutationFn: async (providerData: ProviderProps) => {
      const res = await axios.patch(`${apiUrl}/provider`, providerData);
      if (!res.data) {
        throw new Error(res.data.message || "Failed to update provider");
      }
    },
  });
};

// delete provider
export const useDeleteProvider = () => {
  const { apiUrl } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProvider"],
    mutationFn: async (uid: string) => {
      const res = await axios.delete(`${apiUrl}/provider`, {
        params: { uid },
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete provider");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};

// delete multiple providers
export const useDeleteMultipleProviders = () => {
  const { apiUrl } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMultipleProviders"],
    mutationFn: async (uids: string[]) => {
      const res = await axios.delete(`${apiUrl}/provider/multiple`, {
        params: { uids },
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete providers");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};
