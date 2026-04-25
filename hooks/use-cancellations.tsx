"use client";

import { useAppContext } from "@/context/appContext";
import { Cancel, CancelPublic, CancelStatus } from "@/types/models/cancel";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ---------- GET CANCELLATIONS (USER) ----------

export const useGetUserCancellations = () => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userCancellations", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<CancelPublic[]>(`/cancellations`);
      if (!res.data) throw new Error("Failed to fetch cancellations");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetCancellationByUid = (cancelUid: string) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["cancellationDetail", cancelUid, userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<CancelPublic>(`/cancellations/${cancelUid}`);
      if (!res.data) throw new Error("Failed to fetch cancellation");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid && !!cancelUid,
  });
};

// ---------- GET CANCELLATIONS (ADMIN) ----------

export const useGetAllCancellations = () => {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["allCancellations", adminInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Cancel[]>(`/cancellations/admin`);
      if (!res.data) throw new Error("Failed to fetch cancellations");
      return res.data;
    },
    enabled: !!api && !!adminInfo?.uid,
  });
};

export const useGetCancellationByUidForAdmins = (cancelUid: string) => {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["cancellationDetailAdmin", cancelUid, adminInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Cancel>(`/cancellations/admin/${cancelUid}`);
      if (!res.data) throw new Error("Failed to fetch cancellation");
      return res.data;
    },
    enabled: !!api && !!adminInfo?.uid && !!cancelUid,
  });
};

export const useGetCancellationsByStatus = (status: CancelStatus) => {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["cancellationsByStatus", status, adminInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Cancel[]>(
        `/cancellations/admin/status/${status}`,
      );
      if (!res.data) throw new Error("Failed to fetch cancellations");
      return res.data;
    },
    enabled: !!api && !!adminInfo?.uid && !!status,
  });
};

// ---------- UPDATE CANCELLATION STATUS ----------

export const useUpdateCancellationStatus = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCancellationStatus"],
    mutationFn: async ({
      cancelUid,
      status,
      providerError,
    }: {
      cancelUid: string;
      status: CancelStatus;
      providerError?: string;
    }) => {
      if (!cancelUid) throw new Error("Missing cancellation UID");

      const res = await api.patch(`/cancellations/${cancelUid}`, {
        status,
        providerError,
      });
      if (!res.data) throw new Error("Failed to update cancellation status");

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCancellations"] });
      queryClient.invalidateQueries({ queryKey: ["allCancellations"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationDetail"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationDetailAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationsByStatus"] });
      toast.success("Cancellation status updated successfully");
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};

// ---------- DELETE CANCELLATION ----------

export const useDeleteCancellation = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCancellation"],
    mutationFn: async (cancelUid: string) => {
      if (!cancelUid) throw new Error("Missing cancellation UID");

      const res = await api.delete(`/cancellations/${cancelUid}`);
      if (!res.data) throw new Error("Failed to delete cancellation");

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCancellations"] });
      queryClient.invalidateQueries({ queryKey: ["allCancellations"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationDetail"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationDetailAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["cancellationsByStatus"] });
      toast.success("Cancellation deleted successfully");
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error);
      toast.error(errorMsg);
    },
  });
};
