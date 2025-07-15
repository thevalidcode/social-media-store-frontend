"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FaqProps {
  question: string;
  answer: string;
}
export function useCreateFaq() {
  const { api, store_id } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addFaqs"],
    mutationFn: async (data: FaqProps) => {
      if (!store_id) throw new Error("Store ID is required");
      const response = await api.post("/faq", {
        ...data,
        store_id: Number(store_id),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useGetFaqs() {
  const { api, store_id } = useAppContext();
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await api.get(`/faq?store_id=${store_id}`);
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
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
      const res = await api.delete(`/faq/multiple`, { data });
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
      const res = await api.delete(`/faq`, { data: { uid } });
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
      const res = await api.patch(`/faq`, data);
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
  const { api, store_id } = useAppContext();
  return useQuery({
    queryKey: ["faqs", uid],
    queryFn: async () => {
      const res = await api.get(`/faq?store_id=${store_id}&faq_id=${uid}`);
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
  });
};
