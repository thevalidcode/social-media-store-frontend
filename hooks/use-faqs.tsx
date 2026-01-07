"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FaqProps {
  question: string;
  answer: string;
}

export function useGetFaqs() {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["faqs", storeId],
    queryFn: async () => {
      const res = await api.get(`/faqs?storeId=${storeId}`);
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    enabled: !!api && !!storeId,
  });
}

export function useCreateFaq() {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addFaqs"],
    mutationFn: async (data: FaqProps) => {
      if (!storeId) throw new Error("Store ID is required");
      const response = await api.post("/faqs", { ...data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

interface DeleteFaqsProps {
  uids: string[];
}
export function useDeleteMultipleFaqs() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteFaqs"],
    mutationFn: async (data: DeleteFaqsProps) => {
      const res = await api.delete(`/faqs/multiple`, { data });
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useDeleteSingleFaq() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSingleFaq"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/faqs`, { data: { uid } });
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}
export interface UpdateFaqsProps extends FaqProps {
  uid: string;
}

export const useUpdateFaqs = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateFaqs"],
    mutationFn: async (data: UpdateFaqsProps) => {
      const res = await api.patch(`/faqs`, data);
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useGetFaqsById = (uid: string) => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["faqs", uid],
    queryFn: async () => {
      const res = await api.get(`/faqs?storeId=${storeId}&faq_id=${uid}`);
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
  });
};
