"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import {
  CreateRatingPayload,
  UpdateRatingPayload,
} from "@/types/models/serviceRating";

/**
 * GET SERVICE RATINGS (PUBLIC)
 * Fetches approved ratings for a service
 */
export const useGetServiceRatings = (
  serviceUid?: string,
  page = 1,
  limit = 10,
) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["serviceRatings", serviceUid, page, limit],
    queryFn: async () => {
      if (!serviceUid) throw new Error("Service UID is required");
      const res = await api.get(`/service-ratings/${serviceUid}/public`, {
        params: { page, limit },
      });
      return res.data?.data;
    },
    enabled: !!serviceUid,
  });
};

/**
 * CREATE SERVICE RATING
 * User creates a new rating for a service
 */
export const useCreateServiceRating = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRatingPayload) => {
      const res = await api.post("/service-ratings", payload);
      return res.data?.data;
    },
    onSuccess: (data, payload) => {
      toast.success("Rating submitted! It will appear after admin approval.");
      // Invalidate ratings for this service
      queryClient.invalidateQueries({
        queryKey: ["serviceRatings", payload.serviceUid],
      });
    },
    onError: (error: unknown) => {
      const message = normalizeApiError(error, "Failed to create rating");
      toast.error(message);
    },
  });
};

/**
 * UPDATE SERVICE RATING
 * User updates their own rating
 */
export const useUpdateServiceRating = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      uid,
      payload,
    }: {
      uid: string;
      payload: UpdateRatingPayload;
    }) => {
      const res = await api.patch(`/service-ratings/${uid}`, payload);
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success("Rating updated successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRatings"] });
    },
    onError: (error: unknown) => {
      const message = normalizeApiError(error, "Failed to update rating");
      toast.error(message);
    },
  });
};

/**
 * DELETE SERVICE RATING
 * User deletes their own rating
 */
export const useDeleteServiceRating = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/service-ratings/${uid}`);
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success("Rating deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRatings"] });
    },
    onError: (error: unknown) => {
      const message = normalizeApiError(error, "Failed to delete rating");
      toast.error(message);
    },
  });
};

/**
 * GET PENDING RATINGS (ADMIN)
 * Fetches pending ratings for admin approval
 */
export const useGetPendingRatings = (page = 1, limit = 20) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["pendingRatings", storeId, page, limit],
    queryFn: async () => {
      const res = await api.get("/service-ratings/admin/pending", {
        params: { page, limit },
      });
      return res.data?.data;
    },
    enabled: !!storeId,
  });
};

/**
 * APPROVE SERVICE RATING (ADMIN)
 * Admin approves or rejects a pending rating
 */
export const useApproveServiceRating = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      uid,
      status,
    }: {
      uid: string;
      status: "APPROVED" | "REJECTED";
    }) => {
      const res = await api.patch(`/service-ratings/${uid}/approve`, {
        status,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      const action = variables.status === "APPROVED" ? "approved" : "rejected";
      toast.success(`Rating ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ["pendingRatings", storeId] });
      queryClient.invalidateQueries({ queryKey: ["serviceRatings"] });
    },
    onError: (error: unknown) => {
      const message = normalizeApiError(error, "Failed to approve rating");
      toast.error(message);
    },
  });
};

/**
 * DELETE SERVICE RATING
 * Admin deletes their own rating
 */
export const useDeleteServiceRatingForAdmins = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/service-ratings/admin/${uid}`);
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success("Rating deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRatings"] });
    },
    onError: (error: unknown) => {
      const message = normalizeApiError(error, "Failed to delete rating");
      toast.error(message);
    },
  });
};
